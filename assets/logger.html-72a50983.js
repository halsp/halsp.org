import{_ as a,r,o as l,c as o,a as e,b as i,d,e as s}from"./app-0418676b.js";const t={},c=e("h1",{id:"日志-halsp-logger",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#日志-halsp-logger","aria-hidden":"true"},"#"),i(" 日志 "),e("code",null,"(@halsp/logger)")],-1),u=e("p",null,[i("添加 "),e("code",null,"@halsp/logger"),i(" 插件以使用日志功能")],-1),v=e("code",null,"@halsp/logger",-1),g={href:"https://github.com/winstonjs/winston",target:"_blank",rel:"noopener noreferrer"},m=e("code",null,"@halsp/winston",-1),h=s(`<h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> @halsp/logger
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="快速开始" tabindex="-1"><a class="header-anchor" href="#快速开始" aria-hidden="true">#</a> 快速开始</h2><p>在入口文件中</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &#39;@halsp/logger&#39;;

startup.useLogger()
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在中间件或服务中，通过依赖注入获取日志输出类的实例</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &quot;@halsp/core&quot;;
import { Logger } from &quot;@halsp/logger&quot;;

class TestMiddleware extends Middleware {
  @Logger()
  private readonly logger!: Logger;

  invoke(){
    this.logger.info(&quot;info&quot;);
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="创建多个日志输出实例" tabindex="-1"><a class="header-anchor" href="#创建多个日志输出实例" aria-hidden="true">#</a> 创建多个日志输出实例</h2><p><code>@halsp/logger</code> 支持创建多个日志输出实例，只需调用多次 <code>useLogger</code> ，并传参 <code>identity</code> 用于区分</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/logger&quot;;

startup
  .useLogger({
    identity: &quot;id1&quot;
    // ...
  })
  .useLogger({
    identity: &quot;id2&quot;
    // ...
  });
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在中间件或服务中，给装饰器 <code>@LoggerInject()</code> 传参字符串以区分日志实例</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &quot;@halsp/core&quot;;
import { Logger } from &quot;@halsp/logger&quot;;

class TestMiddleware extends Middleware {
  @Logger(&quot;id1&quot;)
  private readonly logger1!: Logger;
  @Logger(&quot;id2&quot;)
  private readonly logger2!: Logger;

  async invoke(): Promise&lt;void&gt; {
    this.logger1.info(&quot;info&quot;);
    this.logger2.error(&quot;err&quot;);
    await this.next();
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container warning"><p class="custom-container-title">注意</p><p>只有在 <code>useLogger</code> 之后的中间件，才能获取到日志输出实例</p></div><h2 id="获取实例" tabindex="-1"><a class="header-anchor" href="#获取实例" aria-hidden="true">#</a> 获取实例</h2><p>你可以通过依赖注入的方式获取实例，也可以用 <code>ctx.getLogger</code> 获取实例</p><h3 id="依赖注入" tabindex="-1"><a class="header-anchor" href="#依赖注入" aria-hidden="true">#</a> 依赖注入</h3><p>用 <code>@Logger</code> 装饰属性或构造函数参数，通过 <code>@halsp/inject</code> 依赖注入创建实例</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &quot;@halsp/core&quot;;
import { Logger } from &quot;@halsp/logger&quot;;

@Inject
class TestMiddleware extends Middleware {
  constructor(
    @Logger private readonly logger1: Logger,
    @Logger(&quot;id2&quot;) private readonly logger2: Logger
  ) {}

  @Logger(&quot;id1&quot;)
  private readonly logger1!: Logger;

  async invoke(): Promise&lt;void&gt; {
    this.logger1.info(&quot;def&quot;);
    this.logger2.error(&quot;err&quot;);
    this.logger3.warn(&quot;warn&quot;);
    await this.next();
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container tip"><p class="custom-container-title">TIP</p><p><code>Logger</code> 既可以作为装饰器，也可以作为 logger 在 <code>TypeScript</code> 中的实例类型</p></div><h3 id="ctx-getlogger" tabindex="-1"><a class="header-anchor" href="#ctx-getlogger" aria-hidden="true">#</a> <code>ctx.getLogger</code></h3><p>使用 <code>ctx.getLogger</code> 的方式更灵活，但代码易读性不如使用依赖注入</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/logger&quot;;

startup.use(async (ctx, next) =&gt; {
  const logger1 = await ctx.getLogger(&quot;id1&quot;);
  const logger2 = await ctx.getLogger(&quot;id2&quot;);
  const logger = await ctx.getLogger();
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="use" tabindex="-1"><a class="header-anchor" href="#use" aria-hidden="true">#</a> use...</h2><p>除 <code>useLogger</code> 外，<code>@halsp/logger</code> 还提供了以下两种便捷方式</p><ol><li><code>startup.useConsoleLogger</code> 可以快速创建一个控制台输出的日志实例</li><li><code>startup.useFileLogger</code> 可以快速创建一个文件输出的日志实例</li></ol><p>以上两个参数与 <code>useLogger</code> 参数相比，无需设置 <code>transports</code></p><h2 id="生命周期与作用域" tabindex="-1"><a class="header-anchor" href="#生命周期与作用域" aria-hidden="true">#</a> 生命周期与作用域</h2><h3 id="作用域" tabindex="-1"><a class="header-anchor" href="#作用域" aria-hidden="true">#</a> 作用域</h3><p>通过 <code>startup.useLogger</code> 函数传参 <code>injectType</code> 以修改该实例作用域</p>`,29),p={href:"https://halsp.org/usage/inject.html#%E4%BD%9C%E7%94%A8%E5%9F%9F",target:"_blank",rel:"noopener noreferrer"},b=s(`<div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &#39;@halsp/logger&#39;;

startup
  .useLogger({
    injectType: InjectType.Singleton
  })
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="生命周期" tabindex="-1"><a class="header-anchor" href="#生命周期" aria-hidden="true">#</a> 生命周期</h3><p>日志输出实例通过依赖注入 <code>@halsp/inject</code> 创建，因此其生命周期符合 <code>@halsp/inject</code> 规则</p>`,3),q={href:"http://halsp.org/usage/inject.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F",target:"_blank",rel:"noopener noreferrer"},x=s(`<p>销毁的行为是在 <code>startup.useInject</code> 中间件的返回管道中触发，伪代码逻辑如</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>await initInject(); // 初始化依赖注入
await initializeLogger(); // 初始化日志
await next(); // 执行下个中间件
await dispose(); // 销毁
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2);function f(L,_){const n=r("ExternalLinkIcon");return l(),o("div",null,[c,u,e("p",null,[v,i(" 的功能基于 "),e("a",g,[i("winston"),d(n)]),i("，使用 "),m,i(" 可以简化记录日志的操作")]),h,e("p",null,[i("参考 "),e("a",p,[i("https://halsp.org/usage/inject.html#作用域"),d(n)])]),b,e("p",null,[i("参考 "),e("a",q,[i("http://halsp.org/usage/inject.html#生命周期"),d(n)])]),x])}const S=a(t,[["render",f],["__file","logger.html.vue"]]);export{S as default};
