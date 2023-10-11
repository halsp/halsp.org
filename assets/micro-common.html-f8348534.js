import{_ as e,o as a,c as i,e as n}from"./app-0418676b.js";const d={},t=n(`<h1 id="微服务概览" tabindex="-1"><a class="header-anchor" href="#微服务概览" aria-hidden="true">#</a> 微服务概览</h1><p>Halsp 也支持微服务风格架构的开发，并提供了多种微服务通信方式</p><p>不同通信方式的使用方式基本相同，Halsp 封装了实现细节，仅需修改少量代码即可相互切换，但不影响业务代码</p><p>大部分插件都能够同时适用于微服务，如依赖注入、路由、管道、过滤器等等</p><p>为了能和 <code>http</code> 快速切换，很多名称都沿用 <code>http</code> 中的概念，如 <code>ctx.req.body</code> 指的是请求数据，但微服务并没有 body 的说法</p><h2 id="开始使用" tabindex="-1"><a class="header-anchor" href="#开始使用" aria-hidden="true">#</a> 开始使用</h2><p>此部分以 tcp 通信方式举例</p><p>执行下面语句即可通过 <code>create-halsp</code> 创建一个 tcp 通信的微服务项目</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> init halsp@latest -- ms-app <span class="token parameter variable">-e</span> micro-tcp
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>创建完成后会自动运行</p><p>如果手动运行，可以在项目目录下执行</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> start
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>也可以使用镜像源，如</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> init halsp@latest -- ms-app <span class="token parameter variable">-e</span> micro-tcp <span class="token parameter variable">--registry</span> https://registry.npmmirror.com
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="入口" tabindex="-1"><a class="header-anchor" href="#入口" aria-hidden="true">#</a> 入口</h2><p>不同通信方式有不同的 startup 类，如 tcp 的是 <code>MicroTcpStartup</code></p><p>开始一个简单微服务如下</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { MicroTcpStartup } from &quot;@halsp/micro-tcp&quot;;
new MicroTcpStartup().listen();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>上述示例会监听本机 2333 端口</p><p>上述示例不包含路由和其他中间件，无法处理请求</p><p>下面我们给示例加上一条匹配 <code>test:pattern</code></p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { MicroTcpStartup } from &quot;@halsp/micro-tcp&quot;;
new MicroTcpStartup()
  .pattern(&quot;test:pattern&quot;, (ctx) =&gt; {
    ctx.res.setBody({
      reqPattern: ctx.req.pattern,
      reqData: ctx.req.body,
    });
  })
  .listen();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在就支持请求 <code>test:pattern</code> 了</p><p>关于如何使用客户端发起请求，请阅读后面的 <a href="#%E5%AE%A2%E6%88%B7%E7%AB%AF">客户端</a> 部分</p><p>当然这种写法只能用于非常简单的应用，对于一般应用，就需要使用下面的 <a href="#%E8%B7%AF%E7%94%B1">路由</a></p><h2 id="路由" tabindex="-1"><a class="header-anchor" href="#路由" aria-hidden="true">#</a> 路由</h2><p>不同通信协议的路由匹配方式大同小异</p><p>使用装饰器 <code>MicroPattern</code> 装饰 <code>Action</code>，参数为匹配字符串</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Action, MicroPattern } from &quot;@halsp/router&quot;;

@MicroPattern(&quot;user:login&quot;)
export class TestAction extends Action {
  invoke() {
    this.res.setBody(&quot;result&quot;);
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="匹配字符串" tabindex="-1"><a class="header-anchor" href="#匹配字符串" aria-hidden="true">#</a> 匹配字符串</h3><p>不同的通信协议，用的匹配字符串格式有不同的限制或能力，具体请阅读对应通信方式的文档</p><p>如 <code>gRPC</code> 的格式需要固定为 <code>&lt;package&gt;.&lt;service&gt;.&lt;method&gt;</code></p><p>如 <code>NATS</code> 可以使用通配符 <code>@MicroPattern(&quot;user.*&quot;)</code></p><p><code>tcp</code> 通信方式还支持通过文件路径映射路由，如文件 <code>actions/user/getUserInfo.ts</code> 没有使用 <code>MicroPattern</code>，那么匹配字符串即为 <code>user/getUserInfo</code></p><h2 id="客户端" tabindex="-1"><a class="header-anchor" href="#客户端" aria-hidden="true">#</a> 客户端</h2><p>客户端可用于各种环境，如 Native, Serverless, 微服务等</p><p>不同通信方式的客户端使用方式类似，具体差别请阅读对应文档，这里仍然以 TCP 为例</p><h3 id="开始使用-1" tabindex="-1"><a class="header-anchor" href="#开始使用-1" aria-hidden="true">#</a> 开始使用</h3><p>安装依赖 <code>@halsp/micro-tcp-client</code></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> @halsp/micro-tcp-client
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>在 startup.ts 中加入如下代码</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/micro-tcp-client&quot;;
startup.useMicroTcp()
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>在中间件或服务中，通过依赖注入使用客户端实例</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { MicroClient, IMicroClient } from &quot;@halsp/micro-client&quot;;
import { Middleware } from &quot;@halsp/core&quot;;

class TestMiddleware extends Middleware {
  @MicroClient()
  readonly client!: IMicroClient;

  async invoke() {
    const pattern = &quot;user.login&quot;;
    const payload = {
      account: &quot;hi@hal.wang&quot;,
    };
    const result = await this.client.send&lt;string&gt;(pattern, payload);
    this.ok(result.data);
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置" tabindex="-1"><a class="header-anchor" href="#配置" aria-hidden="true">#</a> 配置</h3><p><code>startup.useMicroTcp</code> 接收一个配置对象，一般包含以下内容</p><table><thead><tr><th>字段名</th><th>描述</th></tr></thead><tbody><tr><td>host</td><td>服务端 TCP host</td></tr><tr><td>port</td><td>服务端 TCP 端口</td></tr><tr><td>prefix</td><td>此服务的所有匹配字符串将自动加上该前缀</td></tr><tr><td>sendTimeout</td><td>超时时间，单位为 ms</td></tr><tr><td>identity</td><td>客户端实例唯一 id，利用此字段可以使用多实例</td></tr><tr><td>injectType</td><td>依赖注入类型，即生命周期</td></tr></tbody></table><h3 id="发送消息" tabindex="-1"><a class="header-anchor" href="#发送消息" aria-hidden="true">#</a> 发送消息</h3><p>有两种方式发送消息</p><ul><li>有返回: client.send</li><li>无返回: client.emit</li></ul><h4 id="client-send" tabindex="-1"><a class="header-anchor" href="#client-send" aria-hidden="true">#</a> client.send</h4><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>const result = await this.client.send&lt;string&gt;(pattern, payload);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>返回一个对象，包含以下字段</p><ul><li>data: 返回内容</li><li>error: 如果服务端出错，则此字段有值</li><li>id: 用于标识请求的 id</li></ul><h4 id="client-emit" tabindex="-1"><a class="header-anchor" href="#client-emit" aria-hidden="true">#</a> client.emit</h4><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>this.client.emit(pattern, payload);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>没有返回内容，也不获取返回结果</p><p>一般用于事件通知</p><h3 id="生命周期" tabindex="-1"><a class="header-anchor" href="#生命周期" aria-hidden="true">#</a> 生命周期</h3><p>微服务客户端的实例，是使用依赖注入实现实例化的，因此其生命周期规则取决于 <code>@halsp/inject</code></p><p>但有点不同的是，微服务客户端实例的默认生命周期，不是 <code>Scoped</code> 而是 <code>Singleton</code></p><p>在首次使用客户端实例的地方，会自动初始化并建立连接，不需要用户手动初始化和建立连接</p>`,62),s=[t];function r(c,l){return a(),i("div",null,s)}const p=e(d,[["render",r],["__file","micro-common.html.vue"]]);export{p as default};
