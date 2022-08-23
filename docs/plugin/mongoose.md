# MongoDB

添加 `@ipare/mongoose` 插件以连接使用 MongoDB

`@ipare/mongoose` 的功能基于 [mongoose](https://github.com/Automattic/mongoose)，使用 `@ipare/mongoose` 可以简化数据库的管理

更多数据库操作请参考 [mongoose](https://github.com/Automattic/mongoose)

## 安装

```sh
npm install @ipare/mongoose
```

## 快速开始

在 `startup.ts` 中

```TS
import '@ipare/mongoose';

startup.useMongoose({
  url: "mongodb://test"
})
```

在中间件或服务通过依赖注入获取数据库连接实例 `mongoose.Connection`

```TS
import { Middleware } from "@ipare/core";
import { mongoose, MongoConnection } from "@ipare/mongoose";

class TestMiddleware extends Middleware {
  @MongoConnection()
  private readonly connection!: mongoose.Connection;

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

`@ipare/mongoose` 支持多数据库连接，只需调用多次 `useMongoose` ，并传参 `identity` 用于区分

```TS
import "@ipare/mongoose";

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

在中间件或服务中，给装饰器 `@MongoConnection()` 传参以区分连接

```TS
import { Middleware } from '@ipare/core';
import { mongoose, MongoConnection } from "@ipare/mongoose";

class TestMiddleware extends Middleware {
  @MongoConnection("db1")
  private readonly connection1!: mongoose.Connection;
  @MongoConnection("db2")
  private readonly connection2!: mongoose.Connection;

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

## 生命周期与作用域

### 作用域

通过 `startup.useMongoose` 函数传参 `injectType` 以修改该实例作用域

参考 <https://ipare.org/usage/inject.html#%E4%BD%9C%E7%94%A8%E5%9F%9F>

```TS
import '@ipare/mongoose';

startup
  .useMongoose({
    url: "mongodb://127.0.0.1",
    injectType: InjectType.Singleton
  })
```

### 生命周期

数据库连接实例通过依赖注入 `@ipare/inject` 创建，因此其生命周期符合 `@ipare/inject` 规则

参考 <http://ipare.org/usage/inject.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F>

销毁的行为是在 `startup.useInject` 中间件的返回管道中触发，伪代码逻辑如

```TS
await initInject(); // 初始化依赖注入
await initializeMongoose(); // 初始化 MongoDB
await next(); // 执行下个中间件
await dispose(); // 销毁
```
