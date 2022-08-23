# 断点调试

断点调试可以找到更难发现的 bug，也方便看到代码的真实逻辑，以及各项数据的变化情况

使用 `@ipare/cli` 可以更方便的调试项目，下面的教程均使用了 `@ipare/cli`

如果当前没有使用 `@ipare/cli`，也可以根据后面的 [新增 CLI](#新增-cli) 配置

:::tip 注意
`@ipare/cli` 使用 `@ipare/http` 模拟 Http 环境启动应用

如果运行环境非 `@ipare/http`，如 `lambda`，可能需要注意到这点
:::

## 开始调试

由 `@ipare/cli` 创建的项目已经配置好调试环境，否则需要参考 [新增 CLI](#新增-cli) 配置

如果使用的是 vscode 可以直接按下 F5 开始调试

其他编译器可以执行下面语句开始调试

```sh
npm start
# 或已全局安装 @ipare/cli
ipare start
# 或已在项目内安装 @ipare/cli
npx ipare start
```

## 规范

在 `src` 目录下，必须要有一个 `startup.ts` 文件，并导出一个函数，函数返回 `Startup` 派生类对象

使用 CLI 生成的项目已有这个文件，内容如

```TS
import { Startup } from "@ipare/core";
import "@ipare/mva";
import "@ipare/env";
import "@ipare/logger";

export default <T extends Startup>(startup: T, mode: string) =>
  startup
    .useEnv()
    .useConsoleLogger()
    .useMva();
```

如果没有这个文件，或文件内容有误，`@ipare/cli` 将无法调试

## 新增 CLI

如果当前项目没有 `@ipare/cli`，可以参考以下步骤配置

### 安装

确保已在项目内已安装或全局安装 `@ipare/cli`

```bash
# 项目中安装
npm install @ipare/cli -D

# 或 全局安装
npm install @ipare/cli -g
```

### 添加脚本

修改 package.json 文件，添加运行脚本

```JSON
  "scripts": {
    "dev": "ipare start",
    "start": "ipare start",
    "build": "ipare build"
  },
```

### 增加调试配置

在项目下创建 `.vscode/launch.json` 文件

```JSON
{
  "version": "0.2.0",
  "configurations": [
    {
      "command": "npm start",
      "name": "Ipare Http Debugger",
      "request": "launch",
      "type": "node-terminal"
    }
  ]
}
```

### 创建 `startup.ts` 文件

如果没有按规范使用 `startup.ts` 文件

创建 `src/startup.ts` 文件，在这个文件中配置中间件，内容参考 [规范](#规范)

修改原有的中间件配置文件 `index.ts`，改为使用从 `startup.ts` 中导出的 `Startup` 对象。如 lambda 运行环境

```TS
import { LambdaStartup } from "@ipare/lambda";
import startup from "./startup";

const app = startup(new LambdaStartup(), "production");
export const main = async (event, context) => await app.run(event, context);
```

### 开始调试

上述配置完毕

按下 F5 即可开始断点调试
