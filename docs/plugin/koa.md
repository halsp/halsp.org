# Koa

安装 `@ipare/koa` 以支持 Koa 功能

- 让 koa 成为 ipare 的中间件
- 或 ipare 成为 koa 的中间件
- 并打通二者中间件管道
- 让 `ipare` 可以使用大部分 `koa` 插件
- 用 `koa` 托管 `ipare`

## 安装

```
npm i @ipare/koa
```

## 快速开始

### 将 koa 作为 ipare 的中间件

```TS
import { TestStartup } from "@ipare/core";
import "@ipare/koa";
import { Koa } from "@ipare/koa";

const res = await new TestStartup()
  .use(async (ctx, next) => {
    console.log("step 1");
    await next();
    console.log("step 5");
  })
  .useKoa(
    new Koa().use(async (ctx, next) => {
      console.log("step 2");
      await next();
      console.log("step 4");
    })
  )
  .use((ctx) => {
    console.log("step 3");
  })
  .run();
```

### 将 ipare 作为 koa 的中间件

```TS
import { Koa } from "@ipare/koa";

const koa = new Koa()
  .use(async (ctx, next) => {
    console.log("step 1")
    await next();
    console.log("step 5")
  })
  .use(
    koaIpare((startup) => {
      startup.use(async (ctx, next) => {
        console.log("step 2")
        await next();
        console.log("step 4")
      });
    })
  )
  .use((ctx) => {
    console.log("step 3")
  });
const server = koa.listen(2333);
```

## 中间件管道

@ipare/koa 会打通 ipare 和 koa 的中间件管道，就像你在 ipare 中使用 koa 中间件一样

管道流向：

1. 在 useKoa 后仍有 ipare 中间件：ipare -> koa -> ipare -> koa -> ipare
2. 在 useKoa 后没有 ipare 中间件，或 koa 某个中间件是管道终点：ipare -> koa -> ipare

因此你还可以这样玩：

```TS
import { TestStartup } from "@ipare/core";
import { Koa } from "@ipare/koa";
import cors from "koa-cors";

const res = await new TestStartup()
  .useKoa(
    new Koa()
      .use(async (ctx, next) => {
        ctx.body = "Ipare loves Koa";
        await next();
      })
      .use(async (ctx) => {
        ctx.setHeader("koa", "ipare");
        await next();
      })
  )
  .use(async (ctx, next) => {
    console.log(ctx.res.body); // "Ipare loves Koa"
    await next();
  })
  .useKoa(new Koa().use(cors()))
  .use(async (ctx) => {
    console.log(ctx.res.getHeader("koa")); // "ipare"
  })
  .run();
```

## 使用流

为了兼容各运行环境，ipare 的 ctx.body 都是已解析好的数据

因此如果涉及到流，你有两种做法可以让 `@ipare/koa` 正确解析

1. 先解析

在 `startup.useKoa` 之前的中间件中，先解析流，将解析后的内容放入 `ctx.body`，在 koa 中间件中即可使用该数据

1. 配置传入可读流

useKoa 第二个参数的 streamingBody 传入一个函数，函数参数为 ipare 的 `ctx`，返回值类型为 `ReadableStream`

如 http(s) 环境下

```TS
import { HttpStartup } from "@ipare/http";

new HttpStartup().useKoa(new Koa(), {
  streamingBody: (ctx) => ctx.httpReq,
});
```

如 阿里云函数 环境下

```TS
import { AlifcStartup } from "@ipare/alifc";

new AlifcStartup(req, resp, context).useKoa(new Koa(), {
  streamingBody: (ctx) => ctx.aliReq,
});
```
