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

    
    return (
        <Suspense fallback={<div className='min-h-screen flex items-center justify-center'><Loading /></div>}>
            <main className='flex'>
                <Hero />
                {backendData.isMobile && <BottomBar />}
            </main>
        </Suspense>
    )
}

export default Main
