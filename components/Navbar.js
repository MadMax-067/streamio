"use client"
import React, { useContext, useState, useRef, useEffect } from 'react'
import Streamio from './Streamio';
import localFont from 'next/font/local';
import Search from './Search';
import Link from 'next/link';
import Image from 'next/image';
import { BackendContext } from './Providers';
import { useRouter } from 'next/navigation'
import { prefetchAndNavigate } from '@/utils/navigation'

const mercenary = localFont({ src: '../fonts/mercenaryBold.otf' });

const Navbar = ({ setIsRegistering, setIsLogging }) => {
    const backendData = useContext(BackendContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter()

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className={`${mercenary.className} navbar flex items-center w-full h-[9.25vh]`}>
            <div className='flex w-full items-center mx-4 md:m-0 justify-center md:justify-between md:px-7 2xl:px-10 ' >
                {!backendData.isSearching && (<div>
                    <button 
                        onClick={async () => {
                            await prefetchAndNavigate(router, '/')
                        }}
                        className="hover:opacity-80 transition-opacity"
                    >
                        <Streamio />
                    </button>
                </div>)}
                <Search />
                {!backendData.isMobile && (!backendData.isLoggedIn ? (<div className='flex gap-3' >
                    <button onClick={backendData.onLoginClick} className='btn min-h-0 btn-accent text-secondary/70 md:rounded-[0.85rem] 2xl:rounded-2xl md:w-24 md:h-9 2xl:w-[6.25rem] 2xl:h-10 2xl:text-lg border-secondary/30'>Login</button>
                    <button onClick={backendData.onSignupClick} className='btn min-h-0 btn-primary text-secondary md:rounded-[0.85rem] 2xl:rounded-2xl md:w-24 md:h-9 2xl:w-[6.25rem] 2xl:h-10 2xl:text-lg'>Sign up</button>
                </div>) : (<div className='flex items-center justify-end w-[12.8rem]' ref={dropdownRef}>
                    <div className="relative">
                        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="m-1">
                            <div className="avatar h-9 w-9 rounded-full">
                                <div className="ring-primary ring-offset-accent w-20 rounded-full ring ring-offset-2">
                                    <Image className='rounded-full h-9 w-9' fill style={{ objectFit: 'cover' }} src={backendData?.userData?.avatar} alt={backendData?.userData?.username} />
                                </div>
                            </div>
                        </button>
                        {isDropdownOpen && (
                            <ul className="absolute right-0 mt-2 backdrop-blur-[1rem] menu bg-primary/10 text-secondary rounded-box z-[1] w-40 p-2 shadow">
                                <li>
                                    <Link href={`/profile/${backendData?.userData?.username}`}>Profile</Link>
                                </li>
                                <li><a onClick={backendData.logoutHandle}>Logout</a></li>
                            </ul>
                        )}
                    </div>
                </div>))}
            </div>
        </nav>
    )
}

export default Navbar
