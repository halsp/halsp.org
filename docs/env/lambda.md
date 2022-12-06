# 云函数运行环境 `(@ipare/lambda)`

安装 `@ipare/lambda` 以支持云函数运行环境

可以将 Ipare 项目托管到 腾讯云事件云函数、阿里云事件云函数、aws lambda、azure functions 等，提升云函数响应速度

## 安装

npm i @ipare/lambda

## 开始使用

```TS
import { LambdaStartup } from "@ipare/lambda";

const startup = new LambdaStartup(event, context).use(async (ctx, next) => {
  ctx.res.headers.demo = "@ipare/lambda";
  await next();
});
const main = async (event, context) => {
  return await startup.run();
};
exports.main = main;
```

如果添加 `@ipare/router`

```TS
import { LambdaStartup } from "@ipare/lambda";
import "@ipare/router";

const startup = new LambdaStartup(event, context)
  .use(async (ctx, next) => {
    ctx.res.headers.demo = "@ipare/lambda";
    await next();
  })
  .useRouter();
const main = async (event, context) => {
  return await startup.run();
};
exports.main = main;
```

## 入口

`LambdaStartup` 作为 `Ipare` 运行于云函数的入口

该类继承于 `Startup` 并实现云函数的功能

## CLI 编译

使用 `@ipare/cli` 编译，会自动拷贝 `package.json` 文件至目标目录，并移除 `devDependencies` 中的依赖

你可以通过配置 `ipare-cli.config.ts` 修改默认行为

```TS
import { defineConfig } from "@ipare/cli";

export default defineConfig(() => {
  return {
    build: {
      copyPackage: true,
      removeDevDeps: true,
    },
  };
});
```

labmda 环境默认为 `true`

配置参考 [@ipare/cli](./cli/#项目配置) 中的 `copyPackage` 和 `removeDevDeps` 配置
