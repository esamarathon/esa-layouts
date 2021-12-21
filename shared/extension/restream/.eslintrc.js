const path = require('path');

module.exports = {
  extends: ['../../.eslintrc.extension.js'],
  parserOptions: {
    project: path.join(__dirname, 'tsconfig.json'),
  },
  rules: {
    'max-classes-per-file': 'off',
    '@typescript-eslint/naming-convention': 'off',
  },
};
