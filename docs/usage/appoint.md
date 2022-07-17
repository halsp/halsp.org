# 习惯约定

Ipare 在很多方面都是约定大于配置

遵循这些约定可以避免很多配置和不必要的问题

本部分仅列举常见约定，其他约定详见各插件的介绍

## 统一启动文件 Startup

在 `src` 下需要有 `startup.ts` 文件，导出一个默认回调函数，此规则用于 `@ipare/cli` 正确解析代码，内容如

```TS
// startup.ts
export default function <T extends Startup>(startup: T, mode?: string) {
  return startup
    .use(async (ctx, next) => {
      ctx.res.setHeader("mode", mode ?? "");
      await next();
    })
    .useInject()
    .useRouter();
}
```

`mode` 参数值为 `@ipare/cli` 的 `build` 或 `start` 命令传入的 `--mode` 参数，如 `development`、`production` 等

## 路由文件夹

`@ipare/router` 或 `@ipare/mva` 路由文件夹默认为 `src/actions`

当然你也可以指定其他文件夹，需配置 `ipare-cli.config.ts`，增加 `routerActionsDir` ，如

```ts
import { defineConfig, Configuration } from "@ipare/cli";
export default defineConfig(({ mode }) => {
  return {
    routerActionsDir: "custom-actions",
  } as Configuration;
});
```

## 视图文件夹

`@ipare/view` 或 `@ipare/mva` 视图文件夹默认为 `views`，其中的文件会被 `@ipare/cli` 自动打包

你也可以指定其他文件夹，设置 `startup.useView()` 的参数

```TS
startu.useView({
  dir: "custom-views",
})
```

并且如果修改默认视图文件夹，你还需要配置 `ipare-cli.config.ts` 以支持 `@ipare/cli` 的资源文件打包功能

```TS
import { defineConfig, Configuration } from "@ipare/cli";
export default defineConfig(({ mode }) => {
  return {
    build: {
      assets:[
        {
          include: 'custom-views/*'
        }
      ]
    }
  } as Configuration;
});
```

## 静态文件

`@ipare/static` 静态资源文件夹默认为 `static`，其中的文件会被 `@ipare/cli` 自动打包

你也可以指定其他文件夹，设置 `startup.useStatic()` 的参数

```TS
startup.useStatic({
  dir: "custom-static"
})
```

并且如果修改默认静态资源文件夹，你还需要配置 `ipare-cli.config.ts` 以支持 `@ipare/cli` 的资源文件打包功能

```TS
import { defineConfig, Configuration } from "@ipare/cli";
export default defineConfig(({ mode }) => {
  return {
    build: {
      assets:[
        {
          include: 'custom-static/*'
        }
      ]
    }
  } as Configuration;
});
```
