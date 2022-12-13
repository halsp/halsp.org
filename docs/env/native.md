# 原生 NodeJS 服务 `(@ipare/native)`

安装 `@ipare/native` 以支持 NodeJS 原生运行环境

- 让 Ipare 能够运行于 NodeJS 原生运行环境
- 你可以随时将 Ipare 云函数简单改为 nginx 托管的 Ipare 原生服务
- 也可以将 nginx 托管的 Ipare 原生服务简单改为 Ipare 云函数

## 安装

```
npm i @ipare/native
```

## 快速开始

以下示例开启一个服务，端口是 9504

```TS
import { NativeStartup } from "@ipare/native";

new NativeStartup()
  .use(async (ctx) => {
    ctx.ok("@ipare/native");
  })
  .listen(9504);
```

@ipare/native 也支持 https，上述示例中增加参数 `https:true`

```TS
new NativeStartup({
  https: true
})
  .use(async (ctx) => {
    ctx.ok("@ipare/native");
  })
  .listen(9504);
```

## 组合其他中间件

### @ipare/router

```TS
import { NativeStartup } from "@ipare/native";
import "@ipare/router";

new NativeStartup()
  .useRouter()
  .listen(9504);
```

### @ipare/static

```TS
import { NativeStartup } from "@ipare/native";
import "@ipare/static";

new NativeStartup()
  .useStatic()
  .listen(9504);
```

## body 解析

基于 `@ipare/body` 支持四种 body 解析

```TS
import { NativeStartup } from "@ipare/native";
new NativeStartup()
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

## `httpRes` & `httpReq`

为了更好的利用 ipare，正常情况使用 `ctx.res` 和 `ctx.req` 即可，并且可以更好的配合其他中间件。

为了应对特殊需求，`@ipare/native` 在 ctx 中也加入了 `httpRes` 和 `httpReq`，特殊情况下你也可以按原生方法操作 `ctx.httpRes` 和 `ctx.httpReq`，但不建议使用。

如果调用了 `httpReq.end()`，`ctx.res` 将不会被写入返回结果

## 入口

`NativeStartup` 作为 `Ipare` 运行于原生环境的入口

该类继承于 `Startup` 并实现 `http` 功能
