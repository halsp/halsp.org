# 视图渲染

<p align="center">
    <a href="https://github.com/ipare/view/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="GitHub license" /></a>
    <a href=""><img src="https://img.shields.io/npm/v/@ipare/view.svg" alt="npm version"></a>
    <a href=""><img src="https://badgen.net/npm/dt/@ipare/view" alt="npm downloads"></a>
    <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/vite.svg" alt="node compatibility"></a>
    <a href="#"><img src="https://github.com/ipare/view/actions/workflows/test.yml/badge.svg?branch=main" alt="Build Status"></a>
    <a href="https://codecov.io/gh/ipare/view/branch/main"><img src="https://img.shields.io/codecov/c/github/ipare/view/main.svg" alt="Test Coverage"></a>
    <a href="https://github.com/ipare/view/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"></a>
    <a href="https://gitpod.io/#https://github.com/ipare/view"><img src="https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod" alt="Gitpod Ready-to-Code"></a>
    <a href="https://paypal.me/ihalwang" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
</p>

安装 `@ipare/view` 以支持视图渲染功能，用于构建一体化应用程序

`@ipare/view` 支持多种视图模板，基于 [consolidate](https://github.com/tj/consolidate.js)

## 安装

```
npm i @ipare/views
```

## 快速开始

1. 添加视图文件夹和文件 `views/index.ejs` 并编写内容

2. 启用中间件 `startup.useViews()`

```TS
import { TestStartup } from "@ipare/core";
import "@ipare/views";

const res = await new TestStartup()
  .useViews()
  .use(async (ctx) => {
    ctx.view("index.ejs");
  })
  .run();
```

## `useViews`

`useViews` 接收一个可选配置参数

- dir: 视图文件夹
- options: 通用参数，如网站名称和其他通用信息
- engines: 视图渲染引擎列表

`engines` 用于文件扩展名与 [consolidate](https://github.com/tj/consolidate.js) 对应，如

```TS
startup.useViews({
  dir: "views",
  engines: [
    { ext: "hbs", render: "handlebars" },
    { ext: "custom", render: "ejs" },
  ],
});
```

如果扩展名与渲染引擎名称相同，可省略配置

### 视图文件夹

默认为 `views`, 所有视图将在视图文件夹中查找

## `.view`

你可以在三个地方使用 `view()` 函数渲染视图

- ctx.view(): 管道 HttpContext 对象
- md.view(): 中间件中可以使用 `this.view()` 渲染视图
- res.view(): Response 对象

`view` 函数接收两个参数

- tmpPath: 视图文件夹中的相对路径
- locals: 渲染参数

其中 `tmpPath` 可省略模板文件扩展名，也可省略 `index` 命名的文件

值为 `user/todo/index.ejs`, `user/todo/index`, `user/todo` 效果相同

## ctx.state

`ctx.state` 作为访问级别的模板参数

比如你需要在权限验证之后，将登录信息放入 `ctx.state`

在你使用 `view` 渲染模板时，`@ipare/views` 做了以下类似操作：

```JS
const args = Object.assign({}, options, ctx.state, locals);
```
