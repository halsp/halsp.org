import{_ as n,r as i,o as s,c as l,a,b as e,d as r,w as c,e as t}from"./app-0418676b.js";const o={},u=t(`<h1 id="云函数运行环境-halsp-lambda" tabindex="-1"><a class="header-anchor" href="#云函数运行环境-halsp-lambda" aria-hidden="true">#</a> 云函数运行环境 <code>(@halsp/lambda)</code></h1><p>安装 <code>@halsp/lambda</code> 以支持云函数运行环境</p><p>可以将 Halsp 项目托管到 腾讯云事件云函数、阿里云事件云函数、aws lambda、azure functions 等，提升云函数响应速度</p><h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><p>npm i @halsp/lambda</p><h2 id="开始使用" tabindex="-1"><a class="header-anchor" href="#开始使用" aria-hidden="true">#</a> 开始使用</h2><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Startup } from &quot;@halsp/core&quot;;
import &quot;@halsp/lambda&quot;;

const startup = new Startup().useLambda().use(async (ctx, next) =&gt; {
  ctx.res.headers.demo = &quot;@halsp/lambda&quot;;
  await next();
});
exports.main = async (e, c) =&gt; await startup.run(e, c);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果添加 <code>@halsp/router</code></p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Startup } from &quot;@halsp/core&quot;;
import &quot;@halsp/lambda&quot;;
import &quot;@halsp/router&quot;;

const startup = new Startup()
  .useLambda()
  .use(async (ctx, next) =&gt; {
    ctx.res.headers.demo = &quot;@halsp/lambda&quot;;
    await next();
  })
  .useRouter();
exports.main = async (e, c) =&gt; await startup.run(e, c);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="uselambda" tabindex="-1"><a class="header-anchor" href="#uselambda" aria-hidden="true">#</a> useLambda</h2><p>调用 <code>startup.useLambda()</code> 即开启 Lambda 云函数的功能</p><h2 id="cli-编译" tabindex="-1"><a class="header-anchor" href="#cli-编译" aria-hidden="true">#</a> CLI 编译</h2><p>使用 <code>@halsp/cli</code> 编译，会自动拷贝 <code>package.json</code> 文件至目标目录，并移除 <code>devDependencies</code> 中的依赖</p><p>你可以通过配置 <code>.halsprc.ts</code> 修改默认行为</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { defineConfig } from &quot;@halsp/cli&quot;;

export default defineConfig(() =&gt; {
  return {
    build: {
      copyPackage: true,
      removeDevDeps: true,
    },
  };
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>labmda 环境下，上面的两个值默认为 <code>true</code></p>`,16),m=a("code",null,"copyPackage",-1),v=a("code",null,"removeDevDeps",-1);function p(b,h){const d=i("RouterLink");return s(),l("div",null,[u,a("p",null,[e("配置参考 "),r(d,{to:"/zh/usage/cli/#%E9%A1%B9%E7%9B%AE%E9%85%8D%E7%BD%AE"},{default:c(()=>[e("@halsp/cli")]),_:1}),e(" 中的 "),m,e(" 和 "),v,e(" 配置")])])}const g=n(o,[["render",p],["__file","lambda.html.vue"]]);export{g as default};
