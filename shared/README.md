# esa-layouts-shared

A repository which houses several elements that are used by mutiple [NodeCG](https://nodecg.dev) based bundles for our layouts, [esa-layouts](https://github.com/esamarathon/esa-layouts) for example.

**This repository is purposefully designed for our use, and can have breaking changes without prior notice. We advise you don't directly use it in any projects.**

## Basic notes for setup/structure

- This repository is to be used as a submodule, directly in the root of the NodeCG bundle (usually in a directory named `shared`).
- It requires the bundle to have some specific dependencies and structure; not going to note it all here because it's basically just the stuff from [zoton2/nodecg-vue-ts-template](https://github.com/zoton2/nodecg-vue-ts-template) which we tend to base bundles using.
- The bundle should have a `postinstall` in the `package.json` file:
  - ```
    "postinstall": "cd shared && node postinstall.js"
    ```
- You may want to add a `path` to your `tsconfig.*.json` files for ease of development:
  - ```
    "paths": {
      "@shared/*": [
        "shared/*"
      ],
    }
    ```
- You will want to add these paths to your `tsconfig.browser.json` in the `include` array:
  - ```
    "include": [
      // esa-layouts-shared
      "shared/browser_shared/**/*.ts",
      "shared/browser_shared/**/*.vue",
      "shared/dashboard/**/*.ts",
      "shared/dashboard/**/*.vue",
      "shared/graphics/**/*.ts",
      "shared/graphics/**/*.vue",
      "shared/types/**/*.d.ts"
    ]
    ```
- You will want to add this path to yoiur `tsconfig.extension.json` in the `include` array:
  - ```
    "include": [
      `"shared/types/**/*.d.ts"
    ]
    ```
- You will want to add these to your `tsconfig.extension.json` as `references`:
  - ```
    "references": [
      { "path": "./shared/extension/countdown" },
      { "path": "./shared/extension/mediabox" },
      { "path": "./shared/extension/music" },
      { "path": "./shared/extension/obs" },
      { "path": "./shared/extension/rabbitmq" },
      { "path": "./shared/extension/restream" },
      { "path": "./shared/extension/x32" },
      { "path": "./shared/extension/xkeys-esa" }
    ]
    ```
- You will want to add these entries in your `vetur.config.js` in the `projects` section:
  - ```
    projects: [
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
    ```
- You will want to add this entry in your `.vscode/settings.json` file in the `eslint.workingDirectories` section:
  - ```
    "eslint.workingDirectories": [
      { "pattern": "shared" }
    ]
    ```
- You will want to change the Webpack `resolve.alias.vue` config to make sure it resolves to the one in the bundle:
  - ```
    alias: {
      // vue: 'vue/dist/vue.esm.js',
      vue: path.resolve(__dirname, 'node_modules/vue/dist/vue.esm.js'),
    },
    ```
