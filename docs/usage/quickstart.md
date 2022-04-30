# 快速开始

此教程将指引你创建一个简单的项目

## 初始化

新建文件夹，在文件夹下运行以下命令

```bash
npm init -y
```

## 安装依赖

运行以下命令安装核心依赖

```bash
npm i @sfajs/core
```

### 运行环境

sfajs 支持多种运行环境，根据你的需要安装对应插件

此教程安装 `@sfajs/http`

- 运行在 http 服务下

```bash
npm i @sfajs/http
```

- 运行在 serverless cloudbase 下

```bash
npm i @sfajs/cloudbase
```

- 运行在 serverless 阿里云云函数下

```bash
npm i @sfajs/alifunc
```

## 创建文件

创建 `index.js` 文件

```TS
const { SfaHttp } = require("@sfajs/http");
new SfaHttp()
  .use((ctx) => {
    ctx.ok("OK");
  })
  .listen(2333);
```

一个简单的 http 服务就创建好了

## 运行

`package.json` 中添加运行脚本

```JSON
  "scripts": {
    "dev": "node index.js"
  }
```

然后运行 `npm run dev` 即可启动 http 服务

现在就可以访问 `http://localhost:2333` 了
