# Redis `(@halsp/redis)`

添加 `@halsp/redis` 插件以使用 Redis

`@halsp/redis` 的功能基于 [Redis](https://github.com/redis/node-redis)，使用 `@halsp/redis` 可以简化 Redis 的管理

## 安装

```sh
npm install @halsp/redis
```

## 快速开始

在入口文件中

```TS
import '@halsp/redis';

startup.useRedis({
  url: "redis://test",
})
```

在中间件或服务中，通过依赖注入获取 Redis 连接实例

```TS
import { Middleware } from "@halsp/core";
import { Redis } from "@halsp/redis";

class TestMiddleware extends Middleware {
  @Redis()
  private readonly redisClient!: Redis;

  async invoke(): Promise<void> {
    await redisClient.set("key", "value");
    const value = redisClient.get("key");

    this.ok({ value });
  }
}
```

## 连接多个 Redis

`@halsp/redis` 支持多个 Redis 连接，只需调用多次 `useRedis` ，并传参 `identity` 用于区分

```TS
import "@halsp/redis";

startup
  .useRedis({
    identity: "db1",
    url: "redis://redis1",
    // ...
  })
  .useRedis({
    identity: "db2",
    url: "redis://redis2",
    // ...
  });
```

在中间件或服务中，给装饰器 `@Redis()` 传参字符串以区分连接

```TS
import { Middleware } from "@halsp/core";
import { Redis } from "@halsp/redis";

class TestMiddleware extends Middleware {
  @Redis("db1")
  private readonly redisClient1!: Redis;
  @Redis("db2")
  private readonly redisClient2!: Redis;

  async invoke(): Promise<void> {
    this.redisClient1.set("key1", "value1");
    this.redisClient2.set("key2", "value2");
    await this.next();
  }
}
```

:::warning 注意
只有在 `useRedis` 之后的中间件，才能获取到 Redis 连接实例
:::

## 获取实例

你可以通过依赖注入的方式获取实例，也可以用 `ctx.getRedis` 获取实例

### 依赖注入

用 `@Redis` 装饰属性或构造函数参数，通过 `@halsp/inject` 依赖注入创建实例

```TS
import { Middleware } from "@halsp/core";
import { Redis } from "@halsp/redis";

@Inject
class TestMiddleware extends Middleware {
  constructor(
    @Redis private readonly connection: Redis,
    @Redis("id2") private readonly connection2: Redis
  ) {}

  @Redis("id1")
  private readonly connection1!: Redis;

  async invoke(): Promise<void> {
    await this.next();
  }
}
```

:::tip
`Redis` 既可以作为装饰器，也可以作为 redis 在 `TypeScript` 中的连接实例类型
:::

### `ctx.getRedis`

使用 `ctx.getRedis` 的方式更灵活，但代码易读性不如使用依赖注入

```TS
import "@halsp/redis";

startup.use(async (ctx, next) => {
  const connection1 = await ctx.getRedis("id1");
  const connection2 = await ctx.getRedis("id2");
  const connection = await ctx.getRedis();
});
```

## 生命周期与作用域

### 作用域

通过 `startup.useRedis` 函数传参 `injectType` 以修改该实例作用域

参考 <https://halsp.org/usage/inject.html#%E4%BD%9C%E7%94%A8%E5%9F%9F>

```TS
import '@halsp/redis';

startup
  .useRedis({
    url: "redis://redis1",
    injectType: InjectType.Singleton
  })
```

### 生命周期

Redis 连接实例通过依赖注入 `@halsp/inject` 创建，因此其生命周期符合 `@halsp/inject` 规则

参考 <http://halsp.org/usage/inject.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F>

销毁的行为是在 `startup.useInject` 中间件的返回管道中触发，伪代码逻辑如

```TS
await initInject(); // 初始化依赖注入
await initializeRedis(); // 初始化 Redis 连接
await next(); // 执行下个中间件
await dispose(); // 销毁
```
