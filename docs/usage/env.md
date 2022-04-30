# 运行环境介绍

安装各环境插件，可以让 sfajs 运行于不同的环境

## 已有环境

目前已支持的运行环境如下：

- Http 服务
  - NPM 包：[@sfajs/http](https://www.npmjs.com/package/@sfajs/http)
  - 源码：<https://github.com/sfajs/http>
  - 文档：<https://sfajs.com/usage/http>
- 腾讯云 CloudBase
  - NPM 包：[@sfajs/cloudbase](https://www.npmjs.com/package/@sfajs/cloudbase)
  - 源码：<https://github.com/sfajs/cloudbase>
  - 文档：<https://sfajs.com/usage/cloudbase>
- 阿里云函数计算
  - NPM 包：[@sfajs/alifunc](https://www.npmjs.com/package/@sfajs/alifunc)
  - 源码：<https://github.com/sfajs/alifunc>
  - 文档：<https://sfajs.com/usage/alifunc>

> 🎉 更多环境欢迎贡献并编辑此 [README](https://github.com/sfajs/website/edit/main/docs/usage/env.md) 以添加

## 自定义运行环境

自定义运行环境可参考已有环境

主要操作如下

- 创建入口类并继承 `Startup`
- 每次请求创建一个 `SfaRequest` 对象和 `HttpContext` 对象
- 执行 `await super.invoke(ctx)` 将 `HttpContext` 对象传入 `Startup.invoke` 函数
- 解析 `HttpContext` 对象和 `SfaRequest` 对象设置请求返回

伪代码如下

```TS
import { Startup } from "@sfajs/core";

class YourEnv extends Startup{
  async run(event: any){
    const ctx = createContext(event);
    await super.invoke(ctx);
    return setResult(ctx, event);
  }
}

new YourEnv()
  .use((ctx) => ctx.ok("OK"))
  .run();
```
