"use client"
import { useContext, useEffect, useState, Suspense } from 'react'
import { BackendContext } from '@/components/Providers'
import axios from 'axios'
import { Space_Grotesk } from 'next/font/google'
import { ThumbsUp } from 'lucide-react'
import Loading from '@/components/Loading'
import { useRouter } from 'next/navigation'
import BottomBar from '@/components/BottomBar'
import VideoCard from '@/components/VideoCard'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

export default function LikedVideosPage() {
  const { userData } = useContext(BackendContext)
  const backendData = useContext(BackendContext)
  const router = useRouter()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchLikedVideos = async () => {
    try {
      const response = await axios.get('/api/likes/videos')
      // Extract video data from the nested structure
      const videoData = response.data.data.map(item => item.video)
      setVideos(videoData)
    } catch (error) {
      console.error('Failed to fetch liked videos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userData?.username) {
      fetchLikedVideos()
    }
  }, [userData?.username])

  useEffect(() => {
    if (!backendData.isAuthChecking && !backendData.isLoggedIn) {
      router.replace('/welcome')
    }
  }, [backendData.isAuthChecking, backendData.isLoggedIn, router])

  if (backendData.isAuthChecking) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  if (!backendData.isLoggedIn) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  return (
    <div className={`min-h-screen pb-20 md:pb-0 ${spaceGrotesk.className}`}>
      <div className="px-3 md:px-4 md:container md:mx-auto py-3 md:py-6">
        <div className="flex flex-col max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <ThumbsUp className="w-6 h-6 text-gray-400" />
            <h1 className="text-2xl md:text-3xl font-bold">Liked Videos</h1>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loading />
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-400">
                No liked videos yet
              </h3>
              <p className="text-gray-500 mt-2">
                Videos you like will appear here
              </p>
            </div>
          ) : (
            <div className="px-4 md:px-8">
              <div className="flex flex-wrap justify-evenly gap-4">
                <Suspense fallback={<div><span className='loading loading-spinner loading-lg'></span></div>}>
                  {videos.map((video) => (
                    <div className="w-fit" key={video._id}>
                      <VideoCard
                        videoId={video._id}
                        title={video.title}
                        description={video.description}
                        thumbnail={video.thumbnail}
                        channelName={video.owner.fullName}
                        channelUsername={video.owner.username}
                        views={video.views || 0}
                        avatar={video.owner.avatar}
                        duration={video.duration}
                        createdAt={video.createdAt}
                        isOwner={false}
                      />
                    </div>
                  ))}
                </Suspense>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="md:hidden">
        <BottomBar />
      </div>
    </div>
  )
}