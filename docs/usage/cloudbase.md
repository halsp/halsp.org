# 腾讯云 CloudBase

安装 `@sfajs/cloudbase` 以支持 腾讯云 CloudBase 运行环境

将 sfa 托管到腾讯云 CloudBase

## 安装

npm i @sfajs/cloudbase

## 开始使用

```TS
import SfaCloudbase from "@sfajs/cloudbase";

const main = async (event, context) => {
  return await new SfaCloudbase(event, context)
    .use(async (ctx, next) => {
      ctx.res.headers.demo = "@sfajs/cloudbase";
      await next();
    })
    .run();
};
exports.main = main;
```

如果添加 `@sfajs/router`

```JS
import SfaCloudbase from "@sfajs/cloudbase";
import "@sfajs/router";

const main = async (event, context) => {
  return await new SfaCloudbase(event, context)
    .use(async (ctx, next) => {
      ctx.res.headers.demo = "@sfajs/cloudbase";
      await next();
    })
    .useRouter()
    .run();
};
exports.main = main;
```

## 入口

`SfaCloudbase` 作为 `sfajs` 运行于 `CloudBase` 的入口

该类继承于 `Startup` 并实现 `CloudBase` 功能
