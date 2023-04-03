# 错误处理

任何程序都需要处理已知和未知异常

Halsp 提供了多种请求异常，也提供了异常处理的功能

## 异常类

Http 环境和微服务都提供了异常类

所有异常类都派生自 `@halsp/common` 的 `HalspException` 类

你可以在任何地方抛出请求异常，以终止当前中间件的运行，并使中间件管道立即转向

抛出请求异常后，框架会自动更新请求结果

### Http

在 http 中，提供了许多派生自 `HttpException` 的异常类，当然 `HttpException` 也派生自 `HalspException`

这些 http 异常类均来自于 `@halsp/http`

分别与标准 `http` 状态码相对应

- BadGatewayException
- BadRequestException
- ConflictException
- ForbiddenException
- GatewayTimeoutException
- GoneException
- HttpException
- HttpVersionNotSupportedException
- ImATeapotException
- InternalServerErrorException
- MethodNotAllowedException
- MisdirectedException
- NotAcceptableException
- NotFoundException
- NotImplementedException
- PreconditionFailedException
- RequestTimeoutException
- RequestTooLongException
- ServiceUnavailableException
- UnauthorizedException
- UnprocessableEntityException
- UnsupportedMediaTypeException

#### 异常处理

如果抛出的是请求异常 `HttpException` 派生类的实例对象，那么会根据请求异常返回特定的 body 和 status

```TS
import { Middleware, BadRequestException } from "@halsp/common";

class TestMiddleware extends Middleware{
  invoke(){
    throw new BadRequestException('error message');
  }
}
```

上面的代码会做两件事

1. 将状态码改为 400
2. 将返回 body 改为

```json
{
  "message": "error message",
  "status": 400
}
```

如果抛出的是其他异常，并且没有 catch，那么返回的状态码将是 500，body 为

```json
{
  "message": "<error.message>",
  "status": 500
}
```

### 微服务

微服务提供的异常类来自于 `@halsp/micro`

只有一个 `MicroException`

抛出该异常类的实例对象，框架会自动设置请求结果 `Response.error`

## 中间件行为

抛出异常后，对于中间件的运行行为，默认会有以下影响

- 当前中间件立即中断执行
- 中间件管道转向
- 当前中间件之前的中间件正常反向执行

不难看出，抛出异常一般只会影响当前中间件和其后的中间件

### 贯穿中间件

抛出异常并设置异常 `breakthrough` 的值为 `true`，可以使所有中间件都中断执行

即请求会立即返回，中间件 `next()` 之后的代码不会被执行

```TS
const exception = new BadRequestException('error message');
exception.breakthrough = true;
throw exception;

// or

throw new BadRequestException('error message').setBreakthrough();
```

### 确保部分代码执行

异常贯穿将导致无法正常执行中间件 `next()` 之后的代码

如果该中间件在 `next()` 之后的代码必须被执行，比如清理内存、日志记录等，你需要将这种代码写在 finally 块中

```TS
try {
  await this.next();
} finally {
  // 即使异常的 breakthrough 值为 true，这里的代码也会被执行
}
```

### 终止贯穿

可以在抛出异常中间件之前的中间件中，终止异常继续贯穿中间件

在 `catch` 块中设置异常的 `breakthrough` 值修改为 `false`

```TS
try {
  await this.next();
} catch (err) {
  if (err instanceof HttpException) {
    err.setBreakthrough(false);
  } else {
    throw err;
  }
}
```

## 异常钩子

`startup.hook()` 可以添加多种钩子，其中也包括异常钩子

添加异常钩子能够接管框架对异常的处理，比如你可以特殊处理某种异常，而其他异常按默认处理

如 [@halsp/filter](./filter) 中的异常过滤器，就是使用的异常钩子，并且只处理 `@halsp/router` 中的 `Action` 中间件

```TS
import { HookType } from "@halsp/common";
import { Action } from "@halsp/router";

startup.hook(HookType.Error, (ctx, md, ex) => {
  if (md instanceof Action) {
    // execute exception filters
    return execResult; //  is handled, true or false
  } else {
    return false;
  }
});
```

用 `startup.hook()` 添加异常钩子，接收两个参数

1. `HookType.Error`, 表示该钩子是异常钩子
2. 回调函数有三个参数
   - ctx: Context 实例对象
   - middleware: 抛出异常的中间件
   - exception: 抛出的异常

关于回调函数返回值

- 可以返回 Promise
- 如果返回 false， 表示该异常未处理，将异常交给下一个异常钩子
- 如果返回 true，表示该异常已被捕获并处理，下一个异常钩子将不会被该异常触发
- 如果没有返回值，则和返回 false 效果相同
