'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { fileApi } from '@/lib/api'

// File type definition
interface FileItem {
    id: string
    name: string
    size: number
    uploadedAt: string
    status: 'encrypted' | 'processing' | 'error'
}

export default function DashboardPage() {
    const router = useRouter()
    const { user, logout, isLoading } = useAuth()
    
    // Real file data from API
    const [files, setFiles] = useState<FileItem[]>([])
    const [isLoadingFiles, setIsLoadingFiles] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState('')

    // Load files when component mounts
    useEffect(() => {
        if (user && !isLoading) {
            loadFiles()
        }
    }, [user, isLoading])

    // Redirect if not authenticated
    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login')
        }
    }, [user, isLoading, router])

    // Load files from API
    const loadFiles = async () => {
        try {
            setIsLoadingFiles(true)
            setError('')
            const response = await fileApi.getFiles()
            setFiles(response.files.map(file => ({
                id: file.id,
                name: file.name,
                size: file.size,
                uploadedAt: new Date().toISOString(), // This would come from API
                status: 'encrypted' as const
            })))
        } catch (err: any) {
            setError(err.message || 'Failed to load files')
            console.error('Error loading files:', err)
        } finally {
            setIsLoadingFiles(false)
        }
    }

    // Handle file upload
    const handleFileUpload = async (file: File) => {
        try {
            setIsUploading(true)
            setUploadProgress(0)
            setError('')

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval)
                        return 90
                    }
                    return prev + 10
                })
            }, 200)

            const response = await fileApi.uploadFile(file)
            
            clearInterval(progressInterval)
            setUploadProgress(100)
            
            // Add new file to list
            setFiles(prev => [...prev, {
                id: response.fileId,
                name: file.name,
                size: file.size,
                uploadedAt: new Date().toISOString(),
                status: 'encrypted' as const
            }])

            setTimeout(() => setUploadProgress(0), 1000)
        } catch (err: any) {
            setError(err.message || 'Failed to upload file')
            console.error('Error uploading file:', err)
        } finally {
            setIsUploading(false)
        }
    }

    // Handle file download
    const handleFileDownload = async (fileId: string, fileName: string) => {
        try {
            const blob = await fileApi.downloadFile(fileId)
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = fileName
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (err: any) {
            setError(err.message || 'Failed to download file')
            console.error('Error downloading file:', err)
        }
    }

    // Handle file deletion
    const handleFileDelete = async (fileId: string) => {
        try {
            // This would be implemented in your API
            // await fileApi.deleteFile(fileId)
            setFiles(prev => prev.filter(file => file.id !== fileId))
        } catch (err: any) {
            setError(err.message || 'Failed to delete file')
            console.error('Error deleting file:', err)
        }
    }

    const handleLogout = async () => {
        await logout()
        router.push('/')
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Navigation Header */}
            <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">LockHaven</Link>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Welcome, {user.firstName}
                                    </span>
                                    <button 
                                        onClick={handleLogout}
                                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your secure files</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Upload Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Files</h2>
                    
                    {/* Upload Progress */}
                    {isUploading && (
                        <div className="mb-4">
                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                                <span>Uploading...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                    
                    {/* Drag & Drop Area */}
                    <div 
                        className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center transition-colors ${
                            isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer'
                        }`}
                        onDrop={(e) => {
                            e.preventDefault()
                            if (!isUploading) {
                                const files = Array.from(e.dataTransfer.files)
                                if (files.length > 0) {
                                    handleFileUpload(files[0])
                                }
                            }
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => {
                            if (!isUploading) {
                                const input = document.createElement('input')
                                input.type = 'file'
                                input.onchange = (e) => {
                                    const target = e.target as HTMLInputElement
                                    if (target.files && target.files.length > 0) {
                                        handleFileUpload(target.files[0])
                                    }
                                }
                                input.click()
                            }
                        }}
                    >
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                            {isUploading ? 'Uploading...' : 'Drag and drop files here, or click to browse'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            Maximum file size: 100MB
                        </p>
                    </div>
                </div>

                {/* Files Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Files</h2>
                        {isLoadingFiles && (
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                            </div>
                        )}
                    </div>
                    
                    {/* Files List */}
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {files.length === 0 && !isLoadingFiles ? (
                            <div className="px-6 py-8 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">No files uploaded yet</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">Upload your first file to get started</p>
                            </div>
                        ) : (
                            files.map((file) => (
                                <div key={file.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <div className="flex items-center space-x-4">
                                        {/* File Icon */}
                                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        
                                        {/* File Info */}
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {(file.size / (1024 * 1024)).toFixed(1)} MB • Uploaded {new Date(file.uploadedAt).toLocaleDateString()} • {file.status}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex items-center space-x-2">
                                        <button 
                                            onClick={() => handleFileDownload(file.id, file.name)}
                                            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                        >
                                            Download
                                        </button>
                                        <button 
                                            onClick={() => handleFileDelete(file.id)}
                                            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
