# 单元测试 `(@ipare/testing)`

安装 `@ipare/testing` 以添加单元测试功能

`@ipare/testing` 内建了对多种运行环境的单元测试支持

## Startup

`@ipare/testing` 提供多种环境的 `Startup` 用于单元测试

:::warning
除 `TestStartup` 可以直接导出外，其他 `Startup` 均需要写完整路径，如

```TS
import { TestHttpStartup } from "@ipare/testing/dist/http";
import { TestMicroGrpcStartup } from "@ipare/testing/dist/micro-grpc";
```

:::

### TestStartup

用于与运行环境无关的单元测试

与 http / 微服务 / Serverless 等都无关

并增加了以下功能

- `setContext` 函数，用于设置测试的请求 `Context` 或 `Request`
- `setSkipThrow` 函数，调用之后，中间件如果抛出未处理错误，那么框架将不处理这个错误（默认 ipare 会处理错误，并修改状态码为 500）
- `run` 函数，开始根据请求执行已添加中间件
- `expect` 函数，用于测试断言

```TS
import { TestStartup } from "@ipare/testing";

new TestStartup()
  .use(async (ctx, next) => {
    ctx.setBody("test");
    await next();
  })
  .expect((res) => {
    expect(res.status).toBe(200);
  });
```

```TS
import { TestStartup } from "@ipare/testing";

it("should xxx", async () => {
  new TestStartup()
    .setSkipThrow()
    .setContext(new Context())
    .use(() => {
      ctx.setBody("test");
      await next();
    })
    .expect((res) => {
      expect(!!res).toBeTrue();
    });
});
```

### TestHttpStartup

用于模拟 http 请求，但仍与运行环境无关

```TS
import { TestHttpStartup } from "@ipare/testing/dist/http";

const res = await new TestHttpStartup()
  .use((ctx) => {
    ctx.ok({
      method: ctx.req.method,
      path: ctx.req.path,
    });
  })
  .expect(200, {
    method: "GET",
    path: "url",
  });
```

#### Response

Response 新增 `expect` 函数，用于断言请求结果

注意，使用前需要先导入 `@ipare/testing`

```TS
import { TestHttpStartup } from "@ipare/testing/dist/http";

new TestHttpStartup()
  .use(async (ctx, next) => {
    ctx.ok("body-ok");
    await next();
  })
  .expect((res) => {
    res.expect(200);
    res.expect(200, "body-ok");
    res.expect("body-ok");
    res.expect((res) => {
      expect(res.status).toBe(200);
    });
  });
```

### TestNativeStartup

派生自 `TestHttpStartup`，用于模仿 http 原生 native 运行环境

基于 [supertest](https://github.com/visionmedia/supertest)

`create` 函数会返回 `supertest` 的 `Test` 对象

```TS
import { TestNativeStartup } from "@ipare/testing/dist/http";

await new TestNativeStartup()
  .use((ctx) => {
    ctx.ok({
      method: ctx.req.method,
      path: ctx.req.path,
    });
  })
  .create()
  .get("/url")
  .expect(200, {
    method: "GET",
    path: "url",
  });
```

### 微服务 Startup

微服务包含以下类别的 Startup，用法与前面的 Startup 都类似

- TestMicroGrpcStartup
- TestMicroMqttStartup
- TestMicroNatsStartup
- TestMicroRedisStartup
- TestMicroTcpStartup

```TS
import { TestMicroGrpcStartup } from "@ipare/testing/dist/micro-grpc";

const startup = new TestMicroGrpcStartup({
  protoFiles: "./test/test.proto",
  port: 5080,
})
  .use((ctx) => {
    ctx.res.setBody({
      resMessage: ctx.req.body.reqMessage,
    });
  })
  .pattern("test/TestService/testMethod", (ctx) => {
    ctx.res.body = ctx.req.body;
  });
await startup.listen();
```

## 中间件

Startup 及其派生类新增函数 `expectMiddleware`，用于中间件的单元测试

注意，使用前需要先导入 `@ipare/testing`

```TS
import "@ipare/testing";
import { TestHttpStartup } from "@ipare/testing/dist/http";
import { Middleware } from "@ipare/core";

class TestMiddleware extends Middleware {
  fn() {
    return 1;
  }

  invoke(): void | Promise<void> {
    this.ok();
  }
}

new TestHttpStartup()
  .expectMiddleware(TestMiddleware, (md) => {
    expect(md.fn()).toBe(1);
  })
  .add(TestMiddleware)
  run();
```

:::warning
由于中间件执行顺序的原因，`startup.expectMiddleware` 需要写在 `startup.add` 之前
:::

## 服务/依赖注入

Startup 及其派生类新增函数 `expectInject`，用于依赖注入服务的单元测试

安装了 `@ipare/inject` 的项目才能使用这个功能

注意，使用前需要先导入 `@ipare/testing`

```TS
class TestService1 {
  fn() {
    return 1;
  }
}
class TestService2 {
  @Inject
  private readonly testService1!: TestService1;

  fn() {
    return this.testService1.fn();
  }
}
```

```TS
import "@ipare/testing";
import { TestStartup } from "@ipare/testing";

new TestStartup()
  .expectInject(TestService, (service) => {
    expect(service.fn()).toBe(1);
  });
```

```TS
import "@ipare/testing";
import { TestStartup } from "@ipare/testing";

new TestStartup()
  .useInject();
  .inject(TestService, InjectType.Singleton)
  .expectInject(TestService, (service) => {
    expect(service.fn()).toBe(1);
  });
```

## runin

用于改变当前运行的路径，即改变 `process.cwd()` 的值

多用于与文件相关的单元测试

```TS
import { existsSync } from "fs";
import { runin } from "@ipare/testing";

await runin("./test", () => {
  expect(existsSync("./file.txt")).toBeTruthy();
});
```
