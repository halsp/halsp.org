# Quick Start

You can try online or locally.

## Try Halsp Online

The halsp app can be run in browser for testing and development, and there is no need to install any dependencies on the machine.

Select the required environment and plugins below, then click the button **Create**

<ClientOnly>
  <QuickStart />
</ClientOnly>

<br />

You can also go to a single page <https://quickstart.halsp.org>

Or try to use Halsp directly and quickly at <http://mini.halsp.org>

The repository for the online trial project <https://github.com/halsp/quickstart>

## Create a Halsp Application

In this section we will introduce how to scaffold a Halsp Application on your local machine. The created project will be using a build setup based on [@halsp/cli](./cli) and allow us to select plugins.

Make sure you have an up-to-date version of Node.js installed, then run the following command in your command line

```
npm init halsp
```

This command will install and execute [create-halsp](https://www.npmjs.com/package/create-halsp), the official Halsp project scaffolding tool. You will be presented with prompts for several optional features such as `router` and `testing` support:

```bash
? Project name: halsp-project
? Select plugins 依赖注入 (@halsp/inject), 路由 (@halsp/router)
? Pick the environment to run application: 原生 NodeJS 服务
? Pick the package manager to use when installing dependencies: Use NPM
```

`create-halsp` is base on `@halsp/cli`，the function is the same as `halsp create` when use `@halsp/cli`

## Start

Once the project is created, the dev server is started.

If you select `swagger`, you will see the page of swagger.

If you select `view` or `mva`, launch `/user` and you will see a simple html page.

Otherwise you will see a json string.

Whether the environment you choose is serverless or a native node service, dev server is debugged using the node service. You can modify the startup parameters, such as port, address, etc. in the 'start' node of the `.halsprc.ts` configuration file.

## Build

When you are ready to publish the application to the production environment, run

```bash
npm run build
```

This command will create a production environment files for your application in the 'dist' folder.
