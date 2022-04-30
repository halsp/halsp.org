# Http 服务

安装 `@sfajs/http` 以支持 Http 运行环境

- 让 sfa 能够运行于 http(s)
- 你可以随时将 sfa 云函数简单改为 nginx 托管的 sfa http 服务
- 也可以将 nginx 托管的 sfa http 服务简单改为 sfa 云函数

## 安装

```
npm i @sfajs/http
```

## 快速开始

以下示例开启一个服务，端口当然是 2333 啦

```JS
import { SfaHttp } from "@sfajs/http";

new SfaHttp()
  .use(async (ctx) => {
    ctx.ok("@sfajs/http");
  })
  .listen(2333);
```

@sfajs/http 也支持 https，只需将上述示例中的 `SfaHttp` 改为 `SfaHttps`

## 组合其他中间件

### @sfajs/router

```JS
import { SfaHttp } from "@sfajs/http";
import "@sfajs/router";

new SfaHttp()
  .useRouter()
  .listen(2333);
```

### @sfajs/static

```JS
import { SfaHttp } from "@sfajs/http";
import "@sfajs/router";

new SfaHttp()
  .useStatic()
  .listen(2333);
```

## body 解析

内置四种 body 解析

```JS
import { SfaHttp } from "@sfajs/http";
new SfaHttp()
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

为了更好的利用 sfa，正常情况使用 `ctx.res` 和 `ctx.req` 即可，并且可以更好的配合其他中间件。

为了应对特殊需求，`@sfajs/http` 在 ctx 中可以加入了 `httpRes` 和 `httpReq`，特殊情况下你也可以按原生方法操作 `ctx.httpRes` 和 `ctx.httpReq`，但不建议使用。

如果调用了 `httpReq.end()`，`ctx.res` 将不会被写入返回结果

## 入口

`SfaHttp` 和 `SfaHttps` 作为 `sfajs` 运行于 `Http` 的入口

该类继承于 `Startup` 并实现 `Http` 功能
