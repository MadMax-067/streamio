"use client"
import { useContext, useEffect, useState, useRef, useRouter } from 'react'
import { BackendContext } from '@/components/Providers'
import axios from 'axios'
import Image from 'next/image'
import VideoCard from '@/components/VideoCard'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from "framer-motion"
import SignUp from '@/components/SignUp'
import Login from '@/components/Login'

export default function ProfilePage() {
  const { isLoggedIn, onLoginClick, onSignupClick, isLogging, isRegistering, setIsLogging, setIsRegistering } = useContext(BackendContext)
  const [profileData, setProfileData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const params = useParams()
  const router = useRouter()

  const loginRef = useRef(null)
  const signUpRef = useRef(null)

  const handleClickOutside = (event) => {
    if (loginRef.current && loginRef.current.contains(event.target)) return
    if (signUpRef.current && signUpRef.current.contains(event.target)) return
    setIsLogging(false)
    setIsRegistering(false)
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

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-4">
        <h1 className="text-2xl font-bold mb-4">Please login to view profiles</h1>
        <div className="flex gap-4">
          <Button 
            onClick={onLoginClick} 
            className="btn min-h-0 btn-accent text-secondary/70 md:rounded-[0.85rem] border-secondary/30"
          >
            Login
          </Button>
          <Button 
            onClick={onSignupClick} 
            className="btn min-h-0 btn-primary text-secondary md:rounded-[0.85rem]"
          >
            Sign up
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
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
        {isLogging && (
          <motion.div 
            ref={loginRef}
            key="loginModal"
            exit={{ opacity: 0 }}
            className='fixedBox'
          >
            <Login />
          </motion.div>
        )}
        {isRegistering && (
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
                className={`${
                  profileData?.isSubscribed
                    ? "bg-gray-600 hover:bg-gray-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } px-8`}
              >
                {profileData?.isSubscribed ? "Subscribed" : "Subscribe"}
              </Button>
            </div>
          </div>
        </div>

        {/* Videos Section */}
        <div className="px-4 md:px-8 mt-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Videos</h2>
          <div className="flex flex-wrap justify-evenly gap-4">
            {profileData?.publishedVideos?.map((video) => (
              <div className="w-fit">
                <VideoCard
                  key={video._id}
                  videoId={video._id}
                  title={video.title}
                  thumbnail={video.thumbnail}
                  channelName={profileData.fullName}
                  views={formatViews(video.views || 0)}
                  avatar={profileData.avatar}
                  duration={video.duration}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}