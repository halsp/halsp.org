import{_ as n,r as i,o as s,c as d,a as l,b as e,d as c,w as t,e as r}from"./app-0418676b.js";const o={},u=r(`<h1 id="断点调试" tabindex="-1"><a class="header-anchor" href="#断点调试" aria-hidden="true">#</a> 断点调试</h1><p>断点调试可以找到更难发现的 bug，也方便看到代码的真实逻辑，以及各项数据的变化情况</p><p>使用 <code>@halsp/cli</code> 可以更方便的调试项目，下面的教程均使用了 <code>@halsp/cli</code></p><p>如果当前没有使用 <code>@halsp/cli</code>，也可以根据后面的 <a href="#%E6%96%B0%E5%A2%9E-cli">新增 CLI</a> 部分配置 <code>@halsp/cli</code></p><div class="custom-container tip"><p class="custom-container-title">注意</p><p>Serverless 环境下（<code>@halsp/lambda</code>, <code>@halsp/alifc</code> 等），默认是使用 <code>@halsp/native</code> 模拟 Http 环境启动应用</p><p>如不需要本地调试，可移除相关代码</p></div><h2 id="开始调试" tabindex="-1"><a class="header-anchor" href="#开始调试" aria-hidden="true">#</a> 开始调试</h2><p>由 <code>@halsp/cli</code> 创建的项目已经配置好调试环境，否则需要参考 <a href="#%E6%96%B0%E5%A2%9E-cli">新增 CLI</a> 配置</p><p>如果使用的是 vscode 可以直接按下 F5 开始调试</p><p>其他编译器可以执行下面语句开始运行调试</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> start
<span class="token comment"># 或已全局安装 @halsp/cli</span>
halsp start
<span class="token comment"># 或已在项目内安装 @halsp/cli</span>
npx halsp start
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="入口文件" tabindex="-1"><a class="header-anchor" href="#入口文件" aria-hidden="true">#</a> 入口文件</h2><p>建议 <code>src</code> 目录下，有以下任一文件</p><ol><li><code>native.ts</code></li><li><code>index.ts</code></li><li><code>main.ts</code></li></ol><p><code>@halsp/cli</code> 会按此顺序为优先级，查找并作为入口文件</p><h3 id="入口文件内容示例" tabindex="-1"><a class="header-anchor" href="#入口文件内容示例" aria-hidden="true">#</a> 入口文件内容示例</h3><p>使用 CLI 生成的项目已有这个文件（根据选择环境和插件不同，生成的内容也不同）</p><p>如果运行环境选择 <code>native</code> ，以及其他部分插件，内容如</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Startup } from &quot;@halsp/core&quot;;
import &quot;@halsp/native&quot;;
import &quot;@halsp/mva&quot;;
import &quot;@halsp/env&quot;;
import &quot;@halsp/logger&quot;;

new Startup()
  .useNative()
  .useEnv()
  .useConsoleLogger()
  .useMva()
  .listen()
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果运行环境选择 <code>lambda</code> ，以及其他部分插件，内容如</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Startup } from &quot;@halsp/core&quot;;
import &quot;@halsp/native&quot;;
import &quot;@halsp/lambda&quot;;
import &quot;@halsp/mva&quot;;
import &quot;@halsp/env&quot;;
import &quot;@halsp/logger&quot;;

const startup = new Startup()
  .useNative()
  .useEnv()
  .useConsoleLogger()
  .useMva();

if (p<wbr>rocess.env.NODE_ENV == &quot;development&quot;) {
  startup.listen();
}
export const main = (e: any, c: any) =&gt; startup.run(e, c);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面代码中的 <code>startup.listen</code>，是本地调试时，利用 <code>@halsp/native</code> 启动的本地服务</p><h3 id="指定入口文件" tabindex="-1"><a class="header-anchor" href="#指定入口文件" aria-hidden="true">#</a> 指定入口文件</h3><p>除上述默认入口文件外，也可以指定自定义的入口文件</p><p>通过参数 <code>--startupFile</code> 可以指定入口文件，如</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>halsp start <span class="token parameter variable">--startupFile</span> demo.ts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="已有项目新增-cli" tabindex="-1"><a class="header-anchor" href="#已有项目新增-cli" aria-hidden="true">#</a> 已有项目新增 CLI</h2><p>如果当前项目没有 <code>@halsp/cli</code>，可以参考以下步骤配置</p><h3 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h3><p>确保已在项目内安装或全局安装 <code>@halsp/cli</code></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 项目中安装</span>
<span class="token function">npm</span> <span class="token function">install</span> @halsp/cli <span class="token parameter variable">-D</span>

<span class="token comment"># 或 全局安装</span>
<span class="token function">npm</span> <span class="token function">install</span> @halsp/cli <span class="token parameter variable">-g</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="确保-typescript" tabindex="-1"><a class="header-anchor" href="#确保-typescript" aria-hidden="true">#</a> 确保 TypeScript</h3><p>确保项目是 TypeScript 编写的，目前 <code>@halsp/cli</code> 的调试功能仅支持 TS</p><p>并且在项目根目录必须有文件 <code>tsconfig.json</code></p><h3 id="添加脚本" tabindex="-1"><a class="header-anchor" href="#添加脚本" aria-hidden="true">#</a> 添加脚本</h3><p>修改 package.json 文件，添加运行脚本</p><div class="language-JSON line-numbers-mode" data-ext="JSON"><pre class="language-JSON"><code>  &quot;scripts&quot;: {
    &quot;start&quot;: &quot;halsp start&quot;,
    &quot;build&quot;: &quot;halsp build&quot;
  },
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="增加调试配置" tabindex="-1"><a class="header-anchor" href="#增加调试配置" aria-hidden="true">#</a> 增加调试配置</h3><p>在项目下创建 <code>.vscode/launch.json</code> 文件</p><p>用于配合 <code>vscode</code> 的断点调试</p><div class="language-JSON line-numbers-mode" data-ext="JSON"><pre class="language-JSON"><code>{
  &quot;version&quot;: &quot;0.2.0&quot;,
  &quot;configurations&quot;: [
    {
      &quot;command&quot;: &quot;npm start&quot;,
      &quot;name&quot;: &quot;Halsp Http Debugger&quot;,
      &quot;request&quot;: &quot;launch&quot;,
      &quot;type&quot;: &quot;node-terminal&quot;
    }
  ]
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="创建入口文件" tabindex="-1"><a class="header-anchor" href="#创建入口文件" aria-hidden="true">#</a> 创建入口文件</h3><p>按建议创建入口文件 <code>index.ts</code> 或 <code>main.ts</code></p><p>参考前面的 <a href="#%E5%85%A5%E5%8F%A3%E6%96%87%E4%BB%B6">入口文件</a></p><h3 id="开始调试-1" tabindex="-1"><a class="header-anchor" href="#开始调试-1" aria-hidden="true">#</a> 开始调试</h3><p>上述配置完毕</p><p>按下 F5 即可开始断点调试</p><h2 id="cli-调试命令" tabindex="-1"><a class="header-anchor" href="#cli-调试命令" aria-hidden="true">#</a> CLI 调试命令</h2>`,47);function p(v,h){const a=i("RouterLink");return s(),d("div",null,[u,l("p",null,[e("参考 "),c(a,{to:"/zh/usage/cli.html"},{default:t(()=>[e("CLI 脚手架")]),_:1}),e(" 的文档")])])}const b=n(o,[["render",p],["__file","debug.html.vue"]]);export{b as default};
