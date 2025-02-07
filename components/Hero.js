"use client"
import React, { useContext } from 'react'
import VideoCard from './VideoCard'
import { BackendContext } from './Main';
import Loading from './Loading';

const Hero = ({ homeFeed }) => {
    const backendData = useContext(BackendContext);

    return (
        <section className='hero inline-block md:p-4 max-h-[90.75vh] overflow-x-hidden overflow-y-scroll h-[90.75vh] md:w-[84.375vw]' >
            {backendData.isLoggedIn && (<div className="flex h-fit flex-col md:flex-row flex-wrap justify-center gap-12 md:gap-x-5 md:gap-y-7 ">
                {backendData.homeLoading ? <Loading /> : backendData.homeMessage ? <div>backendData.homeMessage</div> : (homeFeed?.map((video, index) => {
                    return <VideoCard key={video._id} title={video.title} channelName={video.owner.username} thumbnail={video.thumbnail} views={video.views} avatar={video.owner.avatar} />
                }))}
            </div>)}
        </section>
    )
}

export default Hero
