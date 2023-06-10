# 快速开始

你可以选择线上尝试，也可以选择本地构建。

## 线上尝试

浏览器里运行了基于 Halsp 的构建设置，不需要在机器上安装任何依赖

选择下面需要的环境和组件

_如果下面区域显示空白，请耐心等待或刷新重试_

<ClientOnly>
  <QuickStart />
</ClientOnly>

<br />

## 本地构建

在命令行中运行下面语句

```
npm init halsp
```

这一语句将会安装并执行 [create-halsp](https://www.npmjs.com/package/create-halsp)，你将会看到一些选择插件和环境的选项，根据你的需要选择对应的环境和插件如 `router`、`testing` 等。

```bash
? Project name: halsp-project
? Select plugins 依赖注入 (@halsp/inject), 路由 (@halsp/router)
? Pick the environment to run application: 原生 NodeJS 服务
? Pick the package manager to use when installing dependencies: Use NPM
```

`create-halsp` 是 Halsp 的官方项目脚手架工具，由 `@halsp/cli` 自动生成，并且功能完全和 `@halsp/cli` 的 `halsp create` 命令相同。

## 启动

在项目被创建后，就已经启动了

如果选择的插件包含 `swagger`，你将能看到 swagger 页面

如果选择的插件包含 `view` 或 `mva`，访问 `/user` 能看到一个简单的 html 页面

或者，能看到一个返回的 json 字符串

无论你选择的运行环境是云函数还是原生 node 服务，本地开发都是以 node 服务启动调试的，你可以在 `halsp-cli.config.ts` 配置文件中的 `start` 节点修改启动参数，如端口、地址等。

## 发布

当你准备将应用发布到生产环境时，请运行

```bash
npm run build
```

此命令会在 `dist` 文件夹中为你的应用创建一个生产环境的构建版本。
