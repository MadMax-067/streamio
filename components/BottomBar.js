"use client"
import React, { useContext } from 'react'
import { Space_Grotesk } from 'next/font/google'
import BottomButton from './BottomButton'
import { 
  faHouse, 
  faBookBookmark, 
  faClockRotateLeft,
  faFolderOpen,
  faVideo,
  faHeart,
  faGear 
} from '@fortawesome/free-solid-svg-icons'
import { BackendContext } from './Providers'
import Image from 'next/image'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

const BottomBar = () => {
  const backendData = useContext(BackendContext)

  return (
    <nav className={`${spaceGrotesk.className} fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-800/50 z-50 safe-bottom`}>
      <div className='flex items-center justify-between px-4 py-2'>
        <Link href="/" className="flex-1">
          <BottomButton iconName={faHouse} label="Home" />
        </Link>
        <Link href="/subscriptions" className="flex-1">
          <BottomButton iconName={faBookBookmark} label="Subs" />
        </Link>
        <Link href="/history" className="flex-1">
          <BottomButton iconName={faClockRotateLeft} label="History" />
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex-1 flex flex-col items-center gap-1 p-2 hover:text-blue-400 transition-colors">
              <Menu className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-400">More</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-64 bg-gray-800/95 backdrop-blur-md border border-gray-700/50 rounded-t-xl mb-16 shadow-2xl"
            align="end"
          >
            <Link href={`/profile/${backendData?.userData?.username}`}>
              <div className="p-4 border-b border-gray-700/50 hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-700">
                    <Image 
                      src={backendData?.userData?.avatar || "/placeholder.svg"} 
                      alt="Profile"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-200">{backendData?.userData?.fullName}</p>
                    <p className="text-sm text-gray-400">@{backendData?.userData?.username}</p>
                  </div>
                </div>
              </div>
            </Link>

            <div className="py-2 space-y-1">
              <Link href="/playlists">
                <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700/50 transition-colors">
                  <FontAwesomeIcon icon={faFolderOpen} className="w-5 h-5" />
                  <span>Your Playlists</span>
                </DropdownMenuItem>
              </Link>
              <Link href={`/profile/${backendData?.userData?.username}/videos`}>
                <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700/50 transition-colors">
                  <FontAwesomeIcon icon={faVideo} className="w-5 h-5" />
                  <span>Your Videos</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/liked">
                <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700/50 transition-colors">
                  <FontAwesomeIcon icon={faHeart} className="w-5 h-5" />
                  <span>Liked Videos</span>
                </DropdownMenuItem>
              </Link>
            </div>

            <div className="border-t border-gray-700/50 py-2">
              <Link href="/settings">
                <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700/50 transition-colors">
                  <FontAwesomeIcon icon={faGear} className="w-5 h-5" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link>
              <Link href={`/profile/${backendData?.userData?.username}`}>
                <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700/50 transition-colors">
                  <User className="w-5 h-5" />
                  <span>View Profile</span>
                </DropdownMenuItem>
              </Link>
              <button
                onClick={backendData.logoutHandle}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-700/50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

export default BottomBar
