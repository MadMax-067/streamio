"use client"
import { useState, useEffect, useContext } from 'react'
import { Space_Grotesk } from 'next/font/google'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AccountSettings from '@/components/settings/AccountSettings'
import SecuritySettings from '@/components/settings/SecuritySettings'
import { useRouter } from 'next/navigation'
import Loading from '@/components/Loading'
import { BackendContext } from '@/components/Providers'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

export default function SettingsPage() {
  const backendData = useContext(BackendContext)
  const router = useRouter()


  useEffect(() => {
    // Handle all navigation in one place
    if (!backendData.isAuthChecking && !backendData.isLoggedIn) {
      router.replace('/welcome')
    }
  }, [backendData.isAuthChecking, backendData.isLoggedIn, router])

  // Show loading while checking auth
  if (backendData.isAuthChecking) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  // If not logged in, show loading while redirecting
  if (!backendData.isLoggedIn) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loading />
      </div>
    )
  }


  return (
    <div className={`${spaceGrotesk.className} min-h-screen text-secondary md:pb-0 pb-[4.5rem]`}>
      <div className="px-4 md:container md:mx-auto py-4 md:py-6">
        <div className="flex flex-col max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Settings</h1>
          
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 md:mb-8">
              <TabsTrigger 
                value="account" 
                className="px-2 md:px-4 py-2 md:py-2.5 text-sm md:text-base"
              >
                Account Details
              </TabsTrigger>
              <TabsTrigger 
                value="security"
                className="px-2 md:px-4 py-2 md:py-2.5 text-sm md:text-base"
              >
                Security
              </TabsTrigger>
            </TabsList>
            <div className="px-2 md:px-0">
              <TabsContent value="account">
                <AccountSettings />
              </TabsContent>
              <TabsContent value="security">
                <SecuritySettings />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}