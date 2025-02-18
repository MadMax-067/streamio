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
import { User, Settings, LogOut } from 'lucide-react'
import { Space_Grotesk } from 'next/font/google'

const mercenary = localFont({ src: '../fonts/mercenaryBold.otf' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

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
                {!backendData.isMobile && (!backendData.isLoggedIn ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => router.push('/login')}
                            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => router.push('/signup')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Sign up
                        </button>
                    </div>
                ) : (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 hover:bg-gray-800 rounded-lg p-2 transition-colors group"
                        >
                            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-700 group-hover:ring-gray-600 transition-colors">
                                <Image
                                    src={backendData.userData?.avatar || '/default-avatar.png'}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className={`hidden md:block ${spaceGrotesk.className} font-medium text-gray-200 group-hover:text-white transition-colors`}>
                                {backendData.userData?.username}
                            </span>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 z-50">
                                <Link
                                    href={`/profile/${backendData.userData?.username}`}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors"
                                >
                                    <User className="w-4 h-4" />
                                    <span className={spaceGrotesk.className}>Profile</span>
                                </Link>
                                <Link
                                    href="/settings"
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors"
                                >
                                    <Settings className="w-4 h-4" />
                                    <span className={spaceGrotesk.className}>Settings</span>
                                </Link>
                                <div className="border-t border-gray-700 my-1" />
                                <button
                                    onClick={backendData.logoutHandle}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-gray-700/50 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className={spaceGrotesk.className}>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </nav>
    )
}

export default Navbar
