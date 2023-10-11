import{_ as e,o as d,c as i,e as a}from"./app-0418676b.js";const n={},s=a(`<h1 id="路由-halsp-router" tabindex="-1"><a class="header-anchor" href="#路由-halsp-router" aria-hidden="true">#</a> 路由 <code>(@halsp/router)</code></h1><p>添加 <code>@halsp/router</code> 以支持路由功能</p><ul><li>支持 HTTP RESTful</li><li>支持微服务路由</li><li>根据文件系统映射访问路径，彻底解耦无关联功能</li><li>按需加载，提升请求速度</li><li>轻量化，高可扩展性</li><li>移除 controller 层，灵活性更高</li></ul><h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> @halsp/router
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="开始使用" tabindex="-1"><a class="header-anchor" href="#开始使用" aria-hidden="true">#</a> 开始使用</h2><p>在入口文件中添加 <code>startup.useRouter</code></p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/router&quot;;
startup.useRouter()
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>在 <code>src/actions</code> 下创建 <code>test.get.ts</code> 文件和 <code>Action</code> 派生类</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Action } from &quot;@halsp/router&quot;;

export default class extends Action{
  invoke(){
    this.ok();
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>访问 <code>GET /test</code> 即可触发该 <code>Action</code> 中间件</p><div class="custom-container tip"><p class="custom-container-title">TIP</p><p><code>startup.useRouter</code> 实际上可能会注册多个中间件</p></div><h2 id="路由文件夹" tabindex="-1"><a class="header-anchor" href="#路由文件夹" aria-hidden="true">#</a> 路由文件夹</h2><p>路由文件夹默认为 <code>src/actions</code> 或 <code>src/modules</code> （二选一）</p><p>一般 <code>src/actions</code> 用于简单项目，<code>src/modules</code> 用于稍大的模块化项目，本教程仅用 <code>src/actions</code>，模块化请参考 <a href="./module">模块化项目</a> 教程</p><p>在其他文件夹的 <code>actions</code> 不会被正确编译和执行</p><h2 id="配置参数" tabindex="-1"><a class="header-anchor" href="#配置参数" aria-hidden="true">#</a> 配置参数</h2><p><code>startup.useRouter</code> 接收可选参数 <code>RouterOptions</code>，包含以下字段</p><ul><li>prefix: 路由前缀，比如统一添加 <code>/api</code> 或 <code>/v3</code> 前缀</li></ul><h2 id="路由匹配" tabindex="-1"><a class="header-anchor" href="#路由匹配" aria-hidden="true">#</a> 路由匹配</h2><p>路由匹配有两种方式</p><ol><li>请求路径与文件系统路径匹配，通过后缀设置请求方法</li><li>通过装饰器指定请求路径和请求方法</li></ol><p>在一个项目中，两种方式可以混用，但装饰器的优先级更高</p><div class="custom-container warning"><p class="custom-container-title">WARNING</p><p>微服务项目只能使用装饰器的方式来匹配路由</p></div><h3 id="用文件系统匹配路由" tabindex="-1"><a class="header-anchor" href="#用文件系统匹配路由" aria-hidden="true">#</a> 用文件系统匹配路由</h3><p>普通路径与文件系统路径完全相同</p><p>作为路由查询参数的文件或文件夹，命名要以 <code>^</code> 开头</p><p><code>action</code> 文件应以 <code>.post.ts</code>、<code>.get.ts</code>、<code>.get.delete.put .ts</code> 等结尾（或其他自定义请求方法）</p><p>如果没有请求方法后缀，任意 <code>httpMethod</code> 都可以请求，与 <code>.any.ts</code> 效果相同</p><h4 id="例-1" tabindex="-1"><a class="header-anchor" href="#例-1" aria-hidden="true">#</a> 例 1</h4><p>获取 todo list</p><h5 id="指定-httpmethod-建议" tabindex="-1"><a class="header-anchor" href="#指定-httpmethod-建议" aria-hidden="true">#</a> 指定 HttpMethod（建议）</h5><p>目录结构如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>+-- actions
|   +-- todo
|       +-- _.get.ts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>或</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>+-- actions
|   +-- todo.get.ts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>访问地址为 <code>GET /todo</code>，</p><h5 id="任意请求方法" tabindex="-1"><a class="header-anchor" href="#任意请求方法" aria-hidden="true">#</a> 任意请求方法</h5><p>目录结构如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>+-- actions
|   +-- todo
|       +-- getTodoList.ts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>访问地址为 <code>GET /todo/getTodoList</code> 、 <code>POST /todo/getTodoList</code> 、 <code>PUT /todo/getTodoList</code> 等等，效果相同。</p><h4 id="例-2" tabindex="-1"><a class="header-anchor" href="#例-2" aria-hidden="true">#</a> 例 2</h4><p>获取单个 todo item</p><h5 id="指定-httpmethod-建议-1" tabindex="-1"><a class="header-anchor" href="#指定-httpmethod-建议-1" aria-hidden="true">#</a> 指定 HttpMethod（建议）</h5><p>目录结构如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>+-- actions
|   +-- todo
|       +-- ^id
|           +-- _.get.ts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>或</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>+-- actions
|   +-- todo
|       +-- ^id.get.ts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>访问地址为 <code>GET /todo/66</code></p><h5 id="任意请求方法-1" tabindex="-1"><a class="header-anchor" href="#任意请求方法-1" aria-hidden="true">#</a> 任意请求方法</h5><p>目录结构如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>+-- actions
|   +-- todo
|       +-- getTodoItem.ts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>访问地址为 <code>GET(POST 等) /todo/getTodoItem</code>，需要在 <code>body</code> 、 <code>header</code> 或 <code>query</code> 传入 <code>todoId</code> 参数</p><h3 id="用装饰器匹配路由" tabindex="-1"><a class="header-anchor" href="#用装饰器匹配路由" aria-hidden="true">#</a> 用装饰器匹配路由</h3><p>通过装饰器指定请求路径和请求方法</p><p>和文件系统匹配相比，有更强的灵活性，但需要写更多代码，需要支持装饰器功能</p><h4 id="装饰器" tabindex="-1"><a class="header-anchor" href="#装饰器" aria-hidden="true">#</a> 装饰器</h4><p>提供以下装饰器用于指定 <code>Action</code> 的请求方法和请求路径</p><ul><li>HttpGet</li><li>HttpPost</li><li>HttpPatch</li><li>HttpDelete</li><li>HttpPut</li><li>HttpHead</li><li>HttpOptions</li><li>HttpConnect</li><li>HttpTrace</li><li>HttpCustom</li></ul><h4 id="使用方式" tabindex="-1"><a class="header-anchor" href="#使用方式" aria-hidden="true">#</a> 使用方式</h4><p>同时指定请求方法和路径</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { HttpGet } from &#39;@halsp/router&#39;;

@HttpGet(&quot;test/^id&quot;)
export default class extends Action {
  async invoke(): Promise&lt;void&gt; {
    this.ok(&quot;method&quot;);
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>只指定请求方法，路径按文件系统匹配</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { HttpGet } from &#39;@halsp/router&#39;;

@HttpGet
export default class extends Action {
  async invoke(): Promise&lt;void&gt; {
    this.ok(&quot;method&quot;);
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="自定义请求方法" tabindex="-1"><a class="header-anchor" href="#自定义请求方法" aria-hidden="true">#</a> 自定义请求方法</h4><p>使用 <code>@HttpCustom(method, url)</code> 支持自定义请求方法</p><p>关于如何添加自定义请求方法请参考后面的 <a href="#%E8%87%AA%E5%AE%9A%E4%B9%89%E8%AF%B7%E6%B1%82%E6%96%B9%E6%B3%95-1">自定义请求方法</a></p><p>该装饰器接收两个参数</p><ol><li>请求方法</li><li>请求路径，如果不传此参数将按文件系统匹配</li></ol><h2 id="action" tabindex="-1"><a class="header-anchor" href="#action" aria-hidden="true">#</a> Action</h2><p><code>Action</code> 也是中间件，该类继承中间件类 <code>Middleware</code>，但 <code>Action</code> 中间件会在 <code>useRouter</code> 中自动注册，无需手动注册</p><p>如果有特殊需求，正常情况 Action 会作为最终中间件，不应调用 <code>this.next()</code></p><p>每次收到请求，主要执行的是自定义 <code>Action</code> 类实例对象中的 <code>invoke</code> 函数</p><p>所有自定义 <code>Action</code> 都应派生自 <code>Action</code> 类，并重写 <code>invoke</code> 函数</p><h3 id="创建一个-action" tabindex="-1"><a class="header-anchor" href="#创建一个-action" aria-hidden="true">#</a> 创建一个 Action</h3><p>根据下面步骤创建一个常规 Action</p><h4 id="创建路由文件夹" tabindex="-1"><a class="header-anchor" href="#创建路由文件夹" aria-hidden="true">#</a> 创建路由文件夹</h4><p>创建文件夹 <code>src/actions</code>，用于存放所有 <code>Action</code></p><p>路由文件夹也可以是 <code>src/modules</code>，参考前面 <a href="#%E8%B7%AF%E7%94%B1%E6%96%87%E4%BB%B6%E5%A4%B9">路由文件夹</a> 部分</p><h4 id="创建-action-文件" tabindex="-1"><a class="header-anchor" href="#创建-action-文件" aria-hidden="true">#</a> 创建 action 文件</h4><p>根据各业务，创建文件夹和 <code>.ts</code> 文件，名称自定，但名称和路径会映射为访问路径，每个文件对应一个 <code>action</code></p><p>命名格式为 <code>&lt;actionName&gt;.&lt;httpMethod&gt;.ts</code> ，其中 <code>httpMethod</code> 可以多个，如 <code>user.get.ts</code>、<code>user.delete.put.ts</code>。</p><p><code>&lt;actionName&gt;</code> 可以是划线 <code>_</code>，即取自父级文件夹名称，如 <code>/user/_.get.post.ts</code> 与 <code>/user.get.post.ts</code> 相同</p><p>如果命名没有 <code>&lt;httpMethod&gt;</code> 部分，则任意方法都能访问，与 <code>.any.ts</code> 作用相同，如 <code>user.ts</code> 等同于 <code>user.any.ts</code></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>+-- actions
|   +-- type1
|       +-- _.post.ts
|       +-- user.get.ts
|       +-- ...
|   +-- type2
|       +-- _.patch.ts
|       +-- user.delete.ts
|       +-- ^id
|           +-- _.put.ts
|           +-- ...
|   +-- type3.get.post.ts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="创建-action-类" tabindex="-1"><a class="header-anchor" href="#创建-action-类" aria-hidden="true">#</a> 创建 action 类</h4><p>在 action 文件 (<code>.ts</code>) 中创建继承 <code>Action</code> 的类，并重写 <code>invoke</code> 函数</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Action } from &quot;@halsp/router&quot;;

export default class extends Action {
  async invoke() {
    this.ok({
      result: &#39;success&#39;
    });
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="request-params" tabindex="-1"><a class="header-anchor" href="#request-params" aria-hidden="true">#</a> Request.params</h2><p><code>Request.params</code> 是 RESTful 路径中的参数，如</p><ul><li>路由/文件地址：<code>/user/^userId/todo/^todoId.get.ts</code></li><li>访问路径：<code>/user/66/todo/88</code></li></ul><p>那么 <code>params</code> 值为</p><div class="language-JSON line-numbers-mode" data-ext="JSON"><pre class="language-JSON"><code>{
  &quot;userId&quot;: 66,
  &quot;todoId&quot;: 88
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>@halsp/router</code> 会在 <code>ctx.req</code> 中添加 <code>params</code> 属性</p><h2 id="自定义请求方法-1" tabindex="-1"><a class="header-anchor" href="#自定义请求方法-1" aria-hidden="true">#</a> 自定义请求方法</h2><p>如果内置请求方法不满足需求，可以自定义请求方法，如 [&#39;custom-get&#39;,&#39;custom-method&#39;]</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup
  .useHttp({
    customMethods: [&quot;custom-get&quot;, &quot;custom-method&quot;],
  })
  .useRouter();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="路由元数据" tabindex="-1"><a class="header-anchor" href="#路由元数据" aria-hidden="true">#</a> 路由元数据</h2><p>你可以通过装饰器 <code>@SetActionMetadata(key,value)</code> 装饰 Action，给 Action 添加元数据，添加的元数据可以在解析路由后获取</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Action } from &quot;@halsp/core&quot;

@SetActionMetadata(&quot;roles&quot;, [&quot;admin&quot;])
export default class extends Action{}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/router&quot;;

startup
  .use(async (ctx, next)=&gt;{
    const role = ctx.actionMetadata.role; // admin
    await next();
  })
  .useRouter();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>也可以利用 <code>setActionMetadata</code> 创建自定义装饰器，更便捷的添加元数据</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { setActionMetadata } from &quot;@halsp/router&quot;;

function Admin(target: any) {
  setActionMetadata(target, {
    role: &#39;admin&#39;,
  });
}
function Root(target: any) {
  setActionMetadata(target, {
    role: &#39;root&#39;,
  });
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Action } from &quot;@halsp/core&quot;
@Admin
export default class extends Action{}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Action } from &quot;@halsp/core&quot;
@Root
export default class extends Action{}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>也可以使用 <code>getActionMetadata</code> 获取元数据</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Action } from &quot;@halsp/core&quot;
import { getActionMetadata } from &quot;@halsp/router&quot;;

@Root
export default class extends Action{
  async invoke(){
    const metadata = getActionMetadata(this);
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container warning"><p class="custom-container-title">WARNING</p><p>元数据会被转为 json，因此元数据的值不能是函数等内容，因为其不能被解析为 json</p></div><h2 id="编译" tabindex="-1"><a class="header-anchor" href="#编译" aria-hidden="true">#</a> 编译</h2><p>使用 <code>@halsp/cli</code> 的编译命令 <code>halsp build</code> 时，<code>@halsp/router</code> 会扫描路由文件夹并创建映射表</p><p>用于快速匹配路由，提升程序启动速度，serverless 项目通过编译路由表，能极大的提升启动速度和响应速度</p><h3 id="编译结果" tabindex="-1"><a class="header-anchor" href="#编译结果" aria-hidden="true">#</a> 编译结果</h3><p>编译会在目标文件夹下生成 <code>halsp-router.config</code> 文件</p><p>该文件记录了 <code>@halsp/router</code> 的配置和路由表，请不要手动修改</p><h3 id="发布" tabindex="-1"><a class="header-anchor" href="#发布" aria-hidden="true">#</a> 发布</h3><p>发布时需要将 <code>halsp-router.config</code> 一同发布，否则程序首次启动会自动重新创建映射表</p><p>如果没有 <code>halsp-router.config</code> 文件，对于原生服务 <code>@halsp/native</code> 影响不是很大</p><p>但 serverless 项目可能每次请求都会启动一个新程序，即重新创建映射表，将失去编译路由表的优势</p>`,118),t=[s];function c(o,l){return d(),i("div",null,t)}const u=e(n,[["render",c],["__file","router.html.vue"]]);export{u as default};
