import{_ as d,r as a,o as l,c as t,a as e,b as n,d as o,e as s}from"./app-0418676b.js";const c={},r=e("h1",{id:"mongodb-halsp-mongoose",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#mongodb-halsp-mongoose","aria-hidden":"true"},"#"),n(" MongoDB "),e("code",null,"(@halsp/mongoose)")],-1),u=e("p",null,[n("添加 "),e("code",null,"@halsp/mongoose"),n(" 插件以连接使用 MongoDB")],-1),v=e("code",null,"@halsp/mongoose",-1),m={href:"https://github.com/Automattic/mongoose",target:"_blank",rel:"noopener noreferrer"},h=e("code",null,"@halsp/mongoose",-1),b={href:"https://github.com/Automattic/mongoose",target:"_blank",rel:"noopener noreferrer"},g=s(`<h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> @halsp/mongoose
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="快速开始" tabindex="-1"><a class="header-anchor" href="#快速开始" aria-hidden="true">#</a> 快速开始</h2><p>在入口文件中</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &#39;@halsp/mongoose&#39;;

startup.useMongoose({
  url: &quot;mongodb://test&quot;
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在中间件或服务中，通过依赖注入获取数据库连接实例 <code>Mongoose</code></p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &quot;@halsp/core&quot;;
import { Mongoose } from &quot;@halsp/mongoose&quot;;

class TestMiddleware extends Middleware {
  @Mongoose()
  private readonly connection!: Mongoose;

  async invoke(): Promise&lt;void&gt; {
    const MyModel = this.connection.model(&quot;ModelName&quot;);
    const instance = new MyModel();
    instance.my.key = &quot;hello&quot;;
    await instance.save();
    this.ok(instance.toObject());
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="多数据库连接" tabindex="-1"><a class="header-anchor" href="#多数据库连接" aria-hidden="true">#</a> 多数据库连接</h2><p><code>@halsp/mongoose</code> 支持多数据库连接，只需调用多次 <code>useMongoose</code> ，并传参 <code>identity</code> 用于区分</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/mongoose&quot;;

startup
  .useMongoose({
    identity: &quot;db1&quot;,
    url: &quot;mongodb://test&quot;,
    // ...
  })
  .useMongoose({
    identity: &quot;db2&quot;,
    url: &quot;mongodb://127.0.0.1&quot;,
    // ...
  });
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在中间件或服务中，给装饰器 <code>@Mongoose()</code> 传参以区分连接</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &#39;@halsp/core&#39;;
import { Mongoose } from &quot;@halsp/mongoose&quot;;

class TestMiddleware extends Middleware {
  @Mongoose(&quot;db1&quot;)
  private readonly connection1!: Mongoose;
  @Mongoose(&quot;db2&quot;)
  private readonly connection2!: Mongoose;

  async invoke(): Promise&lt;void&gt; {
    const MyModel1 = this.connection1.model(&quot;ModelName1&quot;);
    const MyModel2 = this.connection2.model(&quot;ModelName2&quot;);
    await this.next();
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container warning"><p class="custom-container-title">注意</p><p>只有在 <code>useMongoose</code> 之后的中间件，才能获取到数据库连接实例</p></div><h2 id="获取实例" tabindex="-1"><a class="header-anchor" href="#获取实例" aria-hidden="true">#</a> 获取实例</h2><p>你可以通过依赖注入的方式获取实例，也可以用 <code>ctx.getMongoose</code> 获取实例</p><h3 id="依赖注入" tabindex="-1"><a class="header-anchor" href="#依赖注入" aria-hidden="true">#</a> 依赖注入</h3><p>用 <code>@Mongoose</code> 装饰属性或构造函数参数，通过 <code>@halsp/inject</code> 依赖注入创建实例</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &quot;@halsp/core&quot;;
import { Mongoose } from &quot;@halsp/mongoose&quot;;

@Inject
class TestMiddleware extends Middleware {
  constructor(
    @Mongoose private readonly connection: Mongoose,
    @Mongoose(&quot;id2&quot;) private readonly connection2: Mongoose
  ) {}

  @Mongoose(&quot;id1&quot;)
  private readonly connection1!: Mongoose;

  async invoke(): Promise&lt;void&gt; {
    await this.next();
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container tip"><p class="custom-container-title">TIP</p><p><code>Mongoose</code> 既可以作为装饰器，也可以作为 mongoose 在 <code>TypeScript</code> 中的连接实例类型</p></div><h3 id="ctx-getmongoose" tabindex="-1"><a class="header-anchor" href="#ctx-getmongoose" aria-hidden="true">#</a> <code>ctx.getMongoose</code></h3><p>使用 <code>ctx.getMongoose</code> 的方式更灵活，但代码易读性不如使用依赖注入</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/mongoose&quot;;

startup.use(async (ctx, next) =&gt; {
  const connection1 = await ctx.getMongoose(&quot;id1&quot;);
  const connection2 = await ctx.getMongoose(&quot;id2&quot;);
  const connection = await ctx.getMongoose();
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="生命周期与作用域" tabindex="-1"><a class="header-anchor" href="#生命周期与作用域" aria-hidden="true">#</a> 生命周期与作用域</h2><h3 id="作用域" tabindex="-1"><a class="header-anchor" href="#作用域" aria-hidden="true">#</a> 作用域</h3><p>通过 <code>startup.useMongoose</code> 函数传参 <code>injectType</code> 以修改该实例作用域</p>`,25),p={href:"https://halsp.org/usage/inject.html#%E4%BD%9C%E7%94%A8%E5%9F%9F",target:"_blank",rel:"noopener noreferrer"},M=s(`<div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &#39;@halsp/mongoose&#39;;

startup
  .useMongoose({
    url: &quot;mongodb://127.0.0.1&quot;,
    injectType: InjectType.Singleton
  })
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="生命周期" tabindex="-1"><a class="header-anchor" href="#生命周期" aria-hidden="true">#</a> 生命周期</h3><p>数据库连接实例通过依赖注入 <code>@halsp/inject</code> 创建，因此其生命周期符合 <code>@halsp/inject</code> 规则</p>`,3),q={href:"http://halsp.org/usage/inject.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F",target:"_blank",rel:"noopener noreferrer"},x=s(`<p>销毁的行为是在 <code>startup.useInject</code> 中间件的返回管道中触发，伪代码逻辑如</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>await initInject(); // 初始化依赖注入
await initializeMongoose(); // 初始化 MongoDB
await next(); // 执行下个中间件
await dispose(); // 销毁
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2);function _(f,T){const i=a("ExternalLinkIcon");return l(),t("div",null,[r,u,e("p",null,[v,n(" 的功能基于 "),e("a",m,[n("mongoose"),o(i)]),n("，使用 "),h,n(" 可以简化数据库的管理")]),e("p",null,[n("更多数据库操作请参考 "),e("a",b,[n("mongoose"),o(i)])]),g,e("p",null,[n("参考 "),e("a",p,[n("https://halsp.org/usage/inject.html#作用域"),o(i)])]),M,e("p",null,[n("参考 "),e("a",q,[n("http://halsp.org/usage/inject.html#生命周期"),o(i)])]),x])}const y=d(c,[["render",_],["__file","mongoose.html.vue"]]);export{y as default};
