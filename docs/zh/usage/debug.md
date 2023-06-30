# 断点调试

断点调试可以找到更难发现的 bug，也方便看到代码的真实逻辑，以及各项数据的变化情况

使用 `@halsp/cli` 可以更方便的调试项目，下面的教程均使用了 `@halsp/cli`

如果当前没有使用 `@halsp/cli`，也可以根据后面的 [新增 CLI](#新增-cli) 部分配置 `@halsp/cli`

:::tip 注意
Serverless 环境下（`@halsp/lambda`, `@halsp/alifc` 等），默认是使用 `@halsp/native` 模拟 Http 环境启动应用

如不需要本地调试，可移除相关代码
:::

## 开始调试

由 `@halsp/cli` 创建的项目已经配置好调试环境，否则需要参考 [新增 CLI](#新增-cli) 配置

如果使用的是 vscode 可以直接按下 F5 开始调试

其他编译器可以执行下面语句开始运行调试

```sh
npm start
# 或已全局安装 @halsp/cli
halsp start
# 或已在项目内安装 @halsp/cli
npx halsp start
```

## 入口文件

建议 `src` 目录下，有以下任一文件

1. `native.ts`
1. `index.ts`
1. `main.ts`

`@halsp/cli` 会按此顺序为优先级，查找并作为入口文件

### 入口文件内容示例

使用 CLI 生成的项目已有这个文件（根据选择环境和插件不同，生成的内容也不同）

如果运行环境选择 `native` ，以及其他部分插件，内容如

```TS
import { Startup } from "@halsp/core";
import "@halsp/native";
import "@halsp/mva";
import "@halsp/env";
import "@halsp/logger";

new Startup()
  .useNative()
  .useEnv()
  .useConsoleLogger()
  .useMva()
  .listen()
```

如果运行环境选择 `lambda` ，以及其他部分插件，内容如

```TS
import { Startup } from "@halsp/core";
import "@halsp/native";
import "@halsp/lambda";
import "@halsp/mva";
import "@halsp/env";
import "@halsp/logger";

const startup = new Startup()
  .useNative()
  .useEnv()
  .useConsoleLogger()
  .useMva();

if (process.env.NODE_ENV == "development") {
  startup.listen();
}
export const main = (e: any, c: any) => startup.run(e, c);
```

上面代码中的 `startup.listen`，是本地调试时，利用 `@halsp/native` 启动的本地服务

### 指定入口文件

除上述默认入口文件外，也可以指定自定义的入口文件

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

### 确保 TypeScript

确保项目是 TypeScript 编写的，目前 `@halsp/cli` 的调试功能仅支持 TS

并且在项目根目录必须有文件 `tsconfig.json`

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

按建议创建入口文件 `index.ts` 或 `main.ts`

参考前面的 [入口文件](#入口文件)

### 开始调试

上述配置完毕

按下 F5 即可开始断点调试

## CLI 调试命令

参考 [CLI 脚手架](./cli.html) 的文档
