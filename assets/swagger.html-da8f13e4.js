import{_ as l,r as d,o as r,c as t,a as e,b as i,d as a,e as s}from"./app-0418676b.js";const o={},c=e("h1",{id:"swagger-文档-halsp-swagger",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#swagger-文档-halsp-swagger","aria-hidden":"true"},"#"),i(" Swagger 文档 "),e("code",null,"(@halsp/swagger)")],-1),u=e("p",null,[i("安装 "),e("code",null,"@halsp/swagger"),i(" 以使用 Swagger 文档，用于生成你的 Halsp 文档")],-1),v=e("p",null,[i("基于 "),e("a",{href:"./validator"},"@halsp/validator"),i(" 参数校验，使用装饰器注释文档，"),e("code",null,"@halsp/validator"),i(" 中的部分装饰器会自动生成文档内容")],-1),p={href:"https://github.com/swagger-api/swagger-ui",target:"_blank",rel:"noopener noreferrer"},h=s(`<h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>npm install @halsp/swagger
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="快速开始" tabindex="-1"><a class="header-anchor" href="#快速开始" aria-hidden="true">#</a> 快速开始</h2><p>在入口文件中</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/swagger&quot;;

startup.useSwagger();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>定义传输模型</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/swagger&quot;;
import { V } from &quot;@halsp/validator&quot;;

@V.Description(&quot;login info&quot;)
export class LoginDto {
  @V.Description(&quot;email&quot;).IsEmail()
  account!: string;

  @V.Description(&quot;password&quot;).MinLength(8).MaxLength(24)
  password!: string;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 <code>Action</code> 中用 <code>@halsp/pipe</code> 注入请求参数</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/swagger&quot;;
import { V } from &quot;@halsp/validator&quot;;
import { Action } from &quot;@halsp/core&quot;;
import { Body } from &quot;@halsp/pipe&quot;;

@V.Tags(&quot;user&quot;).Description(&quot;Get user info&quot;)
export default class extends Action {
  @Body
  private readonly loginDto!: LoginDto;

  async invoke() {
    this.ok(this.loginDto);
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="配置" tabindex="-1"><a class="header-anchor" href="#配置" aria-hidden="true">#</a> 配置</h2><p><code>startup.useSwagger</code> 接收一个 <code>options</code> 参数</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>export interface SwaggerOptions {
  basePath?: string;
  path?: string;
  builder?: SwaggerBuilder;
  html?: SwaggerHtmlOptions;
  initOAuth?: any;
  uiBundleOptions?: SwaggerUIBundleConfig;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="path" tabindex="-1"><a class="header-anchor" href="#path" aria-hidden="true">#</a> path</h3><p>访问 swagger 页面的路径，默认为 <code>swagger</code>，即访问路径为 <code>/swagger</code></p><h3 id="basepath" tabindex="-1"><a class="header-anchor" href="#basepath" aria-hidden="true">#</a> basePath</h3><p><code>swagger</code> 前缀路径，用于默认路径跳转</p><p>如下面示例，请求地址为 <code>/</code> 时，会跳转至 <code>./v3/index.html</code></p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.useSwagger({
  basePath: &quot;v3&quot;,
  path: &quot;&quot;
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="builder" tabindex="-1"><a class="header-anchor" href="#builder" aria-hidden="true">#</a> builder</h3><p>回调函数，参数为 <code>OpenApiBuilder</code> 对象，返回值为同一个或新的 <code>OpenApiBuilder</code> 对象，也可以不返回内容</p><p>如</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.useSwagger({
  builder: (builder) =&gt; {
    builder.addInfo({
      title: &quot;@halsp/swagger&quot;,
      version: &quot;0.0.1&quot;,
    });
  }
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>或</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.useSwagger({
  builder: (builder) =&gt; {
    return new OpenApiBuilder();
  },
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,24),g=e("code",null,"OpenApiBuilder",-1),m={href:"https://github.com/metadevpro/openapi3-ts",target:"_blank",rel:"noopener noreferrer"},b=s(`<div class="custom-container tip"><p class="custom-container-title">TIP</p><p>此参数一般用于设定基础信息</p></div><h3 id="html" tabindex="-1"><a class="header-anchor" href="#html" aria-hidden="true">#</a> html</h3><p>网页渲染相关参数</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>export interface SwaggerHtmlOptions {
  lang?: string;
  title?: string;
  removeDefaultStyle?: boolean;
  favicon?: string | string[];
  css?: string | string[];
  style?: string | string[];
  js?: string | string[];
  script?: string | string[];
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="lang" tabindex="-1"><a class="header-anchor" href="#lang" aria-hidden="true">#</a> lang</h4><p>网页语言的值，如 <code>cn</code>/<code>en</code>，影响 <code>&lt;html lang=&quot;en&quot;&gt;</code></p><h4 id="title" tabindex="-1"><a class="header-anchor" href="#title" aria-hidden="true">#</a> title</h4><p>网页标题，取自文档中的 info/title 值，如果没有值，则为 <code>Swagger UI</code></p><h4 id="favicon" tabindex="-1"><a class="header-anchor" href="#favicon" aria-hidden="true">#</a> favicon</h4><p>网页图标地址</p><h4 id="removedefaultstyle" tabindex="-1"><a class="header-anchor" href="#removedefaultstyle" aria-hidden="true">#</a> removeDefaultStyle</h4><p>如果为 true，将移除默认样式资源，你必须添加别的样式</p><h4 id="css" tabindex="-1"><a class="header-anchor" href="#css" aria-hidden="true">#</a> css</h4><p>网页样式文件地址，可以是一个字符串，也可以是字符串数组以添加多个文件</p><h4 id="style" tabindex="-1"><a class="header-anchor" href="#style" aria-hidden="true">#</a> style</h4><p>样式代码，可以是一个字符串添加一个 <code>&lt;style&gt;</code>，也可以是字符串数组添加多个 <code>&lt;style&gt;</code></p><h4 id="js" tabindex="-1"><a class="header-anchor" href="#js" aria-hidden="true">#</a> js</h4><p>javascript 文件地址，可以是一个字符串，也可以是字符串数组以添加多个文件</p><h4 id="script" tabindex="-1"><a class="header-anchor" href="#script" aria-hidden="true">#</a> script</h4><p>javascript 代码，可以是一个字符串添加一个 <code>&lt;script&gt;</code>，也可以是字符串数组添加多个 <code>&lt;script&gt;</code></p><h3 id="initoauth" tabindex="-1"><a class="header-anchor" href="#initoauth" aria-hidden="true">#</a> initOAuth</h3><p><code>swagger-ui-dist</code> 中的 <code>SwaggerUIBundle.initOAuth</code> 参数</p>`,22),S={href:"https://swagger.io/docs/open-source-tools/swagger-ui/usage/oauth2/",target:"_blank",rel:"noopener noreferrer"},f=e("h3",{id:"uibundleoptions",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#uibundleoptions","aria-hidden":"true"},"#"),i(" uiBundleOptions")],-1),w=e("p",null,[e("code",null,"swagger-ui-dist"),i(" 中的 "),e("code",null,"new SwaggerUIBundle()"),i(" 参数")],-1),x={href:"https://swagger.io/docs/open-source-tools/swagger-ui/usage/installation/",target:"_blank",rel:"noopener noreferrer"},T=s(`<p><code>url</code> 和 <code>dom_id</code> 正常情况使用默认值即可</p><p>网页代码请使用 <code>&quot;% code %&quot;</code> 的写法，如</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.useSwagger({
  presets:[
    &quot;%SwaggerUIBundle.presets.apis%&quot;,
    &quot;%SwaggerUIBundle.SwaggerUIStandalonePreset%&quot;
  ]
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在网页会生成如下代码</p><div class="language-JS line-numbers-mode" data-ext="JS"><pre class="language-JS"><code>SwaggerUIBundle({
  url: \`./index.json\`,
  dom_id: &quot;#swagger-ui&quot;,
  presets: [
    SwaggerUIBundle.presets.apis,
    SwaggerUIBundle.SwaggerUIStandalonePreset,
  ],
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="支持的装饰器" tabindex="-1"><a class="header-anchor" href="#支持的装饰器" aria-hidden="true">#</a> 支持的装饰器</h2><p>文档中很多内容是根据装饰器生成的</p><p>装饰器会影响文档的生成，包含 <code>@halsp/validator</code> 中的部分装饰器和 <code>@halsp/swagger</code> 中的全部装饰器</p><ul><li><code>@halsp/swagger</code> 中的装饰器 <ul><li>Ignore</li><li>Tags</li><li>Summary</li><li>Description</li><li>ExternalDocs</li><li>Deprecated</li><li>Servers</li><li>Security</li><li>OperationId</li><li>Style</li><li>Explode</li><li>AllowReserved</li><li>Examples</li><li>Example</li><li>Discriminator</li><li>ReadOnly</li><li>WriteOnly</li><li>Xml</li><li>Format</li><li>Items</li><li>Default</li><li>Title</li><li>MaxProperties</li><li>MinProperties</li><li>Enum</li><li>ContentTypes</li><li>Response</li><li>ResponseHeaders</li><li>ResponseDescription</li><li>ResponseContentTypes</li></ul></li><li><code>@halsp/validator</code> 中影响文档生成的装饰器 <ul><li>IsNotEmpty</li><li>IsEmpty</li><li>IsInt</li><li>IsDate</li><li>IsNumber</li><li>IsString</li><li>IsBoolean</li><li>IsObject</li><li>IsEmpty</li><li>Max</li><li>Min</li><li>MinLength</li><li>MaxLength</li><li>Matches</li><li>ArrayMaxSize</li><li>ArrayMinSize</li><li>ArrayUnique</li><li>Required</li><li>IsOptional</li></ul></li></ul><h3 id="数组" tabindex="-1"><a class="header-anchor" href="#数组" aria-hidden="true">#</a> 数组</h3><p>需要注意，由于 TypeScript 的限制，数组类型无法确定其元素类型，需要借助 <code>Items</code> 装饰器声明元素类型</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>class TestDto1 {
  readonly prop1!: number;
}

class TestDto2 {
  @V.Items(TestDto1)
  readonly prop2!: TestDto1[];
}

export default class extends Action{
  @Body
  @V.Items(TestDto2)
  private readonly dto!:TestDto2[];

  invoke(){
    this.ok(this.dto);
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>二维数组可以这样 <code>.Item([TestDto2])</code>，三维数组 <code>.Item([[TestDto2]])</code>，更高维数组以此类推</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>class TestDto2 {
  @V.Items([TestDto1])
  readonly prop2!: TestDto1[][];
}

class TestDto3 {
  @V.Items([[TestDto1]])
  readonly prop3!: TestDto2[][][];
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="示例项目" tabindex="-1"><a class="header-anchor" href="#示例项目" aria-hidden="true">#</a> 示例项目</h2>`,15),_={href:"https://env-caafniqh-1253337886.ap-shanghai.app.tcloudbase.com/todo",target:"_blank",rel:"noopener noreferrer"},q={href:"https://github.com/hal-wang/todo",target:"_blank",rel:"noopener noreferrer"},I={href:"https://env-caafniqh-1253337886.ap-shanghai.app.tcloudbase.com/todo/swagger",target:"_blank",rel:"noopener noreferrer"};function y(D,B){const n=d("ExternalLinkIcon");return r(),t("div",null,[c,u,v,e("p",null,[i("在浏览器中使用 "),e("a",p,[i("swagger-ui"),a(n)]),i(" 渲染文档")]),h,e("p",null,[g,i(" 参考 "),e("a",m,[i("openapi3-ts"),a(n)])]),b,e("p",null,[i("参考 "),e("a",S,[i("SwaggerUIBundle OAuth"),a(n)])]),f,w,e("p",null,[i("参考 "),e("a",x,[i("SwaggerUIBundle"),a(n)])]),T,e("ul",null,[e("li",null,[i("todo 一个简易的 todo 项目 "),e("ul",null,[e("li",null,[i("在线示例: "),e("a",_,[i("https://env-caafniqh-1253337886.ap-shanghai.app.tcloudbase.com/todo"),a(n)])]),e("li",null,[i("github: "),e("a",q,[i("https://github.com/hal-wang/todo"),a(n)])]),e("li",null,[i("swagger: "),e("a",I,[i("https://env-caafniqh-1253337886.ap-shanghai.app.tcloudbase.com/todo/swagger"),a(n)])])])])])])}const A=l(o,[["render",y],["__file","swagger.html.vue"]]);export{A as default};
