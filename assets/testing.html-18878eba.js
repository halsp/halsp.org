import{_ as e,o as i,c as n,e as s}from"./app-0418676b.js";const d={},a=s(`<h1 id="单元测试-halsp-testing" tabindex="-1"><a class="header-anchor" href="#单元测试-halsp-testing" aria-hidden="true">#</a> 单元测试 <code>(@halsp/testing)</code></h1><p>安装 <code>@halsp/testing</code> 以添加单元测试功能</p><p><code>@halsp/testing</code> 内建了对多种运行环境的单元测试支持</p><h2 id="startup" tabindex="-1"><a class="header-anchor" href="#startup" aria-hidden="true">#</a> Startup</h2><p>增加了以下功能</p><ul><li><code>setContext</code> 函数，用于设置测试的请求 <code>Context</code> 或 <code>Request</code></li><li><code>keepThrow</code> 函数，调用之后，中间件如果抛出未处理错误，那么框架将不处理这个错误（默认 halsp 会处理错误，并修改状态码为 500）</li><li><code>test</code> 函数，开始根据请求执行已添加中间件</li><li><code>expect</code> 函数，用于测试断言</li><li><code>expectError</code> 函数，用于断言错误</li></ul><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Startup } from &quot;@halsp/core&quot;;
import &quot;@halsp/testing&quot;;

new Startup()
  .use(async (ctx, next) =&gt; {
    ctx.setBody(&quot;test&quot;);
    await next();
  })
  .expect((res) =&gt; {
    expect(res.body).toBe(&quot;test&quot;);
  })
  .test();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>设置 Cotnext 并且把未处理的错误抛出</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Startup } from &quot;@halsp/core&quot;;
import &quot;@halsp/testing&quot;;

it(&quot;should xxx&quot;, async () =&gt; {
  new Startup()
    .expect((res) =&gt; {
      expect(res.body).toBe(&quot;test&quot;);
    })
    .keepThrow()
    .setContext(new Context())
    .use(() =&gt; {
      ctx.setBody(&quot;test&quot;);
      await next();
    })
    .test();
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>断言有未处理错误</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Startup } from &quot;@halsp/core&quot;;
import &quot;@halsp/testing&quot;;

it(&quot;should xxx&quot;, async () =&gt; {
  new Startup()
    .expectError((err) =&gt; {
      expect(err.message).toBe(&quot;err&quot;);
    })
    .keepThrow()
    .use(() =&gt; {
      throw new Error(&quot;err&quot;);
    })
    .test();
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="native" tabindex="-1"><a class="header-anchor" href="#native" aria-hidden="true">#</a> Native</h2><p><code>@halsp/testing</code> 已内置对 <code>supertest</code> 的支持</p><p>需要单独安装 <code>supertest</code></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> supertest <span class="token parameter variable">-D</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>调用 <code>startup.nativeTest()</code> 会返回 <code>supertest</code> 实例</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Startup } from &quot;@halsp/core&quot;;
import &quot;@halsp/native&quot;;
import &quot;@halsp/testing&quot;;

it(&quot;should xxx&quot;, async () =&gt; {
  new Startup()
    .useNative()
    .keepThrow()
    .use((ctx) =&gt; {
      ctx.ok({
        method: ctx.req.method,
        path: ctx.req.path,
      });
    })
    .nativeTest()
    .get(&quot;/url&quot;)
    .expect(200, {
      method: &quot;GET&quot;,
      path: &quot;url&quot;,
    });
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container warning"><p class="custom-container-title">WARNING</p><p><code>startup.setContext</code> 不支持 <code>native</code></p></div><h2 id="response" tabindex="-1"><a class="header-anchor" href="#response" aria-hidden="true">#</a> Response</h2><p>Response 新增 <code>expect</code> 函数，用于断言请求结果</p><p>有下面几种使用方式</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>    expect(status: number): this;
    expect(status: number, body: any): this;
    expect(checker: (res: Response) =&gt; void): this;
    expect(body: any): this;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/testing&quot;;
import &quot;@halsp/http&quot;;
import { Startup } from &quot;@halsp/core&quot;;

new Startup()
  .useHttp()
  .use(async (ctx, next) =&gt; {
    ctx.ok(&quot;body-ok&quot;);
    await next();
  })
  .expect((res) =&gt;
    res
      .expect(200)
      .expect(200, &quot;body-ok&quot;)
      .expect(&quot;body-ok&quot;)
      .expect((res) =&gt; {
        expect(res.status).toBe(200);
      })
  );
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="中间件" tabindex="-1"><a class="header-anchor" href="#中间件" aria-hidden="true">#</a> 中间件</h2><p>Startup 新增函数 <code>expectMiddleware</code>，用于中间件的单元测试</p><p>注意，使用前需要先导入 <code>@halsp/testing</code></p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/testing&quot;;
import &quot;@halsp/http&quot;;
import { Middleware, Startup } from &quot;@halsp/core&quot;;

class TestMiddleware extends Middleware {
  fn() {
    return 1;
  }

  invoke(): void | Promise&lt;void&gt; {
    this.ok();
  }
}

new Startup()
  .useHttp()
  .expectMiddleware(TestMiddleware, (md) =&gt; {
    expect(md.fn()).toBe(1);
  })
  .add(TestMiddleware)
  run();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container warning"><p class="custom-container-title">WARNING</p><p>由于中间件执行顺序的原因，<code>startup.expectMiddleware</code> 需要写在 <code>startup.add</code> 之前</p></div><h2 id="服务-依赖注入" tabindex="-1"><a class="header-anchor" href="#服务-依赖注入" aria-hidden="true">#</a> 服务/依赖注入</h2><p>Startup 新增函数 <code>expectInject</code>，用于依赖注入服务的单元测试</p><p>安装了 <code>@halsp/inject</code> 的项目才能使用这个功能</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> @halsp/inject
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>注意，使用前需要先导入 <code>@halsp/testing</code></p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>class TestService1 {
  fn() {
    return 1;
  }
}
class TestService2 {
  @Inject
  private readonly testService1!: TestService1;

  fn() {
    return this.testService1.fn();
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/testing&quot;;
import { Startup } from &quot;@halsp/core&quot;;

new Startup()
  .useInject();
  .expectInject(TestService, (service) =&gt; {
    expect(service.fn()).toBe(1);
  });
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/testing&quot;;
import { Startup } from &quot;@halsp/core&quot;;

new Startup()
  .useInject();
  .inject(TestService, InjectType.Singleton)
  .expectInject(TestService, (service) =&gt; {
    expect(service.fn()).toBe(1);
  });
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="runin" tabindex="-1"><a class="header-anchor" href="#runin" aria-hidden="true">#</a> runin</h2><p>用于改变当前运行的路径，即改变 <code>process.cwd()</code> 的值</p><p>多用于与文件相关的单元测试</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { existsSync } from &quot;fs&quot;;
import { runin } from &quot;@halsp/testing&quot;;

await runin(&quot;./test&quot;, () =&gt; {
  expect(existsSync(&quot;./file.txt&quot;)).toBeTruthy();
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,41),t=[a];function l(r,c){return i(),n("div",null,t)}const u=e(d,[["render",l],["__file","testing.html.vue"]]);export{u as default};
