import{_ as e,o as s,c as i,e as o}from"./app-0418676b.js";const l={},d=o(`<h1 id="跨域-cors-halsp-cors" tabindex="-1"><a class="header-anchor" href="#跨域-cors-halsp-cors" aria-hidden="true">#</a> 跨域 CORS <code>(@halsp/cors)</code></h1><p>安装 <code>@halsp/cors</code> 以开启 Halsp 的跨域功能</p><h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>npm install @halsp/cors
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="快速开始" tabindex="-1"><a class="header-anchor" href="#快速开始" aria-hidden="true">#</a> 快速开始</h2><p>在入口文件中</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/cors&quot;;

startup.useCors();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>一般要在靠前的位置定义，因为有可能前面的中间件会中断中间件管道</p><p>防止出错的情况未能使跨域生效</p></div><h2 id="配置" tabindex="-1"><a class="header-anchor" href="#配置" aria-hidden="true">#</a> 配置</h2><p><code>useCors</code> 接收一个配置参数</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/cors&quot;;

startup.useCors({
  allowMethods: [&quot;GET&quot;, &quot;POST&quot;],
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以配置的字段如下</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>export interface Options {
  allowMethods?: string | string[];
  origin?: string | ((ctx: Context) =&gt; Promise&lt;string&gt; | string);
  exposeHeaders?: string | string[];
  allowHeaders?: string | string[];
  credentials?: boolean | ((ctx: Context) =&gt; Promise&lt;boolean&gt; | boolean);
  maxAge?: number;
  privateNetworkAccess?: boolean;
  secureContext?: boolean;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>origin</li></ul><p><code>Access-Control-Allow-Origin</code></p><p>默认与请求的 <code>Origin</code> 头相同</p><ul><li>allowMethods</li></ul><p><code>Access-Control-Allow-Methods</code></p><p>默认是 <code>GET,HEAD,PUT,POST,DELETE,PATCH</code></p><ul><li>exposeHeaders</li></ul><p><code>Access-Control-Expose-Headers</code></p><ul><li>allowHeaders</li></ul><p><code>Access-Control-Allow-Headers</code></p><ul><li>credentials</li></ul><p><code>Access-Control-Allow-Credentials</code></p><ul><li>credentials</li></ul><p><code>Access-Control-Allow-Credentials</code></p><ul><li>maxAge</li></ul><p><code>Access-Control-Max-Age</code></p><p>单位为秒</p><ul><li>privateNetworkAccess</li></ul><p><code>Access-Control-Allow-Private-Network</code></p><p>如果值为 true 并且请求头包含 <code>Access-Control-Request-Private-Network</code></p><p>那么返回头添加 <code>Access-Control-Allow-Private-Network</code> 值为 <code>true</code></p><ul><li>secureContext</li></ul><p><code>Cross-Origin-Opener-Policy</code> &amp; <code>Cross-Origin-Embedder-Policy</code></p><p>如果值为 <code>true</code>，添加头 <code>Cross-Origin-Opener-Policy</code> 值为 <code>same-origin</code>，头 <code>Cross-Origin-Embedder-Policy</code> 值为 <code>require-corp</code></p>`,37),r=[d];function c(n,a){return s(),i("div",null,r)}const u=e(l,[["render",c],["__file","cors.html.vue"]]);export{u as default};
