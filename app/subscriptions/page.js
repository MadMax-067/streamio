"use client"
import { useContext, useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { BackendContext } from "@/components/Providers"
import { formatDistanceToNow } from "date-fns"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import Loading from "@/components/Loading"
import { useRouter } from 'next/navigation'

const ITEMS_PER_PAGE = 12

const VideoCard = ({ video, index }) => {
  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = Math.floor(totalSeconds % 60)
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/video/${video._id}`}>
        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs">
            {formatDuration(video.duration)}
          </div>
        </div>
        <div className="mt-2">
          <h3 className="font-medium line-clamp-2">{video.title}</h3>
          <Link href={`/profile/${video.owner.username}`} className="mt-1 flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden">
              <Image
                src={video.owner.avatar}
                alt={video.owner.username}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-sm text-gray-400">{video.owner.username}</p>
          </Link>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// Update the fetch function and related state management

export default function SubscriptionsPage() {
  const backendData  = useContext(BackendContext)
  const router = useRouter()
  const [videos, setVideos] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const { ref, inView } = useInView()
  const [totalPages, setTotalPages] = useState(1)

  const fetchVideos = async () => {
    if (loading || !hasMore) return
    
    setLoading(true)
    try {
      const { data } = await axios.get(`/api/subscriptions/videos?page=${page}&limit=${ITEMS_PER_PAGE}`)
      
      if (data.success) {
        setVideos(prev => [...prev, ...data.data.docs])
        setHasMore(data.data.hasNextPage)
        setTotalPages(data.data.totalPages)
        setPage(prev => prev + 1)
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (inView) {
      fetchVideos()
    }
  }, [inView])


  useEffect(() => {
    // Handle all navigation in one place
    if (!backendData.isAuthChecking && !backendData.isLoggedIn) {
      router.replace('/welcome')
    }
  }, [backendData.isAuthChecking, backendData.isLoggedIn, router])

  // Show loading while checking auth
  if (backendData.isAuthChecking) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  // If not logged in, show loading while redirecting
  if (!backendData.isLoggedIn) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  return (
      <div className="min-h-screen pb-[4.5rem] md:pb-0">
        <div className="px-3 md:px-4 md:container md:mx-auto py-3 md:py-6">
          <div className="flex flex-col max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-bold">Subscriptions</h1>
              {videos.length > 0 && (
                <p className="text-sm text-gray-400">
                  Page {page - 1} of {totalPages}
                </p>
              )}
            </div>
            
            {videos.length === 0 && !loading ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-400">
                  No videos from your subscriptions
                </h3>
                <p className="text-gray-500 mt-2">
                  Subscribe to channels to see their latest videos here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {videos.map((video, index) => (
                  <VideoCard 
                    key={video._id} 
                    video={video} 
                    index={index % ITEMS_PER_PAGE} // Reset animation delay per page
                  />
                ))}
              </div>
            )}

            {hasMore && (
              <div
                ref={ref}
                className="flex justify-center py-8"
              >
                {loading && <Loader2 className="w-6 h-6 animate-spin text-gray-400" />}
              </div>
            )}

            {!hasMore && videos.length > 0 && (
              <div className="text-center py-8 text-gray-500">
                No more videos to load
              </div>
            )}
          </div>
        </div>
      </div>
  )
}