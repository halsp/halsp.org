# 路由 `(@ipare/router)`

添加 `@ipare/router` 以支持路由功能

- 支持 HTTP RESTful
- 支持微服务路由
- 根据文件系统映射访问路径，彻底解耦无关联功能
- 按需加载，提升请求速度
- 轻量化，高可扩展性
- 移除 controller 层，灵活性更高

## 安装

```sh
npm install @ipare/router
```

## 开始使用

在 `startup.ts` 中添加 `startup.useRouter`

```TS
import "@ipare/router";
startup.useRouter()
```

在 `src/actions` 下创建 `test.get.ts` 文件和 `Action` 派生类

```TS
import { Action } from "@ipare/router";

export default class extends Action{
  invoke(){
    this.ok();
  }
}
```

访问 `GET /test` 即可触发该 `Action` 中间件

:::tip
`startup.useRouter` 实际上可能会注册多个中间件
:::

## 路由文件夹

路由文件夹默认为 `src/actions`

当然你也可以指定其他文件夹，需配置 `ipare-cli.config.ts`，增加 `routerActionsDir` ，如

```ts
import { defineConfig, Configuration } from "@ipare/cli";
import "@ipare/router/dist/cli-config";

export default defineConfig(() => {
  return {
    routerActionsDir: "custom-actions",
  };
});
```

配置后，`@ipare/cli` 编译时才能正确发现路由

## 配置参数

`startup.useRouter` 接收可选参数 `RouterOptions`，包含以下字段

- prefix: 路由前缀，比如统一添加 `/api` 或 `/v3` 前缀
- customMethods: 如果内置请求方法不满足需求，可以自定义请求方法，如 ['custom-get','custom-method']

## 路由匹配

路由匹配有两种方式

1. 请求路径与文件系统路径匹配，通过后缀设置请求方法
2. 通过装饰器指定请求路径和请求方法

在一个项目中，两种方式可以混用，但装饰器的优先级更高

:::warning
微服务项目只能使用装饰器的方式来匹配路由
:::

### 用文件系统匹配路由

普通路径与文件系统路径完全相同

作为路由查询参数的文件或文件夹，命名要以 `^` 开头

`action` 文件应以 `.post.ts`、`.get.ts`、`.get.delete.put .ts` 等结尾（或其他自定义请求方法）

如果没有请求方法后缀，任意 `httpMethod` 都可以请求，与 `.any.ts` 效果相同

#### 例 1

获取 todo list

##### 指定 HttpMethod（建议）

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

##### 任意请求方法

目录结构如下：

```
+-- actions
|   +-- todo
|       +-- getTodoList.ts
```

访问地址为 `GET /todo/getTodoList` 、 `POST /todo/getTodoList` 、 `PUT /todo/getTodoList` 等等，效果相同。

#### 例 2

获取单个 todo item

##### 指定 HttpMethod（建议）

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

##### 任意请求方法

目录结构如下：

```
+-- actions
|   +-- todo
|       +-- getTodoItem.ts
```

访问地址为 `GET(POST 等) /todo/getTodoItem`，需要在 `body` 、 `header` 或 `query` 传入 `todoId` 参数

### 用装饰器匹配路由

通过装饰器指定请求路径和请求方法

和文件系统匹配相比，有更强的灵活性，但需要写更多代码，需要支持装饰器功能

#### 装饰器

提供以下装饰器用于指定 `Action` 的请求方法和请求路径

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

#### 使用方式

同时指定请求方法和路径

```TS
import { HttpGet } from '@ipare/router';

@HttpGet("test/^id")
export default class extends Action {
  async invoke(): Promise<void> {
    this.ok("method");
  }
}
```

只指定请求方法，路径按文件系统匹配

```TS
import { HttpGet } from '@ipare/router';

@HttpGet
export default class extends Action {
  async invoke(): Promise<void> {
    this.ok("method");
  }
}
```

#### 自定义请求方法

使用 `@HttpCustom(method, url)` 支持自定义请求方法

接收两个参数

1. 请求方法
2. 请求路径，如果不传次参数将按文件系统匹配

## Action

`Action` 也是中间件，该类继承中间件类 `Middleware`，但 `Action` 中间件会在 `useRouter` 中自动注册，无需手动注册

如果有特殊需求，正常情况 Action 会作为最终中间件，不应调用 `this.next()`

每次收到请求，主要执行的是自定义 `Action` 类实例对象中的 `invoke` 函数

所有自定义 `Action` 都应派生自 `Action` 类，并重写 `invoke` 函数

### 创建一个 Action

根据下面步骤创建一个常规 Action

#### 创建路由文件夹

创建文件夹 `src/actions`，用于存放所有 `Action`

路由文件夹也可以是其他路径，但需要修改配置，参考前面 [路由文件夹](#路由文件夹) 部分

#### 创建 action 文件

根据各业务，创建文件夹和 `.ts` 文件，名称自定，但名称和路径会映射为访问路径，每个文件对应一个 `action`

命名格式为 `<actionName>.<httpMethod>.ts` ，其中 `httpMethod` 可以多个，如 `user.get.ts`、`user.delete.put.ts`。

`<actionName>` 可以是划线 `_`，即取自父级文件夹名称，如 `/user/_.get.post.ts` 与 `/user.get.post.ts` 相同

如果命名没有 `<httpMethod>` 部分，则任意方法都能访问，与 `.any.ts` 作用相同，如 `user.ts` 等同于 `user.any.ts`

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

在 action 文件 (`.ts`) 中创建继承 `Action` 的类，并重写 `invoke` 函数

```TS
import { Action } from "@ipare/router";

export default class extends Action {
  async invoke() {
    this.ok({
      result: 'success'
    });
  }
}
```

## Request.params

`Request.params` 是 RESTful 路径中的参数，如

- 路由/文件地址：`/user/^userId/todo/^todoId.get.ts`
- 访问路径：`/user/66/todo/88`

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

startup
  .use(async (ctx, next)=>{
    const role = ctx.actionMetadata.role; // admin
    await next();
  })
  .useRouter();
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

:::warning
元数据会被转为 json，因此元数据的值不能是函数等内容，因为其不能被解析为 json
:::

## 编译

使用 `@ipare/cli` 的编译命令 `ipare build` 时，`@ipare/router` 会扫描路由文件夹并创建映射表

用于快速匹配路由，提升程序启动速度，serverless 项目通过编译路由表，能极大的提升启动速度和响应速度

### 编译结果

编译会在目标文件夹下生成 `.ipare-cache/ipare-router.config` 文件

该文件记录了 `@ipare/router` 的配置和路由表，请不要手动修改

### 发布

发布时需要将 `ipare-router.config` 一同发布，否则程序首次启动会自动重新创建映射表

如果没有 `ipare-router.config` 文件，对于原生服务 `@ipare/native` 影响不是很大

但 serverless 项目可能每次请求都会启动一个新程序，即重新创建映射表，将失去编译路由表的优势
