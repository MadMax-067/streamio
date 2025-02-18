"use client"
import React, { useEffect, useContext, useRef, Suspense } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { Play, Video, Users, TrendingUp } from 'lucide-react'
import { BackendContext } from './Providers'
import SignUp from './SignUp'
import Login from './Login'
import Hero from './Hero'
import Sidebar from './Sidebar'
import BottomBar from './BottomBar'
import { useRouter } from 'next/navigation'
import AuthCheck from '@/components/AuthCheck'
import Loading from './Loading'

const Main = (props) => {
    const backendData = useContext(BackendContext)
    const router = useRouter()

    useEffect(() => {
        if (!backendData.isAuthChecking && !backendData.isLoggedIn) {
          router.push('/welcome')
        }
      }, [backendData.isAuthChecking, backendData.isLoggedIn, router])
    
      if (backendData.isAuthChecking || !backendData.isLoggedIn) return <div className='min-h-screen'></div>;

    return (
        <Suspense fallback={<div className='min-h-screen flex items-center justify-center'><Loading /></div>}>
            <main className='grid'>
                {!backendData.isMobile && <Sidebar />}
                <Hero />
                {backendData.isMobile && <BottomBar />}
            </main>
        </Suspense>
    )
}

export default Main
