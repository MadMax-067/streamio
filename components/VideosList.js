import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function VideosList({ videos, userData, isOwner, onVideoUpdate }) {
  const [hoveredVideo, setHoveredVideo] = useState(null)

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views
  }

  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = Math.floor(totalSeconds % 60)
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-wrap justify-evenly gap-4">
      {videos.map((video) => (
        <div 
          key={video._id}
          className="relative w-fit"
          onMouseEnter={() => setHoveredVideo(video._id)}
          onMouseLeave={() => setHoveredVideo(null)}
        >
          <Link href={`/video/${video._id}`}>
            <div className="relative w-[300px] aspect-video rounded-lg overflow-hidden bg-gray-800 group">
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
          </Link>

          <div className="mt-2">
            <div className="flex items-start gap-2">
              <Link href={`/profile/${userData.username}`}>
                <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={userData.avatar}
                    alt={userData.username}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/video/${video._id}`}>
                  <h3 className="font-medium line-clamp-2">{video.title}</h3>
                </Link>
                <Link href={`/profile/${userData.username}`}>
                  <p className="text-sm text-gray-400">{userData.username}</p>
                </Link>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{formatViews(video.views)} views</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
                </div>
              </div>
              {isOwner && hoveredVideo === video._id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 hover:bg-gray-800 rounded-full">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-gray-900 border-gray-800">
                    <DropdownMenuItem 
                      className="text-red-400 hover:text-red-300 cursor-pointer"
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this video?')) {
                          try {
                            await axios.delete(`/api/videos/${video._id}`)
                            onVideoUpdate()
                          } catch (error) {
                            console.error('Failed to delete video:', error)
                          }
                        }
                      }}
                    >
                      Delete Video
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}