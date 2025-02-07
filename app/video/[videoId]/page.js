"use client"
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { BackendContext } from '@/components/Providers'
import ReactPlayer from 'react-player'

export default function Page({ params }) {
  const slug = params.videoId
  const backendData = useContext(BackendContext)
  const [videoUrl, setVideoUrl] = useState('')

  useEffect(() => {
    if (!slug) return
    axios.get(`/api/videos/${slug}`)
      .then((response) => {
        setVideoUrl(response.data?.data?.videoFile || '')
      })
      .catch((error) => {
        console.error(error)
      })
  }, [slug])

  return (
    <main className="grid place-items-center bg-primary">
      <div className="w-full max-w-[1280px] aspect-video">
        <ReactPlayer
          url={videoUrl}
          controls
          width="100%"
          height="100%"
          playing
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload', // Disable download button
                disablePictureInPicture: true // Disable PiP
              }
            }
          }}
        />
      </div>
    </main>
  )
}
