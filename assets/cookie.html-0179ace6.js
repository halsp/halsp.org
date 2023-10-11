import{_ as d,r as o,o as l,c,a as e,b as i,d as s,e as a}from"./app-0418676b.js";const r={},t=e("h1",{id:"cookie-halsp-cookie",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#cookie-halsp-cookie","aria-hidden":"true"},"#"),i(" Cookie "),e("code",null,"(@halsp/cookie)")],-1),u=e("p",null,[i("安装 "),e("code",null,"@halsp/cookie"),i(" 以开启 Halsp 的 Cookie 功能")],-1),v={href:"https://github.com/jshttp/cookie",target:"_blank",rel:"noopener noreferrer"},m={href:"https://github.com/nfriedly/set-cookie-parser",target:"_blank",rel:"noopener noreferrer"},p=a(`<h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>npm install @halsp/cookie
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="快速开始" tabindex="-1"><a class="header-anchor" href="#快速开始" aria-hidden="true">#</a> 快速开始</h2><p>在入口文件中</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/cookie&quot;;

startup.useCookie();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="获取请求-cookies" tabindex="-1"><a class="header-anchor" href="#获取请求-cookies" aria-hidden="true">#</a> 获取请求 cookies</h3><p>从 <code>ctx</code> 获取</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>const cookies = ctx.cookies;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>等价于从 <code>ctx.req</code> 获取</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>const cookies = ctx.req.cookies;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>也可以获取任一 name 的 cookie</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>const name = ctx.cookies.name;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>还可以利用 <code>@halsp/inject</code> 定义装饰器，通过依赖注入获取 cookies</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { ReadonlyDict } from &quot;@halsp/core&quot;;
import { Inject } from &quot;@halsp/inject&quot;;

// 自定义装饰器
export const Cookies = Inject((ctx) =&gt; ctx.cookies);

// 在服务中
export class CustomService {
  // 通过依赖注入初始化值
  @Cookies
  private readonly cookies!: ReadonlyDict&lt;string&gt;;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="设置响应-cookies" tabindex="-1"><a class="header-anchor" href="#设置响应-cookies" aria-hidden="true">#</a> 设置响应 cookies</h3><p>给 <code>ctx.cookies</code> 赋值即设置响应 cookies</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>ctx.cookies = {
  account: &quot;halsp.org&quot;,
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>等价于给 <code>ctx.res.cookies</code> 赋值</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>ctx.res.cookies = {
  account: &quot;halsp.org&quot;,
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>也可以赋值一个对象以支持参数</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>ctx.cookies = {
  account: {
    value: &quot;halsp.org&quot;,
    httpOnly: true,
    maxAge: 0,
  },
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>还可以给某个 name 的 cookie 赋值</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>ctx.res.cookies.account = &quot;halsp.org&quot;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="custom-container danger"><p class="custom-container-title">注意不能这样赋值</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>ctx.cookies.account = &quot;halsp.org&quot;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>ctx.cookies 属性的 get 方法是返回请求头的 cookie，等同于</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>ctx.req.cookies.account = &quot;halsp.org&quot;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>因此这种写法其实是给请求头的 cookie 赋值，不会抛出错误但在控制台会提示一个 error</p></div><h2 id="请求头-响应头" tabindex="-1"><a class="header-anchor" href="#请求头-响应头" aria-hidden="true">#</a> 请求头/响应头</h2><ul><li>请求的 cookies 从请求头 <code>cookie</code> 取得</li><li>响应的 cookies 会写到响应头 <code>Set-Cookie</code></li></ul><h2 id="配置" tabindex="-1"><a class="header-anchor" href="#配置" aria-hidden="true">#</a> 配置</h2><p><code>useCookie</code> 接收一个配置参数，有下面两个字段</p>`,28),h=e("code",null,"parse",-1),b={href:"https://github.com/jshttp/cookie",target:"_blank",rel:"noopener noreferrer"},g=e("code",null,"parse",-1),k=e("code",null,"serialize",-1),x={href:"https://github.com/jshttp/cookie",target:"_blank",rel:"noopener noreferrer"},S=e("code",null,"serialize",-1),T=a(`<div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/cookie&quot;;

startup.useCookie({
  serialize: {},
  parse: {
    httpOnly: true
  },
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>序列化配置也可以单次使用，在设置 cookie 时赋值一个 <code>SetCookieValueWithArgs</code> 对象</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>export type SetCookieValueWithArgs = {
  value: string;
  path?: string | undefined;
  expires?: Date | undefined;
  maxAge?: number | undefined;
  domain?: string | undefined;
  secure?: boolean | undefined;
  httpOnly?: boolean | undefined;
  sameSite?: string | undefined;
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>ctx.res.cookies.account = {
  value: &quot;halsp.org&quot;,
  httpOnly: true,
  maxAge: 0,
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,4);function _(f,q){const n=o("ExternalLinkIcon");return l(),c("div",null,[t,u,e("p",null,[i("基于 "),e("a",v,[i("cookie"),s(n)]),i(" 和 "),e("a",m,[i("set-cookie-parser"),s(n)])]),p,e("ul",null,[e("li",null,[h,i(" 解析配置，参考 "),e("a",b,[i("cookie"),s(n)]),i(" 的 "),g,i(" 函数参数配置")]),e("li",null,[k,i(" 全局序列化配置，参考 "),e("a",x,[i("cookie"),s(n)]),i(" 的 "),S,i(" 函数参数配置")])]),T])}const y=d(r,[["render",_],["__file","cookie.html.vue"]]);export{y as default};
