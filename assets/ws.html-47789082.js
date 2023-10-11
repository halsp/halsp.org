import{_ as d,r as l,o as c,c as t,a as e,b as n,d as s,e as a}from"./app-0418676b.js";const r={},o=e("h1",{id:"websocket-halsp-ws",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#websocket-halsp-ws","aria-hidden":"true"},"#"),n(" WebSocket "),e("code",null,"(@halsp/ws)")],-1),v=e("p",null,[n("添加 "),e("code",null,"@halsp/ws"),n(" 以实现 Halsp 对 WebSocket 的支持")],-1),u=e("code",null,"@halsp/ws",-1),b={href:"https://github.com/websockets/ws",target:"_blank",rel:"noopener noreferrer"},p=a(`<p><code>@halsp/ws</code> 使 WebSocket 的实现变得非常简单，你可以在任意位置，将普通的 Http 请求，升级为 WebSocket 连接</p><h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> @halsp/ws
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="快速开始" tabindex="-1"><a class="header-anchor" href="#快速开始" aria-hidden="true">#</a> 快速开始</h2><p>在入口文件中</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/ws&quot;;

startup.useWebSocket()
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在需要的地方，调用 <code>ctx.acceptWebSocket</code> 升级 WebSocket 连接</p><p>一般是在 Action 中，对指定的请求地址进行连接升级</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Action, HttpGet } from &quot;@halsp/router&quot;;

@HttpGet(&quot;/ws&quot;)
export class WebSocketAction extends Action {
  invoke() {
    // 升级连接，返回 WebSocket 连接实例
    const ws = await ctx.acceptWebSocket();

    // 接收消息
    ws.onmessage = async ({ data }) =&gt; {
      ws.send(data); // 发送消息
      ws.close(); // 服务端关闭连接
    };

    await next();
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="配置参数" tabindex="-1"><a class="header-anchor" href="#配置参数" aria-hidden="true">#</a> 配置参数</h2><p><code>useWebSocket</code> 接收一个配置参数，包含以下内容</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>export interface WsOptions {
  keepAliveTimeout?: number;
  allowedOrigins?: string[];
  backlog?: number | undefined;
  verifyClient?:
    | ws.VerifyClientCallbackAsync
    | ws.VerifyClientCallbackSync
    | undefined;
  handleProtocols?: (
    protocols: Set&lt;string&gt;,
    request: http.IncomingMessage
  ) =&gt; string | false;
  clientTracking?: boolean | undefined;
  perMessageDeflate?: boolean | ws.PerMessageDeflateOptions | undefined;
  maxPayload?: number | undefined;
  skipUTF8Validation?: boolean | undefined;
  WebSocket?: typeof ws.WebSocket;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>keepAliveTimeout</li></ul><p>服务器等待额外传入数据的不活动毫秒数</p><ul><li>allowedOrigins</li></ul><p>允许的来源</p><ul><li>其余参数</li></ul>`,17),m={href:"https://github.com/websockets/ws",target:"_blank",rel:"noopener noreferrer"},h=a(`<h2 id="升级连接" tabindex="-1"><a class="header-anchor" href="#升级连接" aria-hidden="true">#</a> 升级连接</h2><p>调用 <code>ctx.acceptWebSocket</code> 升级 WebSocket 连接，如果失败，会抛出错误</p><p>也可以调用 <code>ctx.tryAcceptWebSocket</code> 升级连接，如果失败，不抛出错误但返回值为 <code>null</code></p><p>升级连接后即与客户端建立连接，可通过返回的连接实例进行通信</p><h2 id="装饰器" tabindex="-1"><a class="header-anchor" href="#装饰器" aria-hidden="true">#</a> 装饰器</h2><p>可通过装饰器 <code>WebSocket</code> 升级连接，并获取连接实例，此操作更为简单易读</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>class TestMiddleware extends Middleware {
  @WebSocket
  private readonly ws1!: WebSocket;
  @WebSocket()
  private readonly ws2!: WebSocket;

  async invoke() {
    ws1.send(&quot;test&quot;);
    ws2.ping();

    this.ws1.close();
    this.ws2.close();

    await this.next();
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="生命周期" tabindex="-1"><a class="header-anchor" href="#生命周期" aria-hidden="true">#</a> 生命周期</h2><p>建立连接时，会创建连接实例</p><p><code>useWebSocket</code> 中间件会阻止请求返回，直到断开连接</p><p>因此 WebSocket 的生命周期如下</p><ol><li>收到 Http 请求</li><li>升级连接，建立 WebSocket 连接</li><li>WebSocket 正常通信（主体部分）</li><li>WebSocket 主动或被动断开</li><li>结束 Http 请求</li></ol><div class="custom-container warning"><p class="custom-container-title">WARNING</p><p>不应该通过其他方式使请求返回，如在 <code>native</code> 环境中调用 <code>ctx.resStream.end()</code></p><p>这将中断 TCP 的连接，因此 WebSocket 的连接也会被意外断开</p></div>`,13);function k(S,g){const i=l("ExternalLinkIcon");return c(),t("div",null,[o,v,e("p",null,[u,n(" 的能力基于 "),e("a",b,[n("ws"),s(i)]),n("，但你无需管理 WebSocket 的连接细节")]),p,e("p",null,[n("参考 "),e("a",m,[n("ws"),s(i)])]),h])}const f=d(r,[["render",k],["__file","ws.html.vue"]]);export{f as default};
