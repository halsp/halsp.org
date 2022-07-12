# 主程序

每种运行环境都会有一个主程序对象，你可以在这个对象添加插件和中间件

所有运行环境的主程序都继承于 `Startup` 类

文档种的 `startup` 均表示主程序实例对象，但并不特指运行环境

## Startup

为了让 ipare 能够在各类生产环境中使用，`Startup`类设计的较为开放，在 ts 中是个抽象类，因此该类不能直接使用，需要定义派生类并在合适的函数中调用 `invoke` 函数。

`@ipare/core` 提供了一个 `TestStartup` 类，该类没有任何运行环境，方便用于单元测试

目前已支持的运行环境参考 [运行环境介绍](/usage/env)

## HttpContext

请求管道中的内容都在 `HttpContext` 对象之中，每个中间件都可以调用 `this.ctx` 来获取或修改管道内容

该对象包含以下内容：

- res 字段: `Response` 实例对象
- req 字段: `Request` 实例对象
- bag 函数：用于在管道中传递更多内容

### Response

作为 API 返回内容（在 Startup 可能会被解析后返回）

包含以下内容

- headers: 返回的头部
- body: 返回的内容
- status: 返回状态码
- isSuccess: 返回值是否成功，status >= 200 && status < 300
- setHeaders: 设置多个 header
- setHeader: 设置单个 header
- hasHeader: 判断 header 是否存在，忽略 key 大小写
- removeHeader: 移除一个 header，忽略 key 大小写
- getHeader: 获取一个 header 值，忽略 key 大小写

在每个中间件都可以修改 `this.ctx.res` 中的内容

#### X-HTTP-Method-Override

如果请求头部包含 `X-HTTP-Method-Override` 参数，则访问方法 `httpMethod` 以 `X-HTTP-Method-Override` 值为准

比如 Action 要求 `PATCH` 请求，但微信小程序不支持 `PATCH`，那么可以使用 `POST` 访问，并在头部加上此参数，值为 `PATCH`

```JSON
"headers":{
  "X-HTTP-Method-Override": "PATCH"
}
```

### Request

在中间件中，可通过 `this.ctx.req` 方式获取请求内容

`req` 对象包含以下内容

- path: 访问路径，不带域名和查询参数，自动去除开头 `/`
- params: 查询参数
- body: body 内容
- headers: 获取 header 的深拷贝值，get 属性
- setHeaders: 设置多个 header
- setHeader: 设置单个 header
- hasHeader: 判断 header 是否存在，忽略 key 大小写
- removeHeader: 移除一个 header，忽略 key 大小写
- getHeader: 获取一个 header 值，忽略 key 大小写

### `bag` 函数

可以在管道中传递更多自定义内容。

如果使用 TS，可以借泛型特性获得更多智能提示。

ipare 支持两种引用类型的 bag

- Singleton: 单例模式，添加后可多次获取同一引用
- Transient: 临时模式，添加后每次获取都会创建一个新引用

如果是值类型，每次获取的都是该值的拷贝

#### 添加或修改 `bag`

```JS
// Singleton
this.ctx.bag("BAG_NAME", { /*bag content*/ });
```

OR

```JS
// Transient
this.ctx.bag("BAG_NAME", () => { /*bag content*/ });
```

#### 获取 `bag`

```JS
const val = this.ctx.bag("BAG_NAME")
```

或 TS

```TS
const val = this.ctx.bag<string>("BAG_NAME")
```
