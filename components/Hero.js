"use client"
import React, { useContext, useEffect, useState, useRef, useCallback } from 'react'
import VideoCard from './VideoCard'
import VideoCardSkeleton from './VideoCardSkeleton'
import { BackendContext } from './Providers'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const Hero = () => {
    const backendData = useContext(BackendContext)
    const router = useRouter()
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [videos, setVideos] = useState([])
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const observer = useRef()

    // Last element ref callback for intersection observer
    const lastVideoElementRef = useCallback(node => {
        if (backendData.homeLoading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
                loadMoreVideos()
            }
        })
        if (node) observer.current.observe(node)
    }, [hasMore, isLoadingMore])

    const loadMoreVideos = async () => {
        if (!hasMore || isLoadingMore) return
        setIsLoadingMore(true)
        try {
            const response = await axios.get(`/api/dashboard?page=${page + 1}&limit=10`)
            const newVideos = response.data.data.videos
            setVideos(prev => [...prev, ...newVideos])
            setHasMore(response.data.data.hasNext)
            setPage(prev => prev + 1)
        } catch (error) {
            console.error('Error loading more videos:', error)
        } finally {
            setIsLoadingMore(false)
        }
    }

    // Initial load
    useEffect(() => {
        if (backendData.homeFeed) {
            setVideos(backendData.homeFeed)
            setHasMore(true)
            setPage(1)
        }
    }, [backendData.homeFeed])

    const skeletons = Array(4).fill(null)

    return (
        <section className='hero inline-block md:p-4 overflow-x-hidden h-[90.75vh] flex-1'>
            {backendData.isLoggedIn && (
                <div className="flex h-fit flex-col md:flex-row flex-wrap items-center md:items-start justify-center gap-12 md:gap-x-5 md:gap-y-7 px-4 md:px-0">
                    {backendData.homeLoading ? (
                        skeletons.map((_, index) => (
                            <VideoCardSkeleton key={index} />
                        ))
                    ) : backendData.homeMessage ? (
                        <div>{backendData.homeMessage}</div>
                    ) : (
                        <>
                            {videos.map((video, index) => {
                                if (videos.length === index + 1) {
                                    return (
                                        <div ref={lastVideoElementRef} key={video._id}>
                                            <VideoCard
                                                videoId={video._id}
                                                title={video.title}
                                                description={video.description}
                                                channelName={video.owner.fullName}
                                                thumbnail={video.thumbnail}
                                                views={video.views}
                                                duration={video.duration}
                                                avatar={video.owner.avatar}
                                                channelUsername={video.owner.username}
                                                createdAt={video.createdAt}
                                            />
                                        </div>
                                    )
                                }
                                return (
                                    <VideoCard
                                        key={video._id}
                                        videoId={video._id}
                                        title={video.title}
                                        description={video.description}
                                        channelName={video.owner.fullName}
                                        thumbnail={video.thumbnail}
                                        views={video.views}
                                        duration={video.duration}
                                        avatar={video.owner.avatar}
                                        channelUsername={video.owner.username}
                                        createdAt={video.createdAt}
                                    />
                                )
                            })}
                            {isLoadingMore && (
                                skeletons.map((_, index) => (
                                    <VideoCardSkeleton key={`loading-${index}`} />
                                ))
                            )}
                        </>
                    )}
                </div>
            )}
        </section>
    )
}

export default Hero
