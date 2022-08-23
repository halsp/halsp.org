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

在其他地方，获取请求 cookies

```TS
const cookies = ctx.cookies;
// OR
const cookies = ctx.req.cookies;
// OR
const name = ctx.cookies.name;
```

设置返回 cookies（Set-Cookie）

```TS
ctx.cookies = {
  account: "ipare.org",
};
// OR
ctx.res.cookies = {
  account: "ipare.org",
};
// OR set cookie with options
ctx.cookies = {
  account: {
    value: "ipare.org",
    httpOnly: true,
    maxAge: 0,
  },
};
// OR
ctx.res.cookies.account = "ipare.org";

// NOT! ctx.cookies is to get request cookies
ctx.cookies.account = "ipare.org";
```

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
