# 原生 Http 服务

安装 `@ipare/http` 以支持 Http 运行环境

- 让 Ipare 能够运行于 http(s)
- 你可以随时将 Ipare 云函数简单改为 nginx 托管的 Ipare http 服务
- 也可以将 nginx 托管的 Ipare http 服务简单改为 Ipare 云函数

## 安装

```
npm i @ipare/http
```

## 快速开始

以下示例开启一个服务，端口当然是 2333 啦

```JS
import { HttpStartup } from "@ipare/http";

new HttpStartup()
  .use(async (ctx) => {
    ctx.ok("@ipare/http");
  })
  .listen(2333);
```

@ipare/http 也支持 https，只需将上述示例中的 `HttpStartup` 改为 `HttpsStartup`

## 组合其他中间件

### @ipare/router

```JS
import { HttpStartup } from "@ipare/http";
import "@ipare/router";

new HttpStartup()
  .useRouter()
  .listen(2333);
```

### @ipare/static

```JS
import { HttpStartup } from "@ipare/http";
import "@ipare/router";

new HttpStartup()
  .useStatic()
  .listen(2333);
```

## body 解析

内置四种 body 解析

```JS
import { HttpStartup } from "@ipare/http";
new HttpStartup()
  .useHttpJsonBody()
  .useHttpTextBody()
  .useHttpUrlencodedBody()
  .useHttpMultipartBody()
  .listen(2333);
```

### json

接收参数参考 [co-body](https://github.com/koajs/koa-body)

```JS
startup.useHttpJsonBody()
```

或

```JS
startup.useHttpJsonBody({
  strict: true,
  limit: "1mb",
  encoding: "utf-8",
  returnRawBody: false,
  onError: (ctx, err) => {},
});
```

### text

接收参数参考 [co-body](https://github.com/koajs/koa-body)

```JS
startup.useHttpTextBody()
```

或

```JS
startup.useHttpTextBody({
  limit: "1mb",
  encoding: "utf-8",
  returnRawBody: false,
  onError: (ctx, err) => {},
});
```

### urlencoded

接收参数参考 [co-body](https://github.com/koajs/koa-body)

```JS
startup.useHttpUrlencodedBody()
```

或

```JS
startup.useHttpUrlencodedBody({
  queryString:'',
  limit: "1mb",
  encoding: "utf-8",
  returnRawBody: false,
  onError: (ctx, err) => {},
});
```

### multipart

接收参数参考 [formidable](https://github.com/node-formidable/formidable)

```JS
startup.useHttpMultipartBody()
```

或

```JS
startup.useHttpMultipartBody({
  opts: {
    multiples: true,
  },
  limit: "1mb",
  encoding: "utf-8",
  onFileBegin: async (ctx, formName, file) => {
    ctx.res.setHeader("file-name", file.name ?? "");
  },
  onError: (ctx, err) => {},
});
```

## `httpRes` & `httpReq`

为了更好的利用 ipare，正常情况使用 `ctx.res` 和 `ctx.req` 即可，并且可以更好的配合其他中间件。

为了应对特殊需求，`@ipare/http` 在 ctx 中也加入了 `httpRes` 和 `httpReq`，特殊情况下你也可以按原生方法操作 `ctx.httpRes` 和 `ctx.httpReq`，但不建议使用。

如果调用了 `httpReq.end()`，`ctx.res` 将不会被写入返回结果

## 入口

`HttpStartup` 和 `HttpsStartup` 作为 `Ipare` 运行于 `Http` 的入口

该类继承于 `Startup` 并实现 `Http` 功能
