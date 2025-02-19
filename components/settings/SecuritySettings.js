"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import PasswordRequirements from '../PasswordRequirements'
axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.validateStatus = status => {
    return status < 500 // Resolve only if the status code is less than 500
}

export default function SecuritySettings() {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: ''
    })
    const [isLoading, setIsLoading] = useState(false)

    const validatePassword = (password) => {
        const hasLength = password.length >= 8
        const hasUpper = /[A-Z]/.test(password)
        const hasLower = /[a-z]/.test(password)
        const hasNumber = /\d/.test(password)
        const hasSpecial = /[@$!%*?&]/.test(password)
        return hasLength && hasUpper && hasLower && hasNumber && hasSpecial
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()

        if (!validatePassword(formData.newPassword)) {
            toast.error('Password does not meet all requirements')
            return
        }

        if (!formData.oldPassword) {
            toast.error('Please enter your current password')
            return
        }

        setIsLoading(true)

        try {
            
            const response = await axios.post('/api/users/change-password', formData)
            
            if (response.data.success) {
                toast.success('Password updated successfully')
                setFormData({ oldPassword: '', newPassword: '' })
            }

            if (response.status === 401) {
                toast.error('Current password is incorrect')
                setIsLoading(false)
            }
        } catch (error) {
            console.log('Error caught:', error)
            // Reset loading state immediately when error occurs
            setIsLoading(false)

            // Handle 401 unauthorized error
            if (error.response?.status === 401) {
                toast.error('Current password is incorrect')
                return
            }

            // Handle other errors
            toast.error(
                error.response?.data?.message ||
                error.message ||
                'Failed to update password'
            )

            // Log detailed error information
            console.error('Error details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            })
        }

        setIsLoading(false)
    }

    return (
        <div className="space-y-8">
            <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="oldPassword">Current Password</Label>
                        <Input
                            id="oldPassword"
                            name="oldPassword"
                            type="password"
                            value={formData.oldPassword}
                            onChange={handleInputChange}
                            className="bg-gray-800 border-gray-700"
                        />
                    </div>

                    <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="bg-gray-800 border-gray-700"
                        />
                    </div>

                    <div className="mt-2 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                        <h3 className="text-sm font-medium mb-2">Password Requirements:</h3>
                        <PasswordRequirements password={formData.newPassword} />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={isLoading || !validatePassword(formData.newPassword) || !formData.oldPassword}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Updating Password...
                        </>
                    ) : (
                        'Change Password'
                    )}
                </Button>
            </form>
        </div>
    )
}