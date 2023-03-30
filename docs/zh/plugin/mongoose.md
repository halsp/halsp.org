# MongoDB `(@halsp/mongoose)`

添加 `@halsp/mongoose` 插件以连接使用 MongoDB

`@halsp/mongoose` 的功能基于 [mongoose](https://github.com/Automattic/mongoose)，使用 `@halsp/mongoose` 可以简化数据库的管理

更多数据库操作请参考 [mongoose](https://github.com/Automattic/mongoose)

## 安装

```sh
npm install @halsp/mongoose
```

## 快速开始

在 `startup.ts` 中

```TS
import '@halsp/mongoose';

startup.useMongoose({
  url: "mongodb://test"
})
```

在中间件或服务通过依赖注入获取数据库连接实例 `MongooseConnection`

```TS
import { Middleware } from "@halsp/common";
import { MongooseConnection, MongooseInject } from "@halsp/mongoose";

class TestMiddleware extends Middleware {
  @MongooseInject()
  private readonly connection!: MongooseConnection;

  async invoke(): Promise<void> {
    const MyModel = this.connection.model("ModelName");
    const instance = new MyModel();
    instance.my.key = "hello";
    await instance.save();
    this.ok(instance.toObject());
  }
}
```

## 多数据库连接

`@halsp/mongoose` 支持多数据库连接，只需调用多次 `useMongoose` ，并传参 `identity` 用于区分

```TS
import "@halsp/mongoose";

startup
  .useMongoose({
    identity: "db1",
    url: "mongodb://test",
    // ...
  })
  .useMongoose({
    identity: "db2",
    url: "mongodb://127.0.0.1",
    // ...
  });
```

在中间件或服务中，给装饰器 `@MongooseInject()` 传参以区分连接

```TS
import { Middleware } from '@halsp/common';
import { MongooseConnection, MongooseInject } from "@halsp/mongoose";

class TestMiddleware extends Middleware {
  @MongooseInject("db1")
  private readonly connection1!: MongooseConnection;
  @MongooseInject("db2")
  private readonly connection2!: MongooseConnection;

  async invoke(): Promise<void> {
    const MyModel1 = this.connection1.model("ModelName1");
    const MyModel2 = this.connection2.model("ModelName2");
    await this.next();
  }
}
```

:::warning 注意
只有在 `useMongoose` 之后的中间件，才能获取到数据库连接实例
:::

## 获取实例

你可以通过依赖注入的方式获取实例，也可以用 `ctx.getMongoose` 获取实例

### 依赖注入

用 `@MongooseInject` 装饰属性或构造函数参数，通过 `@halsp/inject` 依赖注入创建实例

```TS
import { Middleware } from "@halsp/common";
import { MongooseConnection, MongooseInject } from "@halsp/mongoose";

@Inject
class TestMiddleware extends Middleware {
  constructor(
    @MongooseInject private readonly connection: MongooseConnection,
    @MongooseInject("id2") private readonly connection2: MongooseConnection
  ) {}

  @MongooseInject("id1")
  private readonly connection1!: MongooseConnection;

  async invoke(): Promise<void> {
    await this.next();
  }
}
```

### `ctx.getMongoose`

使用 `ctx.getMongoose` 的方式更灵活，但代码易读性不如使用依赖注入

```TS
import "@halsp/mongoose";

startup.use(async (ctx, next) => {
  const connection1 = await ctx.getMongoose("id1");
  const connection2 = await ctx.getMongoose("id2");
  const connection = await ctx.getMongoose();
});
```

## 生命周期与作用域

### 作用域

通过 `startup.useMongoose` 函数传参 `injectType` 以修改该实例作用域

参考 <https://halsp.org/usage/inject.html#%E4%BD%9C%E7%94%A8%E5%9F%9F>

```TS
import '@halsp/mongoose';

startup
  .useMongoose({
    url: "mongodb://127.0.0.1",
    injectType: InjectType.Singleton
  })
```

### 生命周期

数据库连接实例通过依赖注入 `@halsp/inject` 创建，因此其生命周期符合 `@halsp/inject` 规则

参考 <http://halsp.org/usage/inject.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F>

销毁的行为是在 `startup.useInject` 中间件的返回管道中触发，伪代码逻辑如

```TS
await initInject(); // 初始化依赖注入
await initializeMongoose(); // 初始化 MongoDB
await next(); // 执行下个中间件
await dispose(); // 销毁
```
