# 路由

<p align="center" class="tags">
    <a href="https://github.com/ipare/router/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="GitHub license" /></a>
    <a href=""><img src="https://img.shields.io/npm/v/@ipare/router.svg" alt="npm version"></a>
    <a href=""><img src="https://badgen.net/npm/dt/@ipare/router" alt="npm downloads"></a>
    <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/@ipare/router.svg" alt="node compatibility"></a>
    <a href="#"><img src="https://github.com/ipare/router/actions/workflows/test.yml/badge.svg?branch=main" alt="Build Status"></a>
    <a href="https://codecov.io/gh/ipare/router/branch/main"><img src="https://img.shields.io/codecov/c/github/ipare/router/main.svg" alt="Test Coverage"></a>
    <a href="https://github.com/ipare/router/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"></a>
    <a href="https://gitpod.io/#https://github.com/ipare/router"><img src="https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod" alt="Gitpod Ready-to-Code"></a>
    <a href="https://paypal.me/ihalwang" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
</p>

安装 `@ipare/router` 以支持路由功能

`@ipare/router` 有以下特点

- 支持 RESTful 规范
- 根据文件系统映射访问路径，彻底解耦无关联功能
- 按需加载，提升请求速度
- 轻量化，高可扩展性
- 移除 controller 层，灵活性更高

## 安装

npm i @ipare/router

## 简单使用

```TS
startup.useRouter()
```

```TS
import { TestStartup } from "@ipare/core";
import "@ipare/router";
const res = await new TestStartup()
  .useRouter()
  .run();
```

## 约定

路由文件夹默认为 `src/actions`

当然你也可以指定其他文件夹，需配置 `ipare-cli.config.ts`，增加 `routerActionsDir` ，如

```ts
import { defineConfig, Configuration } from "@ipare/cli";
export default defineConfig(({ mode }) => {
  return {
    routerActionsDir: "custom-actions",
  } as Configuration;
});
```

## 编译

使用 `@ipare/cli` 的编译命令 `ipare build` 时，`@ipare/router` 会扫描路由文件夹并创建映射表

用于快速匹配路由，增加程序启动速度

### 编译结果

将会在目标文件夹下或缓存文件夹 `.ipare-cache` 生成 `ipare-router.config` 文件

## 注册（useRouter）

注册路由中间件 `startup.useRouter` 以支持路由功能

```TS
import "@ipare/router";
const res = await new TestStartup().useRouter().run();
```

或

```TS
import "@ipare/router";
const res = await new OtherStartup().useRouter().run();
```

> `useRouter` 实际上可能会注册多个中间件

## 配置参数

`startup.useRouter` 接收可选参数 `RouterOptions`：

- dir: 路由文件夹，若设置该参数，在运行阶段（编译时不起作用），将覆盖 `ipare-cli.config.ts` 中的 `routerActionsDir`
- prefix: 路由前缀
- customMethods: 自定义请求方法数组，如 ['custom-get','custom-post']

## 路由匹配

在`@ipare/router`中，路由与文件系统匹配。

路由查询参数命名以 `^` 开头（文件系统中命名不允许出现字符 `:`），如果存在多个查询参数则后面的会覆盖前面的，如 `GET user/^id/todo/^id`，则 `id` 值为 `todoId`。正确命名应如 `user/^userId/todo/^todoId`。

如果限制 `httpMethod`, `action` 应以 `.post.ts`、`.get.ts`、`.get.delete.ts` 等结尾（或其他自定义 method，扩展名为.js 效果相同 ），否则任意 `httpMethod` 都可以访问，与 `.any.ts` 效果相同

#### 例 1

获取 todo list

##### 方式 1（建议）

目录结构如下：

```
+-- actions
|   +-- todo
|       +-- _.get.ts
```

或

```
+-- actions
|   +-- todo.get.ts
```

访问地址为 `GET /todo`，

##### 方式 2

目录结构如下：

```
+-- actions
|   +-- todo
|       +-- getTodoList.ts
```

访问地址为 `GET /todo/getTodoList` 、 `POST /todo/getTodoList` 、 `PUT /todo/getTodoList` 等等，效果相同。

#### 例 2

获取单个 todo item

##### 方式 1（建议）

目录结构如下：

```
+-- actions
|   +-- todo
|       +-- ^id
|           +-- _.get.ts
```

或

```
+-- actions
|   +-- todo
|       +-- ^id.get.ts
```

访问地址为 `GET /todo/66`

##### 方式 2

目录结构如下：

```
+-- actions
|   +-- todo
|       +-- getTodoItem.ts
```

访问地址为 `GET(POST 等) /todo/getTodoItem`，需要在 `body` 、 `header` 或 `query` 传入 `todoId` 参数

#### 示例建议

上述两个示例都给了两种定义方式，建议使用方式 1 更符合规范，易读性也更好。

## Action

`Action` 也是中间件，该类继承于中间件类 `Middleware`，但 `Action` 中间件会在 `userRouter` 中自动注册，你无需手动注册

正常情况 Action 会终止管道继续向后执行，不会执行 `next`，除非有其他特殊需求

每次调用 API，如果顺利进行，主要执行的是自定义 `Action` 类实例对象中的 `invoke` 函数

所有自定义 `Action` 都应派生自 `Action` 类，并重写 `invoke` 函数

### 创建一个 Action

#### 创建路由文件夹

在项目下任意位置创建一个任意命名的文件夹（如果不存在）

建议在与 `index.ts` / `index.js` 同级目录下， 创建名为 `actions` 的文件夹

#### 创建 action 文件

根据各业务，创建文件夹或 `.ts/.js` 文件，名称自定，但名称和路径会映射为访问路径，每个文件对应一个 `action`

命名格式为 `<actionName>.<httpMethod>.ts` ，其中 `httpMethod` 可以多个，如 `user.get.ts`、`user.delete.put.ts`。

`actionName` 为下划线 `_` 即取上个文件夹名称，如 `/user/_.get.post.ts` 与 `/user.get.post.ts` 相同

如果命名没有 `httpMethod` 部分，则任意方法都能访问，与 `ANY` 作用相同，如 `user.ts` 等同于 `user.any.ts`

```
+-- actions
|   +-- type1
|       +-- _.post.ts
|       +-- user.get.ts
|       +-- ...
|   +-- type2
|       +-- _.patch.ts
|       +-- user.delete.ts
|       +-- ^id
|           +-- _.put.ts
|           +-- ...
|   +-- type3.get.post.ts
```

#### 创建 action 类

在 action 文件 (`.ts/.js`) 中创建继承 `Action` 的类，并重写 `invoke` 函数

```JS
import { Action } from "@ipare/router";
export default class extends Action {
  async invoke() {
    this.ok({
      result: 'success'
    });
  }
}
```

### metadata

`Action` 有 `metadata` 字段，该字段内容将在编译阶段添加至路由信息

## params

`params` 内容是 RESTful 路径中的参数，如

- 访问路径：`/user/66/todo/88`
- action 文件路径：`/user/^userId/todo/^todoId.get.ts`

那么 `params` 值为

```JSON
{
  "userId": 66,
  "todoId": 88
}
```

`@ipare/router` 会在 `ctx.req` 中添加 `params` 属性

## 路由元数据

你可以通过装饰器 `@SetActionMetadata(key,value)` 装饰 Action，给 Action 添加元数据，添加的元数据可以在解析路由后获取

```TS
import { Action } from "@ipare/core"

@SetActionMetadata("roles", ["admin"])
export default class extends Action{}
```

```TS
import "@ipare/router";
import { TestStartup } from "@ipare/core"

const res = await new TestStartup()
  .use(async (ctx, next)=>{
    const role = ctx.actionMetadata.role; // admin
    await next();
  })
  .useRouter()
  .run();
```

也可以利用 `setActionMetadata` 创建自定义装饰器，更便捷的添加元数据

```TS
import { setActionMetadata } from "@ipare/router";

function Admin(target: any) {
  setActionMetadata(target, {
    role: 'admin',
  });
}
function Root(target: any) {
  setActionMetadata(target, {
    role: 'root',
  });
}
```

```TS
import { Action } from "@ipare/core"
@Admin
export default class extends Action{}
```

```TS
import { Action } from "@ipare/core"
@Root
export default class extends Action{}
```

也可以使用 `getActionMetadata` 获取元数据

```TS
import { Action } from "@ipare/core"
import { getActionMetadata } from "@ipare/router";

@Root
export default class extends Action{
  async invoke(){
    const metadata = getActionMetadata(this);
  }
}
```

## HttpMethod 装饰器

`@ipare/router` 提供以下装饰器用于指定 `Action` 的请求方法和请求路径

- HttpGet
- HttpPost
- HttpPatch
- HttpDelete
- HttpPut
- HttpHead
- HttpOptions
- HttpConnect
- HttpTrace
- HttpCustom

使用方式如

```TS
import { HttpGet } from '@ipare/router';

@HttpGet
export default class extends Action {
  async invoke(): Promise<void> {
    this.ok("method");
  }
}
```

或

```TS
import { HttpGet } from '@ipare/router';

@HttpGet("test/^id")
export default class extends Action {
  async invoke(): Promise<void> {
    this.ok("method");
  }
}
```
