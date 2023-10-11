import{_ as e,o as d,c as a,e as i}from"./app-0418676b.js";const s={},l=i(`<h1 id="mva-框架-halsp-mva" tabindex="-1"><a class="header-anchor" href="#mva-框架-halsp-mva" aria-hidden="true">#</a> MVA 框架 <code>(@halsp/mva)</code></h1><p>安装 <code>@halsp/mva</code> 以支持 MVA 功能</p><p><code>@halsp/mva</code> 基于 <code>@halsp/router</code> ，<code>@halsp/view</code></p><p><code>@halsp/mva</code> 可以将路由返回结果，与模板自动对应并渲染返回</p><h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><p>npm i @halsp/mva</p><h2 id="简单使用" tabindex="-1"><a class="header-anchor" href="#简单使用" aria-hidden="true">#</a> 简单使用</h2><p>在入口文件中</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/mva&quot;;

startup.useMva();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>参考 <code>@halsp/router</code> 在根目录中（ts 项目为 src 目录）添加以下文件夹：</p><ol><li>路由文件夹 <code>actions</code>，并编写 <code>action</code></li><li>视图文件夹 <code>views</code> ，并编写相应视图模板</li></ol><h2 id="配置参数" tabindex="-1"><a class="header-anchor" href="#配置参数" aria-hidden="true">#</a> 配置参数</h2><p><code>useMvc</code> 接收一个可选配置参数</p><ul><li>viewOptions: 与 <code>useView</code> 参数相同</li><li>routerOptions: 与 <code>useRouter</code> 参数相同</li><li>codes: 指定状态码对应的模板，一般用于展示错误页面</li></ul><h2 id="过滤器" tabindex="-1"><a class="header-anchor" href="#过滤器" aria-hidden="true">#</a> 过滤器</h2><p>基于 <code>@halsp/filter</code>，提供了 <code>ResultFilter</code> 过滤器</p><p>在渲染视图之前会执行 <code>onResultExecuting</code>，如果函数返回 false 将终止剩余 <code>ResultFilter</code> 过滤器执行，并取消渲染视图</p><p>在渲染视图之后执行 <code>onResultExecuted</code>，可用于统一返回视图结果</p><h3 id="创建过滤器" tabindex="-1"><a class="header-anchor" href="#创建过滤器" aria-hidden="true">#</a> 创建过滤器</h3><p>新建一个类并实现 <code>ResultFilter</code> 接口</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { ResultFilter } from &quot;@halsp/mva&quot;;

class TestFilter implements ResultFilter {
  onResultExecuted(ctx: Context): void | Promise&lt;void&gt; {
    ctx.res.setHeader(&quot;result2&quot;, 2);
  }
  onResultExecuting(
    ctx: Context
  ): boolean | void | Promise&lt;void&gt; | Promise&lt;boolean&gt; {
    ctx.res.setHeader(&quot;result1&quot;, 1);
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,21),c=[l];function n(o,t){return d(),a("div",null,c)}const u=e(s,[["render",n],["__file","mva.html.vue"]]);export{u as default};
