import{_ as e,o as i,c as d,e as n}from"./app-0418676b.js";const l={},s=n(`<h1 id="中间件" tabindex="-1"><a class="header-anchor" href="#中间件" aria-hidden="true">#</a> 中间件</h1><p>在 Halsp 中，大部分功能都是由中间件实现的</p><p>中间件的功能包括：</p><ul><li>执行代码</li><li>修改请求和响应对象</li><li>拦截请求</li><li>调用下一个中间件</li></ul><h2 id="执行顺序" tabindex="-1"><a class="header-anchor" href="#执行顺序" aria-hidden="true">#</a> 执行顺序</h2><p>Halsp 的中间件采用了洋葱圈模型，即</p><ul><li>进入中间件并执行代码</li><li>执行下一个中间件</li><li>执行剩余代码并返回上一个中间件</li></ul><p>如果没有执行下一个中间件，请求会沿当前中间件直接返回上一个中间件</p><h2 id="中间件类型" tabindex="-1"><a class="header-anchor" href="#中间件类型" aria-hidden="true">#</a> 中间件类型</h2><p>有两种中间件</p><ul><li>类中间件</li><li>函数式中间件</li></ul><p>如果中间件代码较多，建议使用类中间件，让代码更易读</p><p>函数式中间件最终会被转换为类中间件执行，但你可能无需关注这个特点</p><h2 id="使用中间件" tabindex="-1"><a class="header-anchor" href="#使用中间件" aria-hidden="true">#</a> 使用中间件</h2><p>类中间件和函数式中间件使用方式不同，但都大同小异</p><p>中间件执行的顺序严格遵循添加顺序</p><h3 id="函数式中间件" tabindex="-1"><a class="header-anchor" href="#函数式中间件" aria-hidden="true">#</a> 函数式中间件</h3><p>通过 startup.use 添加</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup
  .use(async (ctx, next)=&gt;{
    ctx.res.set(&quot;h1&quot;, 1);
    await next();
    ctx.res.set(&quot;h3&quot;, 3);
  })
  .use((ctx)=&gt;{
    ctx.res.set(&quot;h2&quot;, 2);
  })
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="类中间件" tabindex="-1"><a class="header-anchor" href="#类中间件" aria-hidden="true">#</a> 类中间件</h3><p>通过 startup.add 添加</p><p>创建一个类，并继承 <code>Middleware</code>，实现 <code>invoke</code> 函数</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>class TestMiddleware extends Middleware{
  async invoke(){
    this.ctx.res.set(&quot;h1&quot;,1);
    await this.next();
    this.ctx.res.set(&quot;h2&quot;,2);
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.add(TestMiddleware) // 一般中间件
// OR
startup.add(new TestMiddleware()) // 不推荐
// OR
startup.add(async (ctx) =&gt; TestMiddleware) // 动态中间件
// OR
startup.add(async (ctx) =&gt; new TestMiddleware()) // 动态中间件并自行实例化
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="组合中间件" tabindex="-1"><a class="header-anchor" href="#组合中间件" aria-hidden="true">#</a> 组合中间件</h3><p><code>ComposeMiddleware</code> 中间件可以组合多个中间件</p><p>这些中间件形成的中间件管道，会与主中间件管道相连接</p><p>支持多层嵌套组合</p><p>该类的成员函数 <code>add</code> 和 <code>use</code> 与 <code>Startup</code> 用法相同</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup
  .use(async (ctx, next) =&gt; {
    await next();
  })
  .add(() =&gt;
    new ComposeMiddleware()
      .use(async (ctx, next) =&gt; {
        await next();
      })
      .add(() =&gt;
        new ComposeMiddleware()
          .use(async (ctx, next) =&gt; {
            await next();
          })
          .add(() =&gt;
            new ComposeMiddleware()
              .use(async (ctx, next) =&gt; {
                await next();
              })
              .use(async (ctx, next) =&gt; {
                await next();
              })
          )
          .use(async (ctx, next) =&gt; {
            await next();
          })
      )
      .use(async (ctx, next) =&gt; {
        await next();
      })
  )
  .use(async (ctx, next) =&gt; {
    await next();
  });
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="中间件钩子" tabindex="-1"><a class="header-anchor" href="#中间件钩子" aria-hidden="true">#</a> 中间件钩子</h2><p>中间件钩子可以在中间件的不同生命周期，运行指定的代码</p><ul><li>钩子本质也会被转换为中间件</li><li>钩子只会作用于其后的中间件</li></ul><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.hook(HookType, (ctx, md) =&gt; {
  // do something
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>该函数有两个参数</p><ol><li>钩子类型，有以下几种钩子 <ul><li><code>BeforeInvoke</code>：在中间件执行之前执行，默认参数。若返回 <code>false</code> 则终止后续同类型钩子执行，并且不执行当前中间件</li><li><code>AfterInvoke</code>：在中间件执行之后执行，即 <code>next</code> 之后</li><li><code>BeforeNext</code>：在中间件 <code>next</code> 执行前执行，如果在中间件中没有调用 <code>next</code>，将不触发这种钩子，若返回 <code>false</code> 则终止后续同类型钩子执行，并且不执行下一个中间件</li><li><code>Constructor</code>：用于构造中间件，利用这种钩子可以动态使用中间件。但注册的中间件，必须是中间件的构造器，即 <code>startup.add(YourMiddleware)</code> 的方式</li><li><code>Exception</code>：中间件抛出异常时会执行这类钩子</li></ul></li><li>钩子回调函数，有两个或三个参数 <ul><li>参数 1：管道 Context 对象</li><li>参数 2：中间件对象或中间件构造函数 <ul><li>如果钩子类型为 <code>Constructor</code>，则参数为中间件构造函数</li><li>如果钩子类型为 <code>Exception</code>，则参数为 <code>HttpException</code> 对象或其派生对象</li><li>如果钩子类型为 <code>BeforeInvoke</code> 或 <code>AfterInvoke</code> 或 <code>BeforeNext</code>，则参数为中间件对象</li></ul></li><li>参数 3: 如果钩子类型为 <code>Exception</code>，则此参数为 Error 对象，否则无此参数</li><li>返回值： <ul><li>如果钩子类型为 <code>Constructor</code>，则需要返回中间件对象</li><li>如果钩子类型为 <code>Exception</code>，则返回值为 bool 类型 <ul><li>返回 true 说明在钩子函数中已处理异常，不会执行下一个异常钩子</li><li>返回 false 说明在钩子函数中未处理异常，会继续执行下一个异常钩子</li></ul></li><li>如果钩子类型为 <code>BeforeInvoke</code> 或 <code>AfterInvoke</code> 或 <code>BeforeNext</code>，则没有返回值</li></ul></li></ul></li></ol><p>其中参数 1 可省略，默认为 <code>BeforeInvoke</code></p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &quot;@halsp/core&quot;;

startup
    .hook((md) =&gt; {
      // 1 before hook
      if (md instanceof TestMiddleware) {
        md.count++;
      }
    })
    .add(TestMiddleware)
    .hook((md) =&gt; {
      // 2 before hook
      if (md instanceof TestMiddleware) {
        md.count++;
      }
    })
    .add(TestMiddleware)
    .hook((md) =&gt; {
      // 3 before hook
      if (md instanceof TestMiddleware) {
        md.count++;
      }
    })
    .hook(HookType.AfterInvoke, (ctx, md) =&gt; {
      // AfterInvoke: executed but without effective
      if (md instanceof TestMiddleware) {
        md.count++;
      }
    })
    .hook(HookType.BeforeNext, (ctx, md) =&gt; {
      // BeforeNext: executed before next
      if (md instanceof TestMiddleware) {
        md.count++;
      }
    })
    .add(TestMiddleware)
    .use((ctx) =&gt; ctx.ok());
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,38),a=[s];function c(r,t){return i(),d("div",null,a)}const u=e(l,[["render",c],["__file","middleware.html.vue"]]);export{u as default};
