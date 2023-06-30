# Knex `(@halsp/knex)`

添加 `@halsp/knex` 插件以使用 Knex

`@halsp/knex` 的功能基于 [Knex](https://github.com/knex/knex)，使用 `@halsp/knex` 可以简化集成和连接操作

## 安装

```sh
npm install @halsp/knex
```

## 快速开始

在入口文件中

```TS
import '@halsp/knex';

startup.useKnex({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'your_database_user',
    password : 'your_database_password',
    database : 'myapp_test'
  }
})
```

在中间件或服务中，通过依赖注入获取 Knex 连接实例

```TS
import { Middleware } from "@halsp/core";
import { Knex } from "@halsp/knex";

class TestMiddleware extends Middleware {
  @Knex
  private readonly connection!: Knex;

  async invoke(): Promise<void> {
    await connection.table("test").insert({
      name: "t1",
    });
    const result = await connection.table(tableName).select("*");

    this.ok(result);
  }
}
```

## 创建多个数据库连接

`@halsp/knex` 支持多个 Knex 连接，只需调用多次 `useKnex` ，并传参 `identity` 用于区分

```TS
import "@halsp/knex";

startup
  .useKnex({
    identity: "db1",
    client: "sqlite3",
    connection: {
      filename: "./test1.db",
    },
    // ...
  })
  .useKnex({
    identity: "db2",
    client: "sqlite3",
    connection: {
      filename: "./test2.db",
    },
    // ...
  });
```

在中间件或服务中，给装饰器 `@Knex()` 传参字符串以区分连接

```TS
import { Middleware } from "@halsp/core";
import { Knex } from "@halsp/knex";

class TestMiddleware extends Middleware {
  @Knex("db1")
  private readonly knexClient1!: Knex;
  @Knex("db2")
  private readonly knexClient2!: Knex;

  async invoke(): Promise<void> {
    await knexClient1.table("table1").select("*");
    await knexClient2.table("table2").select("*");
    await this.next();
  }
}
```

:::warning 注意
只有在 `useKnex` 之后的中间件，才能获取到 Knex 连接实例
:::

## 获取实例

你可以通过依赖注入的方式获取实例，也可以用 `ctx.getKnex` 获取实例

### 依赖注入

用 `@Knex` 装饰属性或构造函数参数，通过 `@halsp/inject` 依赖注入创建实例

```TS
import { Middleware } from "@halsp/core";
import { Knex } from "@halsp/knex";

@Inject
class TestMiddleware extends Middleware {
  constructor(
    @Knex private readonly connection: Knex,
    @Knex("id2") private readonly connection2: Knex
  ) {}

  @Knex("id1")
  private readonly connection1!: Knex;

  async invoke(): Promise<void> {
    await this.next();
  }
}
```

:::tip
`Knex` 既可以作为装饰器，也可以作为 knex 在 `TypeScript` 中的连接实例类型
:::

### `ctx.getKnex`

使用 `ctx.getKnex` 的方式更灵活，但代码易读性不如使用依赖注入

```TS
import "@halsp/knex";

startup.use(async (ctx, next) => {
  const connection1 = await ctx.getKnex("id1");
  const connection2 = await ctx.getKnex("id2");
  const connection = await ctx.getKnex();
});
```

## 生命周期与作用域

### 作用域

通过 `startup.useKnex` 函数传参 `injectType` 以修改该实例作用域

参考 <https://halsp.org/usage/inject.html#%E4%BD%9C%E7%94%A8%E5%9F%9F>

```TS
import '@halsp/knex';

startup
  .useKnex({
    injectType: InjectType.Singleton,
    client: "sqlite3",
    connection: {
      filename: "./test.db",
    },
  })
```

### 生命周期

Knex 连接实例通过依赖注入 `@halsp/inject` 创建，因此其生命周期符合 `@halsp/inject` 规则

参考 <http://halsp.org/usage/inject.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F>

销毁的行为是在 `startup.useInject` 中间件的返回管道中触发，伪代码逻辑如

```TS
await initInject(); // 初始化依赖注入
await initializeKnex(); // 初始化 Knex 连接
await next(); // 执行下个中间件
await dispose(); // 销毁
```
