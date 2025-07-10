// This is a demonstration file to show how the API service layer works
// You can delete this file after understanding the concepts

import { authApi, LoginRequest, RegisterRequest } from './api'

// Example: How to use the API service layer

async function demonstrateApiUsage() {
    console.log('=== API Service Layer Demo ===')
    
    // 1. Register a new user
    const registerData: RegisterRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'SecurePass123!'
    }
    
    try {
        console.log('Attempting to register user...')
        const registerResponse = await authApi.register(registerData)
        console.log('Register response:', registerResponse)
        
        if (registerResponse.success) {
            console.log('✅ Registration successful!')
            console.log('User ID:', registerResponse.user?.id)
            console.log('Token:', registerResponse.token?.substring(0, 20) + '...')
        }
    } catch (error) {
        console.log('❌ Registration failed:', error)
    }
    
    // 2. Login with the same user
    const loginData: LoginRequest = {
        email: registerData.email,
        password: registerData.password
    }
    
    try {
        console.log('\nAttempting to login...')
        const loginResponse = await authApi.login(loginData)
        console.log('Login response:', loginResponse)
        
        if (loginResponse.success) {
            console.log('✅ Login successful!')
            console.log('Welcome,', loginResponse.user?.firstName)
        }
    } catch (error) {
        console.log('❌ Login failed:', error)
    }
    
    // 3. Get user profile
    try {
        console.log('\nAttempting to get profile...')
        const profileResponse = await authApi.getProfile()
        console.log('Profile response:', profileResponse)
        
        if (profileResponse.success) {
            console.log('✅ Profile retrieved!')
            console.log('User:', profileResponse.user)
        }
    } catch (error) {
        console.log('❌ Profile fetch failed:', error)
    }
    
    // 4. Logout
    try {
        console.log('\nAttempting to logout...')
        const logoutResponse = await authApi.logout()
        console.log('Logout response:', logoutResponse)
        
        if (logoutResponse.success) {
            console.log('✅ Logout successful!')
        }
    } catch (error) {
        console.log('❌ Logout failed:', error)
    }
}

// Uncomment to run the demo (when backend is ready):
// demonstrateApiUsage()

export { demonstrateApiUsage } 