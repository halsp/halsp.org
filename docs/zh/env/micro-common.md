# 微服务概览

Halsp 也支持微服务风格架构的开发，并提供了多种微服务通信方式

不同通信方式的使用方式基本相同，Halsp 封装了实现细节，仅需修改少量代码即可相互切换，但不影响业务代码

大部分插件都能够同时适用于微服务，如依赖注入、路由、管道、过滤器等等

为了能和 `http` 快速切换，很多名称都沿用 `http` 中的概念，如 `ctx.req.body` 指的是请求数据，但微服务并没有 body 的说法

## 开始使用

此部分以 tcp 通信方式举例

执行下面语句即可通过 `create-halsp` 创建一个 tcp 通信的微服务项目

```sh
npm init halsp@latest -- ms-app -e micro-tcp
```

创建完成后会自动运行

如果手动运行，可以在项目目录下执行

```sh
npm start
```

也可以使用镜像源，如

```sh
npm init halsp@latest -- ms-app -e micro-tcp --registry https://registry.npmmirror.com
```

## 入口

不同通信方式有不同的 startup 类，如 tcp 的是 `MicroTcpStartup`

开始一个简单微服务如下

```TS
import { MicroTcpStartup } from "@halsp/micro-tcp";
new MicroTcpStartup().listen();
```

上述示例会监听本机 2333 端口

上述示例不包含路由和其他中间件，无法处理请求

下面我们给示例加上一条匹配 `test:pattern`

```TS
import { MicroTcpStartup } from "@halsp/micro-tcp";
new MicroTcpStartup()
  .pattern("test:pattern", (ctx) => {
    ctx.res.setBody({
      reqPattern: ctx.req.pattern,
      reqData: ctx.req.body,
    });
  })
  .listen();
```

现在就支持请求 `test:pattern` 了

关于如何使用客户端发起请求，请阅读后面的 [客户端](#客户端) 部分

当然这种写法只能用于非常简单的应用，对于一般应用，就需要使用下面的 [路由](#路由)

## 路由

不同通信协议的路由匹配方式大同小异

使用装饰器 `MicroPattern` 装饰 `Action`，参数为匹配字符串

```TS
import { Action, MicroPattern } from "@halsp/router";

@MicroPattern("user:login")
export class TestAction extends Action {
  invoke() {
    this.res.setBody("result");
  }
}
```

### 匹配字符串

不同的通信协议，用的匹配字符串格式有不同的限制或能力，具体请阅读对应通信方式的文档

如 `gRPC` 的格式需要固定为 `<package>.<service>.<method>`

如 `NATS` 可以使用通配符 `@MicroPattern("user.*")`

`tcp` 通信方式还支持通过文件路径映射路由，如文件 `actions/user/getUserInfo.ts` 没有使用 `MicroPattern`，那么匹配字符串即为 `user/getUserInfo`

## 客户端

客户端可用于各种环境，如 Native, Serverless, 微服务等

不同通信方式的客户端使用方式类似，具体差别请阅读对应文档，这里仍然以 TCP 为例

### 开始使用

安装依赖 `@halsp/micro-tcp-client`

```sh
npm install @halsp/micro-tcp-client
```

在 startup.ts 中加入如下代码

```TS
import "@halsp/micro-tcp-client";
startup.useMicroTcp()
```

在中间件或服务中，通过依赖注入使用客户端实例

```TS
import { MicroClient, IMicroClient } from "@halsp/micro-client";
import { Middleware } from "@halsp/core";

class TestMiddleware extends Middleware {
  @MicroClient()
  readonly client!: IMicroClient;

  async invoke() {
    const pattern = "user.login";
    const payload = {
      account: "hi@hal.wang",
    };
    const result = await this.client.send<string>(pattern, payload);
    this.ok(result.data);
  }
}
```

### 配置

`startup.useMicroTcp` 接收一个配置对象，一般包含以下内容

| 字段名      | 描述                                        |
| ----------- | ------------------------------------------- |
| host        | 服务端 TCP host                             |
| port        | 服务端 TCP 端口                             |
| prefix      | 此服务的所有匹配字符串将自动加上该前缀      |
| sendTimeout | 超时时间，单位为 ms                         |
| identity    | 客户端实例唯一 id，利用此字段可以使用多实例 |
| injectType  | 依赖注入类型，即生命周期                    |

### 发送消息

有两种方式发送消息

- 有返回: client.send
- 无返回: client.emit

#### client.send

```TS
const result = await this.client.send<string>(pattern, payload);
```

返回一个对象，包含以下字段

- data: 返回内容
- error: 如果服务端出错，则此字段有值
- id: 用于标识请求的 id

#### client.emit

```TS
this.client.emit(pattern, payload);
```

没有返回内容，也不获取返回结果

一般用于事件通知

### 生命周期

微服务客户端的实例，是使用依赖注入实现实例化的，因此其生命周期规则取决于 `@halsp/inject`

但有点不同的是，微服务客户端实例的默认生命周期，不是 `Scoped` 而是 `Singleton`

在首次使用客户端实例的地方，会自动初始化并建立连接，不需要用户手动初始化和建立连接
