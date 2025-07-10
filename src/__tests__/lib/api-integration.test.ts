// API Integration Test - Demonstrates how the frontend integrates with the backend
import { authApi, fileApi } from './api'

console.log('=== API Integration Test ===')

// Test authentication flow
async function testAuthenticationFlow() {
    console.log('\n--- Authentication Flow Test ---')
    
    try {
        // 1. Register a new user
        console.log('1. Registering new user...')
        const registerResponse = await authApi.register({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'SecurePass123!'
        })
        console.log('✅ Registration successful:', registerResponse)
        
        // 2. Login with the same user
        console.log('\n2. Logging in...')
        const loginResponse = await authApi.login({
            email: 'john.doe@example.com',
            password: 'SecurePass123!'
        })
        console.log('✅ Login successful:', loginResponse)
        
        // 3. Get user profile
        console.log('\n3. Getting user profile...')
        const profileResponse = await authApi.getProfile()
        console.log('✅ Profile retrieved:', profileResponse)
        
    } catch (error) {
        console.error('❌ Authentication test failed:', error)
    }
}

// Test file operations
async function testFileOperations() {
    console.log('\n--- File Operations Test ---')
    
    try {
        // 1. Get user files
        console.log('1. Getting user files...')
        const filesResponse = await fileApi.getFiles()
        console.log('✅ Files retrieved:', filesResponse)
        
        // 2. Create a mock file for upload test
        const mockFile = new File(['Hello, this is a test file!'], 'test.txt', {
            type: 'text/plain'
        })
        
        console.log('\n2. Uploading test file...')
        const uploadResponse = await fileApi.uploadFile(mockFile)
        console.log('✅ File uploaded:', uploadResponse)
        
        // 3. Download the uploaded file
        console.log('\n3. Downloading file...')
        const downloadResponse = await fileApi.downloadFile(uploadResponse.fileId)
        console.log('✅ File downloaded:', downloadResponse)
        
    } catch (error) {
        console.error('❌ File operations test failed:', error)
    }
}

// Test error handling
async function testErrorHandling() {
    console.log('\n--- Error Handling Test ---')
    
    try {
        // 1. Test invalid login
        console.log('1. Testing invalid login...')
        await authApi.login({
            email: 'invalid@example.com',
            password: 'wrongpassword'
        })
    } catch (error) {
        console.log('✅ Invalid login properly handled:', error instanceof Error ? error.message : 'Unknown error')
    }
    
    try {
        // 2. Test file operations without authentication
        console.log('\n2. Testing file operations without auth...')
        localStorage.removeItem('auth_token') // Remove token
        await fileApi.getFiles()
    } catch (error) {
        console.log('✅ Unauthorized access properly handled:', error instanceof Error ? error.message : 'Unknown error')
    }
}

// Test API configuration
function testApiConfiguration() {
    console.log('\n--- API Configuration Test ---')
    
    console.log('API Base URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api')
    console.log('Environment:', process.env.NEXT_PUBLIC_ENVIRONMENT || 'development')
    
    // Test authentication headers
    const token = localStorage.getItem('auth_token')
    console.log('Auth token present:', !!token)
    
    if (token) {
        console.log('Token preview:', token.substring(0, 20) + '...')
    }
}

// Run all tests
async function runAllTests() {
    console.log('🚀 Starting API Integration Tests...')
    
    testApiConfiguration()
    await testAuthenticationFlow()
    await testFileOperations()
    await testErrorHandling()
    
    console.log('\n✅ All tests completed!')
}

// Export for use in components
export {
    testAuthenticationFlow,
    testFileOperations,
    testErrorHandling,
    testApiConfiguration,
    runAllTests
}

// Auto-run if this file is executed directly
if (typeof window !== 'undefined') {
    // Only run in browser environment
    setTimeout(() => {
        console.log('Running API integration tests in 2 seconds...')
        runAllTests()
    }, 2000)
} 