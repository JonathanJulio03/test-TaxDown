module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.spec.ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  moduleNameMapper: {
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@database/(.*)$': '<rootDir>/src/infrastructure/database/$1',
    '^@entities/(.*)$': '<rootDir>/src/infrastructure/database/entities/$1',
    '^@error/(.*)$': '<rootDir>/src/infrastructure/errors/$1',
    '^@middleware/(.*)$': '<rootDir>/src/infrastructure/middleware/$1',
    '^@controllers/(.*)$': '<rootDir>/src/infrastructure/controllers/$1',
    '^@adapters/(.*)$': '<rootDir>/src/infrastructure/driven-adapter/$1',
    '^@routes/(.*)$': '<rootDir>/src/infrastructure/routes/$1',
    '^@config/(.*)$': '<rootDir>/src/application/config/$1',
    '^@in/(.*)$': '<rootDir>/src/application/port/in/$1',
    '^@out/(.*)$': '<rootDir>/src/application/port/out/$1',
    '^@services/(.*)$': '<rootDir>/src/application/services/$1',
    '^@models/(.*)$': '<rootDir>/src/domain/models/$1'
  }
};
