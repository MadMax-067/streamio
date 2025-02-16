import { useState } from 'react'
import { Upload, X, FileVideo, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import Image from 'next/image'

export default function VideoUpload({ onClose }) {
  const [step, setStep] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [details, setDetails] = useState({
    title: '',
    description: ''
  })
  const [isDraggingThumbnail, setIsDraggingThumbnail] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true)
    } else if (e.type === "dragleave") {
      setIsDragging(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      if (files[0].type.startsWith('video/')) {
        setUploadedFile(files[0])
      } else {
        alert('Please upload a video file')
      }
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('video/')) {
      setUploadedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!uploadedFile) return
    if (!details.title.trim()) {
      toast.error('Title is required')
      return
    }

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('videoFile', uploadedFile)
      formData.append('title', details.title.trim())
      formData.append('description', details.description.trim())
      if (thumbnail) {
        formData.append('thumbnail', thumbnail)
      }
      
      const response = await fetch('/api/videos', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Upload failed')
      }

      toast.success('Video uploaded successfully')
      onClose()
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleThumbnail = (e) => {
    const file = e.target.files[0]
    handleThumbnailFile(file)
  }

  const handleThumbnailFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setThumbnail(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnailPreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      toast.error('Please upload an image file')
    }
  }

  const handleThumbnailDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDraggingThumbnail(true)
    } else if (e.type === "dragleave") {
      setIsDraggingThumbnail(false)
    }
  }

  const handleThumbnailDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingThumbnail(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleThumbnailFile(files[0])
    }
  }

  const handleNextStep = () => {
    if (!uploadedFile) return
    setStep(2)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {step === 1 ? 'Upload Video' : 'Video Details'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {!uploadedFile ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
                    ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}`}
                >
                  <FileVideo className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg mb-2">Drag and drop your video here</p>
                  <p className="text-sm text-gray-400 mb-4">or</p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                  >
                    Select File
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg flex items-center gap-3">
                    <FileVideo className="w-8 h-8 text-blue-400" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-400">
                        {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {isUploading && (
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}

                  <Button
                    onClick={handleNextStep}
                    disabled={!uploadedFile}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Next
                  </Button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={details.title}
                  onChange={(e) => setDetails(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter video title"
                  className="bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={details.description}
                  onChange={(e) => setDetails(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter video description"
                  className="bg-gray-700"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Thumbnail</label>
                <div
                  onDragEnter={handleThumbnailDrag}
                  onDragLeave={handleThumbnailDrag}
                  onDragOver={handleThumbnailDrag}
                  onDrop={handleThumbnailDrop}
                  className={`border-2 border-dashed rounded-lg p-4 transition-colors
                    ${isDraggingThumbnail ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}`}
                >
                  {thumbnailPreview ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden group">
                      <Image
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setThumbnail(null)
                            setThumbnailPreview(null)
                          }}
                          className="text-white hover:bg-white/20"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnail}
                        className="hidden"
                        id="thumbnail-upload"
                      />
                      <label
                        htmlFor="thumbnail-upload"
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-400">
                          Drag and drop or click to upload thumbnail
                        </span>
                      </label>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="hover:bg-gray-700"
                >
                  Back
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || !details.title.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}