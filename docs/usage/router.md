# 路由

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

## 构建

在 package.json 文件的 scripts 节点下添加

```JSON
"build": "sfra" // 等价于 sfra actions, actions 为路由文件夹路径
```

`sfra` 命令有个可选参数，默认值为 `actions`，是 action 所在目录

```JSON
{
  "scripts": {
    "build": "sfra"
  },
  "dependencies": {
    "@ipare/core": "^1.0.1",
    "@ipare/router": "^1.0.1"
  }
}
```

在根目录中（ts 项目为 src 目录）添加路由文件夹 `actions`，并编写 `action`，也可为其他，但需通过 `routerConfig.dir` 参数指定

构建时运行

```
npm run build
```

### 构建结果

- js 项目，将生成 `ipare-router.map` 文件，你可能需要将该文件添加至 `.gitignore` 中

- ts 项目，将按 `tsconfig.json` 中的 `compilerOptions/target` 生成目标文件，同时也会在目标文件夹下生成 `ipare-router.map` 文件

## 路由（useRouter）

如果你无需视图（view）层，注册路由中间件 `startup.useRouter` 仅支持路由功能，`startup.useRouter` 已包含此功能。

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

`startup.useRouter` 接收可选参数 `RouterConfig`：

- dir: 路由文件夹，`@ipare/router` 能够将路由文件夹下的所有 `Action` 映射为 `http` 访问路径。所有 API Action 统一放在这个文件夹中，在该目录中，建立各 `Action` 文件或文件夹。`Action` 文件是 API 的最小执行单元，详情后面 [Action](##Action) 部分有介绍
- prefix: 路由前缀

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

`@ipare/router` 会在 `ctx.req` 中添加 `params` 属性

在 `startup.useRouter` 之前或之后的中间件，都可以获取 `ctx.req.params`

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

## 关于 TS

如果你在 `tsconfig.json` 中设置了输出文件夹 `compilerOptions/outDir`，那么 `sfra` 命令参数中的路由文件夹是 `outDir` 下的相对路径

```JSON
// tsconfig.json
{
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

如 `outDir` 值为 `dist`，构建命令为 `sfra actions`，那么 `dist/actions` 应该是生产用的路由文件夹

### 静态文件

如果有非 ts 文件，你需要在 `tsconfig.json` 中加入 static 节点并添加相应文件

```JSON
"static": [
  {
    "source": "static", // 原文件夹在根目录下的相对路径
    "target": "assets" // 目标文件夹在 outDir 下的相对路径
  },
  "static.txt"
]
```
