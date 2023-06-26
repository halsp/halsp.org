# Koa `(@halsp/koa)`

安装 `@halsp/koa` 以支持 Koa 功能

- 让 `halsp` 可以使用 `koa` 中间件
- 或让 halsp 成为 koa 的中间件
- 打通二者中间件管道
- 可以用 `koa` 托管 `halsp`

## 安装

```
npm i @halsp/koa
```

## 快速开始

### 在 Halsp 中使用 Koa 的中间件

```TS
import "@halsp/koa";

startup
  .use(async (ctx, next) => {
    console.log("step 1");
    await next();
    console.log("step 7");
  })
  .koa(async (ctx, next) => {
    console.log("step 2");
    await next();
    console.log("step 6");
  })
  .koa(async (ctx, next) => {
    console.log("step 3");
    await next();
    console.log("step 5");
  })
  .use((ctx) => {
    console.log("step 4");
  });
```

### 将 Halsp 作为 Koa 的中间件

```TS
import { Koa } from "koa";

const koa = new Koa()
  .use(async (ctx, next) => {
    console.log("step 1")
    await next();
    console.log("step 5")
  })
  .use(
    koaHalsp((startup) => {
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

@halsp/koa 会打通 halsp 和 koa 的中间件管道，就像你在 halsp 中使用 koa 中间件一样

管道流向：

1. 如果在 `startup.koa` 后仍有 halsp 中间件：halsp -> koa -> halsp -> koa -> halsp
2. 如果在 `startup.koa` 后没有 halsp 中间件，或 koa 某个中间件是管道终点：halsp -> koa -> halsp

因此你还可以这样玩：

```TS
import cors from "koa-cors";

startup
  .koa(async (ctx, next) => {
    ctx.body = "Halsp loves Koa";
    await next();
  })
  .koa(async (ctx) => {
    ctx.set("koa", "halsp");
    await next();
  })
  .use(async (ctx, next) => {
    console.log(ctx.res.body); // "Halsp loves Koa"
    await next();
  })
  .koa(cors())
  .use(async (ctx) => {
    console.log(ctx.res.getHeader("koa")); // "halsp"
  });
```

## 解析请求体

为了兼容各运行环境，halsp 的 ctx.body 都是已解析好的数据

因此如果请求体没有被解析，有两种方式解析：

1. 先解析流并将解析后的内容放入 `ctx.body`，如 `co-body`, `formidable` 等工具
2. 在 `Halsp` 中间件中使用 `@halsp/body`，如 `startup.useHttpJsonBody()`
