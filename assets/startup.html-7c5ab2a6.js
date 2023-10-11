import{_ as e,o as a,c as i,e as d}from"./app-0418676b.js";const n={},s=d(`<h1 id="主程序" tabindex="-1"><a class="header-anchor" href="#主程序" aria-hidden="true">#</a> 主程序</h1><p>在 <code>@halsp/core</code> 导出一个类 <code>Startup</code>，作为主程序对象，每种运行环境都会在此类中添加实例方法</p><p>你可以在这个主程序对象添加插件和中间件</p><p>文档中的 <code>startup</code> 均表示主程序实例对象，但并不特指运行环境</p><p>为了让 halsp 能够在各类环境中使用，<code>Startup</code> 类设计的较为开放，本身仅包含基本中间件功能</p><p>因此该类一般不会直接使用，需要配合相关运行环境插件</p><h2 id="运行环境" tabindex="-1"><a class="header-anchor" href="#运行环境" aria-hidden="true">#</a> 运行环境</h2><p>Halsp 提供了多种运行环境</p><p>目前已支持的运行环境参考 <a href="../env/native">运行环境介绍</a></p><h2 id="启动文件" tabindex="-1"><a class="header-anchor" href="#启动文件" aria-hidden="true">#</a> 启动文件</h2><p>在 <code>src</code> 下需要有 <code>index.ts</code> 或 <code>main.ts</code> 文件作为入口，此规则用于 <code>@halsp/cli</code> 正确解析代码，内容如</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>// index.ts / main.ts
import { Startup } from &quot;@halsp/core&quot;;
import &quot;@halsp/inject&quot;;
import &quot;@halsp/router&quot;;
import &quot;@halsp/native&quot;;

new Startup()
  .useNative()
  .use(async (ctx, next) =&gt; {
    ctx.res.set(&quot;mode&quot;, p<wbr>rocess.env.NODE_ENV);
    await next();
  })
  .useInject()
  .useRouter()
  .listen();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>如果 <code>src</code> 下有 <code>native.ts</code> 文件，<code>@halsp/cli</code> 将优先以此文件为入口，一般用于特殊情况的本地调试</p></div><h2 id="中间件" tabindex="-1"><a class="header-anchor" href="#中间件" aria-hidden="true">#</a> 中间件</h2><p>startup 提供了两个方法添加中间件</p><ul><li>use 一般用于添加简单中间件，中间件是一个回调函数</li><li>add 用于添加类中间件，一般用于添加较复杂中间件，或需要将一系列操作封装为一个中间件</li></ul><p>更多关于中间件的介绍，查看后面的 <a href="./middleware">中间件</a> 部分</p>`,17),t=[s];function c(r,l){return a(),i("div",null,t)}const u=e(n,[["render",c],["__file","startup.html.vue"]]);export{u as default};
