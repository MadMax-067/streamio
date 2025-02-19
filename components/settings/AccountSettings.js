"use client"
import { useState, useContext } from 'react'
import { BackendContext } from '../Providers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { Camera, Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'

export default function AccountSettings() {
  const { userData, setUserData } = useContext(BackendContext)
  const [formData, setFormData] = useState({
    fullName: userData?.fullName || '',
    username: userData?.username || '',
    email: userData?.email || ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [coverLoading, setCoverLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value.trimStart()
    }))
  }

  const handleAccountUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Create an object with only the changed fields
    const changedFields = Object.entries(formData).reduce((acc, [key, value]) => {
      if (value !== userData[key]) {
        acc[key] = value
      }
      return acc
    }, {})

    // If no fields have changed, show a message and return
    if (Object.keys(changedFields).length === 0) {
      toast.info('No changes to update')
      setIsLoading(false)
      return
    }

    try {
      const response = await axios.patch('/api/users/update-account', changedFields)
      if (response.data.success) {
        setUserData({
          ...userData,
          ...changedFields
        })
        toast.success('Account details updated successfully')
        if (changedFields.email && response.data.emailVerificationRequired) {
          toast.info('A verification link has been sent to your new email address. Please verify to complete the email update.')
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update account details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    const formData = new FormData()
    formData.append('avatar', file)
    setAvatarLoading(true)

    try {
      const response = await axios.patch('/api/users/update-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (response.data.success) {
        setUserData({
          ...userData,
          avatar: response.data.avatar
        })
        toast.success('Avatar updated successfully')
      }
    } catch (error) {
      toast.error('Failed to update avatar')
    } finally {
      setAvatarLoading(false)
    }
  }

  const handleCoverChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB')
      return
    }

    const formData = new FormData()
    formData.append('coverImage', file)
    setCoverLoading(true)

    try {
      const response = await axios.patch('/api/users/update-cover-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (response.data.success) {
        setUserData({
          ...userData,
          coverImage: response.data.coverImage
        })
        toast.success('Cover image updated successfully')
      }
    } catch (error) {
      toast.error('Failed to update cover image')
    } finally {
      setCoverLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="relative mb-24">
        <div className="relative w-full h-48 bg-gray-800 rounded-xl overflow-hidden">
          <Image
            src={userData?.coverImage || "/placeholder-cover.jpg"}
            alt="Cover"
            fill
            className="object-cover"
          />
          <label className="absolute bottom-4 right-4 cursor-pointer">
            <div className="flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              <Camera className="w-5 h-5" />
              <span>Change Cover</span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
              disabled={coverLoading}
            />
          </label>
          {coverLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}
        </div>
        
        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-gray-900 bg-gray-800">
              <Image
                src={userData?.avatar || "/placeholder.svg"}
                alt="Avatar"
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
            <label className="absolute bottom-2 right-2 cursor-pointer">
              <div className="p-2 bg-gray-900/80 backdrop-blur-sm rounded-full hover:bg-gray-800 transition-colors">
                <Camera className="w-5 h-5" />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={avatarLoading}
              />
            </label>
            {avatarLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleAccountUpdate} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="bg-gray-800 border-gray-700"
            />
          </div>
        </div>

        {formData.email !== userData?.email && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-400">
              Changing your email will require verification. A verification link will be sent to your new email address.
            </p>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full md:w-auto"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Account'
          )}
        </Button>
      </form>
    </div>
  )
}