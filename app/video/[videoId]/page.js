"use client"
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { BackendContext } from '@/components/Providers'

const page = async({ params }) => {
  const slug = (await params).videoId;
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
    <main className="grid">
      <iframe
        src={videoUrl}
        frameBorder="0"
        allowFullScreen
        className="w-full h-[75vh]"
      />
    </main>
  )
}

export default page
