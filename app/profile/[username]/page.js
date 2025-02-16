"use client"
import { useContext, useEffect, useState, useRef, Suspense, lazy } from 'react'
import { BackendContext } from '@/components/Providers'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from "framer-motion"
import SignUp from '@/components/SignUp'
import Login from '@/components/Login'
import { Upload, X } from 'lucide-react'
import BottomBar from '@/components/BottomBar'
import Image from 'next/image'
import Loading from '@/components/Loading'
import AuthCheck from '@/components/AuthCheck'
import VideoUpload from '@/components/VideoUpload'

const VideoCard = lazy(() => import('@/components/VideoCard'))

export default function ProfilePage() {
  const backendData = useContext(BackendContext)
  const [profileData, setProfileData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const params = useParams()

  const loginRef = useRef(null)
  const signUpRef = useRef(null)

  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    video: null,
    thumbnail: null
  })

  const handleClickOutside = (event) => {
    if (loginRef.current && !loginRef.current.contains(event.target)) {
      backendData.setIsLogging(false)
    }
    if (signUpRef.current && !signUpRef.current.contains(event.target)) {
      backendData.setIsRegistering(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/users/channel/${params.username}`)
        setProfileData(response.data.data)
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [params.username])

  const handleUpload = async (e) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('videoFile', uploadData.video)
      formData.append('thumbnail', uploadData.thumbnail)
      formData.append('title', uploadData.title)
      formData.append('description', uploadData.description)

      const response = await axios.post('/api/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true, // Important for auth
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100
          setUploadProgress(Math.round(progress))
        }
      })

      if (response.data.success) {
        // Reset form and close modal
        setUploadData({ title: '', description: '', video: null, thumbnail: null })
        setShowUploadModal(false)
        // Refresh profile data
        window.location.reload()
      } else {
        throw new Error(response.data.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert(error.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleSubscribe = async () => {
    try {
      await axios.post(`/api/subscriptions/channel/${profileData?._id}`)
      const response = await axios.get(`/api/users/channel/${params.username}`)
      setProfileData(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  if (!backendData.isLoggedIn) {
    return <AuthCheck message="Please login to view profiles" />
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    )
  }

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`
    }
    return `${views} views`
  }

  return (
    <>
      <AnimatePresence>
        {backendData.isLogging && (
          <motion.div
            ref={loginRef}
            key="loginModal"
            exit={{ opacity: 0 }}
            className='fixedBox'
          >
            <Login />
          </motion.div>
        )}
        {backendData.isRegistering && (
          <motion.div
            ref={signUpRef}
            key="signUpModal"
            exit={{ opacity: 0 }}
            className='fixedBox'
          >
            <SignUp />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen pb-20 md:pb-0">
        {/* Cover Image */}
        <div className="h-32 md:h-48 bg-gray-800 relative">
          {profileData?.coverImage && (
            <Image
              src={profileData.coverImage}
              alt="Cover"
              fill
              className="object-cover"
            />
          )}
        </div>

        {/* Profile Info */}
        <div className="px-4 md:px-8 -mt-16 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-accent bg-gray-800">
              <Image
                src={profileData?.avatar || "/placeholder.svg"}
                alt={profileData?.username}
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h1 className="text-2xl md:text-3xl font-bold">{profileData?.fullName}</h1>
              <p className="text-gray-400">@{profileData?.username}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-400">
                <span>{profileData?.subscribersCount} subscribers</span>
                <span>{profileData?.publishedVideos?.length} videos</span>
              </div>
            </div>
            <div className="md:ml-auto">
              <Button
                onClick={handleSubscribe}
                className={`${profileData?.isSubscribed
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-blue-600 hover:bg-blue-700"
                  } px-8`}
              >
                {profileData?.isSubscribed ? "Subscribed" : "Subscribe"}
              </Button>
            </div>
          </div>
        </div>

        {params.username === backendData?.userData?.username && (
          <div className="px-4 md:px-8 mt-8">
            <Button
              onClick={() => setShowUploadModal(true)}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Video
            </Button>

            {showUploadModal && (
              <VideoUpload onClose={() => setShowUploadModal(false)} />
            )}
          </div>
        )}

        {/* Videos Section */}
        <div className="px-4 md:px-8 mt-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Videos</h2>
          <div className="flex flex-wrap justify-evenly gap-4">
            <Suspense fallback={<div> <span className='loading loading-spinner loading-lg' ></span> </div>}>
              {profileData?.publishedVideos?.map((video) => (
                <div className="w-fit">
                  <VideoCard
                    key={video._id}
                    videoId={video._id}
                    title={video.title}
                    description={video.description}
                    thumbnail={video.thumbnail}
                    channelName={profileData.fullName}
                    channelUsername={profileData.username}
                    views={formatViews(video.views || 0)}
                    avatar={profileData.avatar}
                    duration={video.duration}
                    isOwner={params.username === backendData?.userData?.username}
                    isPublished={video.isPublished}
                  />
                </div>
              ))}
            </Suspense>
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <BottomBar />
      </div>
    </>
  )
}