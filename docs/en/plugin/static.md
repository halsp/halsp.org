# 静态资源 `(@halsp/static)`

安装 `@halsp/static` 以支持静态资源功能

- 能够返回静态资源，如图片、html、css、js 等文件
- 能够匹配单个文件或整个文件夹
- 可以托管静态网站

## 安装

```
npm i @halsp/static
```

## 快速开始

使用 `startup.useStatic()`

```TS
import "@halsp/static";

startup.useStatic();
```

`useStatic` 如果不传参数，将匹配 `static` 文件夹，即写法等同于

```TS
startup.useStatic({
  dir: "static",
});
```

## 匹配文件

`@halsp/static` 有两种匹配文件的方式

1. 匹配单个文件
2. 匹配文件夹中的所有文件，路由与文件相对路径相同

## 匹配单个文件

```TS
startup.useStatic({
  file: "static/img.png",
  reqPath: "/img"
})
// 请求访问 /img 将返回 img.png 文件
```

匹配单个文件，`useStatic` 接收配置参数包含以下参数

### file

> 必选参数

指定文件的路径

### reqPath

> 可选参数

指定请求路径。如果不设置，请求路径将与 `file` 参数相同

### encoding

> 可选参数

读取文件用的编码，如 `utf-8`/`ascii` 等

## 匹配文件夹

匹配文件夹中的所有文件，`useStatic` 接收配置参数包含以下参数

### dir

> 必选参数

`@halsp/static` 会在该文件夹中按访问路径匹配文件，路由与文件相对路径相同

### prefix

> 可选参数

请求访问前缀，即虚拟目录

比如你将图片放在 `static` 文件夹，但想统一用 `file` 前缀来访问

- GET file/1.png
- GET file/2.txt
- ...

```TS
startup.useStatic({
  dir: "static",
  prefix: "file",
});
```

### exclude

> 可选参数

此参数可以指定排除的文件

值可以为字符串或字符串数组的 `glob` 表达式

```TS
startup.useStatic({
  exclude: ["dir/*.html"],
});
```

### listDir

> 可选参数

如果值为 `true`，请求路径为文件夹时，会列出文件夹中的所有文件和文件夹（`exclude` 参数可以排除文件）

下面的示例，请求地址为 `/files` 时，会列出 `/static` 文件夹下的所有文件

```TS
startup.useStatic({
  dir: "static",
  prefix: "files",
  listDir: true,
});
```

### useIndex

> 可选参数

值可以是字符串或字符串数组，或 `true`

请求路径为文件夹时，会查询是否存在索引文件并返回

- 如果值为 `true`，将自动查找文件 `index.html`
- 如果值为字符串或字符串数组，将查找指定文件

:::tip
一般 `useIndex` 参数用于托管静态网站
:::

### useExt

> 可选参数

值可以是字符串或字符串数组，或 `true`

请求路径为文件时，如果此文件不存在，将自动查找带有指定扩展名的文件

- 如果值为 `true`，将自动补足扩展名 `.html` 并尝试查找和返回
- 如果值为字符串或字符串数组，将自动补足指定扩展名并尝试查找和返回

:::tip
一般 `useExt` 参数用于托管静态网站
:::

## 请求方法

可以指定允许请求静态资源的 http 请求方法，在 `useStatic` 函数中传入参数 `method`

参数类型为字符串或字符串数组

如 `"get"`/`"post"`/`["get","post"]`

```TS
startup.useStatic({
  file: "static/img.png",
  method: "GET",
});
```

或

```TS
startup.useStatic({
  file: "static/img.png",
  method: ["GET", "POST"],
});
```

默认该参数值为 `GET`

如果值为 `ANY` 或 ['ANY'] ，将允许任何请求方法请求静态资源

## 404

在 `useStatic` 函数中传入参数 `file404`，找不到请求文件时会返回 404

`@halsp/static` 如果找不到匹配的静态文件，会根据此参数寻找 404 文件并返回

- 如果未设置此参数，将进入下一个中间件（如果存在下一个中间件）
- 如果值为文件相对路径，将查找 `dir` 参数文件夹下的相对文件
- 如果值为绝对路径，将查找绝对路径的文件
- 如果值为 `true`，将查找 `dir` 参数文件夹下的 `404.html` 文件

:::warning 注意
如果设置了此参数，代码将不会再执行下一个中间件，即 `useStatic` 之后的中间件都不会被执行。
此参数一般用于静态网站托管
:::

## 405

在 `useStatic` 函数中传入参数 `file405`，请求参数错误会返回 405

如果请求参数错误，但找到匹配的静态文件，会根据此参数寻找 405 文件并返回

- 如果未设置此参数，将进入下一个中间件（如果存在下一个中间件）
- 如果值为文件相对路径，将查找 `dir` 参数文件夹下的相对文件
- 如果值为绝对路径，将查找绝对路径的文件
- 如果值为 `true`，将查找 `dir` 参数文件夹下的 `404.html` 文件

### strictMethod

在 `useStatic` 函数中传入参数 `strictMethod`

如果值为 `true`，请求方法错误时将不查询文件是否存在，始终返回 405

此参数可用于提高性能

:::warning 注意
如果设置了此参数，请求方法错误时代码将不会再执行下一个中间件，即 `useStatic` 之后的中间件都不会被执行。
此参数一般用于静态网站托管
:::

## 编码

你可以指定读取静态资源文件的编码，在 `useStatic` 函数中传入参数 `encoding`

参数类型为 `BufferEncoding`

```TS
startup.useStatic({
  file: "static/img.png",
  encoding: 'base64'
})
```

此参数将直接影响返回的内容

如在 http 中，该值可保持默认，或设置为 `binary`

在 serverless 中，该值可能需要设置为 `base64`

## 多个静态资源

你可以使用多次 `.useStatic` 函数，并传入不同参数，以添加多个静态资源文件或静态资源目录

## CLI 编译

如果使用 `@halsp/cli` 编译项目

`static` 目录或 `src/static` 目录以及其中的文件，会被自动拷贝到输出目录

如输出目录是 `dist`

- `/static -> /dist/static`
- `/src/static -> /dist/static`

你也可以通过添加 `.halsprc.ts` 文件的 `build.assets` 数组元素，以增加编译时自动拷贝的文件或文件夹

## 托管静态网站

使用 `@halsp/static` 可以方便的托管静态网站

`@halsp/cli` 的命令 `halsp serve` 就是用到了这个能力

```TS
startup.useStatic({
  dir: process.cwd(),
  listDir: !this.hideDir,
  use404: true,
  useIndex: true,
  method: "ANY",
  useExt: true,
  exclude: this.exclude,
  prefix: this.prefix,
  encoding: this.encoding as BufferEncoding,
})
```
