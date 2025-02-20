"use client"
import { useState, useEffect, useContext } from 'react'
import { Space_Grotesk } from 'next/font/google'
import { Loader2, MoreVertical, Play } from 'lucide-react'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import { BackendContext } from '@/components/Providers'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

export default function PlaylistPage({ params }) {
  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const backendData = useContext(BackendContext)

  const fetchPlaylist = async () => {
    try {
      const response = await axios.get(`/api/playlist/${params.playlistId}`)
      setPlaylist(response.data.data[0])
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

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60)
    const seconds = Math.floor(duration % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
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
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-full md:w-72 aspect-video bg-gray-800 rounded-lg overflow-hidden">
              <div className="grid grid-cols-2 gap-1 p-1 h-full">
                {playlist.videos.slice(0, 4).map((video, index) => (
                  <div key={video._id} className="relative">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1">
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
          </div>

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
        </div>
      </div>
    </div>
  )
}