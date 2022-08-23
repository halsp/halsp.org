# 日志 `(@ipare/logger)`

添加 `@ipare/logger` 插件以使用日志功能

`@ipare/logger` 的功能基于 [winston](https://github.com/winstonjs/winston)，使用 `@ipare/winston` 可以简化记录日志的操作

## 安装

```sh
npm install @ipare/logger
```

## 快速开始

在 `startup.ts` 中

```TS
import '@ipare/logger';

startup.useLogger()
```

在中间件或服务通过依赖注入获取日志输出类的实例

```TS
import { Middleware } from "@ipare/core";
import { winston, Logger } from "@ipare/logger";

class TestMiddleware extends Middleware {
  @Logger()
  private readonly logger!: winston.Logger;

  invoke(){
    this.logger.info("info");
  }
}
```

## 创建多个日志输出类

`@ipare/logger` 支持创建多个日志输出实例，只需调用多次 `useLogger` ，并传参 `identity` 用于区分

```TS
import "@ipare/logger";

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

在中间件或服务中，给装饰器 `@Logger()` 传参字符串以区分日志实例

```TS
import { Middleware } from "@ipare/core";
import { winston, Logger } from "@ipare/logger";

class TestMiddleware extends Middleware {
  @Logger("id1")
  private readonly logger1!: winston.Logger;
  @Logger("id2")
  private readonly logger2!: winston.Logger;

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

## use...

除 `useLogger` 外，`@ipare/logger` 还提供了以下两种便捷方式

1. `startup.useConsoleLogger` 可以快速创建一个控制台输出的日志实例
2. `startup.useFileLogger` 可以快速创建一个文件输出的日志实例

以上两个参数与 `useLogger` 参数相比，无需设置 `transports`

## 生命周期与作用域

### 作用域

通过 `startup.useLogger` 函数传参 `injectType` 以修改该实例作用域

参考 <https://ipare.org/usage/inject.html#%E4%BD%9C%E7%94%A8%E5%9F%9F>

```TS
import '@ipare/logger';

startup
  .useLogger({
    injectType: InjectType.Singleton
  })
```

### 生命周期

日志输出实例通过依赖注入 `@ipare/inject` 创建，因此其生命周期符合 `@ipare/inject` 规则

参考 <http://ipare.org/usage/inject.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F>

销毁的行为是在 `startup.useInject` 中间件的返回管道中触发，伪代码逻辑如

```TS
await initInject(); // 初始化依赖注入
await initializeLogger(); // 初始化日志
await next(); // 执行下个中间件
await dispose(); // 销毁
```
