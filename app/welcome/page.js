"use client"
import { useContext, useEffect } from 'react'
import { BackendContext } from '@/components/Providers'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function WelcomePage() {
    const router = useRouter()
    const backendData = useContext(BackendContext)
    
    useEffect(() => {
        if (backendData.isLoggedIn) {
            router.push('/')
        }
    }, [backendData.isLoggedIn, router])

    if (backendData.isLoggedIn) return null
    
    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Section */}
            <div className="flex-1 flex flex-col md:flex-row items-center justify-center p-4 md:p-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                        Welcome to Streamio
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl mb-8">
                        Your platform for sharing and discovering amazing videos
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                        <Link
                            href="/signup"
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Get Started
                        </Link>
                        <Link
                            href="/login"
                            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full md:w-1/2"
                >
                    <Image
                        src="/welcome-hero.png"
                        alt="Streamio Platform Preview"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-2xl"
                    />
                </motion.div>
            </div>
        </div>
    )
}
