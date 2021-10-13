module.exports = {
  settings: {
    'vetur.useWorkspaceDependencies': true,
    'vetur.validation.template': false,
  },
  projects: [
    {
      root: './src/dashboard',
      package: '../../package.json',
    },
    {
      root: './src/graphics',
      package: '../../package.json',
    },
    {
      root: './src/browser_shared',
      package: '../../package.json',
    },

    // esa-layouts-shared
    {
      root: './shared/dashboard',
      package: '../../package.json',
    },
    {
      root: './shared/graphics',
      package: '../../package.json',
    },
    {
      root: './shared/browser_shared',
      package: '../../package.json',
    },
  ]
}
