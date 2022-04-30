# 断点调试

此教程使用 vscode 断点调试 sfajs 项目

Serverless 项目调试需要使用 `@sfajs/http` 模拟 Http 环境

## 环境配置

如果运行环境是 [Http 服务](/usage/http) 可以跳过此部分

如果运行环境是其他，可以创建 `Http 服务` 用于本地调试

教程使用 TypeScript，你也可以使用对应的 JavaScript

### 安装

安装以下插件

- `@sfajs/http`: SfaJS 的 `Http 服务` 运行环境
- `ts-node`: 用于运行 TypeScript 代码
- `nodemon`: 用于监控文件修改自动编译

```bash
npm i @sfajs/http -D
npm i ts-node -D
npm i nodemon -D
```

### 创建脚本

修改 package.json 文件，添加

```JSON
  "scripts": {
    "dev": "nodemon --exec ts-node ./http.ts",
  },
```

### 创建测试入口

创建文件 `http.ts` 并添加相应中间件

```TS
import "@sfajs/http";
import { SfaHttp } from "@sfajs/http";

new SfaHttp()
  .useHttpJsonBody()
  .use((ctx) => {
    console.log(ctx.req.method, ctx.req.path);
  })
  .listen(2333);
```

## 调试配置

在项目下创建 `.vscode/launch.json` 文件

```JSON
{
    "version": "0.2.0",
    "configurations": [{
        "name": "SfaJS Http Debugger",
        "type": "node",
        "request": "launch",
        "cwd": "${workspaceRoot}",
        "runtimeExecutable": "npm",
        "windows": {
            "runtimeExecutable": "npm.cmd"
        },
        "runtimeArgs": [
            "run",
            "dev"
        ],
        "env": {
            "NODE_ENV": "local"
        },
        "console": "integratedTerminal",
        "protocol": "auto",
        "restart": true,
        "port": 2333,
        "autoAttachChildProcesses": true
    }]
}
```

## 开始调试

按下 F5 即可开始断点调试
