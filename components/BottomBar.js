import React, { useContext } from 'react'
import localFont from 'next/font/local'
import BottomButton from './BottomButton'
import { faHouse, faBookBookmark, faHeart } from '@fortawesome/free-solid-svg-icons'
import { BackendContext } from './Providers'
import Image from 'next/image'
import Link from 'next/link'

const mercenary = localFont({ src: '../fonts/mercenaryBold.otf' })

const BottomBar = () => {
  const backendData = useContext(BackendContext)

  return (
    <aside className={`${mercenary.className} fixed bottom-0 bg-accent w-full bottomBar flex py-4 justify-center items-center`}>
      <div className='flex gap-3 w-full justify-evenly items-center'>
        <Link href="/" passHref prefetch>
          <BottomButton iconName={faHouse} />
        </Link>
        <BottomButton iconName={faBookBookmark} />
        <BottomButton iconName={faHeart} />
        <Link href={`/profile/${backendData?.userData?.username}`} passHref prefetch>
          <div 
            tabIndex={0} 
            role="button" 
            className="h-6 w-6"
          >
            <div className="avatar h-6 w-6 rounded-full">
              <div className="ring-primary ring-offset-accent w-20 rounded-full ring ring-offset-2">
                <Image 
                  className='rounded-full h-9 w-9' 
                  fill 
                  style={{ objectFit: 'cover' }} 
                  src={backendData?.userData?.avatar} 
                  alt={backendData?.userData?.username} 
                />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </aside>
  )
}

export default BottomBar
