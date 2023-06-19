const { defaults } = require('ts-jest/presets');

module.exports = {
  preset: 'ts-jest',
  rootDir: './',
  transform: {
    ...defaults.transform
  },
  testRegex: '(/test/.*\\.(test|spec))\\.ts$',
  moduleFileExtensions: ['js', 'ts'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  collectCoverageFrom: [
    'src/*.{ts}',
    'src/**/*.{ts}'
  ]
};
