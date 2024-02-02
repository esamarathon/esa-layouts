const path = require('path')

// TODO: Look over this and check it's all correct, I'm confused by ESLint sometimes.
// TODO: Do we need import/typescript stuff?
//       - eslint-import-resolver-typescript
//       - eslint-plugin-import

module.exports = {
	root: true,
	env: {
		node: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: path.join(__dirname, 'tsconfig.json'),
	},
	plugins: ['@typescript-eslint'],
	extends: [
		'airbnb-base',
		'airbnb-typescript/base',
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		// 'plugin:import/typescript',
	],
	rules: {
		'max-len': ['error', { code: 100, ignorePattern: '^import\\s.+\\sfrom\\s.+;' }],
		'object-curly-newline': 'off',
		'@typescript-eslint/lines-between-class-members': 'off',
	},
}
