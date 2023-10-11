import{_ as s,r,o as t,c as l,a as e,b as i,d,e as n}from"./app-0418676b.js";const c={},o=n(`<h1 id="原生-nodejs-服务-halsp-native" tabindex="-1"><a class="header-anchor" href="#原生-nodejs-服务-halsp-native" aria-hidden="true">#</a> 原生 NodeJS 服务 <code>(@halsp/native)</code></h1><p>安装 <code>@halsp/native</code> 以支持 NodeJS 原生运行环境</p><ul><li>让 Halsp 能够运行于 NodeJS 原生运行环境</li><li>你可以随时将 Halsp 云函数简单改为 nginx 托管的 Halsp 原生服务</li><li>也可以将 nginx 托管的 Halsp 原生服务简单改为 Halsp 云函数</li></ul><h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>npm i @halsp/native
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="快速开始" tabindex="-1"><a class="header-anchor" href="#快速开始" aria-hidden="true">#</a> 快速开始</h2><p>以下示例开启一个服务，端口是 9504</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Startup } from &quot;@halsp/core&quot;;
import &quot;@halsp/native&quot;;

new Startup()
  .useNative()
  .use(async (ctx) =&gt; {
    ctx.ok(&quot;@halsp/native&quot;);
  })
  .listen(9504);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>@halsp/native 也支持 https，上述示例中增加参数 <code>https</code>，值为相关 https 配置</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>new Startup()
  .useNative({
    https: {
      cert: &quot;&quot;,
    }
  })
  .use(async (ctx) =&gt; {
    ctx.ok(&quot;@halsp/native&quot;);
  })
  .listen(9504);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="组合其他中间件" tabindex="-1"><a class="header-anchor" href="#组合其他中间件" aria-hidden="true">#</a> 组合其他中间件</h2><h3 id="halsp-router" tabindex="-1"><a class="header-anchor" href="#halsp-router" aria-hidden="true">#</a> @halsp/router</h3><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Startup } from &quot;@halsp/core&quot;;
import &quot;@halsp/native&quot;;
import &quot;@halsp/router&quot;;

new Startup()
  .useNative()
  .useRouter()
  .listen(9504);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="halsp-static" tabindex="-1"><a class="header-anchor" href="#halsp-static" aria-hidden="true">#</a> @halsp/static</h3><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Startup } from &quot;@halsp/core&quot;;
import &quot;@halsp/native&quot;;
import &quot;@halsp/static&quot;;

new Startup()
  .useNative()
  .useStatic()
  .listen(9504);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="body-解析" tabindex="-1"><a class="header-anchor" href="#body-解析" aria-hidden="true">#</a> body 解析</h2><p>基于 <code>@halsp/body</code> 支持四种 body 解析</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Startup } from &quot;@halsp/core&quot;;
import &quot;@halsp/native&quot;;

new Startup()
  .useNative()
  .useHttpJsonBody()
  .useHttpTextBody()
  .useHttpUrlencodedBody()
  .useHttpMultipartBody()
  .listen(9504);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="json" tabindex="-1"><a class="header-anchor" href="#json" aria-hidden="true">#</a> json</h3>`,19),u={href:"https://github.com/koajs/koa-body",target:"_blank",rel:"noopener noreferrer"},v=n(`<div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.useHttpJsonBody()
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>或</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.useHttpJsonBody({
  strict: true,
  limit: &quot;1mb&quot;,
  encoding: &quot;utf-8&quot;,
  returnRawBody: false,
  onError: (ctx, err) =&gt; {},
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>默认已支持 json</p></div><h3 id="text" tabindex="-1"><a class="header-anchor" href="#text" aria-hidden="true">#</a> text</h3>`,5),m={href:"https://github.com/koajs/koa-body",target:"_blank",rel:"noopener noreferrer"},p=n(`<div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.useHttpTextBody()
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>或</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.useHttpTextBody({
  limit: &quot;1mb&quot;,
  encoding: &quot;utf-8&quot;,
  returnRawBody: false,
  onError: (ctx, err) =&gt; {},
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="urlencoded" tabindex="-1"><a class="header-anchor" href="#urlencoded" aria-hidden="true">#</a> urlencoded</h3>`,4),b={href:"https://github.com/koajs/koa-body",target:"_blank",rel:"noopener noreferrer"},h=n(`<div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.useHttpUrlencodedBody()
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>或</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.useHttpUrlencodedBody({
  queryString:&#39;&#39;,
  limit: &quot;1mb&quot;,
  encoding: &quot;utf-8&quot;,
  returnRawBody: false,
  onError: (ctx, err) =&gt; {},
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="multipart" tabindex="-1"><a class="header-anchor" href="#multipart" aria-hidden="true">#</a> multipart</h3>`,4),g={href:"https://github.com/node-formidable/formidable",target:"_blank",rel:"noopener noreferrer"},S=n(`<div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.useHttpMultipartBody()
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>或</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.useHttpMultipartBody({
  opts: {
    multiples: true,
  },
  limit: &quot;1mb&quot;,
  encoding: &quot;utf-8&quot;,
  onFileBegin: async (ctx, formName, file) =&gt; {
    ctx.res.set(&quot;file-name&quot;, file.name ?? &quot;&quot;);
  },
  onError: (ctx, err) =&gt; {},
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="resstream-reqstream" tabindex="-1"><a class="header-anchor" href="#resstream-reqstream" aria-hidden="true">#</a> <code>resStream</code> &amp; <code>reqStream</code></h2><p>一般情况下使用 <code>ctx.res</code> 和 <code>ctx.req</code> 即可，并且可以更好的配合其他中间件。</p><p>为了应对特殊需求，<code>@halsp/native</code> 在 ctx 中也加入了 <code>resStream</code> 和 <code>reqStream</code></p><p>特殊情况下你也可以按原生方法操作 <code>ctx.resStream</code> 和 <code>ctx.reqStream</code>，如 <code>@halsp/ws</code> 支持 <code>WebSocket</code></p><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>如果提前调用了 <code>reqStream.end()</code>，<code>ctx.res</code> 最终将不会被写入返回结果</p></div>`,8);function x(q,f){const a=r("ExternalLinkIcon");return t(),l("div",null,[o,e("p",null,[i("接收参数参考 "),e("a",u,[i("co-body"),d(a)])]),v,e("p",null,[i("接收参数参考 "),e("a",m,[i("co-body"),d(a)])]),p,e("p",null,[i("接收参数参考 "),e("a",b,[i("co-body"),d(a)])]),h,e("p",null,[i("接收参数参考 "),e("a",g,[i("formidable"),d(a)])]),S])}const _=s(c,[["render",x],["__file","native.html.vue"]]);export{_ as default};
