// Environment configuration
export const config = {
    // API Configuration
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    
    // Environment
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
    
    // Feature flags
    features: {
        fileUpload: process.env.NEXT_PUBLIC_ENABLE_FILE_UPLOAD === 'true',
        encryption: process.env.NEXT_PUBLIC_ENABLE_ENCRYPTION === 'true',
        darkMode: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE === 'true',
    },
    
    // App settings
    app: {
        name: process.env.NEXT_PUBLIC_APP_NAME || 'LockHaven',
        version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
        maxFileSize: 100 * 1024 * 1024, // 100MB
        supportedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png', 'txt', 'zip'],
    },
    
    // Development settings
    debug: {
        enabled: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
        logLevel: process.env.NEXT_PUBLIC_LOG_LEVEL || 'info',
    },
    
    // Security (development only)
    security: {
        jwtSecret: process.env.NEXT_PUBLIC_JWT_SECRET || 'dev-secret',
        encryptionKey: process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'dev-key',
    },
}

// Environment-specific settings
export const isDevelopment = config.environment === 'development'
export const isProduction = config.environment === 'production' 