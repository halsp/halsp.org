# Cookie

安装 `@ipare/cookie` 以开启 Ipare 的 Cookie 功能

基于 [cookie](https://github.com/jshttp/cookie) 和 [set-cookie-parser](https://github.com/nfriedly/set-cookie-parser)

## 安装

```
npm install @ipare/cookie
```

## 快速开始

在 `startup.ts` 中

```TS
import "@ipare/cookie";

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

### 设置响应 cookies

给 `ctx.cookies` 赋值

```TS
ctx.cookies = {
  account: "ipare.org",
};
```

等价于给 `ctx.res.cookies` 赋值

```TS
ctx.res.cookies = {
  account: "ipare.org",
};
```

也可以赋值一个对象以支持参数

```TS
ctx.cookies = {
  account: {
    value: "ipare.org",
    httpOnly: true,
    maxAge: 0,
  },
};
```

还可以给某个 name 的 cookie 赋值

```TS
ctx.res.cookies.account = "ipare.org";
```

:::danger 注意不能这样赋值

```TS
ctx.cookies.account = "ipare.org";
```

ctx.cookies 属性的 get 方法是返回请求头的 cookie

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
import "@ipare/cookie";

startup.useCookie({
  serialize: {},
  parse: {
    httpOnly: true
  },
});
```

序列化配置也可以单次使用，在设置 cookie 时赋值一个 `SetCookieValue` 对象

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
  value: "ipare.org",
  httpOnly: true,
  maxAge: 0,
};
```
