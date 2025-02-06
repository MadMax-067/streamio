"use client"
import React, { useContext, useState } from 'react'
import { BackendContext } from './Main';
import SearchIcon from './SearchIcon';

const Search = () => {
    const { searchValue, handleSearchChange, formSubmit } = useContext(BackendContext);

    return (
        <div className='searchbar flex items-center border border-secondary/30 rounded-[2rem] w-[45vw] md:h-12 2xl:h-16' >
            <form className='w-full flex justify-between items-center' onSubmit={formSubmit}>
                <input type="text" value={searchValue} onChange={handleSearchChange} placeholder='Search' className='outline-none placeholder:opacity-30 text-secondary/50 px-8 text-xl bg-transparent w-full' />
            <button className='md:px-4 2xl:px-5' >
                <SearchIcon />
            </button>
            </form>
        </div>
    )
}

export default Search
