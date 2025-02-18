"use client"
import React, { useContext, useRef, useState, useEffect, useCallback } from 'react'
import { BackendContext } from './Providers'
import SearchIcon from './SearchIcon'
import { useRouter } from 'next/navigation'
import { prefetchAndNavigate } from '@/utils/navigation'
import { X, LogOut } from 'lucide-react'

const Search = () => {
    const router = useRouter()
    const { searchValue, handleSearchChange, isMobile, isSearching, setIsSearching } = useContext(BackendContext)
    const mobileSearchRef = useRef()
    const [isNavigating, setIsNavigating] = useState(false)

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        if (searchValue.trim() && !isNavigating) {
            setIsNavigating(true)
            const query = encodeURIComponent(searchValue.trim())
            await prefetchAndNavigate(router, `/search?q=${query}`, () => {
                setIsSearching(false)
                setIsNavigating(false)
            })
        }
    }, [searchValue, setIsSearching, isNavigating])

    const handleClickOutside = (event) => {
        if (mobileSearchRef.current && mobileSearchRef.current.contains(event.target)) return;
        setIsSearching(false);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            {isMobile ? (
                isSearching ? (
                    <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-md z-50">
                        <div className="flex items-center h-[9.25vh] px-4">
                            <button 
                                onClick={() => setIsSearching(false)}
                                className="mr-4 text-gray-400"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <form 
                                ref={mobileSearchRef} 
                                className='flex-1 flex items-center' 
                                onSubmit={handleSubmit}
                            >
                                <input 
                                    type="text" 
                                    value={searchValue} 
                                    onChange={handleSearchChange} 
                                    placeholder='Search videos...' 
                                    autoFocus
                                    className='w-full bg-gray-800/50 text-gray-200 placeholder:text-gray-400 rounded-l-lg px-4 py-2 outline-none border border-gray-700/50' 
                                />
                                <button 
                                    type="submit"
                                    className='bg-gray-800/50 text-gray-400 px-4 py-2 rounded-r-lg border border-l-0 border-gray-700/50'
                                >
                                    <SearchIcon />
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsSearching(true)} 
                        className='ml-auto p-2 hover:bg-gray-800/50 rounded-lg transition-colors'
                    >
                        <SearchIcon className="w-6 h-6 text-gray-400" />
                    </button>
                )
            ) : (
                <div className='searchbar hidden md:flex items-center border border-secondary/30 rounded-[2rem] w-[45vw] md:h-12 2xl:h-16'>
                    <form className='w-full flex justify-between items-center' onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            value={searchValue} 
                            onChange={handleSearchChange} 
                            placeholder='Search' 
                            className='outline-none placeholder:opacity-30 text-secondary/50 px-8 text-xl bg-transparent w-full' 
                        />
                        <button className='md:px-4 2xl:px-5'>
                            <SearchIcon />
                        </button>
                    </form>
                </div>
            )}
        </>
    )
}

export default Search
