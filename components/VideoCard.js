"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import localFont from 'next/font/local'
import Card from './Card'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { prefetchAndNavigate } from '@/utils/navigation'
import { MoreVertical, Share2, Pencil, Trash, Eye, EyeOff } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { toast } from 'sonner'
import axios from 'axios'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ImageIcon } from 'lucide-react'

const nunito = localFont({ src: '../fonts/Nunito.ttf' });

const StyledVideoCard = styled.div`
  .video-card {
    width: 100%;
    max-width: 21rem; /* Adjusted from 24rem for better container fit */
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .video-info {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.375rem 0.25rem; /* Reduced horizontal padding */
  }

  .avatar-container {
    width: 2.25rem;
    height: 2.25rem;
    flex-shrink: 0;
  }

  .text-container {
    flex: 1;
    min-width: 0; /* Helps with text truncation */
  }

  .video-title {
    font-size: clamp(0.875rem, 1.2vw, 1.125rem);
    margin: 0.25rem 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .channel-name {
    font-size: clamp(0.75rem, 1vw, 0.875rem);
    color: rgba(var(--secondary-rgb), 0.5);
  }

  .views {
    font-size: clamp(0.7rem, 0.9vw, 0.75rem);
    color: rgba(var(--secondary-rgb), 0.5);
  }

  @media (max-width: 48rem) { /* Mobile */
    .video-card {
      max-width: 100%;
      min-width: 16rem; /* Added minimum width */
    }

    .avatar-container {
      width: 2rem; /* 32px */
      height: 2rem; /* 32px */
    }
  }

  @media (min-width: 48.063rem) and (max-width: 64rem) { /* Tablet */
    .video-card {
      max-width: 19rem;
      min-width: 17rem;
    }
  }

  @media (min-width: 64.063rem) and (max-width: 85.375rem) { /* Desktop */
    .video-card {
      max-width: 21rem;
      min-width: 18rem;
    }
  }

  @media (min-width: 85.376rem) { /* Large Desktop */
    .video-card {
      max-width: 22rem;
      min-width: 20rem;
    }
  }
`;

const VideoCard = ({ 
  videoId, 
  title, 
  description,
  thumbnail, 
  channelName, 
  views, 
  avatar, 
  duration, 
  channelUsername,
  isOwner = false, // New prop to check if user owns the video
  isPublished = true // New prop for publish status
}) => {
  const router = useRouter()

  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editDetails, setEditDetails] = useState({
    title: title,
    description: description,
  })
  const [editThumbnail, setEditThumbnail] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleVideoClick = async (e) => {
    e.preventDefault()
    await prefetchAndNavigate(router, `/video/${videoId}`)
  }

  const handleChannelClick = async (e) => {
    e.preventDefault()
    e.stopPropagation() // Prevent video click handler from firing
    await prefetchAndNavigate(router, `/profile/${channelUsername}`)
  }

  const handleShare = async (e) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/video/${videoId}`)
      toast.success('Link copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this video?')) return

    try {
      await axios.delete(`/api/videos/${videoId}`)
      toast.success('Video deleted successfully')
      window.location.reload()
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Failed to delete video')
    }
  }

  const togglePublish = async (e) => {
    e.stopPropagation()
    try {
      await axios.patch(`/api/videos/toggle/publish/${videoId}`)
      toast.success(`Video ${isPublished ? 'unpublished' : 'published'} successfully`)
      window.location.reload()
    } catch (error) {
      console.error('Toggle publish failed:', error)
      toast.error('Failed to toggle publish status')
    }
  }

  const handleUpdateDetails = async (e) => {
    e.preventDefault()
    if (!editDetails.title.trim()) {
      toast.error('Title is required')
      return
    }

    setIsUpdating(true)
    try {
      const formData = new FormData()
      formData.append('title', editDetails.title.trim())
      formData.append('description', editDetails.description.trim())
      if (editThumbnail) {
        formData.append('thumbnail', editThumbnail)
      }

      await axios.patch(`/api/videos/${videoId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('Video updated successfully')
      setShowEditDialog(false)
      window.location.reload()
    } catch (error) {
      console.error('Update failed:', error)
      toast.error('Failed to update video')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <>
      <StyledVideoCard>
        <div
          onClick={handleVideoClick}
          className="cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <div className={`${nunito.className} video-card gap-2 flex flex-col justify-between bg-secondary/0 rounded`}>
            <div className="relative shrink-0 w-full">
              <Card duration={duration} thumbnail={thumbnail} videoId={videoId} />
            </div>
            <div className="video-info">
              <Link
                href={`/profile/${channelUsername}`}
                onClick={handleChannelClick}
                className="avatar-container relative rounded-full overflow-hidden hover:opacity-80 transition-opacity"
              >
                <Image
                  src={avatar}
                  alt={channelName}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="w-full h-full"
                />
              </Link>
              <div className="text-container relative">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="video-title text-secondary font-semibold">{title}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <button className="p-1 hover:bg-gray-800 rounded-full">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      className="w-56 bg-gray-800 border-gray-700"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenuItem
                        onClick={handleShare}
                        className="text-gray-200 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </DropdownMenuItem>

                      {isOwner && (
                        <>
                          <DropdownMenuSeparator className="bg-gray-700" />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowEditDialog(true)
                            }}
                            className="text-gray-200 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                          >
                            <Pencil className="w-4 h-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={togglePublish}
                            className="text-gray-200 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                          >
                            {isPublished ? (
                              <>
                                <EyeOff className="w-4 h-4" />
                                <span>Unpublish</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4" />
                                <span>Publish</span>
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={handleDelete}
                            className="text-red-500 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                          >
                            <Trash className="w-4 h-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Link
                  href={`/profile/${channelUsername}`}
                  onClick={handleChannelClick}
                  className="channel-name hover:text-blue-400 transition-colors"
                >
                  {channelName}
                </Link>
                <h6 className="views">{views}</h6>
              </div>
            </div>
          </div>
        </div>
      </StyledVideoCard>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-200">Edit Video</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateDetails} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={editDetails.title}
                onChange={(e) => setEditDetails(prev => ({ 
                  ...prev, 
                  title: e.target.value 
                }))}
                placeholder="Enter video title"
                className="bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={editDetails.description}
                onChange={(e) => setEditDetails(prev => ({ 
                  ...prev, 
                  description: e.target.value 
                }))}
                placeholder="Enter video description"
                className="bg-gray-700"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Thumbnail</label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditThumbnail(e.target.files[0])}
                  className="hidden"
                  id="edit-thumbnail"
                />
                <label
                  htmlFor="edit-thumbnail"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-400">
                    {editThumbnail ? editThumbnail.name : 'Choose new thumbnail'}
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowEditDialog(false)}
                className="hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdating || !editDetails.title.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default VideoCard
