# MVA 框架 `(@halsp/mva)`

安装 `@halsp/mva` 以支持 MVA 功能

`@halsp/mva` 基于 `@halsp/router` ，`@halsp/view`

`@halsp/mva` 可以将路由返回结果，与模板自动对应并渲染返回

## 安装

npm i @halsp/mva

## 简单使用

在入口文件中

```TS
import "@halsp/mva";

startup.useMva();
```

参考 `@halsp/router` 在根目录中（ts 项目为 src 目录）添加以下文件夹：

1. 路由文件夹 `actions`，并编写 `action`
2. 视图文件夹 `views` ，并编写相应视图模板

## 配置参数

`useMvc` 接收一个可选配置参数

- viewOptions: 与 `useView` 参数相同
- routerOptions: 与 `useRouter` 参数相同
- codes: 指定状态码对应的模板，一般用于展示错误页面

## 过滤器

基于 `@halsp/filter`，提供了 `ResultFilter` 过滤器

在渲染视图之前会执行 `onResultExecuting`，如果函数返回 false 将终止剩余 `ResultFilter` 过滤器执行，并取消渲染视图

在渲染视图之后执行 `onResultExecuted`，可用于统一返回视图结果

### 创建过滤器

新建一个类并实现 `ResultFilter` 接口

```TS
import { ResultFilter } from "@halsp/mva";

class TestFilter implements ResultFilter {
  onResultExecuted(ctx: Context): void | Promise<void> {
    ctx.res.setHeader("result2", 2);
  }
  onResultExecuting(
    ctx: Context
  ): boolean | void | Promise<void> | Promise<boolean> {
    ctx.res.setHeader("result1", 1);
  }
}
```
