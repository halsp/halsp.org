import{_ as a,r as l,o as r,c as t,a as e,b as i,d as n,e as s}from"./app-0418676b.js";const c={},o=e("h1",{id:"redis-halsp-redis",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#redis-halsp-redis","aria-hidden":"true"},"#"),i(" Redis "),e("code",null,"(@halsp/redis)")],-1),u=e("p",null,[i("添加 "),e("code",null,"@halsp/redis"),i(" 插件以使用 Redis")],-1),v=e("code",null,"@halsp/redis",-1),m={href:"https://github.com/redis/node-redis",target:"_blank",rel:"noopener noreferrer"},h=e("code",null,"@halsp/redis",-1),p=s(`<h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> @halsp/redis
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="快速开始" tabindex="-1"><a class="header-anchor" href="#快速开始" aria-hidden="true">#</a> 快速开始</h2><p>在入口文件中</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &#39;@halsp/redis&#39;;

startup.useRedis({
  url: &quot;redis://test&quot;,
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在中间件或服务中，通过依赖注入获取 Redis 连接实例</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &quot;@halsp/core&quot;;
import { Redis } from &quot;@halsp/redis&quot;;

class TestMiddleware extends Middleware {
  @Redis()
  private readonly redisClient!: Redis;

  async invoke(): Promise&lt;void&gt; {
    await redisClient.set(&quot;key&quot;, &quot;value&quot;);
    const value = redisClient.get(&quot;key&quot;);

    this.ok({ value });
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="连接多个-redis" tabindex="-1"><a class="header-anchor" href="#连接多个-redis" aria-hidden="true">#</a> 连接多个 Redis</h2><p><code>@halsp/redis</code> 支持多个 Redis 连接，只需调用多次 <code>useRedis</code> ，并传参 <code>identity</code> 用于区分</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/redis&quot;;

startup
  .useRedis({
    identity: &quot;db1&quot;,
    url: &quot;redis://redis1&quot;,
    // ...
  })
  .useRedis({
    identity: &quot;db2&quot;,
    url: &quot;redis://redis2&quot;,
    // ...
  });
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在中间件或服务中，给装饰器 <code>@Redis()</code> 传参字符串以区分连接</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &quot;@halsp/core&quot;;
import { Redis } from &quot;@halsp/redis&quot;;

class TestMiddleware extends Middleware {
  @Redis(&quot;db1&quot;)
  private readonly redisClient1!: Redis;
  @Redis(&quot;db2&quot;)
  private readonly redisClient2!: Redis;

  async invoke(): Promise&lt;void&gt; {
    this.redisClient1.set(&quot;key1&quot;, &quot;value1&quot;);
    this.redisClient2.set(&quot;key2&quot;, &quot;value2&quot;);
    await this.next();
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container warning"><p class="custom-container-title">注意</p><p>只有在 <code>useRedis</code> 之后的中间件，才能获取到 Redis 连接实例</p></div><h2 id="获取实例" tabindex="-1"><a class="header-anchor" href="#获取实例" aria-hidden="true">#</a> 获取实例</h2><p>你可以通过依赖注入的方式获取实例，也可以用 <code>ctx.getRedis</code> 获取实例</p><h3 id="依赖注入" tabindex="-1"><a class="header-anchor" href="#依赖注入" aria-hidden="true">#</a> 依赖注入</h3><p>用 <code>@Redis</code> 装饰属性或构造函数参数，通过 <code>@halsp/inject</code> 依赖注入创建实例</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &quot;@halsp/core&quot;;
import { Redis } from &quot;@halsp/redis&quot;;

@Inject
class TestMiddleware extends Middleware {
  constructor(
    @Redis private readonly connection: Redis,
    @Redis(&quot;id2&quot;) private readonly connection2: Redis
  ) {}

  @Redis(&quot;id1&quot;)
  private readonly connection1!: Redis;

  async invoke(): Promise&lt;void&gt; {
    await this.next();
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container tip"><p class="custom-container-title">TIP</p><p><code>Redis</code> 既可以作为装饰器，也可以作为 redis 在 <code>TypeScript</code> 中的连接实例类型</p></div><h3 id="ctx-getredis" tabindex="-1"><a class="header-anchor" href="#ctx-getredis" aria-hidden="true">#</a> <code>ctx.getRedis</code></h3><p>使用 <code>ctx.getRedis</code> 的方式更灵活，但代码易读性不如使用依赖注入</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/redis&quot;;

startup.use(async (ctx, next) =&gt; {
  const connection1 = await ctx.getRedis(&quot;id1&quot;);
  const connection2 = await ctx.getRedis(&quot;id2&quot;);
  const connection = await ctx.getRedis();
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="生命周期与作用域" tabindex="-1"><a class="header-anchor" href="#生命周期与作用域" aria-hidden="true">#</a> 生命周期与作用域</h2><h3 id="作用域" tabindex="-1"><a class="header-anchor" href="#作用域" aria-hidden="true">#</a> 作用域</h3><p>通过 <code>startup.useRedis</code> 函数传参 <code>injectType</code> 以修改该实例作用域</p>`,25),b={href:"https://halsp.org/usage/inject.html#%E4%BD%9C%E7%94%A8%E5%9F%9F",target:"_blank",rel:"noopener noreferrer"},g=s(`<div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &#39;@halsp/redis&#39;;

startup
  .useRedis({
    url: &quot;redis://redis1&quot;,
    injectType: InjectType.Singleton
  })
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="生命周期" tabindex="-1"><a class="header-anchor" href="#生命周期" aria-hidden="true">#</a> 生命周期</h3><p>Redis 连接实例通过依赖注入 <code>@halsp/inject</code> 创建，因此其生命周期符合 <code>@halsp/inject</code> 规则</p>`,3),q={href:"http://halsp.org/usage/inject.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F",target:"_blank",rel:"noopener noreferrer"},R=s(`<p>销毁的行为是在 <code>startup.useInject</code> 中间件的返回管道中触发，伪代码逻辑如</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>await initInject(); // 初始化依赖注入
await initializeRedis(); // 初始化 Redis 连接
await next(); // 执行下个中间件
await dispose(); // 销毁
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2);function x(_,T){const d=l("ExternalLinkIcon");return r(),t("div",null,[o,u,e("p",null,[v,i(" 的功能基于 "),e("a",m,[i("Redis"),n(d)]),i("，使用 "),h,i(" 可以简化 Redis 的管理")]),p,e("p",null,[i("参考 "),e("a",b,[i("https://halsp.org/usage/inject.html#作用域"),n(d)])]),g,e("p",null,[i("参考 "),e("a",q,[i("http://halsp.org/usage/inject.html#生命周期"),n(d)])]),R])}const S=a(c,[["render",x],["__file","redis.html.vue"]]);export{S as default};
