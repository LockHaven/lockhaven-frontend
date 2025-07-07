import { PASSWORD_REGEX, ERROR_MESSAGES } from './constants'

export interface ValidationResult {
    isValid: boolean
    error?: string
}

export function validateEmail(email: string): ValidationResult {
    if (!email) {
        return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELDS }
    }
    
    if (!email.includes('@') || !email.includes('.')) {
        return { isValid: false, error: ERROR_MESSAGES.INVALID_EMAIL }
    }
    
    return { isValid: true }
}

export function validatePassword(password: string): ValidationResult {
    if (!password) {
        return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELDS }
    }
    
    if (!PASSWORD_REGEX.test(password)) {
        return { isValid: false, error: ERROR_MESSAGES.WEAK_PASSWORD }
    }
    
    return { isValid: true }
}

export function validatePasswordConfirmation(password: string, confirmPassword: string): ValidationResult {
    if (!confirmPassword) {
        return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELDS }
    }
    
    if (password !== confirmPassword) {
        return { isValid: false, error: ERROR_MESSAGES.PASSWORDS_DONT_MATCH }
    }
    
    return { isValid: true }
}

export function validateRequired(value: string, fieldName: string): ValidationResult {
    if (!value.trim()) {
        return { isValid: false, error: `Please enter your ${fieldName}` }
    }
    
    return { isValid: true }
}

export function validateFormData(data: Record<string, string>): ValidationResult {
    for (const [key, value] of Object.entries(data)) {
        if (!value.trim()) {
            return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELDS }
        }
    }
    
    return { isValid: true }
}

export function validateFormDataWithRules(
    data: Record<string, string>, 
    rules: Record<string, (value: string) => ValidationResult>
): ValidationResult {
    // Check required fields first
    const requiredValidation = validateFormData(data)
    if (!requiredValidation.isValid) {
        return requiredValidation
    }
    
    // Apply specific validation rules
    for (const [field, validator] of Object.entries(rules)) {
        const validation = validator(data[field])
        if (!validation.isValid) {
            return validation
        }
    }
    
    return { isValid: true }
} 