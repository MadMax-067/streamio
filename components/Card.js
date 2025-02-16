import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import axios from 'axios'
import { Toaster, toast } from 'sonner' // Update import to include Toaster
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from 'framer-motion'

const Card = ({ thumbnail, duration, videoId }) => {
  const router = useRouter()
  const [playlists, setPlaylists] = useState([])
  const [showWatchLaterTick, setShowWatchLaterTick] = useState(false)
  const [showPlaylistTick, setShowPlaylistTick] = useState(false)
  const [isWatchLaterCreating, setIsWatchLaterCreating] = useState(false)

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get('/api/playlist/user')
      setPlaylists(response.data?.data || [])
    } catch (error) {
      console.error('Failed to fetch playlists:', error)
    }
  }

  const handleWatchLater = async (e) => {
    e.stopPropagation()
    if (isWatchLaterCreating) return // Prevent multiple clicks

    try {
      setIsWatchLaterCreating(true)
      // First try to get user's playlists
      const playlistsResponse = await axios.get('/api/playlist/user')
      const userPlaylists = playlistsResponse.data?.data || []
      
      // Look for existing Watch Later playlist
      let watchLaterPlaylist = userPlaylists.find(p => 
        p.name.toLowerCase() === "watch later"
      )
      
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
        try {
          await axios.patch(`/api/playlist/add/${videoId}/${watchLaterPlaylist._id}`)
          setShowWatchLaterTick(true)
          setTimeout(() => setShowWatchLaterTick(false), 2000)
          toast.success("Added to Watch Later")
        } catch (error) {
          if (error.response?.status === 409) {
            toast.info("Already in Watch Later")
          } else {
            throw error
          }
        }
      }
    } catch (error) {
      console.error('Failed to add to Watch Later:', error)
      toast.error("Failed to add to Watch Later")
    } finally {
      setIsWatchLaterCreating(false)
    }
  }

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await axios.patch(`/api/playlist/add/${videoId}/${playlistId}`)
      setShowPlaylistTick(true)
      setTimeout(() => setShowPlaylistTick(false), 2000)
      toast.success("Added to playlist")
    } catch (error) {
      if (error.response?.status === 409) {
        toast.info("Video already in this playlist")
      } else {
        console.error('Failed to add to playlist:', error)
        toast.error("Failed to add to playlist")
      }
    }
  }

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

  return (
    <StyledWrapper>
      <div className="card">
        <div className="card__image-wrapper">
          <Image
            src={thumbnail}
            alt="Thumbnail"
            layout="fill"
            objectFit="cover"
            className="card__image"
            priority
          />
        </div>
        <div className="card__icons">
          <div 
            className="icon-wrapper"
            onClick={handleWatchLater}
            title="Save to Watch Later"
          >
            <AnimatePresence>
              {showWatchLaterTick ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="svg-icon success"
                >
                  <Check className="w-5 h-5 text-green-500" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <svg className="svg-icon watchLater" height={100} viewBox="0 0 100 100" width={100} xmlns="http://www.w3.org/2000/svg">
                    <path d="M50,35.7V50L60.7,60.7M82.1,50A32.1,32.1,0,1,1,50,17.9,32.1,32.1,0,0,1,82.1,50Z" strokeWidth={8}></path>
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div className="icon-wrapper" title="Save to Playlist">
                <AnimatePresence>
                  {showPlaylistTick ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="svg-icon success"
                    >
                      <Check className="w-5 h-5 text-green-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 1 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <svg className="svg-icon playlist" height={100} viewBox="0 0 100 100" width={100} xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.7,28.5H82.3a5.4,5.4,0,0,0,5.4-5.4,5.4,5.4,0,0,0-5.4-5.4H17.7a5.4,5.4,0,0,0-5.4,5.4A5.4,5.4,0,0,0,17.7,28.5Z" fillRule="evenodd"></path>
                        <path d="M82.3,44.6H17.7a5.4,5.4,0,0,0,0,10.8H82.3a5.4,5.4,0,1,0,0-10.8Z" fillRule="evenodd"></path>
                        <path d="M50,71.5H17.7a5.4,5.4,0,0,0-5.4,5.4,5.4,5.4,0,0,0,5.4,5.4H50a5.4,5.4,0,0,0,5.4-5.4A5.4,5.4,0,0,0,50,71.5Z" fillRule="evenodd"></path>
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="min-w-[8rem] bg-gray-800 border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              {playlists.map((playlist) => (
                <DropdownMenuItem
                  key={playlist._id}
                  onClick={() => handleAddToPlaylist(playlist._id)}
                  className="text-gray-200 hover:bg-gray-700 cursor-pointer"
                >
                  {playlist.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => router.push(`/video/${videoId}?action=playlist`)}
                className="text-gray-200 hover:bg-gray-700 cursor-pointer"
              >
                Create new playlist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {duration && (
          <div className="card__time">
            {formatDuration(duration)}
          </div>
        )}
      </div>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  .card {
    width: 22rem;
    height: 14.5rem;
    aspect-ratio: 16/9;
    position: relative;
    border-radius: 1.25rem;
    border: 0.0625rem solid rgb(156, 151, 151);
    transition: all 0.3s ease;
    overflow: hidden; /* Ensure the image doesn't overflow the card */
  }

  .card__image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 1.25rem;
    overflow: hidden;
  }

  .card__icons {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding-right: 1rem;
    padding-top: 1rem;
    gap: 0.875rem;
    opacity: 0;
    transition: all 0.3s ease;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
  }

  .card__time {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.25rem;
    font-weight: lighter;
    border-radius: 0.5rem;
    text-align: center;
    padding: 0.25rem 0.75rem;
    color: whitesmoke;
    background-color: rgba(0, 0, 0, 0.8);
  }

  .svg-icon {
    background-color: rgb(77, 67, 67);
    fill: #ece6e6;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 0.5rem;
    padding: 0.25rem;
    transition: all 0.5s ease-in-out;
  }

  .svg-icon.success {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(22 163 74 / 0.2);
    border: 2px solid rgb(22 163 74);
  }

  .dropdown-menu {
    z-index: 50;
  }

  .card:hover {
    opacity: 0.8;
    animation: video 5s ease;
  }

  .card:hover .card__icons {
    opacity: 1;
  }

  /* Responsive breakpoints */
  @media (max-width: 48rem) {
    .card {
      width: 100%;
      max-width: 20rem;
      height: 13rem;
    }
    
    .card__icons {
      padding-right: 0.5rem;
      padding-top: 0.5rem;
      gap: 0.5rem;
    }
  }

  @media (min-width: 48.063rem) and (max-width: 85.375rem) {
    .card {
      width: 20rem;
      height: 13rem;
    }
    
    .card__icons {
      padding-right: 0.75rem;
      padding-top: 0.75rem;
      gap: 0.75rem;
    }

    .svg-icon {
      width: 2.5rem;
      height: 2.5rem;
    }

    .card__time {
      font-size: 1.125rem;
    }
  }

  @media (min-width: 85.376rem) {
    .card {
      width: 22rem;
      height: 14.5rem;
    }
  }

  .icon-wrapper {
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.1);
      .svg-icon {
        background-color: rgb(97, 87, 87);
      }
    }

    &:active {
      transform: scale(0.95);
    }
  }

  .svg-icon.watchLater {
    stroke: #ece6e6;
    fill: none;
  }
`

export default Card
