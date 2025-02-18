"use client"
import React, { useContext } from 'react'
import VideoCard from './VideoCard'
import VideoCardSkeleton from './VideoCardSkeleton'
import { BackendContext } from './Providers'
import { useRouter } from 'next/navigation'

const Hero = () => {
    const backendData = useContext(BackendContext)
    const router = useRouter()

    const skeletons = Array(8).fill(null) // Show 8 skeleton cards while loading

    return (
        <section className='hero inline-block md:p-4 max-h-[90.75vh] overflow-x-hidden overflow-y-scroll h-[90.75vh] md:w-[84.375vw]' >
            {backendData.isLoggedIn && (
                <div className="flex h-fit flex-col md:flex-row flex-wrap items-center md:items-start justify-center gap-12 md:gap-x-5 md:gap-y-7 px-4 md:px-0">
                    {backendData.homeLoading ? (
                        skeletons.map((_, index) => (
                            <VideoCardSkeleton key={index} />
                        ))
                    ) : backendData.homeMessage ? (
                        <div>{backendData.homeMessage}</div>
                    ) : (
                        backendData.homeFeed?.map((video) => (
                            <VideoCard 
                                key={video._id} 
                                videoId={video._id} 
                                title={video.title} 
                                description={video.description}
                                channelName={video.owner.username} 
                                thumbnail={video.thumbnail} 
                                views={video.views} 
                                duration={video.duration} 
                                avatar={video.owner.avatar} 
                                channelUsername={video.owner.username}
                                createdAt={video.createdAt}
                            />
                        ))
                    )}
                </div>
            )}
        </section>
    )
}

export default Hero
