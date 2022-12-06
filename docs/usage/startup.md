# 主程序

每个程序都会有一个主程序对象，每种运行环境都会至少有一个对应的主程序类，派生自 `Startup` 类

你可以在这个主程序对象添加插件和中间件

文档中的 `startup` 均表示主程序实例对象，但并不特指运行环境

为了让 ipare 能够在各类生产环境中使用，`Startup` 类设计的较为开放，在 `ts` 中是个抽象类

因此该类不能直接使用，需要定义派生类，每种运行环境都有对应的 `Startup` 派生类

## 运行环境

Ipare 提供了多种运行环境

目前已支持的运行环境参考 [运行环境介绍](/usage/env)

## startup.ts

为了能够使用 `@ipare/cli` 便捷调试，在 `src` 下需要有 `startup.ts` 文件，导出一个默认回调函数，内容如

```TS
// startup.ts
import "@ipare/inject";
import "@ipare/router";

export default function <T extends Startup>(startup: T, mode?: string) {
  return startup
    .use(async (ctx, next) => {
      ctx.res.setHeader("mode", mode ?? "");
      await next();
    })
    .useInject()
    .useRouter();
}
```

`mode` 参数值为 `@ipare/cli` 的 `build` 或 `start` 命令传入的 `--mode` 参数，如 `development`、`production` 等

## 单元测试

`@ipare/testing` 提供了 `TestStartup` ,`TestNativeStartup` 等类 ，方便用于单元测试

`TestStartup` 类没有任何运行环境

`TestNativeStartup` 类是原生 NodeJS 运行环境

更多内容转至 [单元测试](/usage/testing)
