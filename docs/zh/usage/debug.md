# 断点调试

断点调试可以找到更难发现的 bug，也方便看到代码的真实逻辑，以及各项数据的变化情况

使用 `@halsp/cli` 可以更方便的调试项目，下面的教程均使用了 `@halsp/cli`

如果当前没有使用 `@halsp/cli`，也可以根据后面的 [新增 CLI](#新增-cli) 部分配置 `@halsp/cli`

:::tip 注意
Serverless 环境下（`@halsp/lambda`, `@halsp/alifc` 等），默认是使用 `@halsp/native` 模拟 Http 环境启动应用

如果不需要，删除 `native.ts` 文件即可
:::

## 开始调试

由 `@halsp/cli` 创建的项目已经配置好调试环境，否则需要参考 [新增 CLI](#新增-cli) 配置

如果使用的是 vscode 可以直接按下 F5 开始调试

其他编译器可以执行下面语句开始调试

```sh
npm start
# 或已全局安装 @halsp/cli
halsp start
# 或已在项目内安装 @halsp/cli
npx halsp start
```

## 入口文件

建议 `src` 目录下，有以下两个文件

1. `index.ts` 入口文件
1. `startup.ts`，导出一个函数，函数返回 `Startup` 派生类实例对象

这样的好处是方便切换环境，如 `lambda` 项目通过增加一个 `native` 入口文件，即可本地模拟调试

### CLI 生成的内容示例

使用 CLI 生成的项目已有这两个文件（根据选择插件不同，生成的内容也不同）

`startup.ts` 内容如

```TS
import { Startup } from "@halsp/core";
import "@halsp/mva";
import "@halsp/env";
import "@halsp/logger";

export default <T extends Startup>(startup: T) =>
  startup
    .useEnv()
    .useConsoleLogger()
    .useMva();
```

`index.ts` 如果选择 `lambda` 环境内容如下

```TS
const app = startup(new LambdaStartup());
export const main = (event: any, context: any) => app.run(event, context);
```

使用 `native` 本地模拟调试的入口文件 `native.ts` 文件内容如下

```TS
import { NativeStartup } from "@halsp/native";
import setupStartup from "./startup";

async function bootstrap() {
  const startup = setupStartup(new NativeStartup().useHttpJsonBody());
  await startup.dynamicListen();
}
bootstrap();
```

### 指定入口文件

默认入口文件按以下顺序查找

- native.ts
- index.ts
- main.ts

通过参数 `--startupFile` 可以指定入口文件，如

```sh
halsp start --startupFile demo.ts
```

## 已有项目新增 CLI

如果当前项目没有 `@halsp/cli`，可以参考以下步骤配置

### 安装

确保已在项目内安装或全局安装 `@halsp/cli`

```bash
# 项目中安装
npm install @halsp/cli -D

# 或 全局安装
npm install @halsp/cli -g
```

### 添加脚本

修改 package.json 文件，添加运行脚本

```JSON
  "scripts": {
    "start": "halsp start",
    "build": "halsp build"
  },
```

### 增加调试配置

在项目下创建 `.vscode/launch.json` 文件

用于配合 `vscode` 的断点调试

```JSON
{
  "version": "0.2.0",
  "configurations": [
    {
      "command": "npm start",
      "name": "Halsp Http Debugger",
      "request": "launch",
      "type": "node-terminal"
    }
  ]
}
```

### 创建入口文件

按建议创建文件 `startup.ts` 和 `index.ts`

参考 [入口文件](#入口文件)

### 开始调试

上述配置完毕

按下 F5 即可开始断点调试

## CLI 调试命令

参考 [CLI 脚手架](/usage/cli.html) 的文档
