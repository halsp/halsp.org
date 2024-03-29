# 阿里云函数计算 `(@halsp/alifc)`

安装 `@halsp/alifc` 以支持阿里云函数计算运行环境

将 Halsp 托管到阿里云函数计算

> 此环境只支持 HTTP 请求的函数。事件请求可以使用 `@halsp/lambda`

## 安装

```
npm i @halsp/alifc
```

## 开始使用

```TS
import { Startup } from "@halsp/core";
import "@halsp/alifc";

const startup = new Startup().useAlifc().use(async (ctx) => {
  ctx.ok("@halsp/alifc");
});
module.exports.handler = async (req, res, context) =>
  await startup.run(req, res, context);
```

如果添加 `@halsp/router`

```TS
import { Startup } from "@halsp/core";
import "@halsp/alifc";
import "@halsp/router";

const startup = new Startup()
  .useAlifc()
  .use(async (ctx) => {
    ctx.ok("@halsp/alifc");
  })
  .useRouter();
module.exports.handler = async (req, res, context) =>
  await startup.run(req, res, context);
```

## 解析 body

阿里云函数计算没有解析 body，但 `@halsp/alifc` 基于 `@halsp/body` 支持四种 body 解析

- json
- text
- urlencoded
- multipart

默认已支持 `json`

使用详情参考 [@halsp/native](https://github.com/halsp/native)

```TS
await new new Startup()
  .useAlifc()
  .useHttpJsonBody()
  .useHttpTextBody()
  .useHttpUrlencodedBody()
  .useHttpMultipartBody()
  .run(req, res, context);
```

## useAlifc

调用 `startup.useAlifc()` 即开启阿里云函数计算功能

## CLI 编译

使用 `@halsp/cli` 编译，会自动拷贝 `package.json` 文件至目标目录，并移除 `devDependencies` 中的依赖

你可以通过配置 `.halsprc.ts` 修改默认行为

```TS
import { defineConfig } from "@halsp/cli";

export default defineConfig(() => {
  return {
    build: {
      copyPackage: true,
      removeDevDeps: true,
    },
  };
});
```

alifc 环境默认为 `true`

配置参考 [@halsp/cli](./cli/#项目配置) 中的 `copyPackage` 和 `removeDevDeps` 配置
