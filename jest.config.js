module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
    '!src/types/*.ts',
    '!src/plugins/UIPlugin.ts'
  ],
  coverageDirectory: 'coverage',
};
