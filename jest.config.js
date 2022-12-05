const commonCofig = require('@folio/stripes-acq-components/jest.config');

module.exports = {
  ...commonCofig,
  testMatch: ['**/(lib|UDPSearch)/**/?(*.)test.{js,jsx}'],
  coverageDirectory: './artifacts/coverage-jest/',
  collectCoverageFrom: [
    '**/(lib|UDPSearch)/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/test/**',
  ],
};
