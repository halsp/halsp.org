# 管道 `(@halsp/pipe)`

安装 `@halsp/pipe` 以支持管道功能

管道一般用于获取、校验、转换、格式化请求参数

此处管道不同于管道上下文 `Context`

用 `Query`, `Header`, `Param`, `Body`, `Ctx` 装饰字段，该字段在特定生命周期会被自动赋值

## 快速开始

先创建一个中间件

```TS
import { Header, Query, Param, Body, Ctx } from "@halsp/pipe";
import { Middleware, ReadonlyDict, Context } from "@halsp/core";

class TestMiddleware extends Middleware {
  @Ctx
  private readonly ctx1!: Context;
  @Header
  private readonly header!: ReadonlyDict;
  @Query
  private readonly query1!: ReadonlyDict;
  @Query
  private readonly query2!: ReadonlyDict;
  @Param
  private readonly params!: ReadonlyDict;
  @Body
  private readonly body!: ReadonlyDict;
  @Body("array")
  private readonly arrayFieldBody!: string;
  @Query("q")
  private readonly queryProperty!: string;

  async invoke(): Promise<void> {
    this.ok({
      header: this.header,
      query1: this.query1,
      query2: this.query2,
      params: this.params,
      body: this.body,
      arrayFieldBody: this.arrayFieldBody,
      queryProperty: this.queryProperty,
    });
  }
}

```

在 `index.ts` 中

```TS
import "@halsp/inject";

startup.useInject().add(TestMiddleware);
```

上述代码中的 `useInject` 会启用依赖注入，`@halsp/pipe` 利用依赖注入实现功能

:::tip
管道功能依赖于 `@halsp/inject`，因此需要先引入 `@halsp/inject` 并加入 `startup.useInject()`
:::

:::warning
管道的功能只会在 `useInject` 之后的中间件中生效，因此你需要把 `useInject` 放在靠前的位置，根据实际项目决定
:::

## 在其他类中

在其他任意类中，你也可以使用 `ctx.getService` 手动实例化类

```TS
import "@halsp/inject";
import { Context } from "@halsp/core";
import { Header, Query, Ctx } from "@halsp/pipe";

class TestClass {
  @Ctx
  private readonly ctx!: Context;
  @Header
  private readonly header!: any;
  @Query("property")
  private readonly query!: any;
}

const obj = await ctx.getService(TestClass); // 利用控制反转创建对象
// OR
const obj = await ctx.getService(new TestClass());
```

## 避免在单例类中使用

由于每次接口请求，参数可能都会变

因此使用装饰器的类，其实例对象必须仅作用于单次网络访问

例如不能使用单例类或单例中间件，否则可能会在高并发下出现不可预知的问题

例如在下面的中间件中不能使用 `@halsp/pipe`，因为中间件是单例的：

```TS
startup.use(new YourMiddleware())
```

```TS
const md = new YourMiddleware();
startup.use((ctx) => md);
```

## 加入管道

`Header`,`Query` 等装饰器参数，可以接收管道对象或类

如果传入的是管道的类，可以利用控制反转自动实例化管道

传入类

```TS
import { Query, ParseIntPipe } from "@halsp/pipe"

@Query("field", ParseIntPipe)
queryField: number;
```

或传入对象

```TS
@Query("field", new ParseIntPipe())
queryField: number;
```

或转换整个 query

```TS
@Body(ParseIntPipe)
body: any; // number
```

## 内置管道

目前内置的管道有

- DefaultValuePipe: 参数为 `null`,`undefined`,`NaN` 等，赋值默认值
- TrimPipe: 去除字符串前后空白符，可单独限定 `start` 或 `end`
- ParseIntPipe: 字符串转整型
- ParseFloatPipe: 字符串转浮点数
- ParseBoolPipe: 字符串转布尔，可自定义对应值

## 自定义管道

更多需求可以自定义管道

创建一个类 `ToStringPipe`，实现 `PipeTransform` 接口，如

```TS
import { Ctx, PipeTransform } from "@halsp/pipe"

class ToStringPipe implements PipeTransform<any, string> {
  @Ctx
  readonly ctx: Context;

  transform(value: any) {
    return "" + value;
  }
}
```

在其他地方使用

```TS
@Body("str", ToStringPipe)
str: string;
```
