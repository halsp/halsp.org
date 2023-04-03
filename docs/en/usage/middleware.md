# 中间件

在 Halsp 中，大部分功能都是由中间件实现的

中间件的功能包括：

- 执行代码
- 修改请求和响应对象
- 拦截请求
- 调用下一个中间件

## 执行顺序

Halsp 的中间件采用了洋葱圈模型，即

- 进入中间件并执行代码
- 执行下一个中间件
- 执行剩余代码并返回上一个中间件

如果没有执行下一个中间件，请求会沿当前中间件直接返回上一个中间件

## 中间件类型

有两种中间件

- 类中间件
- 函数式中间件

如果中间件代码较多，建议使用类中间件，让代码更易读

函数式中间件最终会被转换为类中间件执行，但你可能无需关注这个特点

## 使用中间件

类中间件和函数式中间件使用方式不同，但都大同小异

中间件执行的顺序严格遵循添加顺序

### 函数式中间件

通过 startup.use 添加

```TS
startup
  .use(async (ctx, next)=>{
    ctx.res.setHeader("h1", 1);
    await next();
    ctx.res.setHeader("h3", 3);
  })
  .use((ctx)=>{
    ctx.res.setHeader("h2", 2);
  })
```

### 类中间件

通过 startup.add 添加

创建一个类，并继承 `Middleware`，实现 `invoke` 函数

```TS
class TestMiddleware extends Middleware{
  async invoke(){
    this.ctx.res.setHeader("h1",1);
    await this.next();
    this.ctx.res.setHeader("h2",2);
  }
}
```

```TS
startup.add(TestMiddleware) // 一般中间件
// OR
startup.add(new TestMiddleware()) // 不推荐
// OR
startup.add(async (ctx) => TestMiddleware) // 动态中间件
// OR
startup.add(async (ctx) => new TestMiddleware()) // 动态中间件并自行实例化
```

### 组合中间件

`ComposeMiddleware` 中间件可以组合多个中间件

这些中间件形成的中间件管道，会与主中间件管道相连接

支持多层嵌套组合

该类的成员函数 `add` 和 `use` 与 `Startup` 用法相同

```TS
startup
  .use(async (ctx, next) => {
    await next();
  })
  .add(() =>
    new ComposeMiddleware()
      .use(async (ctx, next) => {
        await next();
      })
      .add(() =>
        new ComposeMiddleware()
          .use(async (ctx, next) => {
            await next();
          })
          .add(() =>
            new ComposeMiddleware()
              .use(async (ctx, next) => {
                await next();
              })
              .use(async (ctx, next) => {
                await next();
              })
          )
          .use(async (ctx, next) => {
            await next();
          })
      )
      .use(async (ctx, next) => {
        await next();
      })
  )
  .use(async (ctx, next) => {
    await next();
  });
```

## 中间件钩子

中间件钩子可以在中间件的不同生命周期，运行指定的代码

- 钩子本质也会被转换为中间件
- 钩子只会作用于其后的中间件

```TS
startup.hook(HookType, (ctx, md) => {})
```

该函数有两个参数

1. 钩子类型，有以下几种钩子
   - `BeforeInvoke`：在中间件执行之前执行，默认参数。若返回 `false` 则终止后续同类型钩子执行，并且不执行当前中间件
   - `AfterInvoke`：在中间件执行之后执行，即 `next` 之后
   - `BeforeNext`：在中间件 `next` 执行前执行，如果在中间件中没有调用 `next`，将不触发这种钩子，若返回 `false` 则终止后续同类型钩子执行，并且不执行下一个中间件
   - `Constructor`：用于构造中间件，利用这种钩子可以动态使用中间件。但注册的中间件，必须是中间件的构造器，即 `startup.add(YourMiddleware)` 的方式
   - `Exception`：中间件抛出异常时会执行这类钩子
2. 钩子回调函数，有两个或三个参数
   - 参数 1：管道 Context 对象
   - 参数 2：中间件对象或中间件构造函数
     - 如果钩子类型为 `Constructor`，则参数为中间件构造函数
     - 如果钩子类型为 `Exception`，则参数为 `HttpException` 对象或其派生对象
     - 如果钩子类型为 `BeforeInvoke` 或 `AfterInvoke` 或 `BeforeNext`，则参数为中间件对象
   - 参数 3: 如果钩子类型为 `Exception`，则此参数为 Error 对象，否则无此参数
   - 返回值：
     - 如果钩子类型为 `Constructor`，则需要返回中间件对象
     - 如果钩子类型为 `Exception`，则返回值为 bool 类型
       - 返回 true 说明在钩子函数中已处理异常，不会执行下一个异常钩子
       - 返回 false 说明在钩子函数中未处理异常，会继续执行下一个异常钩子
     - 如果钩子类型为 `BeforeInvoke` 或 `AfterInvoke` 或 `BeforeNext`，则没有返回值

其中参数 1 可省略，默认为 `BeforeInvoke`

```TS
  import { Middleware } from "@halsp/common";

startup
    .hook((md) => {
      // 1 before hook
      if (md instanceof TestMiddleware) {
        md.count++;
      }
    })
    .add(TestMiddleware)
    .hook((md) => {
      // 2 before hook
      if (md instanceof TestMiddleware) {
        md.count++;
      }
    })
    .add(TestMiddleware)
    .hook((md) => {
      // 3 before hook
      if (md instanceof TestMiddleware) {
        md.count++;
      }
    })
    .hook(HookType.AfterInvoke, (ctx, md) => {
      // AfterInvoke: executed but without effective
      if (md instanceof TestMiddleware) {
        md.count++;
      }
    })
    .hook(HookType.BeforeNext, (ctx, md) => {
      // BeforeNext: executed before next
      if (md instanceof TestMiddleware) {
        md.count++;
      }
    })
    .add(TestMiddleware)
    .use((ctx) => ctx.ok());
```
