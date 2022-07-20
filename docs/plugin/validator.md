# 参数校验

<p align="center">
    <a href="https://github.com/ipare/validator/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="GitHub license" /></a>
    <a href=""><img src="https://img.shields.io/npm/v/@ipare/validator.svg" alt="npm version"></a>
    <a href=""><img src="https://badgen.net/npm/dt/@ipare/validator" alt="npm downloads"></a>
    <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/@ipare/validator.svg" alt="node compatibility"></a>
    <a href="#"><img src="https://github.com/ipare/validator/actions/workflows/test.yml/badge.svg?branch=main" alt="Build Status"></a>
    <a href="https://codecov.io/gh/ipare/validator/branch/main"><img src="https://img.shields.io/codecov/c/github/ipare/validator/main.svg" alt="Test Coverage"></a>
    <a href="https://github.com/ipare/validator/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"></a>
    <a href="https://gitpod.io/#https://github.com/ipare/validator"><img src="https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod" alt="Gitpod Ready-to-Code"></a>
    <a href="https://paypal.me/ihalwang" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
</p>

安装 `@ipare/validate` 以支持参数校验功能

基于 [class-validator](https://github.com/typestack/class-validator) 和 [@ipare/pipe](https://github.com/ipare/pipe) 校验请求参数

使用 `class-validator` 风格的装饰器，借助此插件可以自动校验请求参数

## 安装

```
npm install @ipare/validator
```

## 简单使用

```TS
startup.useValidator()
```

```TS
class TestDto {
  @IsString()
  b1!: string;

  @IsInt()
  b2!: number;

  get b() {
    return this.b1 + this.b2;
  }
}

class TestMiddleware extends Middleware {
  @Body
  private readonly body!: TestDto;

  async invoke(): Promise<void> {
    this.ok(this.body);
  }
}
```

上面的中间件 `TestMiddleware` 会在使用前自动校验 `TestDto` 是否合法

## 配置

可以使用全局配置，也可以使用局部配置

### 全局配置

可以为 `startup.useValidator` 传参一个对象

```TS
startup.useValidator({
  stopAtFirstError: true
})
```

也可以传参一个回调函数，用于指定某些情形使用配置

```TS
startup.useValidator(({ctx,val,propertyType})=>({
  stopAtFirstError: true
  }))
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
