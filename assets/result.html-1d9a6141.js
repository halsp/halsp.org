import{_ as e,o as i,c as d,e as l}from"./app-0418676b.js";const s={},a=l(`<h1 id="请求处理" tabindex="-1"><a class="header-anchor" href="#请求处理" aria-hidden="true">#</a> 请求处理</h1><p>Halsp 有开箱即用的获取请求参数的方式，同时也内置了一些处理返回结果的功能</p><h2 id="请求上下文-context" tabindex="-1"><a class="header-anchor" href="#请求上下文-context" aria-hidden="true">#</a> 请求上下文 Context</h2><p>中间件管道中的内容都在 <code>Context</code> 对象之中，每个中间件都可以调用 <code>this.ctx</code> 来获取或修改中间件管道内容</p><p>该对象包含以下内容：</p><ul><li>res 字段: <code>Response</code> 实例对象</li><li>req 字段: <code>Request</code> 实例对象</li><li>get/set/has/delete：用于在中间件管道中传递更多内容</li></ul><h3 id="response" tabindex="-1"><a class="header-anchor" href="#response" aria-hidden="true">#</a> Response</h3><p>作为 API 返回内容（在 Startup 中可能会被解析后返回）</p><p>包含以下内容</p><ul><li>headers: 返回的头部</li><li>body: 返回的内容</li><li>status: 返回状态码</li><li>isSuccess: 返回值是否成功，status &gt;= 200 &amp;&amp; status &lt; 300</li><li>setHeaders: 设置多个 header</li><li>set: 设置单个 header</li><li>has: 判断 header 是否存在，忽略 key 大小写</li><li>remove: 移除一个 header，忽略 key 大小写</li><li>append: 在已有 header 后追加，或新加 header</li><li>get: 获取一个 header 值，忽略 key 大小写</li><li>其他结果函数</li></ul><p>在每个中间件中，都可以修改 <code>this.ctx.res</code> 中的内容</p><h3 id="request" tabindex="-1"><a class="header-anchor" href="#request" aria-hidden="true">#</a> Request</h3><p>在中间件中，可通过 <code>this.ctx.req</code> 方式获取请求内容</p><p><code>req</code> 对象包含以下内容</p><ul><li>path: 访问路径，不带域名和查询参数，自动去除开头 <code>/</code></li><li>params: 查询参数</li><li>body: body 内容</li><li>headers: 获取 header 的深拷贝值，get 属性</li><li>setHeaders: 设置多个 header</li><li>set: 设置单个 header</li><li>has: 判断 header 是否存在，忽略 key 大小写</li><li>remove: 移除一个 header，忽略 key 大小写</li><li>get: 获取一个 header 值，忽略 key 大小写</li></ul><p>也可以使用更灵活的 <a href="./pipe">管道</a> 来获取请求内容</p><h4 id="x-http-method-override" tabindex="-1"><a class="header-anchor" href="#x-http-method-override" aria-hidden="true">#</a> X-HTTP-Method-Override</h4><p>如果请求头部包含 <code>X-HTTP-Method-Override</code> 参数，则访问方法 <code>httpMethod</code> 以 <code>X-HTTP-Method-Override</code> 值为准</p><p>比如 Action 要求 <code>PATCH</code> 请求，但微信小程序不支持 <code>PATCH</code>，那么可以使用 <code>POST</code> 访问，并在头部加上此参数，值为 <code>PATCH</code></p><div class="language-JSON line-numbers-mode" data-ext="JSON"><pre class="language-JSON"><code>&quot;headers&quot;:{
  &quot;X-HTTP-Method-Override&quot;: &quot;PATCH&quot;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="传递内容" tabindex="-1"><a class="header-anchor" href="#传递内容" aria-hidden="true">#</a> 传递内容</h3><p>可以通过 <code>ctx.get/ctx.set/ctx.has/ctx.delete</code> 在管道中传递更多自定义内容。</p><p>如果使用 TS，可以借泛型特性获得更多智能提示。</p><p>Halsp 支持 3 种生命周期的内容</p><ul><li>singleton: 单例模式，添加后可多次获取同一引用</li><li>scoped: 单次请求，在单次请求内，每次获取都会获取同一引用</li><li>transient: 临时模式，添加后每次获取都会创建一个新引用</li></ul><p>如果是值类型，每次获取的都是该值的拷贝</p><h4 id="添加或修改" tabindex="-1"><a class="header-anchor" href="#添加或修改" aria-hidden="true">#</a> 添加或修改</h4><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>// singleton
this.ctx.set(&quot;BAG_NAME&quot;, &#39;singleton&#39;, () =&gt; { /*content*/ });
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>OR</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>// transient
this.ctx.set(&quot;BAG_NAME&quot;, &#39;transient&#39;, () =&gt; { /*content*/ });
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="获取内容" tabindex="-1"><a class="header-anchor" href="#获取内容" aria-hidden="true">#</a> 获取内容</h4><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>const val = this.ctx.get(&quot;BAG_NAME&quot;)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>或使用模板类型</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>const val = this.ctx.get&lt;string&gt;(&quot;BAG_NAME&quot;)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="内置结果函数" tabindex="-1"><a class="header-anchor" href="#内置结果函数" aria-hidden="true">#</a> 内置结果函数</h2><p>在 <code>Response</code> 和中间件中，内置一些返回结果函数，用于快速设置返回状态码和 body：</p><ul><li>ok, 200</li><li>created, 201</li><li>accepted, 202</li><li>noContent, 204</li><li>partialContent, 206</li><li>redirect, 30*</li><li>badRequest, 400</li><li>badRequestMsg, 400</li><li>forbidden, 403</li><li>forbiddenMsg, 403</li><li>notFound, 404</li><li>notFoundMsg, 404</li><li>methodNotAllowed, 405</li><li>methodNotAllowedMsg, 405</li><li>notAcceptable, 406</li><li>notAcceptableMsg, 406</li><li>requestTimeout, 408</li><li>requestTimeoutMsg, 40</li><li>conflict, 409</li><li>conflictMsg, 409</li><li>gone, 410</li><li>goneMsg, 410</li><li>preconditionFailed, 412</li><li>preconditionFailedMsg, 412</li><li>requestTooLong, 413</li><li>requestTooLongMsg, 413</li><li>unsupportedMediaType, 415</li><li>unsupportedMediaTypeMsg, 415</li><li>imATeapot, 418</li><li>imATeapotMsg, 418</li><li>misdirected, 421</li><li>misdirectedMsg, 421</li><li>unprocessableEntity, 421</li><li>unprocessableEntityMsg, 421</li><li>internalServerError, 500</li><li>internalServerErrorMsg, 500</li><li>notImplemented, 501</li><li>notImplementedMsg, 501</li><li>badGateway, 502</li><li>badGatewayMsg, 502</li><li>serviceUnavailable, 503</li><li>serviceUnavailableMsg, 503</li><li>gatewayTimeout, 504</li><li>gatewayTimeoutMsg, 504</li><li>httpVersionNotSupported, 505</li><li>httpVersionNotSupportedMsg, 505</li></ul><p>如在类中间件中</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &quot;@halsp/core&quot;;

class TestMiddleware extends Middleware{
  async invoke() {
    this.ok(&quot;success&quot;);
    await this.next();
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>等同于</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &quot;@halsp/core&quot;;

class TestMiddleware extends Middleware{
  async invoke() {
    this.ctx.res.body = &quot;success&quot;;
    this.ctx.res.status = 200;
    await this.next();
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如下方式读取请求参数并返回</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &quot;@halsp/core&quot;;

export default class extends Middleware {
  async invoke() {
    const { account, password } = this.ctx.req.query;

    if (/*Incorrect username or password*/) {
      this.notFoundMsg({ message: &quot;Incorrect username or password&quot; });
    } else {
      this.ok({
        /*messages*/
      });
    }
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>多数内置函数支持传入 <code>body</code> 可选参数，<code>body</code> 为返回的内容。</p><p>API 返回错误时，可统一返回 <code>ErrorMessage</code>，命名以 <code>Msg</code> 结尾的内置类型接受 <code>ErrorMessage</code> 参数。</p><p>如</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>ctx.res.notFoundMsg(&quot;not found&quot;);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,47),n=[a];function t(r,o){return i(),d("div",null,n)}const u=e(s,[["render",t],["__file","result.html.vue"]]);export{u as default};
