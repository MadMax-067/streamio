"use client"
import { useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BackendContext } from '@/components/Providers'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import axios from 'axios'

export default function LoginPage() {
    const router = useRouter()
    const backendData = useContext(BackendContext)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Form validation
        if (!formData.password || (!formData.email && !formData.username)) {
            toast.error('Please provide either email or username, and password')
            return
        }

        setIsLoading(true)
        backendData.setIsLoading(true)

        try {
            const response = await axios.post('/api/users/login', formData, {
                withCredentials: true
            })

            if (response.data.success) {
                // Update context with user data
                backendData.setUserData(response.data.data.user)
                backendData.setIsLoggedIn(true)
                backendData.setMessage('Login successful')

                toast.success('Welcome back!')
                router.push('/')
                router.refresh()
            }
            if (response.status === 401) {
                setIsLoading(false)
                backendData.setIsLoading(false)
                toast.error('Invalid username/email or password')
            }
            else {
                throw new Error(response.data.message || 'Login failed')
            }
        } catch (error) {
            backendData.setIsLoggedIn(false)
            backendData.setMessage(error.response?.data?.message || error.message)

            // More specific error messages
            if (error.response?.status === 401) {
                toast.error('Invalid username/email or password')
            } else if (error.response?.status === 403) {
                toast.error('Please verify your email first')
                router.push(`/signup/verification-sent?email=${encodeURIComponent(formData.email)}`)
            } else if (!error.response) {
                toast.error('Network error. Please check your connection.')
            } else {
                toast.error(error.response?.data?.message || 'Login failed')
            }
        } finally {
            setIsLoading(false)
            backendData.setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                    Welcome Back
                </h1>
                <p className="text-gray-400 text-center mb-8">
                    Log in to continue to Streamio
                </p>

                <div className="bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm border border-gray-700/50">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:outline-none focus:border-blue-500 transition"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="relative flex items-center">
                                <div className="flex-grow border-t border-gray-600"></div>
                                <span className="flex-shrink mx-4 text-gray-400">or</span>
                                <div className="flex-grow border-t border-gray-600"></div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="username">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:outline-none focus:border-blue-500 transition"
                                    placeholder="Enter your username"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:outline-none focus:border-blue-500 transition"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Logging in...
                                </span>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-400">
                        Don't have an account?{' '}
                        <Link
                            href="/signup"
                            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}