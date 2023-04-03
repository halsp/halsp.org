# 参数校验 `(@halsp/validator)`

安装 `@halsp/validator` 以支持参数校验功能，可以自动校验请求参数

基于 [class-validator](https://github.com/typestack/class-validator) 和 [@halsp/pipe](https://github.com/halsp/pipe) 校验请求参数

使用链式装饰器，减少引用，改进 `class-validator` 的装饰器风格

## 安装

```
npm install @halsp/validator
```

## 开始使用

可以利用 `@halsp/pipe` 管道功能，在中间件中定义校验规则

也可以定义数据传输模型，并在数据传输模型中定义校验规则

### startup

在 `startup.ts` 中添加如下代码，开启 `@halsp/validator` 的功能

```TS
import "@halsp/validator";
startup.useValidator()
```

### 在数据传输模型中定义

```TS
import { V } from "@halsp/validator";
import { Body } from "@halsp/pipe";
import { Middleware } from "@halsp/common";

// 数据传输模型
class TestDto {
  @V.IsString().IsNotEmpty()
  prop1!: string;

  @V.IsInt().Min(6)
  prop2!: number;

  get prop3() {
    return this.prop1 + this.prop2;
  }
}

// 中间件 或 服务
class TestMiddleware extends Middleware {
  @Body
  private readonly body!: TestDto;

  async invoke(): Promise<void> {
    this.ok(this.body);
  }
}
```

上面的中间件 `TestMiddleware` 会在使用前自动校验 `TestDto` 中的字段值

### 使用 `@halsp/pipe`

```TS
import { V } from "@halsp/validator";
import { Body } from "@halsp/pipe";
import { Middleware } from "@halsp/common";

// 中间件
class TestMiddleware extends Middleware {
  @Body("prop1")
  @V.IsString().IsNotEmpty()
  private readonly prop1!: string;

  @Body("prop2")
  @V.IsInt().Min(6)
  private readonly p2!: any;

  async invoke(): Promise<void> {
    this.ok(this.body);
  }
}
```

上面的中间件 `TestMiddleware` 同样会在使用前自动校验 `body` 的 `prop1` 和 `prop2` 字段值

## 配置

可以使用全局配置，也可以使用局部配置

### 全局配置

可以为 `startup.useValidator` 传参一个配置对象

```TS
startup.useValidator({
  stopAtFirstError: true
})
```

也可以传参一个回调函数，用于动态设置配置

```TS
startup.useValidator(({ ctx, val, propertyType }) => ({
  stopAtFirstError: true,
}));
```

### 局部配置

使用装饰器 `UseValidatorOptions` 装饰 dto 类

```TS
@UseValidatorOptions({
  stopAtFirstError: true
})
class TestDto {
  @V.IsString().IsNotEmpty()
  b1!: string;

  @V.IsInt().Min(6)
  b2!: number;

  get b() {
    return this.b1 + this.b2;
  }
}
```

:::tip
局部配置优先于全局配置，最终配置取自二者合并后的对象
:::

## 指定模型可用性

用 `ValidatorEnable` 装饰器指定模型在哪些情况可用

`ValidatorEnable` 接收一个回调函数

```TS
({ ctx: Context; val: any }) => boolean | Promise<boolean>
```

参数 `val` 是该模型对应的值

```TS
@ValidatorEnable(({ ctx: Context; val: any }) => ctx.bag("test") == val)
class TestClass {
  @V.IsInt()
  b1!: number;
}
```

## 现有校验装饰器

参考 [class-validator](https://github.com/typestack/class-validator)

包含 `class-validator` 全部校验装饰器，装饰器参数也完全相同

此外还提供了 `Is` 装饰器，可以使用自定义校验规则，用于更复杂的需求

也能封装自定义校验，用于复用自定义校验规则

## 自定义校验装饰器 `Is()`

`Is` 装饰器可以实现自定义校验

```TS
class TestDto {
  @V
    .Is(
      (value, property) => typeof value == "number",
      `${property} must be a number`
    )
    .Is((value, property) => (value > 6), `${property} must more than 6`)
  readonly prop!: number;
}
```

上面的代码限制字段 `prop` 的值必须是一个数字，并且值大于 6

`Is` 装饰器有两个参数

- `validate` 校验规则回调函数，返回 bool，有三个参数
  - `value` 请求参数实际值
  - `property` 数据传输模型属性名，或 `@halsp/pipe` 取的属性名如 `@Header('prop')`
  - `args` 装饰器输入参数数组
- `errorMessage` 校验失败响应的错误，可以是一个字符串，也可以是一个回调函数，回调函数的参数同 `validate` 回调函数

## 封装的自定义校验

`Is` 装饰器虽然很灵活，但没法复用

调用函数 `addCustomValidator` 即可增加一个自定义校验，然后在代码中多处重复使用

`@halsp/swagger` 就是基于此功能增加了描述性装饰器（没有校验功能）

如实现一个下面的校验规则：判断请求参数是否为指定值

```TS
import { addCustomValidator } from '@halsp/validator';

addCustomValidator({
  name: "CustomEquals",
  validate: (value, property, args) => value == args[0],
  errorMessage: (value, property, args) => `${property} must equal with ${args[0]}, now is ${value}`,
});

class TestDto{
  @V.CustomEquals(6)
  readonly prop!: number;
}
```

如果请求参数的 prop 值是 7，会校验失败，抛出如下错误

```TS
{
  "status": 400
  "message": 'prop must equal with 6, now is 7'
}
```

### 定义声明

虽然 `addCustomValidator` 可以直接添加一个装饰器并且能够使用，但没有智能提示，在 TypeScript 下使用也会报错

因此 TypeScript 还需要添加声明才能更安全、方便的使用

```TS
import { ValidatorDecoratorReturnType } from "@halsp/validator";

declare module "@halsp/validator" {
  interface ValidatorLib {
    CustomEquals: (num: number) => ValidatorDecoratorReturnType;
    CustomDecorator2: () => ValidatorDecoratorReturnType;
  }
}
```

类型声明代码，可以写在 `.d.ts` 文件中，也可以写在普通 `.ts` 中

如在 types/index.d.ts 文件中声明，即可以全局使用。也可以在 `index.ts` 等文件声明

### `addCustomValidator` 参数

`addCustomValidator` 接收三个参数

- `validate` 校验规则回调函数，返回 bool，与 `Is` 装饰器不同的是有三个参数，前两个参数相同
  - `value` 请求参数实际值
  - `property` 数据传输模型属性名，或 `@halsp/pipe` 取的属性名如 `@Header('prop')`
  - `args` 装饰器输入参数数组
- `errorMessage` 校验失败响应的错误，可以是一个字符串，也可以是一个回调函数，回调函数的参数同 `validate` 回调函数
- `name` 装饰器名称，必须唯一，且与已有装饰器不同
