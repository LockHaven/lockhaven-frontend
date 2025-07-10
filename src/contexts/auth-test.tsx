'use client'

import React from 'react'
import { useAuth } from './AuthContext'

// Test component to demonstrate AuthContext usage
export const AuthTest: React.FC = () => {
    const { 
        user, 
        isAuthenticated, 
        isLoading, 
        error, 
        login, 
        register,
        logout, 
        clearError 
    } = useAuth()

    const handleTestLogin = async () => {
        try {
            await login('test@example.com', 'password123')
        } catch (error) {
            console.error('Login failed:', error)
        }
    }

    const handleTestRegister = async () => {
        try {
            await register('John', 'Doe', 'john@example.com', 'SecurePass123!')
        } catch (error) {
            console.error('Registration failed:', error)
        }
    }

    if (isLoading) {
        return (
            <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">AuthContext Test</h3>
                <p>Loading authentication state...</p>
            </div>
        )
    }

    return (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">AuthContext Test</h3>
            
            {/* Authentication Status */}
            <div className="space-y-2">
                <p><strong>Status:</strong> {isAuthenticated ? 'Authenticated' : 'Not authenticated'}</p>
                {user && (
                    <div>
                        <p><strong>User:</strong> {user.firstName} {user.lastName}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                    </div>
                )}
                {error && (
                    <div className="text-red-600">
                        <p><strong>Error:</strong> {error}</p>
                        <button 
                            onClick={clearError}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Clear Error
                        </button>
                    </div>
                )}
            </div>

            {/* Test Actions */}
            <div className="space-x-2">
                {!isAuthenticated ? (
                    <>
                        <button
                            onClick={handleTestLogin}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Test Login
                        </button>
                        <button
                            onClick={handleTestRegister}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Test Register
                        </button>
                    </>
                ) : (
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Logout
                    </button>
                )}
            </div>

            {/* Context Information */}
            <div className="text-sm text-gray-600">
                <p>This component demonstrates how to use the AuthContext:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Access authentication state with <code>useAuth()</code></li>
                    <li>Call <code>login()</code> and <code>logout()</code> functions</li>
                    <li>Handle loading and error states</li>
                    <li>Access user information when authenticated</li>
                </ul>
            </div>
        </div>
    )
} 