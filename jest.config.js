/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  setupFiles: ['<rootDir>../test/jest-setup.ts'],
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/../src/core/$1',
    '^@db/(.*)$': '<rootDir>/../src/database/$1',
    '^@config/(.*)$': '<rootDir>/../src/config/$1',
    '^@lib/(.*)$': '<rootDir>/../src/library/$1',
  },
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        filename: 'test-report.html',
        openReport: false,
        pageTitle: 'Ordero API - Unit Test Report',
        logoImgPath: 'public/ordero.svg',
      },
    ],
  ],
};

module.exports = config;
