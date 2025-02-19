"use client"
import { useState } from 'react'
import { Space_Grotesk } from 'next/font/google'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AccountSettings from '@/components/settings/AccountSettings'
import SecuritySettings from '@/components/settings/SecuritySettings'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

export default function SettingsPage() {
  return (
    <div className={`${spaceGrotesk.className} min-h-screen text-secondary md:pb-0 pb-[4.5rem]`}>
      <div className="md:container md:mx-auto md:py-6 md:px-4">
        <div className="flex flex-col max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Settings</h1>
          
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="account">Account Details</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <AccountSettings />
            </TabsContent>
            <TabsContent value="security">
              <SecuritySettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}