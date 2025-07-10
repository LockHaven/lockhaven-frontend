import { config } from './config'

// API configuration
const API_BASE_URL = config.apiUrl

// API response types
export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    firstName: string
    lastName: string
    email: string
    password: string
}

export interface AuthResponse {
    success: boolean
    message: string
    token?: string
    user?: {
        id: string
        email: string
        firstName: string
        lastName: string
    }
}

export interface ApiError {
    message: string
    status: number
}

// Generic API call function with authentication
async function apiCall<T>(
    endpoint: string, 
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    // Get auth token from localStorage
    const token = localStorage.getItem('auth_token')
    
    const defaultOptions: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    }

    try {
        const response = await fetch(url, defaultOptions)
        
        if (!response.ok) {
            // Handle 401 Unauthorized
            if (response.status === 401) {
                localStorage.removeItem('auth_token')
                window.location.href = '/login'
                throw new Error('Authentication required')
            }
            
            const errorData = await response.json().catch(() => ({ message: 'Network error' }))
            throw new Error(errorData.message || `HTTP ${response.status}`)
        }
        
        return await response.json()
    } catch (error) {
        console.error('API call failed:', error)
        throw error
    }
}

// Authentication API functions
export const authApi = {
    // Login user
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        return apiCall<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        })
    },

    // Register user
    async register(userData: RegisterRequest): Promise<AuthResponse> {
        return apiCall<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        })
    },

    // Logout user
    async logout(): Promise<{ success: boolean }> {
        return apiCall<{ success: boolean }>('/auth/logout', {
            method: 'POST',
        })
    },

    // Get current user profile
    async getProfile(): Promise<AuthResponse> {
        return apiCall<AuthResponse>('/auth/profile', {
            method: 'GET',
        })
    },
}

// File management API functions (for future use)
export const fileApi = {
    // Upload file
    async uploadFile(file: File): Promise<{ success: boolean; fileId: string }> {
        const formData = new FormData()
        formData.append('file', file)
        
        return apiCall<{ success: boolean; fileId: string }>('/files/upload', {
            method: 'POST',
            body: formData,
            headers: {
                // Don't set Content-Type for FormData
            },
        })
    },

    // Get user files
    async getFiles(): Promise<{ files: Array<{ id: string; name: string; size: number }> }> {
        return apiCall<{ files: Array<{ id: string; name: string; size: number }> }>('/files', {
            method: 'GET',
        })
    },

    // Download file
    async downloadFile(fileId: string): Promise<Blob> {
        const response = await fetch(`${API_BASE_URL}/files/${fileId}/download`, {
            method: 'GET',
        })
        
        if (!response.ok) {
            throw new Error('Download failed')
        }
        
        return response.blob()
    },
} 