"use client"
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import Link from 'next/link'

export default function VerificationContent() {
    const searchParams = useSearchParams()
    const email = searchParams.get('email')

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
        >
            <div className="bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm border border-gray-700/50 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                        <Mail className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">
                        Check your email
                    </h1>
                    <p className="text-gray-400 mb-2">
                        We've sent a verification link to:
                    </p>
                    <p className="text-lg font-medium text-blue-400 mb-6">
                        {email}
                    </p>
                    <p className="text-sm text-gray-500 mb-8">
                        Click the link in the email to verify your account. If you don't see the email, check your spam folder.
                    </p>
                    <div className="space-y-4">
                        <button
                            onClick={() => window.location.href = `mailto:${email}`}
                            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Open Email App
                        </button>
                        <Link
                            href="/login"
                            className="inline-block w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                            Back to Login
                        </Link>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}