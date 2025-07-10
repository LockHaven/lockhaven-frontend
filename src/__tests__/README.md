# Test Directory Structure

This directory contains all tests for the LockHaven frontend application.

## Structure

```
src/__tests__/
├── README.md                 # This file
├── lib/                      # Tests for utility libraries
│   ├── api.test.ts          # API service tests
│   ├── api-integration.test.ts # Integration tests
│   └── config.test.ts       # Configuration tests
├── contexts/                 # Tests for React contexts
│   └── auth.test.tsx        # Authentication context tests
└── components/              # Tests for React components
    └── (component tests will go here)
```

## Test Types

### 1. **Unit Tests** (`*.test.ts`)
- Test individual functions and utilities
- No dependencies on external services
- Fast execution

### 2. **Integration Tests** (`*-integration.test.ts`)
- Test interactions between multiple modules
- May require mock data or external services
- Slower execution

### 3. **Component Tests** (`*.test.tsx`)
- Test React components
- Include user interactions and rendering
- May require test utilities

## Running Tests

### Manual Testing (Current)
- Tests run automatically in the browser
- Check browser console for results
- No setup required

### Automated Testing (Future)
- Install Jest: `npm install --save-dev jest @types/jest`
- Run: `npm test`
- CI/CD integration

## Test Conventions

### Naming
- Files: `*.test.ts` or `*.test.tsx`
- Functions: `testFunctionName()`
- Descriptions: Clear, descriptive names

### Structure
```typescript
// Test setup
const testData = { ... }

// Test function
async function testFunctionName() {
    // Arrange
    const input = testData
    
    // Act
    const result = await functionToTest(input)
    
    // Assert
    if (!result) throw new Error('Expected result')
}
```

### Error Handling
- Tests should handle expected failures gracefully
- Use try/catch for API calls that may fail
- Log meaningful error messages

## Adding New Tests

1. **Create test file** in appropriate directory
2. **Import dependencies** and functions to test
3. **Write test functions** following conventions
4. **Add to test runner** if using automated testing
5. **Document** any special setup requirements

## Best Practices

- ✅ **Isolated tests** - Each test should be independent
- ✅ **Clear naming** - Test names should describe what they test
- ✅ **Error handling** - Handle both success and failure cases
- ✅ **Mock data** - Use realistic test data
- ✅ **Documentation** - Comment complex test logic

## Future Improvements

- [ ] Set up Jest for automated testing
- [ ] Add test coverage reporting
- [ ] Create test utilities and helpers
- [ ] Add visual regression testing
- [ ] Integrate with CI/CD pipeline 