# Cookie `(@halsp/cookie)`

安装 `@halsp/cookie` 以开启 Halsp 的 Cookie 功能

基于 [cookie](https://github.com/jshttp/cookie) 和 [set-cookie-parser](https://github.com/nfriedly/set-cookie-parser)

## 安装

```
npm install @halsp/cookie
```

## 快速开始

在入口文件中

```TS
import "@halsp/cookie";

startup.useCookie();
```

### 获取请求 cookies

从 `ctx` 获取

```TS
const cookies = ctx.cookies;
```

等价于从 `ctx.req` 获取

```TS
const cookies = ctx.req.cookies;
```

也可以获取任一 name 的 cookie

```TS
const name = ctx.cookies.name;
```

还可以利用 `@halsp/inject` 定义装饰器，通过依赖注入获取 cookies

```TS
import { ReadonlyDict } from "@halsp/core";
import { Inject } from "@halsp/inject";

// 自定义装饰器
export const Cookies = Inject((ctx) => ctx.cookies);

// 在服务中
export class CustomService {
  // 通过依赖注入初始化值
  @Cookies
  private readonly cookies!: ReadonlyDict<string>;
}
```

### 设置响应 cookies

给 `ctx.cookies` 赋值即设置响应 cookies

```TS
ctx.cookies = {
  account: "halsp.org",
};
```

等价于给 `ctx.res.cookies` 赋值

```TS
ctx.res.cookies = {
  account: "halsp.org",
};
```

也可以赋值一个对象以支持参数

```TS
ctx.cookies = {
  account: {
    value: "halsp.org",
    httpOnly: true,
    maxAge: 0,
  },
};
```

还可以给某个 name 的 cookie 赋值

```TS
ctx.res.cookies.account = "halsp.org";
```

:::danger 注意不能这样赋值

```TS
ctx.cookies.account = "halsp.org";
```

ctx.cookies 属性的 get 方法是返回请求头的 cookie，等同于

```TS
ctx.req.cookies.account = "halsp.org";
```

因此这种写法其实是给请求头的 cookie 赋值，不会抛出错误但在控制台会提示一个 error
:::

## 请求头/响应头

- 请求的 cookies 从请求头 `cookie` 取得
- 响应的 cookies 会写到响应头 `Set-Cookie`

## 配置

`useCookie` 接收一个配置参数，有下面两个字段

- `parse` 解析配置，参考 [cookie](https://github.com/jshttp/cookie) 的 `parse` 函数参数配置
- `serialize` 全局序列化配置，参考 [cookie](https://github.com/jshttp/cookie) 的 `serialize` 函数参数配置

```TS
import "@halsp/cookie";

startup.useCookie({
  serialize: {},
  parse: {
    httpOnly: true
  },
});
```

序列化配置也可以单次使用，在设置 cookie 时赋值一个 `SetCookieValueWithArgs` 对象

```TS
export type SetCookieValueWithArgs = {
  value: string;
  path?: string | undefined;
  expires?: Date | undefined;
  maxAge?: number | undefined;
  domain?: string | undefined;
  secure?: boolean | undefined;
  httpOnly?: boolean | undefined;
  sameSite?: string | undefined;
};
```

```TS
ctx.res.cookies.account = {
  value: "halsp.org",
  httpOnly: true,
  maxAge: 0,
};
```
