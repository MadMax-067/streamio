"use client"
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { Mail, Loader2 } from 'lucide-react'
import Link from 'next/link'
import VerificationContent from './VerificationContent'

function LoadingState() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-16 h-16 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
        </div>
    )
}

export default function VerificationSentPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-gray-800">
            <Suspense fallback={<LoadingState />}>
                <VerificationContent />
            </Suspense>
        </div>
    )
}