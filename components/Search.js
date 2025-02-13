"use client"
import React, { useContext, useRef, useState, useEffect } from 'react'
import { BackendContext } from './Providers'
import SearchIcon from './SearchIcon'
import { useRouter } from 'next/navigation'

const Search = () => {
    const router = useRouter()
    const { searchValue, handleSearchChange, isMobile, isSearching, setIsSearching } = useContext(BackendContext)
    const mobileSearchRef = useRef()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (searchValue.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`)
            setIsSearching(false)
        }
    }

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
                    <form ref={mobileSearchRef} className='w-4/5 md:w-full flex justify-between items-center' onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            value={searchValue} 
                            onChange={handleSearchChange} 
                            placeholder='Search' 
                            className='outline-none placeholder:opacity-30 text-secondary/50 pr-8 md:px-8 text-xl bg-transparent w-full' 
                        />
                        <button className='md:px-4 2xl:px-5'>
                            <SearchIcon />
                        </button>
                    </form>
                ) : (
                    <button onClick={() => setIsSearching(true)} className='btn ml-auto bg-secondary/10 border-none rounded-full'>
                        <SearchIcon />
                    </button>
                )
            ) : (
                <div className='searchbar flex items-center border border-secondary/30 rounded-[2rem] w-[45vw] md:h-12 2xl:h-16'>
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
