import{_ as e,o as i,c as d,e as n}from"./app-0418676b.js";const a={},s=n(`<h1 id="管道-halsp-pipe" tabindex="-1"><a class="header-anchor" href="#管道-halsp-pipe" aria-hidden="true">#</a> 管道 <code>(@halsp/pipe)</code></h1><p>安装 <code>@halsp/pipe</code> 以支持管道功能</p><p>管道一般用于获取、校验、转换、格式化请求参数</p><p>此处管道不同于管道上下文 <code>Context</code></p><p>用 <code>Query</code>, <code>Header</code>, <code>Param</code>, <code>Body</code> 装饰字段，该字段在特定生命周期会被自动赋值</p><h2 id="快速开始" tabindex="-1"><a class="header-anchor" href="#快速开始" aria-hidden="true">#</a> 快速开始</h2><p>先创建一个中间件</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Header, Query, Param, Body } from &quot;@halsp/pipe&quot;;
import { Middleware, ReadonlyDict, Context } from &quot;@halsp/core&quot;;

class TestMiddleware extends Middleware {
  @Header
  private readonly header!: ReadonlyDict;
  @Query
  private readonly query1!: ReadonlyDict;
  @Query
  private readonly query2!: ReadonlyDict;
  @Param
  private readonly params!: ReadonlyDict;
  @Body
  private readonly body!: ReadonlyDict;
  @Body(&quot;array&quot;)
  private readonly arrayFieldBody!: string;
  @Query(&quot;q&quot;)
  private readonly queryProperty!: string;

  async invoke(): Promise&lt;void&gt; {
    this.ok({
      header: this.header,
      query1: this.query1,
      query2: this.query2,
      params: this.params,
      body: this.body,
      arrayFieldBody: this.arrayFieldBody,
      queryProperty: this.queryProperty,
    });
  }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 <code>index.ts</code> 中</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/inject&quot;;

startup.useInject().add(TestMiddleware);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码中的 <code>useInject</code> 会启用依赖注入，<code>@halsp/pipe</code> 利用依赖注入实现功能</p><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>管道功能依赖于 <code>@halsp/inject</code>，因此需要先引入 <code>@halsp/inject</code> 并加入 <code>startup.useInject()</code></p></div><div class="custom-container warning"><p class="custom-container-title">WARNING</p><p>管道的功能只会在 <code>useInject</code> 之后的中间件中生效，因此你需要把 <code>useInject</code> 放在靠前的位置，根据实际项目决定</p></div><h2 id="在其他类中" tabindex="-1"><a class="header-anchor" href="#在其他类中" aria-hidden="true">#</a> 在其他类中</h2><p>在其他任意类中，你也可以使用 <code>ctx.getService</code> 手动实例化类</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Inject } from &quot;@halsp/inject&quot;;
import { Context } from &quot;@halsp/core&quot;;
import { Header, Query } from &quot;@halsp/pipe&quot;;

class TestClass {
  @Inject
  private readonly ctx!: Context;
  @Header
  private readonly header!: any;
  @Query(&quot;property&quot;)
  private readonly query!: any;
}

const obj = await ctx.getService(TestClass); // 利用控制反转创建对象
// OR
const obj = await ctx.getService(new TestClass());
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="避免在单例类中使用" tabindex="-1"><a class="header-anchor" href="#避免在单例类中使用" aria-hidden="true">#</a> 避免在单例类中使用</h2><p>由于每次接口请求，参数可能都会变</p><p>因此使用装饰器的类，其实例对象必须仅作用于单次网络访问</p><p>例如不能使用单例类或单例中间件，否则可能会在高并发下出现不可预知的问题</p><p>例如在下面的中间件中不能使用 <code>@halsp/pipe</code>，因为中间件是单例的：</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.use(new YourMiddleware())
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>const md = new YourMiddleware();
startup.use((ctx) =&gt; md);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="加入管道" tabindex="-1"><a class="header-anchor" href="#加入管道" aria-hidden="true">#</a> 加入管道</h2><p><code>Header</code>,<code>Query</code> 等装饰器参数，可以接收管道对象或类</p><p>如果传入的是管道的类，可以利用控制反转自动实例化管道</p><p>传入类</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Query, ParseIntPipe } from &quot;@halsp/pipe&quot;

@Query(&quot;field&quot;, ParseIntPipe)
queryField: number;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>或传入对象</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>@Query(&quot;field&quot;, new ParseIntPipe())
queryField: number;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>或转换整个 query</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>@Body(ParseIntPipe)
body: any; // number
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="内置管道" tabindex="-1"><a class="header-anchor" href="#内置管道" aria-hidden="true">#</a> 内置管道</h2><p>目前内置的管道有</p><ul><li>DefaultValuePipe: 参数为 <code>null</code>,<code>undefined</code>,<code>NaN</code> 等，赋值默认值</li><li>TrimPipe: 去除字符串前后空白符，可单独限定 <code>start</code> 或 <code>end</code></li><li>ParseIntPipe: 字符串转整型</li><li>ParseFloatPipe: 字符串转浮点数</li><li>ParseBoolPipe: 字符串转布尔，可自定义对应值</li></ul><h2 id="自定义管道" tabindex="-1"><a class="header-anchor" href="#自定义管道" aria-hidden="true">#</a> 自定义管道</h2><p>更多需求可以自定义管道</p><p>创建一个类 <code>ToStringPipe</code>，实现 <code>PipeTransform</code> 接口，如</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Inject } from &quot;@halsp/inject&quot;;
import { PipeTransform } from &quot;@halsp/pipe&quot;

class ToStringPipe implements PipeTransform&lt;any, string&gt; {
  @Inject
  readonly ctx: Context;

  transform(value: any) {
    return &quot;&quot; + value;
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在其他地方使用</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>@Body(&quot;str&quot;, ToStringPipe)
str: string;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,41),r=[s];function l(c,t){return i(),d("div",null,r)}const u=e(a,[["render",l],["__file","pipe.html.vue"]]);export{u as default};
