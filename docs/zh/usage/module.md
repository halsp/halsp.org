# 模块化项目

模块化的项目更易读和易维护，对于代码量大一些的项目，应该使用模块化开发

Halsp 在框架层面良好支持模块化的项目

各模块之间，利用 `@halsp/inject` 的依赖注入能力，实现低耦合的关系

_模块化项目需要用到 `@halsp/router`，以支持模块化的路由_

## 目录结构

一般模块化的项目，目录结构如下图

```
+-- src
|   +-- index.ts
|   +-- common
|   |   dtos
|   +-- modules
|       +-- user
|       |   +-- module.ts // 模块化配置
|       |   +-- entities
|       |   |   +-- user.entity.ts
|       |   +-- dtos
|       |   |   +-- create-user.dto.ts
|       |   |   +-- login.dto.ts
|       |   +-- services
|       |   |   +-- user.service.ts
|       |   |   +-- admin.service.ts
|       |   +-- actions
|       |   |   +-- user.actions.ts // 装饰器风格
|       |   |   +-- admin.actions.ts // 装饰器风格
|       +-- todo
|           +-- module.ts // 模块化配置
|           +-- entities
|           |   +-- todo.entity.ts
|           |   +-- template.entity.ts
|           +-- dtos
|           |   +-- create-todo.dto.ts
|           |   +-- query-todo.dto.ts
|           +-- services
|           |   +-- todo.service.ts
|           |   +-- image.service.ts
|           |   +-- template.service.ts
|           +-- _.get.ts // 路径即路由风格
|           +-- ^id.patch.ts // 路径即路由风格
|           +-- template.post.ts // 路径即路由风格
+-- package.json
+-- tsconfig.json
```

:::tip
此示例用了两种路由风格：

- 装饰器风格
- 路径即路由风格

具体可参考 [@halsp/router](./router)
:::

默认的模块目录为 `modules`，修改方式参考 [@halsp/router 路由文件夹](./router#路由文件夹)

`modules` 文件夹下的每个文件夹，都代表一个模块

## 模块化配置

每个模块下都必须有一个 module.ts 或 module.js 文件，否则将视为普通文件夹

在模块配置文件中导出 json 对象，类型和内容如下

```TS
interface RouterModule {
  prefix?: string;
  decorators?: ClassDecorator[] | ((mapItem: MapItem) => ClassDecorator[]);
}
```

- prefix

路由前缀，统一为该模块下所有路由加上前缀

- decorators

类装饰器数组，或回调函数返回装饰器数组。可以统一为路由 Action 类动态加上装饰器

如结合 `@halsp/swagger` 为该模块下所有 Action 统一加上 Tag 和描述

```TS
import { V } from "@halsp/validator";

export default {
  prefix: "user",
  decorators: [V.Tags("User").Description("desc")]
}
```

### 配置导出类型

简单的可以直接导出一个 json

```TS
export default {
  prefix: "user"
}
```

另外 `@halsp/router` 提供一个函数 `defineModule`，推荐用这种方式能够利用 TypeScript 类型推断

```TS
import { defineModule } from "@halsp/router";

export default defineModule({
  prefix: "user"
})
```

或

```TS
import { defineModule } from "@halsp/router";

export default defineModule(()=> {
  return {
    prefix: "user"
  };
})
```

除 `export default` 外，也可以用 `module.exports`

```TS
const { defineModule } = require("@halsp/router");

module.exports = defineModule({
  prefix: "user",
});
```
