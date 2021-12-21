const path = require('path');

module.exports = {
  extends: ['../.eslintrc.browser.js'],
  parserOptions: {
    project: path.join(__dirname, 'tsconfig.json'),
  },
};
