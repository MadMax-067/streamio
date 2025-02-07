import React from 'react'
import Image from 'next/image'
import localFont from 'next/font/local'
const nunito = localFont({ src: '../fonts/Nunito.ttf' });

const VideoCard = ({ title, thumbnail, channelName, views, avatar }) => {
    return (
        <div className={`${nunito.className} video-card cursor-pointer gap-2 shrink-0 flex flex-col justify-between max-h-[13.8rem] max-w-[20.6rem] h-[14.2rem] w-[21.25rem] md:max-h-[16rem] md:max-w-[22rem] md:h-[21.5rem] md:w-[31.25rem] bg-secondary/0 rounded`}>
            <div className="relative shrink-0 w-full h-[80%]">
                <Image src={thumbnail} alt={title} fill priority style={{ objectFit: 'cover' }} className="w-full h-auto rounded-2xl" />
            </div>
            <div className='flex items-center gap-3' >
                <div className="relative w-10 h-10 rounded-full">
                    <Image src={avatar} alt={channelName} fill style={{ objectFit: 'cover' }} className="w-full h-full" />
                </div>
                <div>
                    <h3 className="text-lg my-1 leading-none text-secondary font-semibold">{title}</h3>
                    <h6 className="text-secondary/50 text-sm leading-none">{channelName}</h6>
                    <h6 className="text-xs leading-none text-secondary/50">{views}</h6>
                </div>
            </div>
        </div>
    )
}

export default VideoCard
