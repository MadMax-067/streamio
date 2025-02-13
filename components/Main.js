"use client"
import React, { useEffect, useContext, createContext, useState, useRef, use } from 'react'
import axios from 'axios';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Hero from './Hero';
import SignUp from './SignUp';
import Login from './Login';
import { motion, AnimatePresence } from "motion/react"
import BottomBar from './BottomBar';
import { BackendContext } from './Providers';

export const dynamic = 'force-dynamic'

const Main = (props) => {
    const backendData = useContext(BackendContext);

    const loginRef = useRef(null);
    const signUpRef = useRef(null);

    const handleClickOutside = (event) => {
        if (loginRef.current && loginRef.current.contains(event.target)) return;
        if (signUpRef.current && signUpRef.current.contains(event.target)) return;
        backendData.setIsLogging(false);
        backendData.setIsRegistering(false);
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    return (
        <main className='grid'>
            <AnimatePresence>
                {backendData.isLogging && (
                    <motion.div ref={loginRef}
                        key="loginModal"
                        exit={{ opacity: 0 }}
                        className='fixedBox'
                    >
                        <Login />
                    </motion.div>
                )}
                {backendData.isRegistering && (
                    <motion.div ref={signUpRef}
                        key="signUpModal"
                        exit={{ opacity: 0 }}
                        className='fixedBox'
                    >
                        <SignUp />
                    </motion.div>
                )}
            </AnimatePresence>
            {!backendData.isMobile && <Sidebar />}
            <Hero />
            {backendData.isMobile && <BottomBar />}
        </main>
    )
}

export default Main;
