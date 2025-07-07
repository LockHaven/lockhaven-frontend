import React from 'react'

interface FormInputProps {
    id: string
    name: string
    type: 'text' | 'email' | 'password'
    label: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder: string
    required?: boolean
    disabled?: boolean
    error?: string
    helperText?: string
    showHelperText?: boolean
}

export default function FormInput({
    id,
    name,
    type,
    label,
    value,
    onChange,
    placeholder,
    required = false,
    disabled = false,
    error,
    helperText,
    showHelperText = false
}: FormInputProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    error 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
            {showHelperText && helperText && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {helperText}
                </p>
            )}
        </div>
    )
} 