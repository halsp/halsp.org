import{_ as e,o as d,c as n,e as i}from"./app-0418676b.js";const a={},s=i(`<h1 id="自定义运行环境" tabindex="-1"><a class="header-anchor" href="#自定义运行环境" aria-hidden="true">#</a> 自定义运行环境</h1><p>自定义运行环境可参考已有环境</p><p>主要操作如下</p><ul><li>为类 <code>Startup</code> 的 <code>propotype</code> 增加一个函数，用于处理相关环境参数</li><li>每次请求都创建一个 <code>Context</code> 对象，执行 <code>await this.invoke(ctx)</code> 并将 <code>Context</code> 对象传入 <code>this.invoke</code> 函数</li><li>中间件返回后，解析 <code>Context</code> 对象和 <code>Request</code> 对象，并设置请求返回</li></ul><h2 id="伪代码" tabindex="-1"><a class="header-anchor" href="#伪代码" aria-hidden="true">#</a> 伪代码</h2><p>伪代码如下</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Context, Startup } from &quot;@halsp/core&quot;;

declare module &quot;@halsp/core&quot; {
  interface Startup {
    useCustom(): this;
    listen(): void;
  }
}

Startup.prototype.useCustom = function () {
  // do something
  this.listen = function () {
    // request event
    xxxEvent.on(&quot;message&quot;, async () =&gt; {
      const ctx = new Context();
      const res = await this[&quot;invoke&quot;](ctx);
      return setResult(ctx, event);
    });
  };
  return this;
};

new Startup()
  .useCustom()
  .use((ctx) =&gt; {
    ctx.res.ok(&quot;OK&quot;);
  })
  // ...
  .listen();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="分析-lambda" tabindex="-1"><a class="header-anchor" href="#分析-lambda" aria-hidden="true">#</a> 分析 lambda</h2><p>以 <code>@halsp/lambda</code> 为例，分析其的大致实现</p><h3 id="uselambda-函数" tabindex="-1"><a class="header-anchor" href="#uselambda-函数" aria-hidden="true">#</a> useLambda 函数</h3><p>在 Startup.prototype 上增加函数 <code>startup.useLambda</code>，调用此函数以支持 Lambda 环境</p><p>在函数中声明使用 Http 环境 <code>startup.useHttp()</code>，并为 startup 实例创建方法 <code>startup.run</code></p><h3 id="run-函数" tabindex="-1"><a class="header-anchor" href="#run-函数" aria-hidden="true">#</a> run 函数</h3><p>每次网络请求，都会调用 <code>startup.run()</code> 函数</p><p>该函数简单来说就三步操作</p><ol><li>根据 lambda 的参数 <code>event</code> 和 <code>context</code> 解析请求内容，并创建 Context 对象</li><li>执行 <code>this.invoke(ctx)</code>，这一步将执行各个中间件，是 halsp 的核心部分</li><li>格式化返回内容</li></ol><p>函数代码如下</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Startup, Dict } from &quot;@halsp/core&quot;;

Startup.prototype.useLambda = function () {
  return this.useHttp().extend(&quot;run&quot;, async (event: Dict, context: Dict) =&gt; {
    const ctx = this.createContext(event, context);
    await this[&quot;invoke&quot;](ctx);
    return await getStruct(ctx);
  });
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="创建-context" tabindex="-1"><a class="header-anchor" href="#创建-context" aria-hidden="true">#</a> 创建 Context</h3><p><code>Context</code> 构造函数接收 <code>Request</code> 对象，因此需要先创建 <code>Request</code> 对象</p><ol><li>新建一个 <code>Request</code> 对象 <code>new Request()</code></li><li>解析 lambda 的参数 <code>event</code> 和 <code>context</code>，设置 <code>Request</code> 对象的请求参数</li><li>新建一个 <code>Context</code> 对象 <code>new Context(req)</code></li></ol><h3 id="格式化返回内容" tabindex="-1"><a class="header-anchor" href="#格式化返回内容" aria-hidden="true">#</a> 格式化返回内容</h3><p>在 <code>this.invoke</code> 执行完毕后，<code>Context</code> 和 <code>Request</code> 对象已经在各个中间件被更新</p><p>然后需要解析 <code>Context</code> 和 <code>Request</code> 对象并返回符合 lambda 要求的结果</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>export interface ResponseStruct {
  readonly isBase64Encoded: boolean;
  readonly statusCode: number;
  readonly status: number;
  readonly headers: HeadersDict;
  readonly body: any;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><code>body</code> 取自 <code>res.body</code></li><li>由于云函数不支持返回二进制，因此需要判断 <code>res.body</code> 是否二进制（Buffer / Stream）。如果 <code>res.body</code> 是二进制，需要将 <code>body</code> 用 <code>base64</code> 转换，并设置 <code>isBase64Encoded</code> 为 <code>true</code></li><li><code>statusCode</code> 和 <code>status</code> 相同，直接取自 <code>res.status</code>，写两个是为了兼容更多云函数</li><li><code>headers</code> 直接取自 <code>res.headers</code></li></ul><h3 id="使用" tabindex="-1"><a class="header-anchor" href="#使用" aria-hidden="true">#</a> 使用</h3><p>在 index.ts 中</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/lambda&quot;;

const startup = new Startup().useLambda();
export const main = async (event, context) =&gt; await startup.run(event, context);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="贡献" tabindex="-1"><a class="header-anchor" href="#贡献" aria-hidden="true">#</a> 贡献</h2><p>欢迎将自定义运行环境发布至 <code>npm</code> 供其他人使用</p>`,31),t=[s];function c(o,l){return d(),n("div",null,t)}const u=e(a,[["render",c],["__file","custom-env.html.vue"]]);export{u as default};
