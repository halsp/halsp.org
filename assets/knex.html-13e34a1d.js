import{_ as a,r as l,o as t,c,a as e,b as n,d as s,e as d}from"./app-0418676b.js";const r={},o=e("h1",{id:"knex-halsp-knex",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#knex-halsp-knex","aria-hidden":"true"},"#"),n(" Knex "),e("code",null,"(@halsp/knex)")],-1),u=e("p",null,[n("添加 "),e("code",null,"@halsp/knex"),n(" 插件以使用 Knex")],-1),v=e("code",null,"@halsp/knex",-1),m={href:"https://github.com/knex/knex",target:"_blank",rel:"noopener noreferrer"},b=e("code",null,"@halsp/knex",-1),p=d(`<h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> @halsp/knex
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="快速开始" tabindex="-1"><a class="header-anchor" href="#快速开始" aria-hidden="true">#</a> 快速开始</h2><p>在入口文件中</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &#39;@halsp/knex&#39;;

startup.useKnex({
  client: &#39;mysql&#39;,
  connection: {
    host : &#39;127.0.0.1&#39;,
    user : &#39;your_database_user&#39;,
    password : &#39;your_database_password&#39;,
    database : &#39;myapp_test&#39;
  }
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在中间件或服务中，通过依赖注入获取 Knex 连接实例</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &quot;@halsp/core&quot;;
import { Knex } from &quot;@halsp/knex&quot;;

class TestMiddleware extends Middleware {
  @Knex
  private readonly connection!: Knex;

  async invoke(): Promise&lt;void&gt; {
    await connection.table(&quot;test&quot;).insert({
      name: &quot;t1&quot;,
    });
    const result = await connection.table(tableName).select(&quot;*&quot;);

    this.ok(result);
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="创建多个数据库连接" tabindex="-1"><a class="header-anchor" href="#创建多个数据库连接" aria-hidden="true">#</a> 创建多个数据库连接</h2><p><code>@halsp/knex</code> 支持多个 Knex 连接，只需调用多次 <code>useKnex</code> ，并传参 <code>identity</code> 用于区分</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/knex&quot;;

startup
  .useKnex({
    identity: &quot;db1&quot;,
    client: &quot;sqlite3&quot;,
    connection: {
      filename: &quot;./test1.db&quot;,
    },
    // ...
  })
  .useKnex({
    identity: &quot;db2&quot;,
    client: &quot;sqlite3&quot;,
    connection: {
      filename: &quot;./test2.db&quot;,
    },
    // ...
  });
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在中间件或服务中，给装饰器 <code>@Knex()</code> 传参字符串以区分连接</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &quot;@halsp/core&quot;;
import { Knex } from &quot;@halsp/knex&quot;;

class TestMiddleware extends Middleware {
  @Knex(&quot;db1&quot;)
  private readonly knexClient1!: Knex;
  @Knex(&quot;db2&quot;)
  private readonly knexClient2!: Knex;

  async invoke(): Promise&lt;void&gt; {
    await knexClient1.table(&quot;table1&quot;).select(&quot;*&quot;);
    await knexClient2.table(&quot;table2&quot;).select(&quot;*&quot;);
    await this.next();
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container warning"><p class="custom-container-title">注意</p><p>只有在 <code>useKnex</code> 之后的中间件，才能获取到 Knex 连接实例</p></div><h2 id="获取实例" tabindex="-1"><a class="header-anchor" href="#获取实例" aria-hidden="true">#</a> 获取实例</h2><p>你可以通过依赖注入的方式获取实例，也可以用 <code>ctx.getKnex</code> 获取实例</p><h3 id="依赖注入" tabindex="-1"><a class="header-anchor" href="#依赖注入" aria-hidden="true">#</a> 依赖注入</h3><p>用 <code>@Knex</code> 装饰属性或构造函数参数，通过 <code>@halsp/inject</code> 依赖注入创建实例</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &quot;@halsp/core&quot;;
import { Knex } from &quot;@halsp/knex&quot;;

@Inject
class TestMiddleware extends Middleware {
  constructor(
    @Knex private readonly connection: Knex,
    @Knex(&quot;id2&quot;) private readonly connection2: Knex
  ) {}

  @Knex(&quot;id1&quot;)
  private readonly connection1!: Knex;

  async invoke(): Promise&lt;void&gt; {
    await this.next();
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container tip"><p class="custom-container-title">TIP</p><p><code>Knex</code> 既可以作为装饰器，也可以作为 knex 在 <code>TypeScript</code> 中的连接实例类型</p></div><h3 id="ctx-getknex" tabindex="-1"><a class="header-anchor" href="#ctx-getknex" aria-hidden="true">#</a> <code>ctx.getKnex</code></h3><p>使用 <code>ctx.getKnex</code> 的方式更灵活，但代码易读性不如使用依赖注入</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/knex&quot;;

startup.use(async (ctx, next) =&gt; {
  const connection1 = await ctx.getKnex(&quot;id1&quot;);
  const connection2 = await ctx.getKnex(&quot;id2&quot;);
  const connection = await ctx.getKnex();
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="生命周期与作用域" tabindex="-1"><a class="header-anchor" href="#生命周期与作用域" aria-hidden="true">#</a> 生命周期与作用域</h2><h3 id="作用域" tabindex="-1"><a class="header-anchor" href="#作用域" aria-hidden="true">#</a> 作用域</h3><p>通过 <code>startup.useKnex</code> 函数传参 <code>injectType</code> 以修改该实例作用域</p>`,25),h={href:"https://halsp.org/usage/inject.html#%E4%BD%9C%E7%94%A8%E5%9F%9F",target:"_blank",rel:"noopener noreferrer"},x=d(`<div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &#39;@halsp/knex&#39;;

startup
  .useKnex({
    injectType: InjectType.Singleton,
    client: &quot;sqlite3&quot;,
    connection: {
      filename: &quot;./test.db&quot;,
    },
  })
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="生命周期" tabindex="-1"><a class="header-anchor" href="#生命周期" aria-hidden="true">#</a> 生命周期</h3><p>Knex 连接实例通过依赖注入 <code>@halsp/inject</code> 创建，因此其生命周期符合 <code>@halsp/inject</code> 规则</p>`,3),g={href:"http://halsp.org/usage/inject.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F",target:"_blank",rel:"noopener noreferrer"},q=d(`<p>销毁的行为是在 <code>startup.useInject</code> 中间件的返回管道中触发，伪代码逻辑如</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>await initInject(); // 初始化依赖注入
await initializeKnex(); // 初始化 Knex 连接
await next(); // 执行下个中间件
await dispose(); // 销毁
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2);function _(k,K){const i=l("ExternalLinkIcon");return t(),c("div",null,[o,u,e("p",null,[v,n(" 的功能基于 "),e("a",m,[n("Knex"),s(i)]),n("，使用 "),b,n(" 可以简化集成和连接操作")]),p,e("p",null,[n("参考 "),e("a",h,[n("https://halsp.org/usage/inject.html#作用域"),s(i)])]),x,e("p",null,[n("参考 "),e("a",g,[n("http://halsp.org/usage/inject.html#生命周期"),s(i)])]),q])}const T=a(r,[["render",_],["__file","knex.html.vue"]]);export{T as default};
