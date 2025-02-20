"use client"
import { useState, useEffect, useContext } from 'react'
import { Space_Grotesk } from 'next/font/google'
import { Loader2, ArrowLeft, Pencil, Play, MoreVertical } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from 'next/navigation'
import { BackendContext } from '@/components/Providers'
import Loading from '@/components/Loading'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

export default function PlaylistPage({ params }) {
  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const router = useRouter()
  const backendData = useContext(BackendContext)

  

  const formatDuration = (totalSeconds) => {
    if (!totalSeconds) return ''

    // Round down fractional seconds
    const flooredSeconds = Math.floor(totalSeconds)

    const hours = Math.floor(flooredSeconds / 3600)
    const minutes = Math.floor((flooredSeconds % 3600) / 60)
    const seconds = flooredSeconds % 60

    const hh = hours.toString().padStart(2, '0')
    const mm = minutes.toString().padStart(2, '0')
    const ss = seconds.toString().padStart(2, '0')

    return hours > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`
  }

  const fetchPlaylist = async () => {
    try {
      const response = await axios.get(`/api/playlist/${params.playlistId}`)
      const playlistData = response.data.data[0]
      setPlaylist(playlistData)
      setFormData({
        name: playlistData.name,
        description: playlistData.description
      })
    } catch (error) {
      toast.error('Failed to fetch playlist')
      router.push('/playlists')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!backendData.isAuthChecking && !backendData.isLoggedIn) {
      router.replace('/welcome')
      return
    }
    fetchPlaylist()
  }, [params.playlistId, backendData.isAuthChecking, backendData.isLoggedIn, router])

  const handleUpdatePlaylist = async (e) => {
    e.preventDefault()
    try {
      await axios.patch(`/api/playlist/${params.playlistId}`, formData)
      toast.success('Playlist updated')
      fetchPlaylist()
      setShowEditDialog(false)
    } catch (error) {
      toast.error('Failed to update playlist')
    }
  }

  const handleRemoveVideo = async (videoId) => {
    try {
      await axios.patch(`/api/playlist/remove/${videoId}/${params.playlistId}`)
      toast.success('Video removed from playlist')
      fetchPlaylist()
    } catch (error) {
      toast.error('Failed to remove video')
    }
  }

  if (loading || !playlist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className={`min-h-screen pb-20 md:pb-0 ${spaceGrotesk.className}`}>
      <div className="px-4 md:container md:mx-auto py-4 md:py-6">
        <div className="flex flex-col max-w-7xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 w-fit hover:bg-gray-800/50"
            onClick={() => router.push('/playlists')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Playlists
          </Button>

          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-full md:w-72 aspect-video bg-gray-800 rounded-lg overflow-hidden">
              {playlist.videos.length > 0 ? (
                <div className="grid grid-cols-2 gap-1 p-1 h-full">
                  {playlist.videos.slice(0, 4).map((video) => (
                    <div key={video._id} className="relative overflow-hidden">
                      <Image
                        src={video.thumbnail}
                        alt="Video thumbnail"
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                  {[...Array(Math.max(0, 4 - playlist.videos.length))].map((_, index) => (
                    <div key={`empty-${index}`} className="bg-gray-900/50" />
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <FontAwesomeIcon icon={faFolderOpen} className="w-12 h-12" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{playlist.name}</h1>
                  <p className="text-gray-400 mb-4">{playlist.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {playlist.videos.length} videos
                    </span>
                    <span className="text-sm text-gray-500">
                      Created {formatDistanceToNow(new Date(playlist.createdAt))} ago
                    </span>
                  </div>
                </div>
                {playlist.name !== "Watch Later" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    onClick={() => setShowEditDialog(true)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {playlist.videos.length === 0 ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faFolderOpen} className="w-12 h-12 text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-400">This playlist is empty</h3>
              <p className="text-gray-500 mt-2">Add videos to your playlist while watching them</p>
            </div>
          ) : (
            <div className="space-y-4">
              {playlist.videos.map((video, index) => (
                <motion.div
                  key={video._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-4 bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors"
                >
                  <Link href={`/video/${video._id}`} className="flex flex-1 gap-4">
                    <div className="relative w-40 md:w-64 aspect-video">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs">
                        {formatDuration(video.duration)}
                      </div>
                    </div>
                    <div className="flex-1 py-4 pr-4">
                      <h3 className="font-medium text-lg mb-1">{video.title}</h3>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {video.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {video.views} views • {formatDistanceToNow(new Date(video.createdAt))} ago
                      </p>
                    </div>
                  </Link>
                  {playlist.name !== "Watch Later" && (
                    <div className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700">
                          <DropdownMenuItem
                            className="text-red-400 hover:text-red-500 cursor-pointer"
                            onClick={() => handleRemoveVideo(video._id)}
                          >
                            Remove from playlist
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-200">Edit Playlist</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdatePlaylist} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-gray-200"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}