import{_ as s,r as l,o as r,c as o,a as i,b as e,d as a,e as n}from"./app-0418676b.js";const t={},c=i("h1",{id:"参数校验-halsp-validator",tabindex:"-1"},[i("a",{class:"header-anchor",href:"#参数校验-halsp-validator","aria-hidden":"true"},"#"),e(" 参数校验 "),i("code",null,"(@halsp/validator)")],-1),v=i("p",null,[e("安装 "),i("code",null,"@halsp/validator"),e(" 以支持参数校验功能，可以自动校验请求参数")],-1),u={href:"https://github.com/typestack/class-validator",target:"_blank",rel:"noopener noreferrer"},p={href:"https://github.com/halsp/pipe",target:"_blank",rel:"noopener noreferrer"},m=n(`<p>使用链式装饰器，减少引用，改进 <code>class-validator</code> 的装饰器风格</p><h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>npm install @halsp/validator
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="开始使用" tabindex="-1"><a class="header-anchor" href="#开始使用" aria-hidden="true">#</a> 开始使用</h2><p>可以利用 <code>@halsp/pipe</code> 管道功能，在中间件中定义校验规则</p><p>也可以定义数据传输模型，并在数据传输模型中定义校验规则</p><h3 id="startup" tabindex="-1"><a class="header-anchor" href="#startup" aria-hidden="true">#</a> startup</h3><p>在入口文件中添加如下代码，开启 <code>@halsp/validator</code> 的功能</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/validator&quot;;

startup.useValidator()
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="装饰数据传输模型" tabindex="-1"><a class="header-anchor" href="#装饰数据传输模型" aria-hidden="true">#</a> 装饰数据传输模型</h3><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { V } from &quot;@halsp/validator&quot;;
import { Body } from &quot;@halsp/pipe&quot;;
import { Middleware } from &quot;@halsp/core&quot;;

// 数据传输模型
class TestDto {
  @V.IsString().IsNotEmpty()
  prop1!: string;

  @V.IsInt().Min(6)
  prop2!: number;

  get prop3() {
    return this.prop1 + this.prop2;
  }
}

// 中间件 或 服务
class TestMiddleware extends Middleware {
  @Body
  private readonly body!: TestDto;

  async invoke(): Promise&lt;void&gt; {
    this.ok(this.body);
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的中间件 <code>TestMiddleware</code> 会在使用前自动校验 <code>TestDto</code> 中的字段值</p><h3 id="使用-halsp-pipe" tabindex="-1"><a class="header-anchor" href="#使用-halsp-pipe" aria-hidden="true">#</a> 使用 <code>@halsp/pipe</code></h3><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { V } from &quot;@halsp/validator&quot;;
import { Body } from &quot;@halsp/pipe&quot;;
import { Middleware } from &quot;@halsp/core&quot;;

// 中间件
class TestMiddleware extends Middleware {
  @Body(&quot;prop1&quot;)
  @V.IsString().IsNotEmpty()
  private readonly prop1!: string;

  @Body(&quot;prop2&quot;)
  @V.IsInt().Min(6)
  private readonly p2!: any;

  async invoke(): Promise&lt;void&gt; {
    this.ok(this.body);
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的中间件 <code>TestMiddleware</code> 同样会在使用前自动校验 <code>body</code> 的 <code>prop1</code> 和 <code>prop2</code> 字段值</p><h2 id="配置" tabindex="-1"><a class="header-anchor" href="#配置" aria-hidden="true">#</a> 配置</h2><p>可以使用全局配置，也可以使用局部配置</p><h3 id="全局配置" tabindex="-1"><a class="header-anchor" href="#全局配置" aria-hidden="true">#</a> 全局配置</h3><p>可以为 <code>startup.useValidator</code> 传参一个配置对象</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.useValidator({
  stopAtFirstError: true
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>也可以传参一个回调函数，用于动态设置配置</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.useValidator(({ ctx, val, propertyType }) =&gt; ({
  stopAtFirstError: true,
}));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="局部配置" tabindex="-1"><a class="header-anchor" href="#局部配置" aria-hidden="true">#</a> 局部配置</h3><p>使用装饰器 <code>UseValidatorOptions</code> 装饰 dto 类</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>@UseValidatorOptions({
  stopAtFirstError: true
})
class TestDto {
  @V.IsString().IsNotEmpty()
  b1!: string;

  @V.IsInt().Min(6)
  b2!: number;

  get b() {
    return this.b1 + this.b2;
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>局部配置优先于全局配置，最终配置取自二者合并后的对象</p></div><h2 id="指定模型可用性" tabindex="-1"><a class="header-anchor" href="#指定模型可用性" aria-hidden="true">#</a> 指定模型可用性</h2><p>用 <code>ValidatorEnable</code> 装饰器指定模型在哪些情况可用</p><p><code>ValidatorEnable</code> 接收一个回调函数</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>({ ctx: Context; val: any }) =&gt; boolean | Promise&lt;boolean&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>参数 <code>val</code> 是该模型对应的值</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>@ValidatorEnable(({ ctx: Context; val: any }) =&gt; ctx.set(&quot;test&quot;) == val)
class TestClass {
  @V.IsInt()
  b1!: number;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="现有校验装饰器" tabindex="-1"><a class="header-anchor" href="#现有校验装饰器" aria-hidden="true">#</a> 现有校验装饰器</h2>`,33),b={href:"https://github.com/typestack/class-validator",target:"_blank",rel:"noopener noreferrer"},h=n(`<p>包含 <code>class-validator</code> 全部校验装饰器，装饰器参数也完全相同</p><p>此外还提供了 <code>Is</code> 装饰器，可以使用自定义校验规则，用于更复杂的需求</p><p>也能封装自定义校验，用于复用自定义校验规则</p><h2 id="自定义校验装饰器-is" tabindex="-1"><a class="header-anchor" href="#自定义校验装饰器-is" aria-hidden="true">#</a> 自定义校验装饰器 <code>Is()</code></h2><p><code>Is</code> 装饰器可以实现自定义校验</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>class TestDto {
  @V
    .Is(
      (value, property) =&gt; typeof value == &quot;number&quot;,
      \`\${property} must be a number\`
    )
    .Is((value, property) =&gt; (value &gt; 6), \`\${property} must more than 6\`)
  readonly prop!: number;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的代码限制字段 <code>prop</code> 的值必须是一个数字，并且值大于 6</p><p><code>Is</code> 装饰器有两个参数</p><ul><li><code>validate</code> 校验规则回调函数，返回 bool，有三个参数 <ul><li><code>value</code> 请求参数实际值</li><li><code>property</code> 数据传输模型属性名，或 <code>@halsp/pipe</code> 取的属性名如 <code>@Header(&#39;prop&#39;)</code></li><li><code>args</code> 装饰器输入参数数组</li></ul></li><li><code>errorMessage</code> 校验失败响应的错误，可以是一个字符串，也可以是一个回调函数，回调函数的参数同 <code>validate</code> 回调函数</li></ul><h2 id="封装的自定义校验" tabindex="-1"><a class="header-anchor" href="#封装的自定义校验" aria-hidden="true">#</a> 封装的自定义校验</h2><p><code>Is</code> 装饰器虽然很灵活，但没法复用</p><p>调用函数 <code>addCustomValidator</code> 即可增加一个自定义校验，然后在代码中多处重复使用</p><p><code>@halsp/swagger</code> 就是基于此功能增加了描述性装饰器（没有校验功能）</p><p>如实现一个下面的校验规则：判断请求参数是否为指定值</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { addCustomValidator } from &#39;@halsp/validator&#39;;

addCustomValidator({
  name: &quot;CustomEquals&quot;,
  validate: (value, property, args) =&gt; value == args[0],
  errorMessage: (value, property, args) =&gt; \`\${property} must equal with \${args[0]}, now is \${value}\`,
});

class TestDto{
  @V.CustomEquals(6)
  readonly prop!: number;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果请求参数的 prop 值是 7，会校验失败，抛出如下错误</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>{
  &quot;status&quot;: 400
  &quot;message&quot;: &#39;prop must equal with 6, now is 7&#39;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="定义声明" tabindex="-1"><a class="header-anchor" href="#定义声明" aria-hidden="true">#</a> 定义声明</h3><p>虽然 <code>addCustomValidator</code> 可以直接添加一个装饰器并且能够使用，但没有智能提示，在 TypeScript 下使用也会报错</p><p>因此 TypeScript 还需要添加声明才能更安全、方便的使用</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { ValidatorDecoratorReturnType } from &quot;@halsp/validator&quot;;

declare module &quot;@halsp/validator&quot; {
  interface ValidatorLib {
    CustomEquals: (num: number) =&gt; ValidatorDecoratorReturnType;
    CustomDecorator2: () =&gt; ValidatorDecoratorReturnType;
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>类型声明代码，可以写在 <code>.d.ts</code> 文件中，也可以写在普通 <code>.ts</code> 中</p><p>如在 types/index.d.ts 文件中声明，即可以全局使用。也可以在 <code>index.ts</code> 等文件声明</p><h3 id="addcustomvalidator-参数" tabindex="-1"><a class="header-anchor" href="#addcustomvalidator-参数" aria-hidden="true">#</a> <code>addCustomValidator</code> 参数</h3><p><code>addCustomValidator</code> 接收三个参数</p><ul><li><code>validate</code> 校验规则回调函数，返回 bool，与 <code>Is</code> 装饰器不同的是有三个参数，前两个参数相同 <ul><li><code>value</code> 请求参数实际值</li><li><code>property</code> 数据传输模型属性名，或 <code>@halsp/pipe</code> 取的属性名如 <code>@Header(&#39;prop&#39;)</code></li><li><code>args</code> 装饰器输入参数数组</li></ul></li><li><code>errorMessage</code> 校验失败响应的错误，可以是一个字符串，也可以是一个回调函数，回调函数的参数同 <code>validate</code> 回调函数</li><li><code>name</code> 装饰器名称，必须唯一，且与已有装饰器不能重名</li></ul>`,26);function g(T,x){const d=l("ExternalLinkIcon");return r(),o("div",null,[c,v,i("p",null,[e("基于 "),i("a",u,[e("class-validator"),a(d)]),e(" 和 "),i("a",p,[e("@halsp/pipe"),a(d)]),e(" 校验请求参数")]),m,i("p",null,[e("参考 "),i("a",b,[e("class-validator"),a(d)])]),h])}const S=s(t,[["render",g],["__file","validator.html.vue"]]);export{S as default};
