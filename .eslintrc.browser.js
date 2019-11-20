module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  env: {
    es6: true,
    node: true,
  },
  globals: {
    nodecg: 'readonly',
    NodeCG: 'readonly',
  },
  plugins: [
    'vue',
  ],
  extends: [
    'airbnb-base',
    'plugin:vue/recommended',
    'eslint:recommended',
  ],
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: [
          'node_modules',
          '../..',
        ],
      },
    },
  },
  rules: {
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: true, // Some places have dev deps imported where eslint complains.
      packageDir: ['.', '../..'], // Check for deps in NodeCG folder as well.
    }],
    'import/no-unresolved': [2, { caseSensitive: false }],
    'vue/html-self-closing': ['error', {
      html: {
        component: 'never', // Transpiler(?) has issues with self closing components.
      },
    }],
    'max-len': ["error", { "code": 100 }],
    'lines-between-class-members': 'off',
  }
};
