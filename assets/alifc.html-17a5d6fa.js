import{_ as c,r as n,o as r,c as t,a as i,b as e,d as a,w as o,e as d}from"./app-0418676b.js";const u={},v=d(`<h1 id="阿里云函数计算-halsp-alifc" tabindex="-1"><a class="header-anchor" href="#阿里云函数计算-halsp-alifc" aria-hidden="true">#</a> 阿里云函数计算 <code>(@halsp/alifc)</code></h1><p>安装 <code>@halsp/alifc</code> 以支持阿里云函数计算运行环境</p><p>将 Halsp 托管到阿里云函数计算</p><blockquote><p>此环境只支持 HTTP 请求的函数。事件请求可以使用 <code>@halsp/lambda</code></p></blockquote><h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>npm i @halsp/alifc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="开始使用" tabindex="-1"><a class="header-anchor" href="#开始使用" aria-hidden="true">#</a> 开始使用</h2><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Startup } from &quot;@halsp/core&quot;;
import &quot;@halsp/alifc&quot;;

const startup = new Startup().useAlifc().use(async (ctx) =&gt; {
  ctx.ok(&quot;@halsp/alifc&quot;);
});
module.exports.handler = async (req, res, context) =&gt;
  await startup.run(req, res, context);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果添加 <code>@halsp/router</code></p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Startup } from &quot;@halsp/core&quot;;
import &quot;@halsp/alifc&quot;;
import &quot;@halsp/router&quot;;

const startup = new Startup()
  .useAlifc()
  .use(async (ctx) =&gt; {
    ctx.ok(&quot;@halsp/alifc&quot;);
  })
  .useRouter();
module.exports.handler = async (req, res, context) =&gt;
  await startup.run(req, res, context);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="解析-body" tabindex="-1"><a class="header-anchor" href="#解析-body" aria-hidden="true">#</a> 解析 body</h2><p>阿里云函数计算没有解析 body，但 <code>@halsp/alifc</code> 基于 <code>@halsp/body</code> 支持四种 body 解析</p><ul><li>json</li><li>text</li><li>urlencoded</li><li>multipart</li></ul><p>默认已支持 <code>json</code></p>`,14),p={href:"https://github.com/halsp/native",target:"_blank",rel:"noopener noreferrer"},m=d(`<div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>await new new Startup()
  .useAlifc()
  .useHttpJsonBody()
  .useHttpTextBody()
  .useHttpUrlencodedBody()
  .useHttpMultipartBody()
  .run(req, res, context);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="usealifc" tabindex="-1"><a class="header-anchor" href="#usealifc" aria-hidden="true">#</a> useAlifc</h2><p>调用 <code>startup.useAlifc()</code> 即开启阿里云函数计算功能</p><h2 id="cli-编译" tabindex="-1"><a class="header-anchor" href="#cli-编译" aria-hidden="true">#</a> CLI 编译</h2><p>使用 <code>@halsp/cli</code> 编译，会自动拷贝 <code>package.json</code> 文件至目标目录，并移除 <code>devDependencies</code> 中的依赖</p><p>你可以通过配置 <code>.halsprc.ts</code> 修改默认行为</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { defineConfig } from &quot;@halsp/cli&quot;;

export default defineConfig(() =&gt; {
  return {
    build: {
      copyPackage: true,
      removeDevDeps: true,
    },
  };
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>alifc 环境默认为 <code>true</code></p>`,8),h=i("code",null,"copyPackage",-1),b=i("code",null,"removeDevDeps",-1);function f(x,g){const s=n("ExternalLinkIcon"),l=n("RouterLink");return r(),t("div",null,[v,i("p",null,[e("使用详情参考 "),i("a",p,[e("@halsp/native"),a(s)])]),m,i("p",null,[e("配置参考 "),a(l,{to:"/en/env/cli/#%E9%A1%B9%E7%9B%AE%E9%85%8D%E7%BD%AE"},{default:o(()=>[e("@halsp/cli")]),_:1}),e(" 中的 "),h,e(" 和 "),b,e(" 配置")])])}const q=c(u,[["render",f],["__file","alifc.html.vue"]]);export{q as default};
