# 云函数运行环境 `(@halsp/lambda)`

安装 `@halsp/lambda` 以支持云函数运行环境

可以将 Halsp 项目托管到 腾讯云事件云函数、阿里云事件云函数、aws lambda、azure functions 等，提升云函数响应速度

## 安装

npm i @halsp/lambda

## 开始使用

```TS
import { Startup } from "@halsp/core";
import "@halsp/lambda";

const startup = new Startup().useLambda().use(async (ctx, next) => {
  ctx.res.headers.demo = "@halsp/lambda";
  await next();
});
exports.main = async (e, c) => await startup.run(e, c);
```

如果添加 `@halsp/router`

```TS
import { Startup } from "@halsp/core";
import "@halsp/lambda";
import "@halsp/router";

const startup = new Startup()
  .useLambda()
  .use(async (ctx, next) => {
    ctx.res.headers.demo = "@halsp/lambda";
    await next();
  })
  .useRouter();
exports.main = async (e, c) => await startup.run(e, c);
```

## useLambda

调用 `startup.useLambda()` 即开启 Lambda 云函数的功能

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

labmda 环境下，上面的两个值默认为 `true`

配置参考 [@halsp/cli](../usage/cli/#项目配置) 中的 `copyPackage` 和 `removeDevDeps` 配置
