const path = require('path');

module.exports = {
  extends: ['../.eslintrc.browser.js'],
  parserOptions: {
    project: path.join(__dirname, 'tsconfig.json'),
  },
  overrides: [{
    files: ['**/index.ts'],
    rules: {
      'import/newline-after-import': 'off',
    },
  }],
};
