"use client"
import { Check, X } from 'lucide-react'

export default function PasswordRequirements({ password }) {
  const requirements = [
    {
      text: 'At least 8 characters long',
      test: (pass) => pass.length >= 8
    },
    {
      text: 'Contains at least one uppercase letter',
      test: (pass) => /[A-Z]/.test(pass)
    },
    {
      text: 'Contains at least one lowercase letter',
      test: (pass) => /[a-z]/.test(pass)
    },
    {
      text: 'Contains at least one number',
      test: (pass) => /\d/.test(pass)
    },
    {
      text: 'Contains at least one special character',
      test: (pass) => /[@$!%*?&]/.test(pass)
    }
  ]

  return (
    <div className="space-y-2">
      {requirements.map((req, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          {req.test(password) ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <X className="w-4 h-4 text-red-500" />
          )}
          <span className={req.test(password) ? "text-green-500" : "text-red-500"}>
            {req.text}
          </span>
        </div>
      ))}
    </div>
  )
}