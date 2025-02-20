"use client"
import { useState, useEffect, useContext } from 'react'
import { Space_Grotesk } from 'next/font/google'
import { Loader2, Trash2 } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { BackendContext } from '@/components/Providers'

// Ensure font is properly initialized
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

// Create a VideoCard component to reduce complexity
const VideoCard = ({ video, index }) => {
  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60)
    const seconds = Math.floor(duration % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views
  }

  return (
    <motion.div
      key={video._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all"
    >
      <Link href={`/video/${video._id}`}>
        <div className="relative aspect-video">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs">
            {formatDuration(video.duration)}
          </div>
        </div>
        <div className="p-4">
          <div className="flex gap-3">
            <Link href={`/profile/${video.owner.username}`}>
              <Image
                src={video.owner.avatar}
                alt={video.owner.fullName}
                width={40}
                height={40}
                className="rounded-full h-10 w-10 object-cover"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-base mb-1 line-clamp-2">
                {video.title}
              </h3>
              <Link 
                href={`/profile/${video.owner.username}`}
                className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                {video.owner.fullName}
              </Link>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                <span>{formatViews(video.views)} views</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// Main History Page component
export default function HistoryPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()
  const backendData = useContext(BackendContext)

  useEffect(() => {
    if (!backendData.isAuthChecking && !backendData.isLoggedIn) {
      router.replace('/welcome')
    }
  }, [backendData.isAuthChecking, backendData.isLoggedIn, router])

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/api/users/history')
      setHistory(response.data.data)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch history')
      toast.error('Failed to fetch watch history')
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = async () => {
    try {
      await axios.delete('/api/users/history')
      setHistory([])
      toast.success('Watch history cleared')
    } catch (error) {
      toast.error('Failed to clear history')
    }
  }

  useEffect(() => {
    if (backendData.isLoggedIn) {
      fetchHistory()
    }
  }, [backendData.isLoggedIn])

  if (backendData.isAuthChecking) {
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon 
                icon={faClockRotateLeft} 
                className="w-6 h-6 text-gray-400" 
              />
              <h1 className="text-2xl md:text-3xl font-bold">Watch History</h1>
            </div>
            {history.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center gap-2"
                onClick={clearHistory}
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden md:inline">Clear History</span>
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="text-center text-gray-400">{error}</div>
          ) : history.length === 0 ? (
            <div className="text-center text-gray-400 min-h-[50vh] flex flex-col items-center justify-center">
              <ClockRotateLeft className="w-12 h-12 mb-4" />
              <p className="text-lg">No watch history found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {history.map((video, index) => (
                <VideoCard key={video._id} video={video} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}