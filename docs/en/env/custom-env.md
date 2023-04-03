# 自定义运行环境

自定义运行环境可参考已有环境

主要操作如下

- 创建入口类并继承 `Startup`
- 每次请求创建一个 `Request` 对象和 `Context` 对象
- 执行 `await super.invoke(ctx)` 将 `Context` 对象传入 `super.invoke` 函数
- 解析 `Context` 对象和 `Request` 对象设置请求返回

## 伪代码

伪代码如下

```TS
import { Startup } from "@halsp/core";

class CustomEnvStartup extends Startup{
  async run(event: any){
    const ctx = createContext(event);
    await super.invoke(ctx);
    return setResult(ctx, event);
  }
}

new CustomEnvStartup()
  .use((ctx) => ctx.ok("OK"))
  // ...
  .run();
```

## 分析 lambda

以 `@halsp/lambda` 为例，分析 `LambdaStartup` 的大致实现

### run 函数

每次网络请求，都会调用 `LambdaStartup.run()` 函数

该函数简单来说就三步操作

1. 根据 lambda 的参数 `event` 和 `context` 解析请求内容，并创建 Context 对象
2. 执行 `super.invoke(ctx)`，这一步将执行各个中间件，是 halsp 的核心部分
3. 格式化返回内容

函数代码如下

```TS
import { Startup, Dict} from "@halsp/core";

export class LambdaStartup extends Startup {
  async run(event: Dict, context: Dict): Promise<ResponseStruct> {
    const ctx = this.createContext(event, context);
    await super.invoke(ctx);
    return await this.#getStruct(ctx);
  }
}
```

### 创建 Context

`Context` 构造函数接收 `Request` 对象，因此需要先创建 `Request` 对象

1. 新建一个 `Request` 对象 `new Request()`
2. 解析 lambda 的参数 `event` 和 `context`，设置 `Request` 对象的请求参数
3. 新建一个 `Context` 对象 `new Context(req)`

### 格式化返回内容

在 `super.invoke` 执行完毕后，`Context` 和 `Request` 对象已经在各个中间件被更新

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
import { LambdaStartup } from "@halsp/lambda";
import startup from "./startup";

const app = startup(new LambdaStartup());
export const main = async (event, context) => await app.run(event, context);
```

## 贡献

欢迎将自定义运行环境发布至 `npm` 供其他人使用
