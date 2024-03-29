# Jwt 身份验证 `(@halsp/jwt)`

安装 `@halsp/jwt` 以使用 Jwt 身份验证

`@halsp/jwt` 基于以下内容

- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [@halsp/inject](https://github.com/halsp/inject)

## 安装

```
npm install @halsp/jwt
```

## 快速开始

在入口文件中

```TS
import "@halsp/jwt";

startup.useJwt(options);
```

```TS
import "@halsp/jwt";

startup
  .useJwt(options)
  .useJwtVerify()
```

## 配置

`useJwt` 接收一个配置参数，包括以下配置

### secret

jwt 密钥

### publicKey & privateKey

jwt 公钥和私钥

RSA 和 ECDSA 加密的 PEM 公钥

### signOptions & verifyOptions

创建 `jwt token` 和验证 `jwt token` 是的配置参数

具体配置参考 [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)

### `prefix`

`jwt token` 的前缀，用于解析，默认为 `Bearer`

### tokenProvider

`tokenProvider` 是一个回调函数，用于指明 `jwt token` 的位置，如 `headers`/`query` 中

使用 `useJwt` 后会给 `Context` 对象增加 `jwtToken` 属性，默认取自请求头部 `Authorization` 值

设置 `tokenProvider` 后可以从其他位置获取 `jwt token`

## 内置验证 jwt

`startup.useJwtVerify()` 可以添加对 jwt token 的验证

```TS
startup
  .useJwt()
  .useJwtVerify()
```

该函数接收两个可选参数

- skip: 回调函数，返回 `Promise<bool>`
  - 如果值为 true，则不校验此次请求
  - 如果值为 false，则校验此次请求的 `jwt token` 是否正确
- onError: 回调函数，验证 jwt 失败时会执行
  - 如果不传此参数将使用默认逻辑返回 401
  - 回调函数有两个参数：`Context` 和错误信息

## 额外验证

如果只验证 token 并不满足需求，比如还需要比对 Redis 中的缓存 token

那么可以使用 `startup.useJwtExtraAuth` 添加额外的验证

```TS
startup
  .useJwt()
  .useJwtVerify()
  .useJwtExtraAuth((ctx) => bool)
```

该函数接收一个回调函数，返回 `Promise<bool>`

- 如果返回值为 true，说明验证通过，会继续执行下一个中间件
- 如果返回值为 false，说明验证失败，将终止后续中间件执行

如果回调函数返回 false，并且没有设置状态码（即默认值 `404`），也没有设置 `body`(`undefined`)，那么状态码会被自动设置为 `401`

## JwtService

在调用 `useJwt` 时就已经使用 `@halsp/inject` 注入了 `JwtService`

用于更方便的处理 jwt

### 引用

你可以通过 `控制反转` 的方式使用 `JwtService`

```TS
class YourMiddleware extends Middleware{
  @Inject
  private readonly jwtService!: JwtService;
}
```

OR

```TS
@Inject
class YourMiddleware extends Middleware{
  constructor(private readonly jwtService: JwtService){}
}
```

OR

```TS
const jwtService = await ctx.getService(JwtService);
```

### 提供方法

JwtService 提供了一些 jwt 相关的方法

#### sign

生成 jwt token

接收两个参数

- payload: jwt payload
- options: jwt 配置，可选参数。优先使用这个配置，没有的配置项再使用 `useJwt` 传入的配置 `signOptions`

#### verify

验证 jwt token

如果验证失败会抛出异常，请使用 `try{}catch{}` 或 `Promise.catch`

接收两个参数

- token: jwt token
- options: jwt 配置，可选参数。优先使用这个配置，没有的配置项再使用 `useJwt` 传入的配置 `verifyOptions`

#### decode

解析 jwt token

如果解析失败返回 null，解析成功返回结果取决于传入参数，具体查看 ts 智能提示

接收两个参数

- token: jwt token
- options: jwt 配置，可选参数。优先使用这个配置，没有的配置项再使用 `useJwt` 传入的配置

## 装饰器

你通过装饰器的方式，来快捷使用和解析 `jwt token`

在中间件或服务中，被装饰的字段会被自动解析

#### @JwtToken

赋值为 `jwt token` 字符串

```TS
import { Middleware } from "@halsp/core";
import * as jwt from "jsonwebtoken";

class TestMiddleware extends Middleware{
  @JwtToken
  private readonly token!: string;
}
```

#### @JwtObject

解析 `jwt token` 字符串并转为对象

```TS
import { Middleware } from "@halsp/core";
import * as jwt from "jsonwebtoken";

class TestMiddleware extends Middleware{
  @JwtObject
  private readonly jwt!: jwt.Jwt;
}
```

#### @JwtPayload

只取 jwt payload 部分，如果是 json 字符串，则会自动解析

```TS
import { Middleware } from "@halsp/core";
import * as jwt from "jsonwebtoken";

class TestMiddleware extends Middleware{
  @JwtPayload
  private readonly payload!: any;
}
```
