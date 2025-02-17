"use client"
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'

export default function VerifyEmailPage() {
    const params = useParams()
    const router = useRouter()
    const [verificationState, setVerificationState] = useState({
        isLoading: true,
        isSuccess: false,
        error: null
    })

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(`/api/verify-email/${params.token}`)
                if (response.data.success) {
                    setVerificationState({
                        isLoading: false,
                        isSuccess: true,
                        error: null
                    })
                } else {
                    throw new Error(response.data.message)
                }
            } catch (error) {
                setVerificationState({
                    isLoading: false,
                    isSuccess: false,
                    error: error.response?.data?.message || 'Verification failed'
                })
            }
        }

        verifyEmail()
    }, [params.token])

    const renderContent = () => {
        if (verificationState.isLoading) {
            return (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">
                        Verifying your email
                    </h1>
                    <p className="text-gray-400">
                        Please wait while we verify your email address...
                    </p>
                </motion.div>
            )
        }

        if (verificationState.isSuccess) {
            return (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-8 h-8 text-green-400" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">
                        Email Verified Successfully!
                    </h1>
                    <p className="text-gray-400 mb-8">
                        Your email has been verified. You can now log in to your account.
                    </p>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Continue to Login
                        </Link>
                    </motion.div>
                </motion.div>
            )
        }

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                    <XCircle className="w-8 h-8 text-red-400" />
                </div>
                <h1 className="text-2xl font-bold mb-4">
                    Verification Failed
                </h1>
                <p className="text-gray-400 mb-4">
                    {verificationState.error}
                </p>
                <p className="text-sm text-gray-500 mb-8">
                    The verification link might be expired or invalid. Please try requesting a new verification email.
                </p>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link
                        href="/resend-verification"
                        className="inline-flex items-center justify-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                        Request New Verification
                    </Link>
                </motion.div>
            </motion.div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-gray-800">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm border border-gray-700/50 text-center">
                    {renderContent()}
                </div>
            </motion.div>
        </div>
    )
}