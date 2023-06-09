# 请求处理

Halsp 有开箱即用的获取请求参数的方式，同时也内置了一些处理返回结果的功能

## 请求上下文 Context

中间件管道中的内容都在 `Context` 对象之中，每个中间件都可以调用 `this.ctx` 来获取或修改中间件管道内容

该对象包含以下内容：

- res 字段: `Response` 实例对象
- req 字段: `Request` 实例对象
- get/set/has/delete：用于在中间件管道中传递更多内容

### Response

作为 API 返回内容（在 Startup 中可能会被解析后返回）

包含以下内容

- headers: 返回的头部
- body: 返回的内容
- status: 返回状态码
- isSuccess: 返回值是否成功，status >= 200 && status < 300
- setHeaders: 设置多个 header
- set: 设置单个 header
- has: 判断 header 是否存在，忽略 key 大小写
- remove: 移除一个 header，忽略 key 大小写
- append: 在已有 header 后追加，或新加 header
- get: 获取一个 header 值，忽略 key 大小写
- 其他结果函数

在每个中间件中，都可以修改 `this.ctx.res` 中的内容

### Request

在中间件中，可通过 `this.ctx.req` 方式获取请求内容

`req` 对象包含以下内容

- path: 访问路径，不带域名和查询参数，自动去除开头 `/`
- params: 查询参数
- body: body 内容
- headers: 获取 header 的深拷贝值，get 属性
- setHeaders: 设置多个 header
- set: 设置单个 header
- has: 判断 header 是否存在，忽略 key 大小写
- remove: 移除一个 header，忽略 key 大小写
- get: 获取一个 header 值，忽略 key 大小写

也可以使用更灵活的 [管道](./pipe) 来获取请求内容

#### X-HTTP-Method-Override

如果请求头部包含 `X-HTTP-Method-Override` 参数，则访问方法 `httpMethod` 以 `X-HTTP-Method-Override` 值为准

比如 Action 要求 `PATCH` 请求，但微信小程序不支持 `PATCH`，那么可以使用 `POST` 访问，并在头部加上此参数，值为 `PATCH`

```JSON
"headers":{
  "X-HTTP-Method-Override": "PATCH"
}
```

### 传递内容

可以通过 `ctx.get/ctx.set/ctx.has/ctx.delete` 在管道中传递更多自定义内容。

如果使用 TS，可以借泛型特性获得更多智能提示。

Halsp 支持 3 种生命周期的内容

- singleton: 单例模式，添加后可多次获取同一引用
- scoped: 单次请求，在单次请求内，每次获取都会获取同一引用
- transient: 临时模式，添加后每次获取都会创建一个新引用

如果是值类型，每次获取的都是该值的拷贝

#### 添加或修改

```TS
// singleton
this.ctx.set("BAG_NAME", 'singleton', () => { /*content*/ });
```

OR

```TS
// transient
this.ctx.set("BAG_NAME", 'transient', () => { /*content*/ });
```

#### 获取内容

```TS
const val = this.ctx.get("BAG_NAME")
```

或使用模板类型

```TS
const val = this.ctx.get<string>("BAG_NAME")
```

## 内置结果函数

在 `Response` 和中间件中，内置一些返回结果函数，用于快速设置返回状态码和 body：

- ok, 200
- created, 201
- accepted, 202
- noContent, 204
- partialContent, 206
- redirect, 30\*
- badRequest, 400
- badRequestMsg, 400
- forbidden, 403
- forbiddenMsg, 403
- notFound, 404
- notFoundMsg, 404
- methodNotAllowed, 405
- methodNotAllowedMsg, 405
- notAcceptable, 406
- notAcceptableMsg, 406
- requestTimeout, 408
- requestTimeoutMsg, 40
- conflict, 409
- conflictMsg, 409
- gone, 410
- goneMsg, 410
- preconditionFailed, 412
- preconditionFailedMsg, 412
- requestTooLong, 413
- requestTooLongMsg, 413
- unsupportedMediaType, 415
- unsupportedMediaTypeMsg, 415
- imATeapot, 418
- imATeapotMsg, 418
- misdirected, 421
- misdirectedMsg, 421
- unprocessableEntity, 421
- unprocessableEntityMsg, 421
- internalServerError, 500
- internalServerErrorMsg, 500
- notImplemented, 501
- notImplementedMsg, 501
- badGateway, 502
- badGatewayMsg, 502
- serviceUnavailable, 503
- serviceUnavailableMsg, 503
- gatewayTimeout, 504
- gatewayTimeoutMsg, 504
- httpVersionNotSupported, 505
- httpVersionNotSupportedMsg, 505

如在类中间件中

```TS
import { Middleware } from "@halsp/core";

class TestMiddleware extends Middleware{
  async invoke() {
    this.ok("success");
    await this.next();
  }
}
```

等同于

```TS
import { Middleware } from "@halsp/core";

class TestMiddleware extends Middleware{
  async invoke() {
    this.ctx.res.body = "success";
    this.ctx.res.status = 200;
    await this.next();
  }
}
```

如下方式读取请求参数并返回

```TS
import { Middleware } from "@halsp/core";

export default class extends Middleware {
  async invoke() {
    const { account, password } = this.ctx.req.query;

    if (/*Incorrect username or password*/) {
      this.notFoundMsg({ message: "Incorrect username or password" });
    } else {
      this.ok({
        /*messages*/
      });
    }
  }
}
```

多数内置函数支持传入 `body` 可选参数，`body` 为返回的内容。

API 返回错误时，可统一返回 `ErrorMessage`，命名以 `Msg` 结尾的内置类型接受 `ErrorMessage` 参数。

如

```TS
ctx.res.notFoundMsg("not found");
```
