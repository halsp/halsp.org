# 原生 NodeJS 服务 `(@halsp/native)`

安装 `@halsp/native` 以支持 NodeJS 原生运行环境

- 让 Halsp 能够运行于 NodeJS 原生运行环境
- 你可以随时将 Halsp 云函数简单改为 nginx 托管的 Halsp 原生服务
- 也可以将 nginx 托管的 Halsp 原生服务简单改为 Halsp 云函数

## 安装

```
npm i @halsp/native
```

## 快速开始

以下示例开启一个服务，端口是 9504

```TS
import { Startup } from "@halsp/core";
import "@halsp/native";

new Startup()
  .useNative()
  .use(async (ctx) => {
    ctx.ok("@halsp/native");
  })
  .listen(9504);
```

@halsp/native 也支持 https，上述示例中增加参数 `https`，值为相关 https 配置

```TS
new Startup()
  .useNative({
    https: {
      cert: "",
    }
  })
  .use(async (ctx) => {
    ctx.ok("@halsp/native");
  })
  .listen(9504);
```

## 组合其他中间件

### @halsp/router

```TS
import { Startup } from "@halsp/core";
import "@halsp/native";
import "@halsp/router";

new Startup()
  .useNative()
  .useRouter()
  .listen(9504);
```

### @halsp/static

```TS
import { Startup } from "@halsp/core";
import "@halsp/native";
import "@halsp/static";

new Startup()
  .useNative()
  .useStatic()
  .listen(9504);
```

## body 解析

基于 `@halsp/body` 支持四种 body 解析

```TS
import { Startup } from "@halsp/core";
import "@halsp/native";

new Startup()
  .useNative()
  .useHttpJsonBody()
  .useHttpTextBody()
  .useHttpUrlencodedBody()
  .useHttpMultipartBody()
  .listen(9504);
```

### json

接收参数参考 [co-body](https://github.com/koajs/koa-body)

```TS
startup.useHttpJsonBody()
```

或

```TS
startup.useHttpJsonBody({
  strict: true,
  limit: "1mb",
  encoding: "utf-8",
  returnRawBody: false,
  onError: (ctx, err) => {},
});
```

:::tip
默认已支持 json
:::

### text

接收参数参考 [co-body](https://github.com/koajs/koa-body)

```TS
startup.useHttpTextBody()
```

或

```TS
startup.useHttpTextBody({
  limit: "1mb",
  encoding: "utf-8",
  returnRawBody: false,
  onError: (ctx, err) => {},
});
```

### urlencoded

接收参数参考 [co-body](https://github.com/koajs/koa-body)

```TS
startup.useHttpUrlencodedBody()
```

或

```TS
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

```TS
startup.useHttpMultipartBody()
```

或

```TS
startup.useHttpMultipartBody({
  opts: {
    multiples: true,
  },
  limit: "1mb",
  encoding: "utf-8",
  onFileBegin: async (ctx, formName, file) => {
    ctx.res.set("file-name", file.name ?? "");
  },
  onError: (ctx, err) => {},
});
```

## `resStream` & `reqStream`

一般情况下使用 `ctx.res` 和 `ctx.req` 即可，并且可以更好的配合其他中间件。

为了应对特殊需求，`@halsp/native` 在 ctx 中也加入了 `resStream` 和 `reqStream`

特殊情况下你也可以按原生方法操作 `ctx.resStream` 和 `ctx.reqStream`，如 `@halsp/ws` 支持 `WebSocket`

:::tip
如果提前调用了 `reqStream.end()`，`ctx.res` 最终将不会被写入返回结果
:::
