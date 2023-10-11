import{_ as e,o as i,c as n,e as s}from"./app-0418676b.js";const d={},l=s(`<h1 id="模块化项目" tabindex="-1"><a class="header-anchor" href="#模块化项目" aria-hidden="true">#</a> 模块化项目</h1><p>模块化的项目更易读和易维护，对于代码量大一些的项目，应该使用模块化开发</p><p>Halsp 在框架层面良好支持模块化的项目</p><p>各模块之间，利用 <code>@halsp/inject</code> 的依赖注入能力，实现低耦合的关系</p><p><em>模块化项目需要用到 <code>@halsp/router</code>，以支持模块化的路由</em></p><h2 id="目录结构" tabindex="-1"><a class="header-anchor" href="#目录结构" aria-hidden="true">#</a> 目录结构</h2><p>一般模块化的项目，目录结构如下图</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>+-- src
|   +-- index.ts
|   +-- common
|   |   dtos
|   +-- modules
|       +-- user
|       |   +-- module.ts // 模块化配置
|       |   +-- entities
|       |   |   +-- user.entity.ts
|       |   +-- dtos
|       |   |   +-- create-user.dto.ts
|       |   |   +-- login.dto.ts
|       |   +-- services
|       |   |   +-- user.service.ts
|       |   |   +-- admin.service.ts
|       |   +-- actions
|       |   |   +-- user.actions.ts // 装饰器风格
|       |   |   +-- admin.actions.ts // 装饰器风格
|       +-- todo
|           +-- module.ts // 模块化配置
|           +-- entities
|           |   +-- todo.entity.ts
|           |   +-- template.entity.ts
|           +-- dtos
|           |   +-- create-todo.dto.ts
|           |   +-- query-todo.dto.ts
|           +-- services
|           |   +-- todo.service.ts
|           |   +-- image.service.ts
|           |   +-- template.service.ts
|           +-- _.get.ts // 路径即路由风格
|           +-- ^id.patch.ts // 路径即路由风格
|           +-- template.post.ts // 路径即路由风格
+-- package.json
+-- tsconfig.json
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>此示例用了两种路由风格：</p><ul><li>装饰器风格</li><li>路径即路由风格</li></ul><p>具体可参考 <a href="./router">@halsp/router</a></p></div><p>存放模块代码的目录为 <code>modules</code>，参考 <a href="./router#%E8%B7%AF%E7%94%B1%E6%96%87%E4%BB%B6%E5%A4%B9">@halsp/router 路由文件夹</a></p><p><code>modules</code> 文件夹下的每个文件夹，都代表一个模块</p><h2 id="模块化配置" tabindex="-1"><a class="header-anchor" href="#模块化配置" aria-hidden="true">#</a> 模块化配置</h2><p>每个模块下都必须有一个 module.ts 或 module.js 文件，否则将视为普通文件夹</p><p>在模块配置文件中导出 json 对象，类型和内容如下</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>interface RouterModule {
  prefix?: string;
  decorators?: ClassDecorator[] | ((mapItem: MapItem) =&gt; ClassDecorator[]);
  deepDir?: string;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>prefix</li></ul><p>路由前缀，统一为该模块下所有路由加上前缀</p><ul><li>decorators</li></ul><p>类装饰器数组，或回调函数返回装饰器数组。可以统一为路由 Action 类动态加上装饰器</p><p>如结合 <code>@halsp/swagger</code> 为该模块下所有 Action 统一加上 Tag 和描述</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { V } from &quot;@halsp/validator&quot;;

export default {
  prefix: &quot;user&quot;,
  decorators: [V.Tags(&quot;User&quot;).Description(&quot;desc&quot;)]
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>-- deepDir</p><p>仅 <code>路径即路由风格</code> 起作用，值为模块下的目录相对路径</p><p>表明只有在此子目录中的 Action 才会生效，并且请求路径以此为基础</p><p>通过此参数，允许将模块下所有 Action 统一放到一个目录中，如 actions，代码结构更清晰，目录结构可以如下</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>+-- src
|   +-- modules
|       +-- todo
|           +-- module.ts // 模块化配置，deepDir 值为 actions
|           +-- actions
|           |   +-- _.get.ts
|           |   +-- ^id.patch.ts
|           |   +-- template.post.ts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置导出类型" tabindex="-1"><a class="header-anchor" href="#配置导出类型" aria-hidden="true">#</a> 配置导出类型</h3><p>简单的可以直接导出一个 json</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>export default {
  prefix: &quot;user&quot;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>另外 <code>@halsp/router</code> 提供一个函数 <code>defineModule</code>，推荐用这种方式能够利用 TypeScript 类型推断</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { defineModule } from &quot;@halsp/router&quot;;

export default defineModule({
  prefix: &quot;user&quot;
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>或</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { defineModule } from &quot;@halsp/router&quot;;

export default defineModule(()=&gt; {
  return {
    prefix: &quot;user&quot;
  };
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>除 <code>export default</code> 外，也可以用 <code>module.exports</code></p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>const { defineModule } = require(&quot;@halsp/router&quot;);

module.exports = defineModule({
  prefix: &quot;user&quot;,
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,35),a=[l];function r(t,c){return i(),n("div",null,a)}const v=e(d,[["render",r],["__file","module.html.vue"]]);export{v as default};
