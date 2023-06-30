# WebSocket `(@halsp/ws)`

添加 `@halsp/ws` 以实现 Halsp 对 WebSocket 的支持

`@halsp/ws` 的能力基于 [ws](https://github.com/websockets/ws)，但你无需管理 WebSocket 的连接细节

`@halsp/ws` 使 WebSocket 的实现变得非常简单，你可以在任意位置，将普通的 Http 请求，升级为 WebSocket 连接

## 安装

```sh
npm install @halsp/ws
```

## 快速开始

在入口文件中

```TS
import "@halsp/ws";

startup.useWebSocket()
```

在需要的地方，调用 `ctx.acceptWebSocket` 升级 WebSocket 连接

一般是在 Action 中，对指定的请求地址进行连接升级

```TS
import { Action, HttpGet } from "@halsp/router";

@HttpGet("/ws")
export class WebSocketAction extends Action {
  invoke() {
    // 升级连接，返回 WebSocket 连接实例
    const ws = await ctx.acceptWebSocket();

    // 接收消息
    ws.onmessage = async ({ data }) => {
      ws.send(data); // 发送消息
      ws.close(); // 服务端关闭连接
    };

    await next();
  }
}
```

## 配置参数

`useWebSocket` 接收一个配置参数，包含以下内容

```TS
export interface WsOptions {
  keepAliveTimeout?: number;
  allowedOrigins?: string[];
  backlog?: number | undefined;
  verifyClient?:
    | ws.VerifyClientCallbackAsync
    | ws.VerifyClientCallbackSync
    | undefined;
  handleProtocols?: (
    protocols: Set<string>,
    request: http.IncomingMessage
  ) => string | false;
  clientTracking?: boolean | undefined;
  perMessageDeflate?: boolean | ws.PerMessageDeflateOptions | undefined;
  maxPayload?: number | undefined;
  skipUTF8Validation?: boolean | undefined;
  WebSocket?: typeof ws.WebSocket;
}
```

- keepAliveTimeout

服务器等待额外传入数据的不活动毫秒数

- allowedOrigins

允许的来源

- 其余参数

参考 [ws](https://github.com/websockets/ws)

## 升级连接

调用 `ctx.acceptWebSocket` 升级 WebSocket 连接，如果失败，会抛出错误

也可以调用 `ctx.tryAcceptWebSocket` 升级连接，如果失败，不抛出错误但返回值为 `null`

升级连接后即与客户端建立连接，可通过返回的连接实例进行通信

## 装饰器

可通过装饰器 `WebSocket` 升级连接，并获取连接实例，此操作更为简单易读

```TS
class TestMiddleware extends Middleware {
  @WebSocket
  private readonly ws1!: WebSocket;
  @WebSocket()
  private readonly ws2!: WebSocket;

  async invoke() {
    ws1.send("test");
    ws2.ping();

    this.ws1.close();
    this.ws2.close();

    await this.next();
  }
}
```

## 生命周期

建立连接时，会创建连接实例

`useWebSocket` 中间件会阻止请求返回，直到断开连接

因此 WebSocket 的生命周期如下

1. 收到 Http 请求
1. 升级连接，建立 WebSocket 连接
1. WebSocket 正常通信（主体部分）
1. WebSocket 主动或被动断开
1. 结束 Http 请求

:::warning
不应该通过其他方式使请求返回，如在 `native` 环境中调用 `ctx.resStream.end()`

这将中断 TCP 的连接，因此 WebSocket 的连接也会被意外断开
:::
