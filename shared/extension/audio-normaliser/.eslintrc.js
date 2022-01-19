const path = require('path');

module.exports = {
  extends: ['../../.eslintrc.extension.js'],
  parserOptions: {
    project: path.join(__dirname, 'tsconfig.json'),
  },
  rules: {
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
  },
};
