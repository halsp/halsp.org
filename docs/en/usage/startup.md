# 主程序

在 `@halsp/core` 导出一个类 `Startup`，作为主程序对象，每种运行环境都会在此类中添加实例方法

你可以在这个主程序对象添加插件和中间件

文档中的 `startup` 均表示主程序实例对象，但并不特指运行环境

为了让 halsp 能够在各类环境中使用，`Startup` 类设计的较为开放，本身仅包含基本中间件功能

因此该类一般不会直接使用，需要配合相关运行环境插件

## 运行环境

Halsp 提供了多种运行环境

目前已支持的运行环境参考 [运行环境介绍](../env/native)

## 启动文件

在 `src` 下需要有 `index.ts` 或 `main.ts` 文件作为入口，此规则用于 `@halsp/cli` 正确解析代码，内容如

```TS
// index.ts / main.ts
import { Startup } from "@halsp/core";
import "@halsp/inject";
import "@halsp/router";
import "@halsp/native";

new Startup()
  .useNative()
  .use(async (ctx, next) => {
    ctx.res.set("mode", process.env.NODE_ENV);
    await next();
  })
  .useInject()
  .useRouter()
  .listen();
```

:::tip
如果 `src` 下有 `native.ts` 文件，`@halsp/cli` 将优先以此文件为入口，一般用于特殊情况的本地调试
:::

## 中间件

startup 提供了两个方法添加中间件

- use 一般用于添加简单中间件，中间件是一个回调函数
- add 用于添加类中间件，一般用于添加较复杂中间件，或需要将一系列操作封装为一个中间件

更多关于中间件的介绍，查看后面的 [中间件](./middleware) 部分
