# 过滤器 `(@halsp/filter)`

安装 `@halsp/filter` 以支持请求过滤器功能

另选择安装 `@halsp/mva` 以支持视图渲染过滤器

请求过滤器基于 `@halsp/router`

`@halsp/filter` 提供以下过滤器

- ActionFilter: Action 运行前和运行后执行，比较通用，可以改变传入内容和返回结果，可以用于统一返回
- AuthorizationFilter: Action 运行前执行，一般用于身份认证
- ResourceFilter: Action 运行前和运行后执行，一般用于资源缓存
- ExceptionFilter: Action 运行抛出异常时执行，一般用于自定义异常处理

`@halsp/mva` 提供以下过滤器

- ResultFilter: 视图渲染前和渲染后执行，可以改变渲染模型和渲染模板，也可以改变渲染结果

## 引入过滤器

以下三者调用任意一个都可以

- useFilter
- useGlobalFilter
- useFilterOrder

如

```TS
import "@halsp/filter"

startup.useFilter()
// OR
startup.useGlobalFilter(YourFilter, 1)
```

:::tip 注意
过滤器需要在 `startup.useRouter` 之前引入
:::

## 过滤器的作用范围

过滤器有两种作用范围

- 作用于 Action
- 全局过滤器

### 在 Action 上使用过滤器

可以单独为某个 Action 使用过滤器

在 Action 类声明出，加上装饰器 `UseFilters`，表示这个 Action 使用滤器

```TS
@UseFilters(filter)
@UseFilters(...filters)
export default class extends Action{
  invoke(){}
}
```

### 全局过滤器

用以下方式添加全局过滤器

```TS
startup.useGlobalFilter(filter)
```

:::tip 注意
应在 `useRouter` 之前添加全局过滤器
:::

全局过滤器可以添加多个，每次使用 `useGlobalFilter` 都会添加一个全局过滤器

## 依赖注入

过滤器支持 `@halsp/inject` 依赖注入，要在 `startup.useInject` 之后引入过滤器

```TS
import "@halsp/filter"
import "@halsp/router"
import "@halsp/inject"

startup
  .useInject()
  .useFilter()
  .useRouter()
```

:::TIP
`@UseFilters()` 和 `startup.useGlobalFilter()` 建议传入类而不是对象，这样可以让框架自动初始化过滤器，以正确初始化依赖注入关系
:::

## 执行顺序

不同类型的过滤器之间，执行顺序是固定的

`ExceptionFilter` 过滤器是抛出异常立即执行，即如果不抛出异常不会执行

其他过滤器按以下顺序执行

1. AuthorizationFilter.onAuthorization
2. ResourceFilter.onResourceExecuting
3. ActionFilter.onActionExecuting
4. ResultFilter.onResultExecuting
5. Action Middleware _（中间件）_
6. ResultFilter.onResultExecuted
7. ActionFilter.onActionExecuted
8. ResourceFilter.onResourceExecuted

`ResourceFilter`/`ActionFilter`/`ResultFilter` 这三种过滤器都有两个函数，他们之间的执行顺序和中间件类似

_`ResultFilter` 是 `@halsp/mva` 提供的_

### 同类型执行顺序

同类型过滤器的执行顺序默认按以下顺序规则执行

- 全局优先于局部装饰器
- 全局过滤器之间按引入顺序执行
- 局部过滤器之间按引入顺序执行

### 指定执行顺序

你也可以指定同类型过滤器之间的执行顺序

```TS
startup.useFilterOrder(FilterConstructor, order)
```

如果是全局过滤器，除上面的方式外，也可以在 `useGlobalFilter` 传入第二个参数作为执行顺序

```TS
startup.useGlobalFilter(Filter, order)
```

:::warning
如果多次调用，仅最后一次生效
:::

## 创建一个过滤器

创建一个类，实现对应过滤器接口，如 `ActionFilter` 过滤器

```TS
class TestActionFilter implements ActionFilter {
  onActionExecuted(ctx: Context): void | Promise<void> {
    ctx.res.setHeader("action2", 2);
  }
  onActionExecuting(
    ctx: Context
  ): boolean | void | Promise<void> | Promise<boolean> {
    ctx.res.setHeader("action1", 1);
    return true;
  }
}
```
