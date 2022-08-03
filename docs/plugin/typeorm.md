# TypeORM

添加 `@ipare/typeorm` 插件以使用流行 ORM 工具 [TypeORM](https://github.com/typeorm/typeorm)

`@ipare/typeorm` 的功能基于 [TypeORM](https://github.com/typeorm/typeorm)，使用 `@ipare/typeorm` 可以简化数据库的操作

## 安装

```sh
npm install @ipare/typeorm
```

## 快速开始

在 `startup.ts` 中

```TS
import '@ipare/typeorm';

// 此示例使用 sqlite，需要在项目中先安装 sqlite 驱动: npm install sqlite3
startup.useTypeorm({
  type: 'sqlite',
  database: './test.db'
})
```

在 `src/entities` 定义实体模型

```TS
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    age: number
}
```

在中间件或服务通过依赖注入获取数据库连接实例 `DataSource`

```TS
import { Middleware } from '@ipare/core';
import { typeorm, DataSource } from "@ipare/typeorm";

class TestMiddleware extends Middleware {
  @DataSource()
  private readonly dataSource!: typeorm.DataSource;

  async invoke(): Promise<void> {
    const userRepository = this.dataSource.getRepository(User);

    const user = new User();
    user.firstName = "Timber";
    user.lastName = "Saw";
    user.age = 25;
    await userRepository.save(user);

    const allUsers = await userRepository.find();
    const firstUser = await userRepository.findOneBy({
      id: 1,
    }); // find by id
    const timber = await userRepository.findOneBy({
      firstName: "Timber",
      lastName: "Saw",
    }); // find by firstName and lastName

    await userRepository.remove(timber);

    this.ok({
      firstUser,
      allUsers,
    });
  }
}
```

## 多数据库连接

`@ipare/typeorm` 支持多数据库连接，只需调用多次 `useTypeorm` ，并传参 `identity` 用于区分

```TS
import '@ipare/typeorm';

startup
  .useTypeorm({
    identity: "db1",
    type: 'sqlite',
    database: './test.db',
    // ...
  })
  .useTypeorm({
    identity: "db2",
    type: 'mysql',
    host: '127.0.0.1',
    // ...
  })
```

在中间件或服务中，给装饰器 `@DataSource()` 传参以区分连接

```TS
import { Middleware } from '@ipare/core';
import { typeorm, DataSource } from "@ipare/typeorm";

class TestMiddleware extends Middleware {
  @DataSource("db1")
  private readonly dataSource1!: typeorm.DataSource;
  @DataSource("db2")
  private readonly dataSource2!: typeorm.DataSource;

  async invoke(): Promise<void> {
    const userRepository1 = this.dataSource1.getRepository(User);
    const userRepository2 = this.dataSource2.getRepository(User);
    await this.next();
  }
}
```

:::warning 注意
只有在 `useTypeorm` 之后的中间件，才能获取到数据库连接实例
:::

## 生命周期

数据库连接实例通过依赖注入 `@ipare/inject` 创建，因此其生命周期与作用域均符合 `@ipare/inject` 规则

### 作用域

数据库连接实例有以下三种作用域:

- Singleton: 单例
- Scoped: 单次请求作用域
- Transient: 临时

默认作用域是 `Scoped`

通过 `startup.useTypeorm` 函数传参 `injectType` 以决定该实例作用域

```TS
import '@ipare/typeorm';

startup
  .useTypeorm({
    type: 'sqlite',
    database: './test.db',
    injectType: InjectType.Singleton
  })
```

### 何时创建实例？

根据 `@ipare/inject` 规则，数据库实例是按需创建的

- 使用了数据库实例的中间件或服务，如果被创建，那么数据库实例也会被创建
- 如果作用域是 `Transient`，将每次使用都会创建数据库连接

### 实例的销毁

`Scoped` 和 `Transient` 作用域的实例会在请求单次结束后自动销毁，因此一般情况无需手动销毁

`Singleton` 作用域的实例不会被 `@ipare/typeorm` 销毁

销毁的行为是在 `startup.useTypeorm` 中间件的返回管道中触发，逻辑如

```TS
await initialize(); // 初始化
await next(); // 执行下个中间件
await destroy(); // 销毁
```

## 数据库驱动

参考 <https://github.com/typeorm/typeorm>

`@ipare/typeorm` 没有内置数据库驱动

因此需要配合安装数据库驱动，以支持对应数据库

- MySQL 或 MariaDB

```sh
npm install mysql --save
```

或

```sh
npm install mysql2 --save
```

- PostgreSQL 或 CockroachDB

```sh
npm install pg --save
```

- SQLite

```sh
npm install sqlite3 --save
```

- Microsoft SQL Server

```sh
npm install mssql --save
```

- sql.js

```sh
npm install sql.js --save
```

- Oracle

```sh
npm install oracledb --save
```

To make the Oracle driver work, you need to follow the installation instructions from their site.

- SAP Hana

```sh
npm install @sap/hana-client
npm install hdb-pool
```

SAP Hana support made possible by the sponsorship of Neptune Software.

- Google Cloud Spanner

```sh
npm install @google-cloud/spanner --save
```

## 数据库实体模型

项目中应该包含 `src/entities` 目录，默认 `src/entities` 目录中的数据库实体模型会被自动加载

```
ipare-project
│── src
│   │── startup.ts
│   │── index.ts
│   └── entities
│       └── user.entity.ts
│       └── todo.entity.ts
│── package.json
└── tsconfig.json
```

你也可以指定实体模型为其他

```TS
startup.useTypeorm({
  entities: [UserEntity, TodoEntity]
})
```

或

```TS
startup.useTypeorm({
  entities: ['entities/**/*.ts']
})
```

:::warning 注意
默认会将 `src` 目录下的 `.ts` 文件编译到 `dist` 目录，因此配置路径时要使用 `entities` 而不是 `src/entities`

具体根据不同项目决定路径
:::
