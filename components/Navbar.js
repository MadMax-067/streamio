"use client"
import React, { useContext, useEffect } from 'react'
import Streamio from './Streamio';
import localFont from 'next/font/local';
import Search from './Search';
import Link from 'next/link';
import Image from 'next/image';
import { BackendContext } from './Main';
const mercenary = localFont({ src: '../fonts/mercenaryBold.otf' });

const Navbar = ({ setIsRegistering, setIsLogging }) => {
    const backendData = useContext(BackendContext);

    const onLoginClick = () => {
        backendData.setIsRegistering(false);
        backendData.setIsLogging(true);
    };
    const onSignupClick = () => {
        backendData.setIsLogging(false);
        backendData.setIsRegistering(true);
    };

    return (
        <nav className={`${mercenary.className} navbar flex items-center w-full h-[9.25vh]`}>
            <div className='flex w-full items-center justify-between md:px-7 2xl:px-10 ' >
                <div>
                    <Link href="/"><Streamio /></Link>
                </div>
                <Search />
                {!backendData.isLoggedIn ? (<div className='flex gap-3' >
                    <button onClick={onLoginClick} className='btn min-h-0 btn-accent text-secondary/70 md:rounded-[0.85rem] 2xl:rounded-2xl md:w-24 md:h-9 2xl:w-[6.25rem] 2xl:h-10 2xl:text-lg border-secondary/30'>Login</button>
                    <button onClick={onSignupClick} className='btn min-h-0 btn-primary text-secondary md:rounded-[0.85rem] 2xl:rounded-2xl md:w-24 md:h-9 2xl:w-[6.25rem] 2xl:h-10 2xl:text-lg'>Sign up</button>
                </div>) : (<div className='flex items-center justify-end w-[12.8rem]' >
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="m-1"><div className="avatar h-9 w-9 rounded-full">
                            <div class="ring-primary ring-offset-accent w-20 rounded-full ring ring-offset-2">
                                <Image className='rounded-full h-9 w-9' fill style={{ objectFit: 'cover' }} src={backendData?.userData?.avatar} alt={backendData?.userData?.username} />
                            </div>
                        </div></div>
                        <ul tabIndex={0} className="dropdown-content backdrop-blur-[1rem] menu bg-primary/10 text-secondary rounded-box z-[1] w-40 p-2 shadow">
                            <li><a>Profile</a></li>
                            <li><a onClick={backendData.logoutHandle} >Logout</a></li>
                        </ul>
                    </div>
                </div>)}
            </div>
        </nav>
    )
}

export default Navbar
