// Shared Test Runner Utility
// Provides consistent testing interface across all test files

export interface TestCase {
    name: string
    fn: () => Promise<void> | void
    category?: string
}

export class TestRunner {
    private tests: TestCase[] = []
    private passed = 0
    private failed = 0
    private startTime = 0

    addTest(test: TestCase) {
        this.tests.push(test)
    }

    addTests(tests: TestCase[]) {
        this.tests.push(...tests)
    }

    async run(category?: string) {
        this.startTime = Date.now()
        const filteredTests = category 
            ? this.tests.filter(test => test.category === category)
            : this.tests

        console.log(`🧪 Running ${filteredTests.length} tests${category ? ` in category: ${category}` : ''}...\n`)
        
        for (const test of filteredTests) {
            try {
                await test.fn()
                console.log(`✅ ${test.name}`)
                this.passed++
            } catch (error) {
                console.log(`❌ ${test.name}: ${error}`)
                this.failed++
            }
        }
        
        const duration = Date.now() - this.startTime
        console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed (${duration}ms)`)
        
        return {
            passed: this.passed,
            failed: this.failed,
            total: this.passed + this.failed,
            duration
        }
    }

    reset() {
        this.tests = []
        this.passed = 0
        this.failed = 0
    }
}

// Global test runner instance
export const globalTestRunner = new TestRunner()

// Utility function to create test cases
export function createTest(name: string, fn: () => Promise<void> | void, category?: string): TestCase {
    return { name, fn, category }
}

// Auto-run tests when imported in browser
if (typeof window !== 'undefined') {
    setTimeout(() => {
        globalTestRunner.run()
    }, 1000)
} 