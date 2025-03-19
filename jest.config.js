module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/unit/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  moduleNameMapper: {
    // Handle module aliases (if needed)
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  // Indicates whether the coverage information should be collected
  collectCoverage: true,
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  // The test environment that will be used for DOM-related tests
  testEnvironment: 'jsdom',
}; 