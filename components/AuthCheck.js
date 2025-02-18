"use client"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { Video, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import { BackendContext } from './Providers'
import Image from 'next/image'

const AuthCheck = ({ message = "Please login to continue" }) => {
    const backendData = useContext(BackendContext)
    const router = useRouter()

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const rotateX = useTransform(mouseY, [-300, 300], [10, -10])
    const rotateY = useTransform(mouseX, [-300, 300], [-10, 10])

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        animate(mouseX, event.clientX - centerX)
        animate(mouseY, event.clientY - centerY)
    }

    const handleMouseLeave = () => {
        animate(mouseX, 0)
        animate(mouseY, 0)
    }

    if (backendData.isLoggedIn) return null

    return (
        <main className="min-h-screen">
            <div className="container mx-auto px-4 py-16 md:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                        Welcome to Streamio
                    </h1>
                    <p className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto">
                        {message}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center p-8 bg-gray-800/50 rounded-2xl"
                    >
                        <Video className="w-16 h-16 text-blue-400 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Share Your Content</h2>
                        <p className="text-gray-400 text-center">Upload and share your videos with a growing community of creators</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col items-center p-8 bg-gray-800/50 rounded-2xl"
                    >
                        <Users className="w-16 h-16 text-purple-400 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Connect with Others</h2>
                        <p className="text-gray-400 text-center">Join a vibrant community of content creators and viewers</p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="max-w-5xl mx-auto mb-16 perspective-1000"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <motion.div
                        className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-gray-800/50 p-2"
                        style={{
                            rotateX,
                            rotateY,
                            transformStyle: "preserve-3d"
                        }}
                    >
                        <motion.div
                            className="absolute inset-0 opacity-50 bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                            style={{
                                rotateX,
                                rotateY,
                                transformStyle: "preserve-3d"
                            }}
                        />
                        <Image
                            src="/platform-preview.png"
                            alt="Streamio Platform Preview"
                            width={1920}
                            height={1080}
                            className="w-full h-auto rounded-lg relative z-10"
                            priority
                        />
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center"
                >
                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => router.push('/signup')}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-semibold transition-colors"
                        >
                            Get Started
                        </button>
                        <button
                            onClick={() => router.push('/login')}
                            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-lg font-semibold transition-colors"
                        >
                            Sign In
                        </button>
                    </div>
                </motion.div>
            </div>
        </main>
    )
}

export default AuthCheck