# 自定义运行环境

自定义运行环境可参考已有环境

主要操作如下

- 为类 `Startup` 的 `propotype` 增加一个函数，用于处理相关环境参数
- 每次请求都创建一个 `Context` 对象，执行 `await this.invoke(ctx)` 并将 `Context` 对象传入 `this.invoke` 函数
- 中间件返回后，解析 `Context` 对象和 `Request` 对象，并设置请求返回

## 伪代码

伪代码如下

```TS
import { Context, Startup } from "@halsp/core";

declare module "@halsp/core" {
  interface Startup {
    useCustom(): this;
    listen(): void;
  }
}

Startup.prototype.useCustom = function () {
  // do something
  this.listen = function () {
    // request event
    xxxEvent.on("message", async () => {
      const ctx = new Context();
      const res = await this["invoke"](ctx);
      return setResult(ctx, event);
    });
  };
  return this;
};

new Startup()
  .useCustom()
  .use((ctx) => {
    ctx.res.ok("OK");
  })
  // ...
  .listen();
```

## 分析 lambda

以 `@halsp/lambda` 为例，分析其的大致实现

### useLambda 函数

在 Startup.prototype 上增加函数 `startup.useLambda`，调用此函数以支持 Lambda 环境

在函数中声明使用 Http 环境 `startup.useHttp()`，并为 startup 实例创建方法 `startup.run`

### run 函数

每次网络请求，都会调用 `startup.run()` 函数

该函数简单来说就三步操作

1. 根据 lambda 的参数 `event` 和 `context` 解析请求内容，并创建 Context 对象
2. 执行 `this.invoke(ctx)`，这一步将执行各个中间件，是 halsp 的核心部分
3. 格式化返回内容

函数代码如下

```TS
import { Startup, Dict } from "@halsp/core";

Startup.prototype.useLambda = function () {
  return this.useHttp().extend("run", async (event: Dict, context: Dict) => {
    const ctx = this.createContext(event, context);
    await this["invoke"](ctx);
    return await getStruct(ctx);
  });
};
```

### 创建 Context

`Context` 构造函数接收 `Request` 对象，因此需要先创建 `Request` 对象

1. 新建一个 `Request` 对象 `new Request()`
2. 解析 lambda 的参数 `event` 和 `context`，设置 `Request` 对象的请求参数
3. 新建一个 `Context` 对象 `new Context(req)`

### 格式化返回内容

在 `this.invoke` 执行完毕后，`Context` 和 `Request` 对象已经在各个中间件被更新

然后需要解析 `Context` 和 `Request` 对象并返回符合 lambda 要求的结果

```TS
export interface ResponseStruct {
  readonly isBase64Encoded: boolean;
  readonly statusCode: number;
  readonly status: number;
  readonly headers: HeadersDict;
  readonly body: any;
}
```

- `body` 取自 `res.body`
- 由于云函数不支持返回二进制，因此需要判断 `res.body` 是否二进制（Buffer / Stream）。如果 `res.body` 是二进制，需要将 `body` 用 `base64` 转换，并设置 `isBase64Encoded` 为 `true`
- `statusCode` 和 `status` 相同，直接取自 `res.status`，写两个是为了兼容更多云函数
- `headers` 直接取自 `res.headers`

### 使用

在 index.ts 中

```TS
import "@halsp/lambda";

const startup = new Startup().useLambda();
export const main = async (event, context) => await startup.run(event, context);
```

## 贡献

欢迎将自定义运行环境发布至 `npm` 供其他人使用
