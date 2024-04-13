module.exports = {
  testEnvironment: 'jsdom',
  preset: '@siroc/jest-preset',
  verbose: true,
  collectCoverage: true,
  coveragePathIgnorePatterns: ['test', '.babelrc.js', 'lib'],
}
