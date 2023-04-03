# 日志 `(@halsp/logger)`

添加 `@halsp/logger` 插件以使用日志功能

`@halsp/logger` 的功能基于 [winston](https://github.com/winstonjs/winston)，使用 `@halsp/winston` 可以简化记录日志的操作

## 安装

```sh
npm install @halsp/logger
```

## 快速开始

在 `startup.ts` 中

```TS
import '@halsp/logger';

startup.useLogger()
```

在中间件或服务通过依赖注入获取日志输出类的实例

```TS
import { Middleware } from "@halsp/core";
import { LoggerInject, Logger } from "@halsp/logger";

class TestMiddleware extends Middleware {
  @LoggerInject()
  private readonly logger!: Logger;

  invoke(){
    this.logger.info("info");
  }
}
```

## 创建多个日志输出实例

`@halsp/logger` 支持创建多个日志输出实例，只需调用多次 `useLogger` ，并传参 `identity` 用于区分

```TS
import "@halsp/logger";

startup
  .useLogger({
    identity: "id1"
    // ...
  })
  .useLogger({
    identity: "id2"
    // ...
  });
```

在中间件或服务中，给装饰器 `@LoggerInject()` 传参字符串以区分日志实例

```TS
import { Middleware } from "@halsp/core";
import { LoggerInject, Logger } from "@halsp/logger";

class TestMiddleware extends Middleware {
  @LoggerInject("id1")
  private readonly logger1!: Logger;
  @LoggerInject("id2")
  private readonly logger2!: Logger;

  async invoke(): Promise<void> {
    this.logger1.info("info");
    this.logger2.error("err");
    await this.next();
  }
}
```

:::warning 注意
只有在 `useLogger` 之后的中间件，才能获取到日志输出实例
:::

## 获取实例

你可以通过依赖注入的方式获取实例，也可以用 `ctx.getLogger` 获取实例

### 依赖注入

用 `@LoggerInject` 装饰属性或构造函数参数，通过 `@halsp/inject` 依赖注入创建实例

```TS
import { Middleware } from "@halsp/core";
import { Logger, LoggerInject } from "@halsp/logger";

@Inject
class TestMiddleware extends Middleware {
  constructor(
    @LoggerInject private readonly logger1: Logger,
    @LoggerInject("id2") private readonly logger2: Logger
  ) {}

  @LoggerInject("id1")
  private readonly logger1!: Logger;

  async invoke(): Promise<void> {
    this.logger1.info("def");
    this.logger2.error("err");
    this.logger3.info("info");
    await this.next();
  }
}
```

### `ctx.getLogger`

使用 `ctx.getLogger` 的方式更灵活，但代码易读性不如使用依赖注入

```TS
import "@halsp/logger";

startup.use(async (ctx, next) => {
  const logger1 = await ctx.getLogger("id1");
  const logger2 = await ctx.getLogger("id2");
  const logger = await ctx.getLogger();
});
```

## use...

除 `useLogger` 外，`@halsp/logger` 还提供了以下两种便捷方式

1. `startup.useConsoleLogger` 可以快速创建一个控制台输出的日志实例
2. `startup.useFileLogger` 可以快速创建一个文件输出的日志实例

以上两个参数与 `useLogger` 参数相比，无需设置 `transports`

## 生命周期与作用域

### 作用域

通过 `startup.useLogger` 函数传参 `injectType` 以修改该实例作用域

参考 <https://halsp.org/usage/inject.html#%E4%BD%9C%E7%94%A8%E5%9F%9F>

```TS
import '@halsp/logger';

startup
  .useLogger({
    injectType: InjectType.Singleton
  })
```

### 生命周期

日志输出实例通过依赖注入 `@halsp/inject` 创建，因此其生命周期符合 `@halsp/inject` 规则

参考 <http://halsp.org/usage/inject.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F>

销毁的行为是在 `startup.useInject` 中间件的返回管道中触发，伪代码逻辑如

```TS
await initInject(); // 初始化依赖注入
await initializeLogger(); // 初始化日志
await next(); // 执行下个中间件
await dispose(); // 销毁
```
