import{_ as e,o as n,c as a,e as i}from"./app-0418676b.js";const s={},l=i(`<h1 id="koa-halsp-koa" tabindex="-1"><a class="header-anchor" href="#koa-halsp-koa" aria-hidden="true">#</a> Koa <code>(@halsp/koa)</code></h1><p>安装 <code>@halsp/koa</code> 以支持 Koa 功能</p><ul><li>让 <code>halsp</code> 可以使用 <code>koa</code> 中间件</li><li>或让 halsp 成为 koa 的中间件</li><li>打通二者中间件管道</li><li>可以用 <code>koa</code> 托管 <code>halsp</code></li></ul><h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>npm i @halsp/koa
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="快速开始" tabindex="-1"><a class="header-anchor" href="#快速开始" aria-hidden="true">#</a> 快速开始</h2><h3 id="在-halsp-中使用-koa-的中间件" tabindex="-1"><a class="header-anchor" href="#在-halsp-中使用-koa-的中间件" aria-hidden="true">#</a> 在 Halsp 中使用 Koa 的中间件</h3><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/koa&quot;;

startup
  .use(async (ctx, next) =&gt; {
    console.log(&quot;step 1&quot;);
    await next();
    console.log(&quot;step 7&quot;);
  })
  .koa(async (ctx, next) =&gt; {
    console.log(&quot;step 2&quot;);
    await next();
    console.log(&quot;step 6&quot;);
  })
  .koa(async (ctx, next) =&gt; {
    console.log(&quot;step 3&quot;);
    await next();
    console.log(&quot;step 5&quot;);
  })
  .use((ctx) =&gt; {
    console.log(&quot;step 4&quot;);
  });
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="将-halsp-作为-koa-的中间件" tabindex="-1"><a class="header-anchor" href="#将-halsp-作为-koa-的中间件" aria-hidden="true">#</a> 将 Halsp 作为 Koa 的中间件</h3><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Koa } from &quot;koa&quot;;

const koa = new Koa()
  .use(async (ctx, next) =&gt; {
    console.log(&quot;step 1&quot;)
    await next();
    console.log(&quot;step 5&quot;)
  })
  .use(
    koaHalsp((startup) =&gt; {
      startup.use(async (ctx, next) =&gt; {
        console.log(&quot;step 2&quot;)
        await next();
        console.log(&quot;step 4&quot;)
      });
    })
  )
  .use((ctx) =&gt; {
    console.log(&quot;step 3&quot;)
  });
const server = koa.listen(2333);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="中间件管道" tabindex="-1"><a class="header-anchor" href="#中间件管道" aria-hidden="true">#</a> 中间件管道</h2><p>@halsp/koa 会打通 halsp 和 koa 的中间件管道，就像你在 halsp 中使用 koa 中间件一样</p><p>管道流向：</p><ol><li>如果在 <code>startup.koa</code> 后仍有 halsp 中间件：halsp -&gt; koa -&gt; halsp -&gt; koa -&gt; halsp</li><li>如果在 <code>startup.koa</code> 后没有 halsp 中间件，或 koa 某个中间件是管道终点：halsp -&gt; koa -&gt; halsp</li></ol><p>因此你还可以这样玩：</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import cors from &quot;koa-cors&quot;;

startup
  .koa(async (ctx, next) =&gt; {
    ctx.body = &quot;Halsp loves Koa&quot;;
    await next();
  })
  .koa(async (ctx) =&gt; {
    ctx.set(&quot;koa&quot;, &quot;halsp&quot;);
    await next();
  })
  .use(async (ctx, next) =&gt; {
    console.log(ctx.res.body); // &quot;Halsp loves Koa&quot;
    await next();
  })
  .koa(cors())
  .use(async (ctx) =&gt; {
    console.log(ctx.res.getHeader(&quot;koa&quot;)); // &quot;halsp&quot;
  });
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="解析请求体" tabindex="-1"><a class="header-anchor" href="#解析请求体" aria-hidden="true">#</a> 解析请求体</h2><p>为了兼容各运行环境，halsp 的 ctx.body 都是已解析好的数据</p><p>因此如果请求体没有被解析，有两种方式解析：</p><ol><li>先解析流并将解析后的内容放入 <code>ctx.body</code>，如 <code>co-body</code>, <code>formidable</code> 等工具</li><li>在 <code>Halsp</code> 中间件中使用 <code>@halsp/body</code>，如 <code>startup.useHttpJsonBody()</code></li></ol>`,20),d=[l];function o(t,c){return n(),a("div",null,d)}const u=e(s,[["render",o],["__file","koa.html.vue"]]);export{u as default};
