# 单元测试 `(@halsp/testing)`

安装 `@halsp/testing` 以添加单元测试功能

`@halsp/testing` 内建了对多种运行环境的单元测试支持

## Startup

增加了以下功能

- `setContext` 函数，用于设置测试的请求 `Context` 或 `Request`
- `keepThrow` 函数，调用之后，中间件如果抛出未处理错误，那么框架将不处理这个错误（默认 halsp 会处理错误，并修改状态码为 500）
- `test` 函数，开始根据请求执行已添加中间件
- `expect` 函数，用于测试断言
- `expectError` 函数，用于断言错误

```TS
import { Startup } from "@halsp/core";
import "@halsp/testing";

new Startup()
  .use(async (ctx, next) => {
    ctx.setBody("test");
    await next();
  })
  .expect((res) => {
    expect(res.body).toBe("test");
  })
  .test();
```

设置 Cotnext 并且把未处理的错误抛出

```TS
import { Startup } from "@halsp/core";
import "@halsp/testing";

it("should xxx", async () => {
  new Startup()
    .expect((res) => {
      expect(res.body).toBe("test");
    })
    .keepThrow()
    .setContext(new Context())
    .use(() => {
      ctx.setBody("test");
      await next();
    })
    .test();
});
```

断言有未处理错误

```TS
import { Startup } from "@halsp/core";
import "@halsp/testing";

it("should xxx", async () => {
  new Startup()
    .expectError((err) => {
      expect(err.message).toBe("err");
    })
    .keepThrow()
    .use(() => {
      throw new Error("err");
    })
    .test();
});
```

## Native

`@halsp/testing` 已内置对 `supertest` 的支持

需要单独安装 `supertest`

```sh
npm install supertest -D
```

调用 `startup.nativeTest()` 会返回 `supertest` 实例

```TS
import { Startup } from "@halsp/core";
import "@halsp/native";
import "@halsp/testing";

it("should xxx", async () => {
  new Startup()
    .useNative()
    .keepThrow()
    .use((ctx) => {
      ctx.ok({
        method: ctx.req.method,
        path: ctx.req.path,
      });
    })
    .nativeTest()
    .get("/url")
    .expect(200, {
      method: "GET",
      path: "url",
    });
});
```

:::warning
`startup.setContext` 不支持 `native`
:::

## Response

Response 新增 `expect` 函数，用于断言请求结果

有下面几种使用方式

```TS
    expect(status: number): this;
    expect(status: number, body: any): this;
    expect(checker: (res: Response) => void): this;
    expect(body: any): this;
```

如

```TS
import "@halsp/testing";
import "@halsp/http";
import { Startup } from "@halsp/core";

new Startup()
  .useHttp()
  .use(async (ctx, next) => {
    ctx.ok("body-ok");
    await next();
  })
  .expect((res) =>
    res
      .expect(200)
      .expect(200, "body-ok")
      .expect("body-ok")
      .expect((res) => {
        expect(res.status).toBe(200);
      })
  );
```

## 中间件

Startup 新增函数 `expectMiddleware`，用于中间件的单元测试

注意，使用前需要先导入 `@halsp/testing`

```TS
import "@halsp/testing";
import "@halsp/http";
import { Middleware, Startup } from "@halsp/core";

class TestMiddleware extends Middleware {
  fn() {
    return 1;
  }

  invoke(): void | Promise<void> {
    this.ok();
  }
}

new Startup()
  .useHttp()
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

Startup 新增函数 `expectInject`，用于依赖注入服务的单元测试

安装了 `@halsp/inject` 的项目才能使用这个功能

```sh
npm install @halsp/inject
```

注意，使用前需要先导入 `@halsp/testing`

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
import "@halsp/testing";
import { Startup } from "@halsp/core";

new Startup()
  .useInject();
  .expectInject(TestService, (service) => {
    expect(service.fn()).toBe(1);
  });
```

```TS
import "@halsp/testing";
import { Startup } from "@halsp/core";

new Startup()
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
import { runin } from "@halsp/testing";

await runin("./test", () => {
  expect(existsSync("./file.txt")).toBeTruthy();
});
```
