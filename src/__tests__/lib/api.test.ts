// API Service Tests
// Tests the API service functions and error handling

import { authApi, fileApi } from '@/lib/api'

// Simple test runner (no Jest required)
class TestRunner {
    private tests: Array<{ name: string; fn: () => Promise<void> }> = []
    private passed = 0
    private failed = 0

    test(name: string, fn: () => Promise<void>) {
        this.tests.push({ name, fn })
    }

    async run() {
        console.log('🧪 Running API Tests...\n')
        
        for (const test of this.tests) {
            try {
                await test.fn()
                console.log(`✅ ${test.name}`)
                this.passed++
            } catch (error) {
                console.log(`❌ ${test.name}: ${error}`)
                this.failed++
            }
        }
        
        console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed`)
    }
}

// Test functions
async function testLogin() {
    const loginData = {
        email: 'test@example.com',
        password: 'SecurePass123!'
    }
    
    const response = await authApi.login(loginData)
    if (!response) throw new Error('Login response is undefined')
}

async function testRegister() {
    const registerData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'SecurePass123!'
    }
    
    const response = await authApi.register(registerData)
    if (!response) throw new Error('Register response is undefined')
}

async function testGetFiles() {
    const response = await fileApi.getFiles()
    if (!response.files) throw new Error('Files response is undefined')
}

async function testUploadFile() {
    const mockFile = new File(['test content'], 'test.txt', {
        type: 'text/plain'
    })
    
    const response = await fileApi.uploadFile(mockFile)
    if (!response.success) throw new Error('Upload failed')
}

// Run tests
const runner = new TestRunner()

runner.test('Login API', testLogin)
runner.test('Register API', testRegister)
runner.test('Get Files API', testGetFiles)
runner.test('Upload File API', testUploadFile)

// Auto-run if this file is executed
if (typeof window !== 'undefined') {
    setTimeout(() => {
        runner.run()
    }, 1000)
}

export { runner } 