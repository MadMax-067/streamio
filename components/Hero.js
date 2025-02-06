"use client"
import React, { useContext } from 'react'
import VideoCard from './VideoCard'
import { BackendContext } from './Main';

const Hero = ({ homeFeed }) => {
    const backendData = useContext(BackendContext);

    return (
        <section className='hero inline-block p-4 h-[90.75vh] w-[84.375vw]' >
            {backendData.isLoggedIn && (<div className="flex flex-wrap justify-center gap-x-5 gap-y-7 ">
                {homeFeed?.map((video, index) => {
                    return <VideoCard key={video._id} title={video.title} channelName={video.owner.username} thumbnail={video.thumbnail} views={video.views} avatar={video.owner.avatar} />
                })}
            </div>)}
        </section>
    )
}

export default Hero
