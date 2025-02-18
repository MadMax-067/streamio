"use client"
import React, { useState } from 'react'
import localFont from 'next/font/local'
import { Space_Grotesk } from 'next/font/google'
import SideButton from './SideButton'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { 
    faHouse, 
    faBookBookmark, 
    faClockRotateLeft, 
    faFolderOpen, 
    faVideo, 
    faHeart, 
    faGear 
} from '@fortawesome/free-solid-svg-icons'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <motion.aside 
            className={`${spaceGrotesk.className} sidebar flex flex-col py-4 justify-between h-[90.75vh] backdrop-blur-sm border-r border-gray-800/50`}
            animate={{ 
                width: isCollapsed ? '4rem' : '15.625vw',
                transition: { duration: 0.3, ease: 'easeInOut' }
            }}
        >
            <div className='flex flex-col gap-3 w-full items-start relative'>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-2 p-1 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    ) : (
                        <ChevronLeft className="w-4 h-4 text-gray-400" />
                    )}
                </button>
                <SideButton actionName="Home" iconName={faHouse} isCollapsed={isCollapsed} />
                <SideButton actionName="Subscriptions" iconName={faBookBookmark} isCollapsed={isCollapsed} />
                <SideButton actionName="History" iconName={faClockRotateLeft} isCollapsed={isCollapsed} />
                <SideButton actionName="Playlists" iconName={faFolderOpen} isCollapsed={isCollapsed} />
                <SideButton actionName="Your videos" iconName={faVideo} isCollapsed={isCollapsed} />
                <SideButton actionName="Liked videos" iconName={faHeart} isCollapsed={isCollapsed} />
            </div>
            <div className='flex flex-col gap-3 w-full items-start'>
                <SideButton actionName="Settings" iconName={faGear} isCollapsed={isCollapsed} />
            </div>
        </motion.aside>
    )
}

export default Sidebar
