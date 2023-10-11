import{_ as s,r as d,o as l,c as o,a as i,b as e,d as r,w as t,e as n}from"./app-0418676b.js";const c={},p=n(`<h1 id="错误处理" tabindex="-1"><a class="header-anchor" href="#错误处理" aria-hidden="true">#</a> 错误处理</h1><p>任何程序都需要处理已知和未知异常</p><p>Halsp 提供了多种请求异常，也内置了基本异常处理的功能，还支持扩展异常处理</p><h2 id="异常类" tabindex="-1"><a class="header-anchor" href="#异常类" aria-hidden="true">#</a> 异常类</h2><p>Http 环境和微服务都提供了异常类</p><p>所有异常类都派生自 <code>@halsp/core</code> 的 <code>HalspException</code> 类</p><p>你可以在任何地方抛出请求异常，以终止当前中间件的运行，并使中间件管道立即转向</p><p>抛出请求异常后，框架会自动更新请求响应内容</p><h3 id="http" tabindex="-1"><a class="header-anchor" href="#http" aria-hidden="true">#</a> Http</h3><p>在 http 中，提供了许多派生自 <code>HttpException</code> 的异常类，当然 <code>HttpException</code> 也派生自 <code>HalspException</code></p><p>这些 http 异常类均来自于 <code>@halsp/http</code></p><p>分别与标准 <code>http</code> 状态码相对应</p><ul><li>BadGatewayException</li><li>BadRequestException</li><li>ConflictException</li><li>ForbiddenException</li><li>GatewayTimeoutException</li><li>GoneException</li><li>HttpException</li><li>HttpVersionNotSupportedException</li><li>ImATeapotException</li><li>InternalServerErrorException</li><li>MethodNotAllowedException</li><li>MisdirectedException</li><li>NotAcceptableException</li><li>NotFoundException</li><li>NotImplementedException</li><li>PreconditionFailedException</li><li>RequestTimeoutException</li><li>RequestTooLongException</li><li>ServiceUnavailableException</li><li>UnauthorizedException</li><li>UnprocessableEntityException</li><li>UnsupportedMediaTypeException</li></ul><h4 id="异常处理" tabindex="-1"><a class="header-anchor" href="#异常处理" aria-hidden="true">#</a> 异常处理</h4><p>如果抛出的是请求异常 <code>HttpException</code> 派生类的实例对象，那么会根据请求异常返回特定的 body 和 status</p><p>如抛出 <code>BadRequestException</code></p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware, BadRequestException } from &quot;@halsp/core&quot;;

class TestMiddleware extends Middleware{
  invoke(){
    throw new BadRequestException(&#39;error message&#39;);
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的代码会做两件事</p><ol><li>将状态码改为 400</li><li>将返回 body 改为</li></ol><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;message&quot;</span><span class="token operator">:</span> <span class="token string">&quot;error message&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;status&quot;</span><span class="token operator">:</span> <span class="token number">400</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果抛出的是其他异常，并且异常没有被捕获，那么返回的状态码将是 500，body 为</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;message&quot;</span><span class="token operator">:</span> <span class="token string">&quot;&lt;error.message&gt;&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;status&quot;</span><span class="token operator">:</span> <span class="token number">500</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="微服务" tabindex="-1"><a class="header-anchor" href="#微服务" aria-hidden="true">#</a> 微服务</h3><p>微服务提供的异常类来自于 <code>@halsp/micro</code></p><p>只有一个 <code>MicroException</code></p><p>抛出该异常类的实例对象，框架会自动设置请求结果 <code>Response.error</code></p><h2 id="中间件行为" tabindex="-1"><a class="header-anchor" href="#中间件行为" aria-hidden="true">#</a> 中间件行为</h2><p>抛出异常后，对于中间件的运行行为，默认会有以下影响</p><ul><li>当前中间件立即中断执行</li><li>中间件管道转向</li><li>当前中间件之前的中间件，照常反向执行并返回</li></ul><p>不难看出，抛出异常一般只会影响当前中间件和其后的中间件</p><h3 id="贯穿中间件" tabindex="-1"><a class="header-anchor" href="#贯穿中间件" aria-hidden="true">#</a> 贯穿中间件</h3><p>如果某个异常较为严重，需要完全终止此次请求的中间件执行</p><p>那么就需要抛出异常，并设置异常 <code>breakthrough</code> 的值为 <code>true</code>，可以使所有中间件都中断执行</p><p>即请求会立即返回，且中间件 <code>next()</code> 之后的代码不会被执行</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>const exception = new BadRequestException(&#39;error message&#39;);
exception.breakthrough = true;
throw exception;

// or

throw new BadRequestException(&#39;error message&#39;).setBreakthrough();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="确保部分代码执行" tabindex="-1"><a class="header-anchor" href="#确保部分代码执行" aria-hidden="true">#</a> 确保部分代码执行</h3><p>异常贯穿将导致无法正常执行中间件 <code>next()</code> 之后的代码</p><p>如果该中间件在 <code>next()</code> 之后的代码必须被执行，比如清理内存、日志记录等，你需要将这种代码写在 finally 块中</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>try {
  await this.next();
} finally {
  // 即使异常的 breakthrough 值为 true，这里的代码也会被执行
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="终止贯穿" tabindex="-1"><a class="header-anchor" href="#终止贯穿" aria-hidden="true">#</a> 终止贯穿</h3><p>可以在抛出异常中间件之前的中间件中，终止异常继续贯穿中间件</p><p>在 <code>catch</code> 块中设置异常的 <code>breakthrough</code> 值修改为 <code>false</code></p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>try {
  await this.next();
} catch (err) {
  if (err instanceof HttpException) {
    err.setBreakthrough(false);
  } else {
    throw err;
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="过滤器" tabindex="-1"><a class="header-anchor" href="#过滤器" aria-hidden="true">#</a> 过滤器</h2><p>Halsp 提供有多种过滤器，其中异常过滤器可以捕获在 Action 中间件中抛出的异常</p><p>更多内容可参考 <a href="./filter">过滤器</a> 文档</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>class CustomExceptionFilter implements ExceptionFilter&lt;Error&gt; {
  onException(ctx: Context, error: Error): Promise&lt;boolean&gt; {
    ctx.res.set(&#39;error&#39;, error.message);
  }
}

@UseFilters(CustomExceptionFilter)
export default class extends Action{
  invoke(){}
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>一般情况过滤器就能够满足需求，而且过滤器能让代码更易读</p><p>但是如果需要捕获其他中间件抛出的错误，那么就需要用到下面的异常钩子</p><h2 id="异常钩子" tabindex="-1"><a class="header-anchor" href="#异常钩子" aria-hidden="true">#</a> 异常钩子</h2>`,50),u=i("code",null,"startup.hook()",-1),v=n(`<p>添加异常钩子能够接管框架对异常的处理，比如你可以特殊处理某种异常，而其他异常按默认处理</p><p>如 <a href="./filter">@halsp/filter</a> 中的异常过滤器，就是使用的异常钩子，并且只处理 <code>@halsp/router</code> 中的 <code>Action</code> 中间件</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { HookType } from &quot;@halsp/core&quot;;
import { Action } from &quot;@halsp/router&quot;;

startup.hook(HookType.Error, (ctx, md, ex) =&gt; {
  if (md instanceof Action) {
    // execute exception filters
    return execResult; //  is handled, true or false
  } else {
    return false;
  }
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>用 <code>startup.hook()</code> 添加异常钩子，接收两个参数</p><ol><li><code>HookType.Error</code>, 表示该钩子是异常钩子</li><li>回调函数，有三个参数 <ul><li>ctx: Context 实例对象</li><li>middleware: 抛出异常的中间件</li><li>error: 抛出的错误</li></ul></li></ol><p>关于回调函数返回值</p><ul><li>可以返回 <code>boolean</code>/<code>Promise&lt;boolean&gt;</code>，或没有返回值</li><li>如果返回 <code>false</code>，表示该异常未处理，将异常交给下一个异常钩子</li><li>如果返回 <code>true</code>，表示该异常已被捕获并处理，下一个异常钩子将不会被该异常触发</li><li>如果没有返回值，则和返回 <code>false</code> 效果相同</li></ul>`,7);function h(m,b){const a=d("RouterLink");return l(),o("div",null,[p,i("p",null,[u,e(" 可以添加多种"),r(a,{to:"/zh/usage/middleware.html#%E4%B8%AD%E9%97%B4%E4%BB%B6%E9%92%A9%E5%AD%90"},{default:t(()=>[e("中间件钩子")]),_:1}),e("，其中也包括异常钩子")]),v])}const g=s(c,[["render",h],["__file","error.html.vue"]]);export{g as default};
