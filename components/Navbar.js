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
import { User, Settings, X, LogOut } from 'lucide-react'
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

    const handleOptionClick = () => {
        setIsDropdownOpen(false);
    };

    return (
        <nav className={`${mercenary.className} navbar flex items-center w-full h-[9.25vh] bg-gray-900/95 backdrop-blur-md z-40 border-b border-gray-800/50`}>
            <div className='flex w-full items-center mx-4 md:m-0 justify-between md:justify-between md:px-7 2xl:px-10'>
                {!backendData.isSearching && (
                    <Link href="/" className="shrink-0">
                        <Streamio />
                    </Link>
                )}

                <div className="flex-1 flex justify-end md:justify-center">
                    <Search />
                </div>

                {!backendData.isMobile && (!backendData.isLoggedIn ? (
                    <div className="md:flex gap-2 hidden">
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
                            <div 
                                className="absolute right-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-xl overflow-hidden"
                                style={{ zIndex: 1000 }}
                                ref={dropdownRef}
                            >
                                <Link 
                                    href={`/profile/${backendData.userData?.username}`}
                                    className="block hover:bg-gray-700/50 transition-colors"
                                >
                                    <div className="p-4 border-b border-gray-700/50">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-700">
                                                <Image
                                                    src={backendData.userData?.avatar || '/default-avatar.png'}
                                                    alt="Profile"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-200">{backendData.userData?.fullName}</p>
                                                <p className="text-sm text-gray-400">@{backendData.userData?.username}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                <div className="py-2">
                                    <Link
                                        href={`/profile/${backendData.userData?.username}`}
                                        className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700/50 transition-colors"
                                        onClick={handleOptionClick}
                                    >
                                        <User className="w-5 h-5" />
                                        <span className={spaceGrotesk.className}>View Profile</span>
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700/50 transition-colors"
                                        onClick={handleOptionClick}
                                    >
                                        <Settings className="w-5 h-5" />
                                        <span className={spaceGrotesk.className}>Settings</span>
                                    </Link>
                                </div>

                                <div className="border-t border-gray-700/50 py-2">
                                    <button
                                        onClick={() => { backendData.logoutHandle(); handleOptionClick(); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-700/50 transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className={spaceGrotesk.className}>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </nav>
    )
}

export default Navbar
