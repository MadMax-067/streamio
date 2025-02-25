"use client"

import { useContext, useEffect, useState, useRef } from "react"
import axios from "axios"
import Image from "next/image"
import { BackendContext } from "@/components/Providers"
import ReactPlayer from "react-player"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Settings,
  SkipForward,
  SkipBack,
  ThumbsUp,
  ThumbsDown,
  Share2,
  BookmarkPlus,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  MessageSquare,
  Share,
  Flag,
  Download,
  PlaySquare,
  Check,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import Loading from "@/components/Loading"
import { motion, AnimatePresence } from "framer-motion"
import SignUp from '@/components/SignUp'
import Login from '@/components/Login'
import Link from 'next/link'
import AuthCheck from '@/components/AuthCheck'
import { useRouter } from 'next/navigation'
import { Space_Grotesk } from 'next/font/google'
import localFont from 'next/font/local'
import VideoPlayerSettings from '@/components/VideoPlayerSettings'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })
const mercenary = localFont({ src: '../../../fonts/mercenaryBold.otf' })

export default function VideoPage({ params }) {
  // 1. All hooks at the top level
  const router = useRouter()
  const playerRef = useRef(null)
  const backendData = useContext(BackendContext)
  
  // All useState hooks
  const [playing, setPlaying] = useState(true)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [played, setPlayed] = useState(0)
  const [seeking, setSeeking] = useState(false)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [likes, setLikes] = useState(0)
  const [videoUrl, setVideoUrl] = useState("")
  const [videoData, setVideoData] = useState(null)
  const [commentLikes, setCommentLikes] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [playlists, setPlaylists] = useState([])
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false)
  const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '' })
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [qualities] = useState(['1080', '720', '480', '360'])
  const [selectedQuality, setSelectedQuality] = useState('1080')
  const [isQualityChanging, setIsQualityChanging] = useState(false)

  // All useEffect hooks
  useEffect(() => {
    if (!backendData.isAuthChecking && !backendData.isLoggedIn) {
      router.replace('/welcome')
    }
  }, [backendData.isAuthChecking, backendData.isLoggedIn, router])

  useEffect(() => {
    const fetchVideoData = async () => {
      if (!params.videoId) return
      setIsLoading(true)
      try {
        const videoResponse = await axios.get(`/api/videos/${params.videoId}`)
        const videoData = videoResponse.data?.data
        setVideoUrl(videoData?.videoFile || "")
        setVideoData(videoData)
        setIsLiked(videoData?.isLiked || false)
        setLikes(videoData?.likesCount || 0)
        
        const playlistsResponse = await axios.get('/api/playlist/user')
        const userPlaylists = playlistsResponse.data?.data || []
        const isVideoSaved = userPlaylists.some(playlist => 
          playlist.videos.some(video => video._id === params.videoId)
        )
        setIsSaved(isVideoSaved)
      } catch (error) {
        console.error('Video fetch error:', error)
        setError("Failed to load video. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    const fetchComments = async () => {
      if (!params.videoId) return
      try {
        const commentsResponse = await axios.get(`/api/comments/${params.videoId}`)
        setComments(commentsResponse.data?.data?.comments || [])
      } catch (error) {
        console.error('Comments fetch error:', error)
        setComments([])
      }
    }

    if (backendData.isLoggedIn) {
      fetchVideoData()
      fetchComments()
      fetchPlaylists()
    }
  }, [params.videoId, backendData.isLoggedIn])

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.getInternalPlayer().playbackRate = playbackSpeed
    }
  }, [playbackSpeed])

  useEffect(() => {
    if (playerRef.current) {
      setIsQualityChanging(true)
      const currentTime = playerRef.current.getCurrentTime()
      
      // Update video source with new quality
      const newUrl = `${videoData?.videoFile}?quality=${selectedQuality}`
      playerRef.current.getInternalPlayer().src = newUrl
      
      // Restore playback position and state
      playerRef.current.seekTo(currentTime)
      if (playing) {
        playerRef.current.getInternalPlayer().play()
      }
      setIsQualityChanging(false)
    }
  }, [selectedQuality])

  const handlePlayPause = () => setPlaying(!playing)
  const handleVolumeChange = (value) => {
    setVolume(value[0])
    setMuted(value[0] === 0)
  }
  const handleToggleMute = () => setMuted(!muted)
  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played)
    }
  }
  const handleSeekChange = (value) => {
    setPlayed(value[0])
    playerRef.current?.seekTo(value[0])
  }
  const handleToggleFullscreen = () => {
    if (!isFullscreen) {
      playerRef.current?.getInternalPlayer()?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
    setIsFullscreen(!isFullscreen)
  }

  const handleSubscribe = async () => {
    try {
      const response = await axios.post(`/api/subscriptions/channel/${videoData?.owner?._id}`)
      if (response.data.success) {
        // Update local state to show immediate feedback
        setVideoData(prev => ({
          ...prev,
          owner: {
            ...prev.owner,
            subscribersCount: prev.isSubscribed 
              ? prev.owner.subscribersCount - 1 
              : prev.owner.subscribersCount + 1
          },
          isSubscribed: !prev.isSubscribed
        }))
      }
    } catch (error) {
      console.error('Subscribe error:', error)
      toast.error("Failed to subscribe. Please try again.")
    }
  }

  const handleLike = async () => {
    try {
      await axios.post(`/api/likes/toggle/v/${params.videoId}`)
      const response = await axios.get(`/api/videos/${params.videoId}`)
      const data = response.data?.data
      setIsLiked(data?.isLiked || false)
      setLikes(data?.likesCount || 0)
    } catch (error) {
      console.error(error)
    }
  }

  const handleCommentLike = async (commentId) => {
    try {
      await axios.post(`/api/likes/toggle/c/${commentId}`)
      // Fetch fresh comments after like
      const commentsResponse = await axios.get(`/api/comments/${params.videoId}`)
      setComments(commentsResponse.data?.data?.comments || [])
    } catch (error) {
      console.error(error)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    const trimmedComment = newComment.trim()
    if (!trimmedComment) return

    try {
      await axios.post(`/api/comments/${params.videoId}`, {
        content: trimmedComment,
      })
      const response = await axios.get(`/api/comments/${params.videoId}`)
      setComments(response.data?.data?.comments || [])
      setNewComment("")
    } catch (error) {
      console.error(error)
    }
  }

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get('/api/playlist/user')
      setPlaylists(response.data?.data || [])
    } catch (error) {
      console.error('Failed to fetch playlists:', error)
    }
  }

  const handleCreatePlaylist = async (e) => {
    e.preventDefault()
    const trimmedName = newPlaylist.name.trim()
    const trimmedDescription = newPlaylist.description.trim()
    
    if (!trimmedName) return
    
    try {
      await axios.post('/api/playlist', {
        name: trimmedName,
        description: trimmedDescription
      })
      setNewPlaylist({ name: '', description: '' })
      setShowCreatePlaylist(false)
      fetchPlaylists()
    } catch (error) {
      console.error('Failed to create playlist:', error)
    }
  }

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await axios.patch(`/api/playlist/add/${params.videoId}/${playlistId}`)
      setIsSaved(true)
    } catch (error) {
      console.error('Failed to add to playlist:', error)
    }
  }

  const handleShare = async () => {
    const videoUrl = window.location.href
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: videoData?.title,
          text: videoData?.description?.slice(0, 100),
          url: videoUrl
        })
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error)
        }
      }
    } else {
      // Fallback to copy to clipboard
      try {
        await navigator.clipboard.writeText(videoUrl)
        toast.success("Link copied to clipboard!")
      } catch (error) {
        console.error('Copy failed:', error)
        toast.error("Failed to copy link")
      }
    }
  }

  const handleReport = () => {
    toast.info("Thanks for reporting. We'll review this content.")
  }

  const handleAddToWatchLater = async () => {
    try {
      // First try to get user's playlists
      const playlistsResponse = await axios.get('/api/playlist/user')
      const userPlaylists = playlistsResponse.data?.data || []
      
      // Look for existing Watch Later playlist
      let watchLaterPlaylist = userPlaylists.find(p => p.name === "Watch Later")
      
      // If Watch Later playlist doesn't exist, create it
      if (!watchLaterPlaylist) {
        const createResponse = await axios.post('/api/playlist', {
          name: "Watch Later",
          description: "Videos saved for later viewing"
        })
        watchLaterPlaylist = createResponse.data?.data
      }
      
      // Add video to Watch Later playlist
      if (watchLaterPlaylist) {
        await axios.patch(`/api/playlist/add/${params.videoId}/${watchLaterPlaylist._id}`)
        toast.success("Added to Watch Later")
        fetchPlaylists() // Refresh playlists
      }
    } catch (error) {
      console.error('Failed to add to Watch Later:', error)
      toast.error("Failed to add to Watch Later")
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const formatCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count
  }

  // Render loading state
  if (backendData.isAuthChecking || isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className={`min-h-screen text-secondary ${spaceGrotesk.className} md:pb-0 pb-[4.5rem]`}>
      <div className="md:container md:mx-auto md:py-6 md:px-4">
        <div className="flex flex-col max-w-[1920px] mx-auto">
          {/* Video Player - Full width on mobile */}
          <div className="relative group w-full">
             <div className="relative aspect-video bg-black md:rounded-xl overflow-hidden">
              <ReactPlayer
                ref={playerRef}
                url={`${videoUrl}?quality=${selectedQuality}`}
                playing={playing && !isQualityChanging}
                volume={volume}
                muted={muted}
                width="100%"
                height="100%"
                onProgress={handleProgress}
                onDuration={setDuration}
                config={{
                  file: {
                    attributes: {
                      controlsList: "nodownload",
                      disablePictureInPicture: true,
                      autoPlay: true,  // Added this line
                    },
                    forceVideo: true,
                    qualities: qualities.map(q => ({
                      label: `${q}p`,
                      value: q,
                    })),
                  },
                }}
              />
              <VideoPlayerSettings
                playing={playing}
                played={played}
                volume={volume}
                muted={muted}
                duration={duration}
                onPlayPause={handlePlayPause}
                onSeek={handleSeekChange}
                onVolumeChange={handleVolumeChange}
                onToggleMute={handleToggleMute}
                onToggleFullscreen={handleToggleFullscreen}
                playbackSpeed={playbackSpeed}
                setPlaybackSpeed={setPlaybackSpeed}
                quality={selectedQuality}
                qualities={qualities}
                onQualityChange={setSelectedQuality}
              />
            </div>
          </div>

          {/* Video Info - Stack on mobile */}
          <div className="flex flex-col px-4 md:px-0 max-w-5xl mx-auto w-full">
            {/* Title */}
            <h1 className={`${mercenary.className} text-2xl md:text-3xl font-bold mt-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text`}>
              {videoData?.title}
            </h1>

            {/* Views and date - Mobile layout */}
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
              <span className="font-medium">{formatCount(videoData?.views)} views</span>
              <span>•</span>
              <span>{new Date(videoData?.createdAt).toLocaleDateString()}</span>
            </div>

            {/* Channel info and actions - Stack on mobile */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 gap-4">
              <div className="flex items-center justify-between gap-3 w-full md:w-auto">
                <Link 
                  href={`/profile/${videoData?.owner?.username}`}
                  className="flex items-center gap-3 hover:bg-gray-800/50 p-2 rounded-lg transition"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={videoData?.owner?.avatar || "/placeholder.svg?height=40&width=40"}
                      alt={videoData?.owner?.username || "Channel avatar"}
                      width={40}
                      height={40}
                      className="h-10 object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{videoData?.owner?.fullName}</h3>
                    <p className="text-sm text-gray-400">{formatCount(videoData?.owner?.subscribersCount)} subscribers</p>
                  </div>
                </Link>

                {/* Only show subscribe button if the video is not owned by current user */}
                {videoData?.owner?._id !== backendData?.userData?._id && (
                  <Button
                    onClick={handleSubscribe}
                    className={`
                      px-4 py-2 rounded-lg transition-all duration-200 font-medium
                      ${videoData?.isSubscribed 
                        ? "bg-gray-800 hover:bg-gray-700 text-gray-300" 
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      {videoData?.isSubscribed ? (
                        <>
                          <Check className="w-4 h-4" />
                          Subscribed
                        </>
                      ) : (
                        'Subscribe'
                      )}
                    </span>
                  </Button>
                )}
              </div>

              {/* Action buttons - Horizontal scroll on mobile */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                <div className="flex items-center bg-gray-800 rounded-full shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-2 rounded-full px-4 hover:bg-gray-700 ${isLiked ? "text-blue-500" : ""}`}
                    onClick={handleLike}
                  >
                    <ThumbsUp className="w-5 h-5" />
                    <span>{formatCount(likes)}</span>
                  </Button>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 shrink-0"
                  onClick={handleShare}
                >
                  <Share2 className="w-5 h-5" />
                  <span className="hidden md:inline">Share</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex items-center gap-2 bg-gray-800/80 hover:bg-gray-700 shrink-0 ${
                        isSaved ? "text-blue-500" : ""
                      }`}
                    >
                      <BookmarkPlus className="w-5 h-5" />
                      <span className="hidden md:inline">Save</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-56 bg-gray-800 border-gray-700 rounded-lg overflow-hidden"
                    sideOffset={5}
                  >
                    {playlists.map((playlist) => (
                      <DropdownMenuItem
                        key={playlist._id}
                        className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700 focus:text-gray-200 cursor-pointer px-4 py-2"
                        onClick={() => handleAddToPlaylist(playlist._id)}
                      >
                        {playlist.name}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem
                      className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700 focus:text-gray-200 cursor-pointer px-4 py-2"
                      onClick={() => setShowCreatePlaylist(true)}
                    >
                      Create new playlist
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="bg-gray-800/80 hover:bg-gray-700 shrink-0"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-56 bg-gray-800 border-gray-700 rounded-lg overflow-hidden"
                    sideOffset={5}
                  >
                    <DropdownMenuItem 
                      className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700 focus:text-gray-200 cursor-pointer px-4 py-2 flex items-center gap-2"
                      onClick={handleAddToWatchLater}
                    >
                      <PlaySquare className="w-4 h-4" />
                      <span>Save to Watch Later</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700 focus:text-gray-200 cursor-pointer px-4 py-2 flex items-center gap-2"
                      onClick={() => window.open(videoUrl, '_blank')}
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700 focus:text-gray-200 cursor-pointer px-4 py-2 flex items-center gap-2"
                      onClick={handleReport}
                    >
                      <Flag className="w-4 h-4" />
                      <span>Report</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Description - Collapsible on mobile */}
            <motion.div 
              className="mt-6 bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={`${showFullDescription ? "" : "line-clamp-3"} text-gray-300`}>
                {videoData?.description}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 text-gray-400 hover:text-white hover:bg-gray-700"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? (
                  <span className="flex items-center gap-2">
                    <ChevronUp className="w-4 h-4" /> Show less
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ChevronDown className="w-4 h-4" /> Show more
                  </span>
                )}
              </Button>
            </motion.div>

            {/* Comments Section - Mobile optimized */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4 px-1">
                <MessageSquare className="w-5 h-5" />
                <h2 className="text-lg md:text-xl font-bold">Comments</h2>
                <span className="text-gray-400">({comments.length})</span>
              </div>

              {/* Add Comment - Full width on mobile */}
              <form onSubmit={handleCommentSubmit} className="flex gap-4 mb-6">
                <Image
                  src={backendData?.userData?.avatar || "/placeholder.svg?height=40&width=40"}
                  alt="Your avatar"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full shrink-0"
                />
                <div className="flex-1">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value.trimStart())}
                    placeholder="Add a comment..."
                    className="min-h-[60px] bg-gray-800 border-none focus:ring-1 focus:ring-blue-500 w-full"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button type="button" variant="ghost" className="hover:bg-gray-700" onClick={() => setNewComment("")}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={!newComment.trim()}>
                      Comment
                    </Button>
                  </div>
                </div>
              </form>

              {/* Comments List - Mobile optimized spacing */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment._id} className="p-2">
                    <div className="flex gap-3">
                      <Link 
                        href={`/profile/${comment.owner.username}`} 
                        className="shrink-0"
                      >
                        <Image
                          src={comment.owner.avatar || "/placeholder.svg"}
                          alt={comment.owner.fullName}
                          width={40}
                          height={40}
                          className="h-8 w-8 md:h-10 md:w-10 rounded-full hover:opacity-80 transition-opacity"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Link 
                            href={`/profile/${comment.owner.username}`}
                            className="font-medium text-sm md:text-base hover:text-blue-400 transition-colors"
                          >
                            {comment.owner.fullName}
                          </Link>
                          <span className="text-xs md:text-sm text-gray-400">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-1 text-sm md:text-base break-words">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`flex items-center gap-1 hover:bg-gray-700 ${comment.isLiked ? "text-blue-500" : ""}`}
                            onClick={() => handleCommentLike(comment._id)}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            {comment.likesCount}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={showCreatePlaylist} onOpenChange={setShowCreatePlaylist}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-200">Create new playlist</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreatePlaylist} className="space-y-4">
            <div>
              <Input
                placeholder="Playlist name"
                value={newPlaylist.name}
                onChange={(e) => setNewPlaylist(prev => ({ 
                  ...prev, 
                  name: e.target.value.trimStart() 
                }))}
                className="bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>
            <div>
              <Textarea
                placeholder="Description"
                value={newPlaylist.description}
                onChange={(e) => setNewPlaylist(prev => ({ 
                  ...prev, 
                  description: e.target.value.trimStart() 
                }))}
                className="bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                className="hover:bg-gray-700"
                onClick={() => setShowCreatePlaylist(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!newPlaylist.name.trim()}
              >
                Create
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

