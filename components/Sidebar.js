import React from 'react'
import localFont from 'next/font/local';
import SideButton from './SideButton';
const mercenary = localFont({ src: '../fonts/mercenaryBold.otf' });
import { faHouse, faBookBookmark, faClockRotateLeft, faFolderOpen, faVideo, faHeart, faGear } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <aside className={`${mercenary.className} sidebar flex flex-col py-4 justify-between items-center h-[90.75vh] w-[15.625vw]`}>
      <div className='flex flex-col gap-3 w-full items-center'>
        <SideButton actionName={"Home"} iconName={faHouse} />
        <SideButton actionName={"Subscriptions"} iconName={faBookBookmark} />
        <SideButton actionName={"History"} iconName={faClockRotateLeft} />
        <SideButton actionName={"Playlists"} iconName={faFolderOpen} />
        <SideButton actionName={"Your videos"} iconName={faVideo} />
        <SideButton actionName={"Liked videos"} iconName={faHeart} />
      </div>
      <div className='flex flex-col gap-3 w-full items-center'>
        <SideButton actionName={"Settings"} iconName={faGear} />
      </div>
    </aside>
  )
}

export default Sidebar
