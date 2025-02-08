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
} from "lucide-react"

export default function Page({ params }) {
  const playerRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [played, setPlayed] = useState(0)
  const [seeking, setSeeking] = useState(false)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [comments, setComments] = useState([]) // Changed from initialComments to empty array
  const [newComment, setNewComment] = useState("")
  const [likes, setLikes] = useState(15420)
  const [dislikes, setDislikes] = useState(123)
  const slug = params.videoId
  const backendData = useContext(BackendContext)
  const [videoUrl, setVideoUrl] = useState("")
  const [videoData, setVideoData] = useState(null)
  const [commentLikes, setCommentLikes] = useState({})

  useEffect(() => {
    if (!slug) return
    
    // Fetch the video
    axios
      .get(`/api/videos/${slug}`)
      .then((response) => {
        const data = response.data?.data
        setVideoUrl(data?.videoFile || "")
        setVideoData(data)
        // Set initial like state based on API data
        setIsLiked(data?.isLiked || false)
        setLikes(data?.likesCount || 0)
      })
      .catch(console.error)

    // Fetch comments
    axios
      .get(`/api/comments/${slug}`)
      .then((response) => {
        const fetchedComments = response.data?.data?.comments || []
        const mappedComments = fetchedComments.map((item) => ({
          id: item._id,
          user: item.owner?.fullName || item.owner?.username || "Unknown User",
          avatar: item.owner?.avatar || "/placeholder.svg?height=40&width=40",
          content: item.content,
          likes: item.likesCount || 0, // Add likes count
          isLiked: item.isLiked || false, // Add liked state
          timestamp: new Date(item.createdAt).toLocaleString(),
          replies: [],
        }))
        setComments(mappedComments)
        // Set initial comment likes state
        const initialLikes = {}
        mappedComments.forEach(comment => {
          initialLikes[comment.id] = comment.isLiked
        })
        setCommentLikes(initialLikes)
      })
      .catch(console.error)
  }, [slug])

  const handlePlayPause = () => setPlaying(!playing)
  const handleVolumeChange = (value) => {
    setVolume(value[0])
    if (playerRef.current) {
      playerRef.current.getInternalPlayer().volume = value[0]
    }
  }
  const handleToggleMute = () => {
    setMuted(!muted)
    if (playerRef.current) {
      playerRef.current.getInternalPlayer().muted = !muted
    }
  }
  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played)
    }
  }
  const handleSeekMouseDown = () => setSeeking(true)
  const handleSeekChange = (value) => {
    setPlayed(value[0])
    if (playerRef.current) {
      playerRef.current.seekTo(value[0])
    }
  }
  const handleSeekMouseUp = () => {
    setSeeking(false)
  }
  const handleToggleFullscreen = () => {
    if (!isFullscreen) {
      playerRef.current.getInternalPlayer().requestFullscreen()
    } else {
      document.exitFullscreen()
    }
    setIsFullscreen(!isFullscreen)
  }

  const handleSubscribe = async () => {
    try {
      await axios.post(`/api/subscriptions/channel/${videoData?.owner?._id}`)
      // Refetch video data to get updated subscription status
      const response = await axios.get(`/api/videos/${slug}`)
      setVideoData(response.data?.data)
    } catch (error) {
      console.error(error)
    }
  }

  // Update the video like handler
  const handleLike = async () => {
    try {
      await axios.post(`/api/likes/toggle/v/${slug}`)
      // Update local state immediately for better UX
      setIsLiked(!isLiked)
      setLikes(prev => isLiked ? prev - 1 : prev + 1)
      
      // Then fetch latest data
      const response = await axios.get(`/api/videos/${slug}`)
      const data = response.data?.data
      // Update with actual server data
      setIsLiked(data?.isLiked || false)
      setLikes(data?.likesCount || 0)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDislike = () => {
    if (isDisliked) {
      setDislikes(dislikes - 1)
    } else {
      setDislikes(dislikes + 1)
      if (isLiked) {
        setLikes(likes - 1)
        setIsLiked(false)
      }
    }
    setIsDisliked(!isDisliked)
  }

  // Update the comment like handler
  const handleCommentLike = async (commentId) => {
    try {
      await axios.post(`/api/likes/toggle/c/${commentId}`)
      
      // Update local state immediately
      setComments(prevComments => 
        prevComments.map(comment => {
          if (comment.id === commentId) {
            const isCurrentlyLiked = commentLikes[commentId]
            return {
              ...comment,
              likes: isCurrentlyLiked ? comment.likes - 1 : comment.likes + 1
            }
          }
          return comment
        })
      )
      
      setCommentLikes(prev => ({
        ...prev,
        [commentId]: !prev[commentId]
      }))

      // Fetch latest comments
      const response = await axios.get(`/api/comments/${slug}`)
      const fetchedComments = response.data?.data?.comments || []
      const mappedComments = fetchedComments.map((item) => ({
        id: item._id,
        user: item.owner?.fullName || item.owner?.username || "Unknown User",
        avatar: item.owner?.avatar || "/placeholder.svg?height=40&width=40",
        content: item.content,
        likes: item.likesCount || 0,
        isLiked: item.isLiked || false,
        timestamp: new Date(item.createdAt).toLocaleString(),
        replies: [],
      }))
      setComments(mappedComments)
    } catch (error) {
      console.error(error)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      await axios.post(`/api/comments/${slug}`, {
        content: newComment
      })
      
      // Refetch comments
      const response = await axios.get(`/api/comments/${slug}`)
      const fetchedComments = response.data?.data?.comments || []
      const mappedComments = fetchedComments.map((item) => ({
        id: item._id,
        user: item.owner?.fullName || item.owner?.username || "Unknown User",
        avatar: item.owner?.avatar || "/placeholder.svg?height=40&width=40",
        content: item.content,
        likes: 0,
        timestamp: new Date(item.createdAt).toLocaleString(),
        replies: [],
      }))
      setComments(mappedComments)
      setNewComment("")
    } catch (error) {
      console.error(error)
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

  const handleError = (error) => {
    console.error("Video playback error:", error)
    // Show user-friendly error message
  }

  return (
    <div className="min-h-screen text-secondary">
      <div className="container mx-auto py-6 px-4">
        <div className="relative group">
          {/* Video Player */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <ReactPlayer
              ref={playerRef}
              url={videoUrl}
              playing={playing}
              volume={volume}
              muted={muted}
              width="100%"
              height="100%"
              onProgress={handleProgress}
              onDuration={setDuration}
              onError={handleError}
              config={{
                file: {
                  attributes: {
                    controlsList: "nodownload",
                    disablePictureInPicture: true,
                  },
                  forceVideo: true,
                  forceHLS: false,
                  forceDASH: false,
                }
              }}
            />

            {/* Custom Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Progress Bar */}
              <Slider
                value={[played]}
                max={1}
                step={0.001}
                onValueChange={handleSeekChange}
                onValueCommit={handleSeekMouseUp}
                className="mb-4 [&>span:first-child]:h-1 [&>span:first-child]:bg-blue-500/30 [&_[role=slider]]:bg-blue-500 [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-blue-500"
              />

              <div className="flex items-center gap-4">
                {/* Play/Pause */}
                <Button variant="ghost" size="icon" onClick={handlePlayPause} className="hover:bg-white/10">
                  {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </Button>

                {/* Skip Buttons */}
                <Button variant="ghost" size="icon" className="hover:bg-white/10">
                  <SkipBack className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-white/10">
                  <SkipForward className="w-5 h-5" />
                </Button>

                {/* Volume Control */}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={handleToggleMute} className="hover:bg-white/10">
                    {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  <Slider
                    value={[muted ? 0 : volume]}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="w-24 [&>span:first-child]:h-1 [&>span:first-child]:bg-blue-500/30 [&_[role=slider]]:bg-blue-500 [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-blue-500"
                  />
                </div>

                {/* Time Display */}
                <span className="text-sm">
                  {formatTime(played * duration)} / {formatTime(duration)}
                </span>

                {/* Settings & Fullscreen */}
                <div className="ml-auto flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="hover:bg-white/10">
                    <Settings className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleToggleFullscreen} className="hover:bg-white/10">
                    <Maximize2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="mt-4">
            <h1 className="text-2xl font-bold">{videoData?.title}</h1>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={videoData?.owner?.avatar || "/placeholder.svg?height=40&width=40"}
                      alt={videoData?.owner?.username || "Channel avatar"}
                      height={40}
                      width={40}
                      className="h-10 object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{videoData?.owner?.fullName}</h3>
                    <p className="text-sm text-gray-400">{videoData?.owner?.subscribersCount} subscribers</p>
                  </div>
                </div>
                <Button 
                  onClick={handleSubscribe}
                  className={`${
                    videoData?.owner?.isSubscribed 
                      ? 'bg-gray-600 hover:bg-gray-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {videoData?.owner?.isSubscribed ? 'Subscribed' : 'Subscribe'}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-gray-800 rounded-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-2 rounded-l-full px-4 ${videoData?.isLiked ? "text-blue-500" : ""}`}
                    onClick={handleLike}
                  >
                    <ThumbsUp className="w-5 h-5" />
                    <span>{formatCount(videoData?.likesCount || 0)}</span>
                  </Button>
                  <div className="w-px h-6 bg-gray-700" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-r-full px-4 ${isDisliked ? "text-blue-500" : ""}`}
                    onClick={handleDislike}
                  >
                    <ThumbsDown className="w-5 h-5" />
                  </Button>
                </div>

                <Button variant="ghost" size="sm" className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700">
                  <Share2 className="w-5 h-5" />
                  Share
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-2 bg-gray-800 hover:bg-gray-700 ${isSaved ? "text-blue-500" : ""}`}
                  onClick={() => setIsSaved(!isSaved)}
                >
                  <BookmarkPlus className="w-5 h-5" />
                  Save
                </Button>

                <Button variant="ghost" size="icon" className="bg-gray-800 hover:bg-gray-700">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4 bg-gray-800 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <div className="font-medium">
                  {formatCount(videoData?.views || 0)} views • {
                    new Date(videoData?.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  }
                </div>
              </div>
              <div className={`mt-2 ${showFullDescription ? "" : "line-clamp-2"}`}>
                {videoData?.description}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                {showFullDescription ? "Show less" : "Show more"}
              </Button>
            </div>

            {/* Comments Section */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5" />
                <h2 className="text-xl font-bold">Comments</h2>
                <span className="text-gray-400">({comments.length})</span>
              </div>

              {/* Add Comment */}
              <form onSubmit={handleCommentSubmit} className="flex gap-4 mb-6">
                <Image
                  src={backendData?.userData?.avatar}
                  alt="Your avatar"
                  height={40}
                  width={40}
                  className="h-10 rounded-full"
                />
                <div className="flex-1">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="min-h-[60px] bg-gray-800 border-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button type="button" variant="ghost" onClick={() => setNewComment("")}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={!newComment.trim()}>
                      Comment
                    </Button>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="space-y-4">
                    <div className="flex gap-4">
                      <Image
                        src={comment.avatar || "/placeholder.svg"}
                        alt={`${comment.user}'s avatar`}
                        height={40}
                        width={40}
                        className="h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{comment.user}</span>
                          <span className="text-sm text-gray-400">{comment.timestamp}</span>
                        </div>
                        <p className="mt-1">{comment.content}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`flex items-center gap-1 ${commentLikes[comment.id] ? "text-blue-500" : ""}`}
                            onClick={() => handleCommentLike(comment.id)}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            {comment.likes}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ThumbsDown className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Replies */}
                    {comment.replies.length > 0 && (
                      <div className="ml-14 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-4">
                            <Image
                              src={reply.avatar || "/placeholder.svg"}
                              alt={`${reply.user}'s avatar`}
                              height={32}
                              width={32}
                              className="h-8 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{reply.user}</span>
                                <span className="text-sm text-gray-400">{reply.timestamp}</span>
                              </div>
                              <p className="mt-1">{reply.content}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                  <ThumbsUp className="w-4 h-4" />
                                  {reply.likes}
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <ThumbsDown className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

