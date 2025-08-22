
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/server', '<rootDir>/client', '<rootDir>/shared'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  collectCoverageFrom: [
    'server/**/*.ts',
    'client/src/**/*.{ts,tsx}',
    'shared/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**'
  ],
  projects: [
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/server/**/__tests__/**/*.test.ts'],
      transform: {
        '^.+\\.ts$': 'ts-jest'
      }
    },
    {
      displayName: 'client',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/client/**/__tests__/**/*.test.tsx', '<rootDir>/client/**/__tests__/**/*.test.ts'],
      transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
      },
      moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/client/src/$1',
        '^@shared/(.*)$': '<rootDir>/shared/$1'
      },
      setupFilesAfterEnv: ['<rootDir>/client/src/setupTests.ts']
    }
  ]
};
