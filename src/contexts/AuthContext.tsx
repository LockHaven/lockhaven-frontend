'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '@/lib/api'

// Types for authentication
export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    name?: string // Computed from firstName + lastName
}

export interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
}

export interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>
    register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>
    logout: () => void
    clearError: () => void
    refreshUser: () => Promise<void>
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
    })

    // Initialize auth state on mount
    useEffect(() => {
        initializeAuth()
    }, [])

    // Check for existing token and validate it
    const initializeAuth = async () => {
        try {
            const token = localStorage.getItem('auth_token')
            if (token) {
                // Validate token with backend
                const response = await authApi.getProfile()
                if (response.user) {
                    setState({
                        user: response.user,
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    })
                } else {
                    throw new Error('Invalid token')
                }
            } else {
                setState(prev => ({ ...prev, isLoading: false }))
            }
        } catch (error) {
            // Token is invalid, clear it
            localStorage.removeItem('auth_token')
            setState({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            })
        }
    }

    // Login function
    const login = async (email: string, password: string) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))
            
            const response = await authApi.login({ email, password })
            
            if (response.token && response.user) {
                // Store token
                localStorage.setItem('auth_token', response.token)
                
                setState({
                    user: response.user,
                    token: response.token,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                })
            } else {
                throw new Error('Login failed - invalid response')
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Login failed',
            }))
            throw error
        }
    }

    // Register function
    const register = async (firstName: string, lastName: string, email: string, password: string) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))
            
            const response = await authApi.register({ firstName, lastName, email, password })
            
            if (response.token && response.user) {
                // Store token
                localStorage.setItem('auth_token', response.token)
                
                setState({
                    user: response.user,
                    token: response.token,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                })
            } else {
                throw new Error('Registration failed - invalid response')
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Registration failed',
            }))
            throw error
        }
    }

    // Logout function
    const logout = () => {
        localStorage.removeItem('auth_token')
        setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        })
    }

    // Clear error
    const clearError = () => {
        setState(prev => ({ ...prev, error: null }))
    }

    // Refresh user data
    const refreshUser = async () => {
        try {
            const response = await authApi.getProfile()
            if (response.user) {
                setState(prev => ({ ...prev, user: response.user as User }))
            } else {
                throw new Error('Failed to get user profile')
            }
        } catch (error) {
            // If refresh fails, user might be logged out
            logout()
        }
    }

    const value: AuthContextType = {
        ...state,
        login,
        register,
        logout,
        clearError,
        refreshUser,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

// Higher-order component for protected routes
export const withAuth = <P extends object>(
    Component: React.ComponentType<P>
) => {
    return function AuthenticatedComponent(props: P) {
        const { isAuthenticated, isLoading } = useAuth()

        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                </div>
            )
        }

        if (!isAuthenticated) {
            // Redirect to login (handled by Next.js router)
            window.location.href = '/signIn'
            return null
        }

        return <Component {...props} />
    }
} 