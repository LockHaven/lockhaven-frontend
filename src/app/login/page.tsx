'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ERROR_MESSAGES, SUCCESS_MESSAGES, PASSWORD_REGEX } from '@/lib/constants'
import { validateFormDataWithRules, validateEmail, validatePassword } from '@/lib/validation'
import FormInput from '@/components/ui/FormInput'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
    const router = useRouter()
    const { login } = useAuth()
    
    // State for form inputs
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [passwordHelperText, setPasswordHelperText] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Clear any previous errors
        setError('')

        // Define validation rules for login form
        const validationRules = {
            email: validateEmail,
            password: validatePassword
        }

        // Validate form data with specific rules
        const formData = { email, password }
        const formDataValidation = validateFormDataWithRules(formData, validationRules)
        if (!formDataValidation.isValid) {
            setError(formDataValidation.error!)
            return
        }

        setIsLoading(true)

        try {
            await login(email, password)
            setSuccess(SUCCESS_MESSAGES.LOGIN_SUCCESS)
            setTimeout(() => router.push('/dashboard'), 1500)
        } catch (err: any) {
            setError(err.message || ERROR_MESSAGES.LOGIN_FAILED)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full">
                {/* Back to Home Link */}
                <div className="mb-6">
                    <Link 
                        href="/" 
                        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>

                <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
                    Sign In to LockHaven
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
                    Access your secure files
                </p>
                
                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 rounded-lg">
                        {success}
                    </div>
                )}
                
                {/* Form Container */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <FormInput
                        id="email"
                        name="email"
                        type="email"
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        disabled={isLoading}
                    />

                    {/* Password Input */}
                    <FormInput
                        id="password"
                        name="password"
                        type="password"
                        label="Password"
                        value={password}
                        onChange={(e) => {
                            const newPassword = e.target.value
                            setPassword(newPassword)
                            
                            // Real-time password validation
                            if (newPassword && !PASSWORD_REGEX.test(newPassword)) {
                                setPasswordHelperText('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
                            } else if (newPassword) {
                                setPasswordHelperText('Password meets requirements ✓')
                            } else {
                                setPasswordHelperText('')
                            }
                        }}
                        placeholder="Enter your password"
                        required
                        disabled={isLoading}
                        helperText={passwordHelperText}
                        showHelperText={!!passwordHelperText}
                    />

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                {/* Sign Up Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link 
                            href="/register" 
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}