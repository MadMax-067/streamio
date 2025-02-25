"use client"
import { useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BackendContext } from '@/components/Providers'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { ImageIcon, X, Eye, EyeOff } from 'lucide-react' // Add this import
import Image from 'next/image'
import axios from 'axios'
import PasswordRequirements from '@/components/PasswordRequirements'

export default function SignUpPage() {
    const router = useRouter()
    const backendData = useContext(BackendContext)
    const [isDragging, setIsDragging] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [showPassword, setShowPassword] = useState(false) // Add this state

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        avatar: null
    })

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true)
        } else if (e.type === "dragleave") {
            setIsDragging(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const file = e.dataTransfer.files[0]
        handleAvatarFile(file)
    }

    const handleAvatarFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            const fakeEvent = {
                target: {
                    name: 'avatar',
                    files: [file]
                }
            }
            handleChange(fakeEvent)

            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result)
            }
            reader.readAsDataURL(file)
        } else {
            toast.error('Please upload an image file')
        }
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target
        if (name === 'avatar' && files) {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }))
            // Handle preview separately
            if (files[0]) {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setAvatarPreview(reader.result)
                }
                reader.readAsDataURL(files[0])
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const validatePassword = (password) => {
        const hasLength = password.length >= 8
        const hasUpper = /[A-Z]/.test(password)
        const hasLower = /[a-z]/.test(password)
        const hasNumber = /\d/.test(password)
        const hasSpecial = /[@$!%*?&]/.test(password)
        return hasLength && hasUpper && hasLower && hasNumber && hasSpecial
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const requiredFields = ['fullName', 'email', 'username', 'password']
        for (const field of requiredFields) {
            if (!formData[field]) {
                toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`)
                return
            }
        }

        if (!validatePassword(formData.password)) {
            toast.error('Password does not meet requirements')
            return
        }

        try {
            const data = new FormData()
            Object.keys(formData).forEach(key => {
                if (formData[key]) {
                    data.append(key, formData[key])
                }
            })

            backendData.setIsLoading(true) // Show loading state

            const response = await axios.post('/api/users/register', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            

            if (response.data.success) {
                toast.success('Account created successfully')
                router.push(`/signup/verification-sent?email=${encodeURIComponent(formData.email)}`)
            } else {
                toast.error(response.data.message || 'Registration failed')
            }
        } catch (error) {
            // Detailed error logging
            console.error('Registration error:', error)

            // More specific error messages
            if (error.response) {
                // Server responded with error
                toast.error(error.response.data.message || 'Registration failed')
            } else if (error.request) {
                // Request made but no response
                toast.error('No response from server. Please try again.')
            } else {
                // Error in request setup   
                toast.error('Error creating account. Please try again.')
            }
        } finally {
            backendData.setIsLoading(false) // Reset loading state
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
                    Create Account
                </h1>
                <p className="text-gray-400 text-center mb-8">
                    Join the Streamio community
                </p>

                <div className="bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm border border-gray-700/50">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {/* Avatar Upload Section */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Profile Picture
                                </label>
                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    className={`relative w-32 h-32 mx-auto rounded-full border-2 border-dashed transition-colors overflow-hidden
                                        ${isDragging
                                            ? 'border-blue-500 bg-blue-500/10'
                                            : 'border-gray-600 hover:border-gray-500'}`}
                                >
                                    {avatarPreview ? (
                                        <>
                                            <Image
                                                src={avatarPreview}
                                                alt="Avatar preview"
                                                fill
                                                className="object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const fakeEvent = {
                                                        target: {
                                                            name: 'avatar',
                                                            files: null
                                                        }
                                                    }
                                                    handleChange(fakeEvent)
                                                    setAvatarPreview(null)
                                                }}
                                                className="absolute top-1 right-1 p-1 bg-gray-800/80 rounded-full hover:bg-gray-700 z-10"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleAvatarFile(e.target.files[0])}
                                                className="hidden"
                                                id="avatar-upload"
                                                name="avatar"
                                            />
                                            <label
                                                htmlFor="avatar-upload"
                                                className="flex flex-col items-center cursor-pointer"
                                            >
                                                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                                <span className="text-xs text-gray-400 text-center px-2">
                                                    Drop photo here or click to upload
                                                </span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="fullName">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:outline-none focus:border-blue-500 transition"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Add all form fields */}
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

                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="username">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:outline-none focus:border-blue-500 transition"
                                    placeholder="Choose a username"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:outline-none focus:border-blue-500 transition pr-10"
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <div className="mt-2 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                                    <h3 className="text-sm font-medium mb-2 text-gray-300">Password Requirements:</h3>
                                    <PasswordRequirements password={formData.password} />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={backendData.isLoading || !validatePassword(formData.password)}
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {backendData.isLoading ? 'Creating account...' : 'Sign up'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-gray-400">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}