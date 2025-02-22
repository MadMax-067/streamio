"use client"
import { useContext, useEffect, useState, Suspense } from 'react'
import { BackendContext } from '@/components/Providers'
import axios from 'axios'
import { Space_Grotesk } from 'next/font/google'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Loading from '@/components/Loading'
import { useRouter } from 'next/navigation'
import VideoUpload from '@/components/VideoUpload'
import BottomBar from '@/components/BottomBar'
import VideoCard from '@/components/VideoCard'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

export default function VideosPage() {
  const { userData } = useContext(BackendContext)
  const backendData = useContext(BackendContext)
  const router = useRouter()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`/api/users/channel/${userData?.username}`)
      setVideos(response.data.data.publishedVideos || [])
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userData?.username) {
      fetchVideos()
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Your Videos</h1>
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Video
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loading />
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-400">
                You haven't uploaded any videos yet
              </h3>
              <p className="text-gray-500 mt-2">
                Click the upload button to share your first video
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
                        channelName={userData.fullName}
                        channelUsername={userData.username}
                        views={video.views || 0}
                        avatar={userData.avatar}
                        duration={video.duration}
                        createdAt={video.createdAt}
                        isOwner={true}
                        isPublished={video.isPublished}
                        onVideoDeleted={fetchVideos}
                      />
                    </div>
                  ))}
                </Suspense>
              </div>
            </div>
          )}
        </div>
      </div>

      {showUploadModal && (
        <VideoUpload
          onClose={() => {
            setShowUploadModal(false)
            fetchVideos()
          }}
        />
      )}

      <div className="md:hidden">
        <BottomBar />
      </div>
    </div>
  )
}