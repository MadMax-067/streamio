"use client"
import React, { useContext } from 'react'
import VideoCard from './VideoCard'
import { BackendContext } from './Providers';
import Loading from './Loading';
import { useRouter } from 'next/navigation'

const Hero = () => {
    const backendData = useContext(BackendContext);
    const router = useRouter()

    return (
        <section className='hero inline-block md:p-4 max-h-[90.75vh] overflow-x-hidden overflow-y-scroll h-[90.75vh] md:w-[84.375vw]' >
            {backendData.isLoggedIn && (<div className="flex h-fit flex-col md:flex-row flex-wrap justify-center gap-12 md:gap-x-5 md:gap-y-7 ">
                {backendData.homeLoading ? <Loading /> : backendData.homeMessage ? <div>{backendData.homeMessage}</div> : (backendData.homeFeed?.map((video, index) => {
                    return <VideoCard key={video._id} videoId={video._id} title={video.title} channelName={video.owner.username} thumbnail={video.thumbnail} views={video.views} duration={video.duration} avatar={video.owner.avatar} />
                }))}
            </div>)}
        </section>
    )
}

export default Hero
