# 视图渲染 `(@halsp/view)`

安装 `@halsp/view` 以支持视图渲染功能，用于构建一体化应用程序

`@halsp/view` 支持多种视图模板，基于 [consolidate](https://github.com/tj/consolidate.js)

## 安装

```
npm i @halsp/view
```

## 快速开始

以 `ejs` 为例

添加视图模板文件夹 `views` 和文件 `views/index.ejs` 并编写 `ejs` 视图模板内容

在 `index.ts` 中添加 `startup.useView()` 如

```TS
import "@halsp/view";

startup
  .useView()
  .use(async (ctx) => {
    ctx.res.view("index.ejs");
  });
```

## `startup.useView()`

`startup.useView()` 接收一个可选配置参数，包括以下属性

- dir: 视图文件夹
- options: 渲染页面用的通用参数，如网站名称和其他通用信息
- engines: 视图渲染引擎

`engines` 用于将文件扩展名与 [consolidate](https://github.com/tj/consolidate.js) 支持的模板对应，如

```TS
startup.useView({
  dir: "views",
  engines: [
    { ext: "hbs", render: "handlebars" },
    { ext: "custom", render: "ejs" },
  ],
});
```

如果扩展名与渲染引擎名称相同，可省略配置，如 xxx.ejs 文件默认使用 ejs 模板引擎

### 视图文件夹

默认为 `views`, 所有视图将在视图文件夹中查找

## 渲染函数 .view()

你可以在两个地方使用 `view()` 函数渲染视图

- ctx.view()
- res.view()

### ctx.view()

管道 Context 类实例方法

返回值为渲染后的 html 字符串，不会修改 Response

### res.view()

Response 类的实例方法

没有返回值，但会修改 Response

如果当前环境是微服务，则会修改 Response.body 值为渲染后的 html 字符串

如果当前环境是 http，则做如下以下操作

1. 设置返回 body 为渲染后的 html 字符串
2. 设置状态码为 200
3. 设置返回头 `content-type` 为 `text/html`

### 参数

`.view()` 函数接收两个参数

- tmpPath: 模板文件夹中的相对路径
- locals: 渲染参数

其中 `tmpPath` 可省略模板文件扩展名，也可省略以 `index.xxx` 命名的文件

如 `tmpPath` 以下值效果相同

1. `user/todo/index.ejs`
2. `user/todo/index`
3. `user/todo`

## ctx.state

`ctx.state` 作为请求级别的模板参数

比如你需要在权限验证之后，每次请求都将登录信息放入 `ctx.state`

在你使用 `view` 渲染模板时，`@halsp/view` 做了以下类似操作：

```TS
const args = Object.assign({}, options, ctx.state, locals);
```

## CLI

已内置 `@halsp/cli` 的支持

因此 `views` 文件夹不需要手动配置为资源文件
