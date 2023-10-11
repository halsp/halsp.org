import{_ as e,o as i,c as l,e as n}from"./app-0418676b.js";const a={},d=n(`<h1 id="过滤器-halsp-filter" tabindex="-1"><a class="header-anchor" href="#过滤器-halsp-filter" aria-hidden="true">#</a> 过滤器 <code>(@halsp/filter)</code></h1><p>安装 <code>@halsp/filter</code> 以支持请求过滤器功能</p><p>另选择安装 <code>@halsp/mva</code> 以支持视图渲染过滤器</p><p>请求过滤器基于 <code>@halsp/router</code></p><p><code>@halsp/filter</code> 提供以下过滤器</p><ul><li>ActionFilter: Action 运行前和运行后执行，比较通用，可以改变传入内容和返回结果，可以用于统一返回</li><li>AuthorizationFilter: Action 运行前执行，一般用于身份认证</li><li>ResourceFilter: Action 运行前和运行后执行，一般用于资源缓存</li><li>ExceptionFilter: Action 运行抛出异常时执行，一般用于自定义异常处理</li></ul><p><code>@halsp/mva</code> 提供以下过滤器</p><ul><li>ResultFilter: 视图渲染前和渲染后执行，可以改变渲染模型和渲染模板，也可以改变渲染结果</li></ul><h2 id="引入过滤器" tabindex="-1"><a class="header-anchor" href="#引入过滤器" aria-hidden="true">#</a> 引入过滤器</h2><p>以下三者调用任意一个都可以</p><ul><li>useFilter</li><li>useGlobalFilter</li><li>useFilterOrder</li></ul><p>如</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/filter&quot;

startup.useFilter()
// OR
startup.useGlobalFilter(YourFilter, 1)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container tip"><p class="custom-container-title">注意</p><p>过滤器需要在 <code>startup.useRouter</code> 之前引入，否则不起作用</p></div><h2 id="过滤器的作用范围" tabindex="-1"><a class="header-anchor" href="#过滤器的作用范围" aria-hidden="true">#</a> 过滤器的作用范围</h2><p>过滤器有两种作用范围</p><ul><li>作用于单个请求 <code>Action</code></li><li>全局过滤器</li></ul><h3 id="在-action-上使用过滤器" tabindex="-1"><a class="header-anchor" href="#在-action-上使用过滤器" aria-hidden="true">#</a> 在 Action 上使用过滤器</h3><p>可以单独为某个 Action 使用过滤器</p><p>在 Action 类声明处，加上装饰器 <code>UseFilters</code>，表示这个 Action 使用滤器，可以添加多个过滤器</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>@UseFilters(filter)
@UseFilters(...filters)
export default class extends Action{
  invoke(){}
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="全局过滤器" tabindex="-1"><a class="header-anchor" href="#全局过滤器" aria-hidden="true">#</a> 全局过滤器</h3><p>用以下方式添加全局过滤器</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.useGlobalFilter(filter)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="custom-container tip"><p class="custom-container-title">注意</p><p>应在 <code>useRouter</code> 之前添加全局过滤器</p></div><p>全局过滤器可以添加多个，每次调用 <code>useGlobalFilter</code> 都会添加一个全局过滤器</p><h2 id="依赖注入" tabindex="-1"><a class="header-anchor" href="#依赖注入" aria-hidden="true">#</a> 依赖注入</h2><p>过滤器支持 <code>@halsp/inject</code> 依赖注入，要在 <code>startup.useInject</code> 之后引入过滤器</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/filter&quot;
import &quot;@halsp/router&quot;
import &quot;@halsp/inject&quot;

startup
  .useInject()
  .useFilter()
  .useRouter()
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container tip"><p class="custom-container-title">建议</p><p><code>@UseFilters()</code> 和 <code>startup.useGlobalFilter()</code> 建议传入类而不是对象</p><p>这样可以让框架自动初始化过滤器，以正确初始化依赖注入关系</p></div><h2 id="执行顺序" tabindex="-1"><a class="header-anchor" href="#执行顺序" aria-hidden="true">#</a> 执行顺序</h2><p>不同类型的过滤器之间，执行顺序是固定不可变的</p><p><code>ExceptionFilter</code> 过滤器是抛出异常立即执行，即如果不抛出异常不会执行</p><p>其他过滤器按以下顺序执行</p><ol><li>AuthorizationFilter.onAuthorization</li><li>ResourceFilter.onResourceExecuting</li><li>ActionFilter.onActionExecuting</li><li>ResultFilter.onResultExecuting</li><li>Action Middleware <em>（中间件）</em></li><li>ResultFilter.onResultExecuted</li><li>ActionFilter.onActionExecuted</li><li>ResourceFilter.onResourceExecuted</li></ol><p><code>ResourceFilter</code>/<code>ActionFilter</code>/<code>ResultFilter</code> 这三种过滤器都有两个函数，他们之间的执行顺序和中间件类似</p><p><em><code>ResultFilter</code> 是 <code>@halsp/mva</code> 提供的</em></p><h3 id="同类型执行顺序" tabindex="-1"><a class="header-anchor" href="#同类型执行顺序" aria-hidden="true">#</a> 同类型执行顺序</h3><p>同类型过滤器的执行顺序默认按以下顺序规则执行</p><ul><li>全局优先于局部过滤器</li><li>全局过滤器之间按引入顺序执行</li><li>局部过滤器之间按引入顺序执行</li></ul><h3 id="指定执行顺序" tabindex="-1"><a class="header-anchor" href="#指定执行顺序" aria-hidden="true">#</a> 指定执行顺序</h3><p>你也可以指定同类型过滤器之间的执行顺序</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.useFilterOrder(FilterConstructor, order)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>如果是全局过滤器，除上面的方式外，也可以在 <code>useGlobalFilter</code> 传入第二个参数作为执行顺序</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.useGlobalFilter(Filter, order)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="custom-container warning"><p class="custom-container-title">WARNING</p><p>如果多次调用，仅最后一次生效</p></div><h2 id="创建一个过滤器" tabindex="-1"><a class="header-anchor" href="#创建一个过滤器" aria-hidden="true">#</a> 创建一个过滤器</h2><p>创建一个类，实现对应过滤器接口，如 <code>ActionFilter</code> 过滤器</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>class TestActionFilter implements ActionFilter {
  onActionExecuted(ctx: Context): void | Promise&lt;void&gt; {
    ctx.res.setHeader(&quot;action2&quot;, 2);
  }
  onActionExecuting(
    ctx: Context
  ): boolean | void | Promise&lt;void&gt; | Promise&lt;boolean&gt; {
    ctx.res.setHeader(&quot;action1&quot;, 1);
    return true;
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 Action 上使用</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>@UseFilters(TestActionFilter)
export default class extends Action{
  invoke(){}
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>或注册为全局过滤器</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.useGlobalFilter(TestActionFilter)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,53),s=[d];function t(r,c){return i(),l("div",null,s)}const u=e(a,[["render",t],["__file","filter.html.vue"]]);export{u as default};
