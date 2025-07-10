// Configuration Management Test
import { config, isDevelopment, isProduction } from './config'

console.log('=== Configuration Management Test ===')

// Test environment variables
console.log('API URL:', config.apiUrl)
console.log('Environment:', config.environment)
console.log('Is Development:', isDevelopment)
console.log('Is Production:', isProduction)

// Test app settings
console.log('App Name:', config.app.name)
console.log('Max File Size:', config.app.maxFileSize, 'bytes')
console.log('Supported Files:', config.app.supportedFileTypes)

// Test feature flags
console.log('File Upload Enabled:', config.features.fileUpload)
console.log('Encryption Enabled:', config.features.encryption)

// Simulate different environments
console.log('\n=== Environment Simulation ===')

// Development environment
process.env.NEXT_PUBLIC_ENVIRONMENT = 'development'
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:5000/api'
console.log('Dev API URL:', config.apiUrl)
console.log('Dev Environment:', config.environment)

// Production environment
process.env.NEXT_PUBLIC_ENVIRONMENT = 'production'
process.env.NEXT_PUBLIC_API_URL = 'https://api.lockhaven.com/api'
console.log('Prod API URL:', config.apiUrl)
console.log('Prod Environment:', config.environment) 