import{_ as r,r as t,o as s,c as o,a as e,b as d,d as a,e as n}from"./app-0418676b.js";const l={},c=e("h1",{id:"jwt-身份验证-halsp-jwt",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#jwt-身份验证-halsp-jwt","aria-hidden":"true"},"#"),d(" Jwt 身份验证 "),e("code",null,"(@halsp/jwt)")],-1),u=e("p",null,[d("安装 "),e("code",null,"@halsp/jwt"),d(" 以使用 Jwt 身份验证")],-1),h=e("p",null,[e("code",null,"@halsp/jwt"),d(" 基于以下内容")],-1),p={href:"https://github.com/auth0/node-jsonwebtoken",target:"_blank",rel:"noopener noreferrer"},v={href:"https://github.com/halsp/inject",target:"_blank",rel:"noopener noreferrer"},b=n(`<h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>npm install @halsp/jwt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="快速开始" tabindex="-1"><a class="header-anchor" href="#快速开始" aria-hidden="true">#</a> 快速开始</h2><p>在入口文件中</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/jwt&quot;;

startup.useJwt(options);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/jwt&quot;;

startup
  .useJwt(options)
  .useJwtVerify()
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="配置" tabindex="-1"><a class="header-anchor" href="#配置" aria-hidden="true">#</a> 配置</h2><p><code>useJwt</code> 接收一个配置参数，包括以下配置</p><h3 id="secret" tabindex="-1"><a class="header-anchor" href="#secret" aria-hidden="true">#</a> secret</h3><p>jwt 密钥</p><h3 id="publickey-privatekey" tabindex="-1"><a class="header-anchor" href="#publickey-privatekey" aria-hidden="true">#</a> publicKey &amp; privateKey</h3><p>jwt 公钥和私钥</p><p>RSA 和 ECDSA 加密的 PEM 公钥</p><h3 id="signoptions-verifyoptions" tabindex="-1"><a class="header-anchor" href="#signoptions-verifyoptions" aria-hidden="true">#</a> signOptions &amp; verifyOptions</h3><p>创建 <code>jwt token</code> 和验证 <code>jwt token</code> 是的配置参数</p>`,15),m={href:"https://github.com/auth0/node-jsonwebtoken",target:"_blank",rel:"noopener noreferrer"},w=n(`<h3 id="prefix" tabindex="-1"><a class="header-anchor" href="#prefix" aria-hidden="true">#</a> <code>prefix</code></h3><p><code>jwt token</code> 的前缀，用于解析，默认为 <code>Bearer</code></p><h3 id="tokenprovider" tabindex="-1"><a class="header-anchor" href="#tokenprovider" aria-hidden="true">#</a> tokenProvider</h3><p><code>tokenProvider</code> 是一个回调函数，用于指明 <code>jwt token</code> 的位置，如 <code>headers</code>/<code>query</code> 中</p><p>使用 <code>useJwt</code> 后会给 <code>Context</code> 对象增加 <code>jwtToken</code> 属性，默认取自请求头部 <code>Authorization</code> 值</p><p>设置 <code>tokenProvider</code> 后可以从其他位置获取 <code>jwt token</code></p><h2 id="内置验证-jwt" tabindex="-1"><a class="header-anchor" href="#内置验证-jwt" aria-hidden="true">#</a> 内置验证 jwt</h2><p><code>startup.useJwtVerify()</code> 可以添加对 jwt token 的验证</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup
  .useJwt()
  .useJwtVerify()
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>该函数接收两个可选参数</p><ul><li>skip: 回调函数，返回 <code>Promise&lt;bool&gt;</code><ul><li>如果值为 true，则不校验此次请求</li><li>如果值为 false，则校验此次请求的 <code>jwt token</code> 是否正确</li></ul></li><li>onError: 回调函数，验证 jwt 失败时会执行 <ul><li>如果不传此参数将使用默认逻辑返回 401</li><li>回调函数有两个参数：<code>Context</code> 和错误信息</li></ul></li></ul><h2 id="额外验证" tabindex="-1"><a class="header-anchor" href="#额外验证" aria-hidden="true">#</a> 额外验证</h2><p>如果只验证 token 并不满足需求，比如还需要比对 Redis 中的缓存 token</p><p>那么可以使用 <code>startup.useJwtExtraAuth</code> 添加额外的验证</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup
  .useJwt()
  .useJwtVerify()
  .useJwtExtraAuth((ctx) =&gt; bool)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>该函数接收一个回调函数，返回 <code>Promise&lt;bool&gt;</code></p><ul><li>如果返回值为 true，说明验证通过，会继续执行下一个中间件</li><li>如果返回值为 false，说明验证失败，将终止后续中间件执行</li></ul><p>如果回调函数返回 false，并且没有设置状态码（即默认值 <code>404</code>），也没有设置 <code>body</code>(<code>undefined</code>)，那么状态码会被自动设置为 <code>401</code></p><h2 id="jwtservice" tabindex="-1"><a class="header-anchor" href="#jwtservice" aria-hidden="true">#</a> JwtService</h2><p>在调用 <code>useJwt</code> 时就已经使用 <code>@halsp/inject</code> 注入了 <code>JwtService</code></p><p>用于更方便的处理 jwt</p><h3 id="引用" tabindex="-1"><a class="header-anchor" href="#引用" aria-hidden="true">#</a> 引用</h3><p>你可以通过 <code>控制反转</code> 的方式使用 <code>JwtService</code></p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>class YourMiddleware extends Middleware{
  @Inject
  private readonly jwtService!: JwtService;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>OR</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>@Inject
class YourMiddleware extends Middleware{
  constructor(private readonly jwtService: JwtService){}
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>OR</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>const jwtService = await ctx.getService(JwtService);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="提供方法" tabindex="-1"><a class="header-anchor" href="#提供方法" aria-hidden="true">#</a> 提供方法</h3><p>JwtService 提供了一些 jwt 相关的方法</p><h4 id="sign" tabindex="-1"><a class="header-anchor" href="#sign" aria-hidden="true">#</a> sign</h4><p>生成 jwt token</p><p>接收两个参数</p><ul><li>payload: jwt payload</li><li>options: jwt 配置，可选参数。优先使用这个配置，没有的配置项再使用 <code>useJwt</code> 传入的配置 <code>signOptions</code></li></ul><h4 id="verify" tabindex="-1"><a class="header-anchor" href="#verify" aria-hidden="true">#</a> verify</h4><p>验证 jwt token</p><p>如果验证失败会抛出异常，请使用 <code>try{}catch{}</code> 或 <code>Promise.catch</code></p><p>接收两个参数</p><ul><li>token: jwt token</li><li>options: jwt 配置，可选参数。优先使用这个配置，没有的配置项再使用 <code>useJwt</code> 传入的配置 <code>verifyOptions</code></li></ul><h4 id="decode" tabindex="-1"><a class="header-anchor" href="#decode" aria-hidden="true">#</a> decode</h4><p>解析 jwt token</p><p>如果解析失败返回 null，解析成功返回结果取决于传入参数，具体查看 ts 智能提示</p><p>接收两个参数</p><ul><li>token: jwt token</li><li>options: jwt 配置，可选参数。优先使用这个配置，没有的配置项再使用 <code>useJwt</code> 传入的配置</li></ul><h2 id="装饰器" tabindex="-1"><a class="header-anchor" href="#装饰器" aria-hidden="true">#</a> 装饰器</h2><p>你通过装饰器的方式，来快捷使用和解析 <code>jwt token</code></p><p>在中间件或服务中，被装饰的字段会被自动解析</p><h4 id="jwttoken" tabindex="-1"><a class="header-anchor" href="#jwttoken" aria-hidden="true">#</a> @JwtToken</h4><p>赋值为 <code>jwt token</code> 字符串</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &quot;@halsp/core&quot;;
import * as jwt from &quot;jsonwebtoken&quot;;

class TestMiddleware extends Middleware{
  @JwtToken
  private readonly token!: string;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="jwtobject" tabindex="-1"><a class="header-anchor" href="#jwtobject" aria-hidden="true">#</a> @JwtObject</h4><p>解析 <code>jwt token</code> 字符串并转为对象</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &quot;@halsp/core&quot;;
import * as jwt from &quot;jsonwebtoken&quot;;

class TestMiddleware extends Middleware{
  @JwtObject
  private readonly jwt!: jwt.Jwt;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="jwtpayload" tabindex="-1"><a class="header-anchor" href="#jwtpayload" aria-hidden="true">#</a> @JwtPayload</h4><p>只取 jwt payload 部分，如果是 json 字符串，则会自动解析</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &quot;@halsp/core&quot;;
import * as jwt from &quot;jsonwebtoken&quot;;

class TestMiddleware extends Middleware{
  @JwtPayload
  private readonly payload!: any;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,56);function j(g,f){const i=t("ExternalLinkIcon");return s(),o("div",null,[c,u,h,e("ul",null,[e("li",null,[e("a",p,[d("jsonwebtoken"),a(i)])]),e("li",null,[e("a",v,[d("@halsp/inject"),a(i)])])]),b,e("p",null,[d("具体配置参考 "),e("a",m,[d("jsonwebtoken"),a(i)])]),w])}const k=r(l,[["render",j],["__file","jwt.html.vue"]]);export{k as default};