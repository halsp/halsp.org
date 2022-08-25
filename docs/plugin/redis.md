# Redis `(@ipare/redis)`

添加 `@ipare/redis` 插件以使用 Redis

`@ipare/redis` 的功能基于 [Redis](https://github.com/redis/node-redis)，使用 `@ipare/redis` 可以简化 Redis 的管理

## 安装

```sh
npm install @ipare/redis
```

## 快速开始

在 `startup.ts` 中

```TS
import '@ipare/redis';

startup.useRedis({
  url: "redis://test",
})
```

在中间件或服务通过依赖注入获取 Redis 连接实例

```TS
import { Middleware } from "@ipare/core";
import { redis, RedisClient } from "@ipare/redis";

class TestMiddleware extends Middleware {
  @RedisClient()
  private readonly redisClient!: RedisConnection;

  async invoke(): Promise<void> {
    await redisClient.set("key", "value");
    const value = redisClient.get("key");

    this.ok({ value });
  }
}
```

## 连接多个 Redis

`@ipare/redis` 支持多个 Redis 连接，只需调用多次 `useRedis` ，并传参 `identity` 用于区分

```TS
import "@ipare/redis";

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

在中间件或服务中，给装饰器 `@RedisClient()` 传参字符串以区分连接

```TS
import { Middleware } from "@ipare/core";
import { RedisConnection, RedisClient } from "@ipare/redis";

class TestMiddleware extends Middleware {
  @RedisClient("db1")
  private readonly redisClient1!: RedisConnection;
  @RedisClient("db2")
  private readonly redisClient2!: RedisConnection;

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

用 `@RedisClient` 装饰属性或构造函数参数，通过 `@ipare/inject` 依赖注入创建实例

```TS
import { Middleware } from "@ipare/core";
import { RedisConnection, RedisClient } from "@ipare/redis";

@Inject
class TestMiddleware extends Middleware {
  constructor(
    @RedisClient private readonly connection: RedisConnection,
    @RedisClient("id2") private readonly connection2: RedisConnection
  ) {}

  @RedisClient("id1")
  private readonly connection1!: RedisConnection;

  async invoke(): Promise<void> {
    await this.next();
  }
}
```

### `ctx.getRedis`

使用 `ctx.getRedis` 的方式更灵活，但代码易读性不如使用依赖注入

```TS
import "@ipare/redis";

startup.use(async (ctx, next) => {
  const connection1 = await ctx.getRedis("id1");
  const connection2 = await ctx.getRedis("id2");
  const connection = await ctx.getRedis();
});
```

## 生命周期与作用域

### 作用域

通过 `startup.useRedis` 函数传参 `injectType` 以修改该实例作用域

参考 <https://ipare.org/usage/inject.html#%E4%BD%9C%E7%94%A8%E5%9F%9F>

```TS
import '@ipare/redis';

startup
  .useRedis({
    url: "redis://redis1",
    injectType: InjectType.Singleton
  })
```

### 生命周期

Redis 连接实例通过依赖注入 `@ipare/inject` 创建，因此其生命周期符合 `@ipare/inject` 规则

参考 <http://ipare.org/usage/inject.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F>

销毁的行为是在 `startup.useInject` 中间件的返回管道中触发，伪代码逻辑如

```TS
await initInject(); // 初始化依赖注入
await initializeRedis(); // 初始化 Redis 连接
await next(); // 执行下个中间件
await dispose(); // 销毁
```
