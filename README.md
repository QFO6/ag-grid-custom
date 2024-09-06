# @QFO6/ag-grid-custom

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn run serve
```

### Compiles and minifies for production

```
yarn run build:core
```

### Run your unit tests

```
yarn run test:unit
```

### Lints and fixes files

```
yarn run lint
```

### Add dependencies to the project

```
yarn add <package>
yarn add -S <package>
yarn add -D <package>
```

### Generate/Update components doc

Please refer https://vuese.github.io/website/cli/

## Contribution

### Steps

1. Clone this repository to your local machine

2. Add the code you want to share and run `npm run build` to build latest modules

3. Bump a version by run `npm version patch/minor/major -m 'changes description'`, it will upgrade the version number and commit automatically.

4. Run `npm publish` to publish to our registry by following the [guide]

5. Sync your local commits to remote repository.
6. Check the latest version in npm registry.

## Using the Package

### Set local registry

Before install this module, please set your local npm or yarn registry by:

- Note: login user and credentials please contact with DevOps members.

### Disable ssl

**Currently, we need to disable ssl during deploy to server in CI tools like Jenkins**

```
yarn config set "strict-ssl" false -g
```

Or change the file located in ${your_user}/.yarnrc and add below line into it :

```
strict-ssl=false
```

### Install it in your project

```
yarn add @QFO6/ag-grid-custom
```

### Usage

Once you have installed the package, in your entry file of the repository (main.js) if you are using it in a Vue CLI project. Write the import command

```
import AgGridCustom from '@QFO6/ag-grid-custom'
```

To install it globally.

```
Vue.use(AgGridCustom)
```

If not globally, you can also import the individual components locally.

```
import VClientPaginatedAgTable from '@QFO6/ag-grid-custom'
```

## Note

Use `--skip-plugin` to skip the plugins during build the bundles, [more details](https://cli.vuejs.org/guide/cli-service.html#vue-cli-service-build).

```
vue-cli-service build --skip-plugins vuetify --target lib --name AgCustom --filename ag-grid-custom lib/index.js
```
