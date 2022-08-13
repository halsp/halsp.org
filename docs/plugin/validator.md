# 参数校验

安装 `@ipare/validator` 以支持参数校验功能

基于 [class-validator](https://github.com/typestack/class-validator) 和 [@ipare/pipe](https://github.com/ipare/pipe) 校验请求参数

使用 `class-validator` 风格的装饰器，配合 `@ipare/validator` 可以实现用装饰器自动校验请求参数

## 安装

```
npm install @ipare/validator
```

## 开始使用

你可以定义数据传输模型，并在数据传输模型中定义校验规则

也可以利用 `@ipare/pipe` 管道功能，在中间件中定义校验规则

### startup

首先在 `startup.ts` 中添加如下代码，开启 `@ipare/validator` 的功能

```TS
import "@ipare/validator";
startup.useValidator()
```

### 在数据传输模型中定义

```TS
// 数据传输模型
class TestDto {
  @IsString()
  b1!: string;

  @IsInt()
  b2!: number;

  get b() {
    return this.b1 + this.b2;
  }
}

// 中间件
class TestMiddleware extends Middleware {
  @Body
  private readonly body!: TestDto;

  async invoke(): Promise<void> {
    this.ok(this.body);
  }
}
```

上面的中间件 `TestMiddleware` 会在使用前自动校验 `TestDto` 中的字段值

### 使用 `@ipare/pipe`

```TS
// 中间件
class TestMiddleware extends Middleware {
  @Body("prop1")
  @IsString()
  @IsBase64()
  private readonly prop1!: string;

  @Body("prop2")
  @IsNumber()
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

使用装饰器 `UseValidatorOptions` 定义传输模型

```TS
@UseValidatorOptions({
  stopAtFirstError: true
})
class TestDto {
  @IsString()
  b1!: string;

  @IsInt()
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
(args: { ctx: HttpContext; val: any }) => boolean | Promise<boolean>
```

参数 `val` 是该模型对应的值
