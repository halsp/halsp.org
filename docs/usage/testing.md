# 单元测试 `(@ipare/testing)`

安装 `@ipare/testing` 以添加单元测试

`@ipare/testing` 内建了对 `jest` 的支持

## Startup

`@ipare/testing` 提供了两种 `Startup` 用于单元测试

1. `TestStartup`
2. `TestHttpStartup`

### TestStartup

用于运行环境无关的单元测试

增加了以下功能

- `setRequest` 函数，用于设置请求 `Request`
- `skipThrow` 函数，调用之后，中间件会抛出未处理错误（默认 ipare 会处理错误，并修改状态码为 500）
- `run` 函数，开始根据请求执行已添加中间件
- `it` 函数，用于测试断言

```TS
import { TestStartup } from "@ipare/testing";

new TestStartup()
  .use(async (ctx, next) => {
    ctx.ok();
    await next();
  })
  .it("should expect", (res) => {
    res.expect(200);
  });
```

```TS
import { TestStartup } from "@ipare/testing";

new TestStartup()
  .skipThrow()
  .setRequest(new Request())
  .use(() => {
    throw new Error("err");
  })
  .it("status shound be 500 if skip throw error", (res) => {
    res.expect(500, {
      status: 500,
      message: "err",
    });
  });
```

### TestHttpStartup

用于模仿 http 运行环境

基于 [supertest](https://github.com/visionmedia/supertest)

`create` 函数会返回 `supertest` 的 `Test` 对象

```TS
import { TestHttpStartup } from "@ipare/testing";

await new TestHttpStartup()
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

## Response

Response 新增 `expect` 函数，用于断言请求结果

注意，使用前需要先导入 `@ipare/testing`

```TS
import "@ipare/testing";
import { TestStartup } from "@ipare/testing";

new TestStartup()
  .use(async (ctx, next) => {
    ctx.ok("body-ok");
    await next();
  })
  .it("should expect", (res) => {
    res.expect(200);
    res.expect(200, "body-ok");
    res.expect("body-ok");
    res.expect((res) => {
      expect(res.status).toBe(200);
    });
  });
```

## 中间件

Startup 及其派生类新增函数 `expectMiddleware`，用于中间件的单元测试

注意，使用前需要先导入 `@ipare/testing`

```TS
import "@ipare/testing";
import { TestStartup } from "@ipare/testing";
import { Middleware } from "@ipare/core";

class TestMiddleware extends Middleware {
  fn() {
    return 1;
  }

  invoke(): void | Promise<void> {
    this.ok();
  }
}

new TestStartup()
  .expectMiddleware(TestMiddleware, (md) => {
    expect(md.fn()).toBe(1);
  })
  .add(TestMiddleware)
  .it("should expect middleware");
```

## 服务

Startup 及其派生类新增函数 `expectInject`，用于依赖注入服务的单元测试

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
  })
  .it("should create service by @ipare/inject");
```

```TS
import "@ipare/testing";
import { TestStartup } from "@ipare/testing";

new TestStartup()
  .useInject();
  .inject(TestService, InjectType.Singleton)
  .expectInject(TestService, (service) => {
    expect(service.fn()).toBe(1);
  })
  .it("should create service by @ipare/inject");
```

## runin

用于改变运行位置，即 `process.cwd()` 的值

```TS
import { existsSync } from "fs";
import { runin } from "@ipare/testing";

await runin("./test", () => {
  expect(existsSync("./file.txt")).toBeTruthy();
});
```
