const path = require('path');

module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    // project: 'tsconfig.browser.json',
    extraFileExtensions: ['.vue'],
    ecmaVersion: 2020,
  },
  globals: {
    nodecg: 'readonly',
    NodeCG: 'readonly',
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
    'airbnb-typescript/base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        // This is needed to properly resolve paths.
        // project: 'tsconfig.browser.json', // Check if needed and how to fix if so!
      },
      /* webpack: {
        config: path.join(__dirname, '../webpack.config.js'), // Check if needed and how to fix if so!
      }, */
    },
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
  },
  rules: {
    'import/no-extraneous-dependencies': ['error', {
      // Everything is compiled for the browser so dev dependencies are fine.
      devDependencies: true,
      packageDir: [path.join(__dirname, '.'), path.join(__dirname, '..')],
    }],
    // max-len set to ignore "import" lines (as they usually get long and messy).
    'max-len': ['error', { code: 100, ignorePattern: '^import\\s.+\\sfrom\\s.+;$' }],
    // I mainly have this off as it ruins auto import sorting in VSCode.
    'object-curly-newline': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    'vue/html-self-closing': ['error'],
    'class-methods-use-this': 'off',
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e', // for e.returnvalue
      ],
    }],
    'import/extensions': ['error', 'ignorePackages', {
      js: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    }],
  }
};
