const path = require('path');

module.exports = {
  extends: ['../.eslintrc.browser.js'],
  overrides: [{
    files: ['**/index.ts'],
    rules: {
      'import/newline-after-import': 'off',
    },
  }],
};
