# 错误处理

任何程序都需要处理已知和未知错误

Ipare 提供了多种请求异常，也提供了错误处理的功能

## 1 HttpException

在 Ipare 中，提供了许多派生自 `HttpException` 的错误类

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
- HttpException
- BadRequestException
- UnauthorizedException
- MethodNotAllowedException
- NotFoundException
- ForbiddenException
- NotAcceptableException
- RequestTimeoutException
- ConflictException
- GoneException
- RequestTooLongException
- UnsupportedMediaTypeException
- UnprocessableEntityException
- InternalServerErrorException
- NotImplementedException
- HttpVersionNotSupportedException
- BadGatewayException
- ServiceUnavailableException
- GatewayTimeoutException
- ImATeapotException
- PreconditionFailedException
- MisdirectedException
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

你可以在任何地方抛出请求异常，以终止当前中间件的运行，并使中间件管道转向

抛出请求异常后，框架会自动设置状态码和 body

```TS
import { Middleware, BadRequestException } from "@ipare/core";

class TestMiddleware extends Middleware{
  invoke(){
    throw new BadRequestException('error message');
  }
}
```

上面的代码会将状态码改为 400，body 改为

```json
{
  "message": "error message",
  "status": 400
}
```

## 2 错误处理

如果抛出的是请求异常 `HttpException`，那么会根据请求异常返回特定的 body 和 status

如果抛出的是其他错误，并且没有 catch，那么返回的状态码将是 500，body 为

```json
{
  "message": "Error.message",
  "status": 500
}
```

### 2.1 中间件行为

抛出错误后，对于中间件的运行行为会有以下影响

- 当前中间件立即中断执行
- 中间件管道转向
- 之前的中间件正常反向执行

不难看出，抛出错误一般只会影响当前中间件和其后的中间件

## 3 异常贯穿中间件

抛出异常并设置异常 `breakthrough` 的值，可以使所有中间件都中断执行，即请求会立即返回

```TS
throw new BadRequestException('error message').setBreakthrough();
```

当前中间件、之前中间件、只会中间件，都会被中断

### 3.1 确保部分代码执行

异常贯穿将导致无法正常执行中间件 `next()` 之后的代码

如果该中间件在 `next()` 之后的代码必须被执行，比如清理内存、日志记录等，你需要这样写

```TS
try {
  await this.next();
} finally {
  // TODO
}
```

### 3.2 终止贯穿

可以在之前的中间件中，终止异常继续贯穿中间件，在之前的中间件中这样做

```TS
try {
  await this.next();
} catch (err) {
  if (
    err instanceof HttpException &&
    err.breakthrough &&
    err["some-prop"] == "value" // sample
  ) {
    err.setBreakthrough(false);
  } else {
    throw err;
  }
}
```

## 4 错误钩子

`startup.hook()` 可以添加多种钩子，其中也包括异常钩子

添加异常钩子能够接管框架对错误的处理，比如你可以特殊处理某种错误，而其他错误按默认处理

如 [@ipare/filter](./filter) 中的异常过滤器，就是使用的异常钩子，并且只处理 `@ipare/router` 中的 `Action` 中间件

```TS
import { Action } from "@ipare/router";

startup.hook(HookType.Exception, (ctx, md, ex) => {
  if (md instanceof Action) {
    // execute exception filters
    return execResult; //  is handled, true or false
  } else {
    return false;
  }
});
```

用 `hook()` 添加异常钩子，接收两个参数

1. `HookType.Exception`, 表示该钩子是异常钩子
2. 回调函数，有三个参数
   - ctx: HttpContext 对象
   - middleware: 抛出异常的中间件
   - exception: 抛出的异常

关于回调函数返回值

- 如果返回 false， 表示该异常未处理，将异常交给下一个异常钩子
- 如果返回 true，表示该异常已被捕获并处理，下一个异常钩子将会被该异常触发
- 如果没有返回值，则和返回 false 效果相同
