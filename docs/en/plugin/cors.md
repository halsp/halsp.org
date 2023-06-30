# 跨域 CORS `(@halsp/cors)`

安装 `@halsp/cors` 以开启 Halsp 的跨域功能

## 安装

```
npm install @halsp/cors
```

## 快速开始

在入口文件中

```TS
import "@halsp/cors";

startup.useCors();
```

:::tip
一般要在靠前的位置定义，因为有可能前面的中间件会中断中间件管道

防止出错的情况未能使跨域生效
:::

## 配置

`useCors` 接收一个配置参数

```TS
import "@halsp/cors";

startup.useCors({
  allowMethods: ["GET", "POST"],
});
```

可以配置的字段如下

```TS
export interface Options {
  allowMethods?: string | string[];
  origin?: string | ((ctx: Context) => Promise<string> | string);
  exposeHeaders?: string | string[];
  allowHeaders?: string | string[];
  credentials?: boolean | ((ctx: Context) => Promise<boolean> | boolean);
  maxAge?: number;
  privateNetworkAccess?: boolean;
  secureContext?: boolean;
}
```

- origin

`Access-Control-Allow-Origin`

默认与请求的 `Origin` 头相同

- allowMethods

`Access-Control-Allow-Methods`

默认是 `GET,HEAD,PUT,POST,DELETE,PATCH`

- exposeHeaders

`Access-Control-Expose-Headers`

- allowHeaders

`Access-Control-Allow-Headers`

- credentials

`Access-Control-Allow-Credentials`

- credentials

`Access-Control-Allow-Credentials`

- maxAge

`Access-Control-Max-Age`

单位为秒

- privateNetworkAccess

`Access-Control-Allow-Private-Network`

如果值为 true 并且请求头包含 `Access-Control-Request-Private-Network`

那么返回头添加 `Access-Control-Allow-Private-Network` 值为 `true`

- secureContext

`Cross-Origin-Opener-Policy` & `Cross-Origin-Embedder-Policy`

如果值为 `true`，添加头 `Cross-Origin-Opener-Policy` 值为 `same-origin`，头 `Cross-Origin-Embedder-Policy` 值为 `require-corp`
