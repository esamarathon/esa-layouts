/**
 * Some stuff is commented out that may need re-enabling if necessary.
 */

module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.extension.json',
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'airbnb-typescript/base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        // This is needed to properly resolve paths.
        project: 'tsconfig.extension.json',
      },
    },
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
  },
  rules: {
    'import/no-extraneous-dependencies': ['error', {
      // Some places have dev dependencies imported where eslint complains.
      // devDependencies: true,
      // Check for dependencies in NodeCG folder as well.
      packageDir: ['.', '../..'],
    }],
    '@typescript-eslint/lines-between-class-members': 'off',
    // max-len set to ignore "import" lines (as they usually get long and messy).
    'max-len': ['error', { code: 100, ignorePattern: '^import\\s.+\\sfrom\\s.+;$' }],
    // I mainly have this off as it ruins auto import sorting in VSCode.
    'object-curly-newline': 'off',
    'import/extensions': ['error', 'ignorePackages', {
      js: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    }],
    // 'import/no-unresolved': [2, { commonjs: true, caseSensitive: false }],

    // '@typescript-eslint/ban-ts-comment': 'off',
    // 'no-restricted-syntax': 'off',
    // 'import/prefer-default-export': 'off',
    // 'no-await-in-loop': 'off',
    // 'global-require': 'off', // Apparently deprecated but still need to turn it off. :)
  },

  // Overrides for types.
  overrides: [{
    files: ['**/*.d.ts'],
    rules: {
      // @typescript-eslint/no-unused-vars does not work with type definitions
      '@typescript-eslint/no-unused-vars': 'off',
      // Sometimes eslint complains about this for types (usually when using namespaces).
      'import/prefer-default-export': 'off',

      // 'camelcase': 'off',
    }
  }],
};
