# MVA 框架 `(@ipare/mva)`

安装 `@ipare/mva` 以支持 MVA 功能

`@ipare/mva` 基于 `@ipare/router` ，`@ipare/view`

`@ipare/mva` 可以将路由返回结果，与模板自动对应并渲染返回

## 安装

npm i @ipare/mva

## 简单使用

在 `startup.ts` 中

```TS
import "@ipare/mva";

startup.useMva();
```

参考 `@ipare/router` 在根目录中（ts 项目为 src 目录）添加以下文件夹：

1. 路由文件夹 `actions`，并编写 `action`，也可为其他，但通过 `routerOptions.dir` 参数指定
2. 视图文件夹 `views` ，并编写相应视图模板，也可为其他，但通过 `viewOptions.dir` 参数指定

## 配置参数

`useMvc` 接收一个可选配置参数

- viewOptions: 与 `useViews` 参数相同
- routerOptions: 与 `useRouter` 参数相同
- codes: 指定状态码对应的模板

## 过滤器

基于 `@ipare/filter`，提供了 `ResultFilter` 过滤器

在渲染视图之前会执行 `onResultExecuting`，如果函数返回 false 将终止剩余 `ResultFilter` 过滤器执行，并取消渲染视图

在渲染视图之后执行 `onResultExecuted`，可用于统一返回视图结果

### 创建过滤器

新建一个类并实现 `ResultFilter` 接口

```TS
import { ResultFilter } from "@ipare/mva";

class TestFilter implements ResultFilter {
  onResultExecuted(ctx: HttpContext): void | Promise<void> {
    ctx.res.setHeader("result2", 2);
  }
  onResultExecuting(
    ctx: HttpContext
  ): boolean | void | Promise<void> | Promise<boolean> {
    ctx.res.setHeader("result1", 1);
  }
}
```

## 关于 TS

你需要在 `tsconfig.json` 中的 `static` 中添加 `src/views`，让 `sfra` 编译命令能够将模板文件复制到编译目录

```JSON
"static": [
  "src/views" // 模板文件夹路径
]
```
