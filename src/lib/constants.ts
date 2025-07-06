// Validation patterns
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

// API endpoints (for future use)
export const API_ENDPOINTS = {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    UPLOAD: '/api/files/upload',
    FILES: '/api/files',
} as const

// App configuration
export const APP_CONFIG = {
    MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
    SUPPORTED_FILE_TYPES: ['pdf', 'doc', 'docx', 'jpg', 'png', 'txt'],
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
} as const

// Error messages
export const ERROR_MESSAGES = {
    REQUIRED_FIELDS: 'Please fill in all fields',
    INVALID_EMAIL: 'Please enter a valid email address',
    WEAK_PASSWORD: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    PASSWORDS_DONT_MATCH: 'Passwords do not match',
    LOGIN_FAILED: 'Login failed. Please try again.',
    REGISTRATION_FAILED: 'Registration failed. Please try again.',
} as const

// Success messages
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful!',
    REGISTRATION_SUCCESS: 'Account created successfully!',
    FILE_UPLOADED: 'File uploaded successfully!',
} as const 