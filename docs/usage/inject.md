# 依赖注入

添加 `@ipare/inject` 以实现 `Ipare` 的依赖注入

在 Ipare 中，有很多插件基于依赖注入

通过装饰器使用依赖注入，能够更好的管理代码

项目中的业务逻辑一般写在服务（Service）中，相关的操作会被抽象到一个或多个服务中，服务方便被多处使用

为了管理这些服务，`@ipare/inject` 可以集中托管服务的创建、获取、销毁

## 安装

```sh
npm install @ipare/redis
```

## 名词解释

1. 服务：是指需要通过依赖注入管理的类
2. 服务实例：是指依赖注入自动通过服务创建的对象

## 快速开始

定义服务，主要写业务逻辑

```TS
import { Inject } from "@ipare/inject";

class TestService1 {}

class TestService2 {
  @Inject
  private readonly testService1!: TestService1;
}
```

定义中间件类，派生自 `Middleware`，或其他派生自 `Middleware` 的类

```TS
import { Middleware } from "@ipare/core";
import { Inject } from "@ipare/inject";

class TestMiddleware extends Middleware {
  @Inject
  private readonly testService1!: TestService1;
  @Inject
  private readonly testService2!: TestService2;

  invoke() {
    this.ok();
  }
}
```

在 `startup.ts` 中

```TS
import "@ipare/inject";
startup.useInject().add(TestMiddleware);
```

上述代码中的 `startup.useInject` 会启用依赖注入

:::tip
需要注意的是，自动依赖注入只会在 `startup.useInject` 之后的中间件中生效，因此你需要把 `useInject` 放在靠前的位置，根据实际项目决定
:::

:::warning
如果不调用 `startup.useInject`，但通过 `parseInject` 手动创建了实例，那么单例类型的服务会出现不可预知的问题，如无法保证单例的问题
:::

## 装饰器

你需要开启装饰器功能以使用依赖注入

装饰器有两种方式修饰中间件或服务

1. 修饰服务类
2. 修饰声明字段

正常使用二者没有区别，但服务创建的时机有些区别，详细请阅读后面的 `生命周期` 部分

### 修饰声明字段

在服务或中间件的字段声明，使用装饰器 `@Inject`，`@ipare/inject` 将在服务初始化后注入对应服务

```TS
import { Middleware } from "@ipare/core";
import { Inject } from "@ipare/inject";

class TestService1 {}

class TestService2 {
  @Inject
  private readonly testService1!: TestService1;
}

class TestMiddleware extends Middleware {
  @Inject
  private readonly testService1!: TestService1;
  @Inject
  private readonly testService2!: TestService2;

  invoke() {
    this.ok();
  }
}
```

上面的代码，在使用依赖注入后，创建 `TestMiddleware` 中间件实例，会给字段 `testService1`,`testService2` 自动赋值

同样也会递归的给 `testService2.testService1` 字段赋值，服务可以多层嵌套

### 修饰服务类

在服务类定义时使用装饰器 `@Inject`，并在类构造函数中添加服务，`@ipare/inject` 会在初始化类时注入对应服务

```TS
import { Inject } from "@ipare/inject";
import { Middleware } from "@ipare/core";

class OtherService(){}

@Inject
class TestService{
  constructor(
    readonly otherService: OtherService,
    @Inject("KEY1") private readonly params1: number
  ){}
}

@Inject
class TestMiddleware extends Middleware {
  constructor(
    private readonly testService: TestService, // TestService object
    @Inject("KEY1") private readonly params1: number, // 2333
    @Inject("KEY2") private readonly params2: any // true
  ){
    super();
  }

  async invoke(): Promise<void> {
    this.ok({
      service: this.testService.constructor.name,
      params1: this.params1,
      params2: this.params2
    });
  }
}

startup
  .useInject()
  .inject("KEY1", 2333)
  .inject("KEY2", true)
  .add(TestMiddleware);
```

需要注意的是，添加的中间件必须是中间件的构造器

```TS
startup.add(YourMiddleware)
```

因此下面添加中间件的方式，将不能使用类装饰器

```TS
startup.add(async (ctx, next) => {});
startup.add(new YourMiddleware());
startup.add(() => new YourMiddleware());
startup.add(async () => await Factory.creatMiddleware());
```

## 作用域

服务的作用域分为三种

1. Singleton：单例服务，nodejs 运行期间只初始化一次，即多次使用只会存在一个对象
2. Scoped：单次请求，每次请求会初始化一次，每次请求结束后此对象不会再使用
3. Transient：瞬时，每次使用都会被实例化

```TS
import "@ipare/inject";
import { InjectType } from "@ipare/inject";

startup
  .inject(IService, Service, InjectType.Singleton)
  .inject(IService, Service, InjectType.Scoped)
  .inject(IService, Service, InjectType.Transient)
  .inject("KEY", Service, InjectType.Scoped)
  .inject(Service, InjectType.Scoped);
```

需要注意的是，在云函数中，不能保证服务是单例的，因为云函数在调用完毕可能被销毁，下次调用可能会启动新实例

## 生命周期

不同作用域的服务，生命周期不同，体现在创建实例和销毁实例的时机不同

### 创建实例

依赖注入的服务实例是按需创建的

- 中间件在创建时，会同时创建用到的服务
- 服务在创建时，如果用到了其他服务，那么其他服务也会被创建
- 如果作用域是 `Transient`，每次都会创建一个新实例

用 `@Inject` 修饰的字段

- 如果是在中间件中，那么服务将在 `invoke` 函数被执行前实例化
- 如果是在服务中，子服务会在父服务构造函数执行完毕后，立即初始化

### 销毁实例

`Singleton` 作用域的服务不会被框架销毁，如有特定需求，你需要手动销毁实例

`Scoped` 和 `Transient` 作用域的服务会在每次请求结束后调用实例的 `dispose` 函数

因此如果需要框架自动销毁服务，服务需要继承 `InjectDisposable` 接口并实现 `dispose` 函数

```TS
class CustomService implements InjectDisposable {
  dispose() {
    // TODO
  }
}
```

`dispose` 函数可以返回 `void`，也可以返回 `Promise<void>`

:::tip
你也可以直接给已有的服务添加 `dispose` 函数，如 `@ipare/logger` 和 `@ipare.redis` 等插件就是这样实现的
:::

## 注册服务

服务的注册分为自动注册和显式注册

### 显式注册

可以指定实例化派生类或服务的作用域，以实现控制反转

使用 `startup.inject()` 显式注册

```TS
import "@ipare/inject";

// 类映射本身实例对象
startup.inject(Service);
// 父类映射实例对象（实现控制反转）
startup.inject(IService, Service);
// 类映射特定实例对象，注意此方式仅能用于单例，因为服务没有交给框架实例化，若用于其他类型的依赖注入，可能会出现不可预知的问题。
startup.inject(IService, new Service(), InjectType.Singleton);
// 类映射特定值，值可以是实例对象，也可以是其他任意值如 Number/Date/Stream 等类型
startup.inject(IService, async (ctx) => await createService(ctx));
```

显式注册并不会立即实例化服务，依赖注入都是按需实例化，因此显式注册并不会占用多少计算资源，本质仅添加了一条字典记录

:::tip
需要注意的是， 显式注册 `startup.inject` 仅作用于其后的中间件，因此你可能需要在靠前的位置显式注册服务
:::

:::warning
使用依赖注入的父类和子类，必须都是类，不能是接口 `interface`

如上面代码的 `IService` 和 `Service` 都必须是类
:::

### 自动注册

`@ipare/inject` 可以自动实例化服务和中间件，自动注册服务的作用域都是 `Scoped`

没有使用 `startup.inject` 显式注册的服务和中间件，都会被自动注册

## 键值注入

显式注册除了上面的类映射的方式，你还可以使用特定的 Key 注入服务

Key 是字符串，即指定字符串映射指定实例对象或其他值

在 `startup.ts` 中

```TS
import "@ipare/inject";

// 字符串映射服务
startup.inject("SERVICE_KEY", Service);
// 字符串映射特定服务实例，注意此方式仅能用于单例，因为服务没有交给框架实例化，若用于其他类型的依赖注入，可能会出现不可预知的问题。
startup.inject("SERVICE_KEY", new Service(), InjectType.Singleton);
// 字符串映射特定值，值可以是实例对象，也可以是其他任意值如 Number/Date/Stream 等类型
startup.inject("SERVICE_KEY", async (ctx) => await createService(ctx));
```

在服务或中间件中使用

```TS
class TestMiddleware extends Middleware {
  @Inject("SERVICE_KEY")
  private readonly testService!: TestService;

  invoke(){
    this.ok();
  }
}
```

除服务外，甚至可以注入常量值

```TS
startup.inject("KEY1", true);
startup.inject("KEY2", "str");
startup.inject("KEY3", () => 2333);
startup.inject(
  "KEY4",
  async (ctx) => new Promise<symbol>((resolve) => resolve(Symbol()))
);
```

```TS
class TestMiddleware extends Middleware {
  @Inject("KEY1")
  private readonly key1!: boolean; // true
  @Inject("KEY2")
  private readonly key2!: any; // "str"
  @Inject("KEY3")
  private readonly key3!: number; // 2333
  @Inject("KEY4")
  private readonly key3!: Symbol; // symbol
}
```

## 服务的嵌套

嵌套的服务也能被正确初始化

```TS
class TestService1(){}

class TestService2{
  @Inject
  private readonly service1!: TestService1;
}

class TestService3{
  @Inject
  private readonly service1!: TestService1;

  @Inject
  service2!: TestService2;
}

class TestMiddleware extends Middleware{
  @Inject
  private readonly service1!: TestService1;

  @Inject
  private readonly service2!: TestService2;

  @Inject
  private readonly service3!: TestService3;
}
```

## 手动创建服务

有些服务可能没有写在其他服务中，也没有写在中间件中，就无法自动获取服务，需要手动获取服务

有两种方式手动获取服务

### 使用控制反转

也可以利用控制反转，创建或获取一个服务实例

```TS
import { parseInject } from '@ipare/inject'

const service = await parseInject(ctx, Service);
```

这种方式可以同时实例化属性服务或构造器服务，推荐使用这种方式

### 先创建后注入

可以先创建对象，然后再注入服务

```TS
import { parseInject } from '@ipare/inject'

const service = new Service();
await parseInject(ctx, service);

// OR
const service = await parseInject(ctx, new Service());
```

但是这种方式无法实例化 `服务写在构造函数中` 的类，仅可注入实例对象字段的服务

由于服务是手动创建的，其作用域等同于 `Transient`

可以针对需要特殊实例化的服务

## 自定义注入

可以利用并拓展提供的 `Inject` 和 `createInject` 创建自定义注入

### 自定义 `Inject`

如前所述，`Inject` 本身也可以作为装饰器

同时 `Inject` 也可以作为函数，传入以下参数返回一个新的装饰器：

- handler: 回调函数，支持异步，返回值将作为装饰的字段值
- type: 可选，服务的作用域，`InjectType` 类型，与前面介绍的 **作用域** 的概念相同。这里是用于控制 `handler` 回调函数的作用域
  - Singleton: `handler` 回调只会执行一次，因此装饰的不同字段值始终相同，回调函数没有 `HttpContext` 参数
  - Scoped: `handler` 回调每次网络请求只会执行一次，装饰的不同字段值在单次网络访问期间相同，回调函数有参数 `HttpContext`
  - Scoped: `handler` 回调在每个装饰的字段都会执行一次，回调函数有参数 `HttpContext`

### 自定义 `createInject`

比自定义 `Inject` 能实现的功能更多，但同时需要传入更多参数

`createInject` 无返回值，用于创建更复杂的自定义注入装饰器， 接收以下参数

- handle: 同自定义 `Inject` 中的 `handler` 回调函数
- target: 装饰的类或类的原型，从装饰器参数取得
- propertyKey: 装饰的属性名，从属性装饰器参数取得
- parameterIndex: 装饰的参数索引，从参数装饰器参数取得
- type: `InjectType` 类型，作用同上面自定义 `Inject` 的 `type` 参数

### 例 1

实现获取请求 `Host` 和获取当前请求用户 ID

定义装饰器

```TS
import { Inject } from "@ipare/inject";

// 创建一个 @Host 装饰器
const Host = Inject((ctx) => ctx.req.getHeader("Host"));

// 创建一个 @UserID 装饰器
const UserID = Inject((ctx) => ctx.req.query["uid"]);
// 或使用 `createInject` 创建 @UserID 装饰器，二者功能相同
function UserID(target:any, propertyKey: string|symbol){
  return createInject((ctx) => ctx.req.query["uid"], target, propertyKey);
}
```

在中间件或服务中使用

```TS
import { Middleware } from "@ipare/core";

class TestMiddleware extends Middleware {
  @Host
  readonly host!: string;
  @UserID
  readonly userId!: string;

  async invoke(): Promise<void> {
    this.ok({
      host: this.host,
      userId: this.userId,
    });
  }
}
```

OR

```TS
@Inject
class TestMiddleware extends Middleware {
  constructor(@Host readonly host: string, @UserID readonly userId: string) {
    super();
  }

  async invoke(): Promise<void> {
    this.ok({
      host: this.host,
      userId: this.userId,
    });
  }
}
```

### 例 2

通过自定义装饰器，嵌套服务

定义

```TS
import { Inject,parseInject } from "@ipare/inject";

class TestService1{}
class TestService2{
  @Inject
  service1: TestService1;
}
class TestService3{
  @Inject
  service1: TestService1;
  @Inject
  service2: TestService2;
}

const Service3 = Inject((ctx) => new TestService3());
```

中间件

```TS
import { Middleware } from "@ipare/core";

class TestMiddleware extends Middleware {
  @Service3
  readonly service1!: Service3;
  @Service3
  readonly service2!: any;
}
```

OR

```TS
@Inject
class TestMiddleware extends Middleware {
  constructor(
    @Service3 readonly service1: Service3,
    @Service3 readonly service2: any
  ){
    super();
  }
}
```
