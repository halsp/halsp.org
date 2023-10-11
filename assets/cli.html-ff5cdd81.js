import{_ as d,r as l,o as r,c as t,a as i,b as e,d as n,e as s}from"./app-0418676b.js";const c={},o=s(`<h1 id="cli-脚手架-halsp-cli" tabindex="-1"><a class="header-anchor" href="#cli-脚手架-halsp-cli" aria-hidden="true">#</a> CLI 脚手架 <code>(@halsp/cli)</code></h1><p><code>@halsp/cli</code> 提供创建、编译、调试、升级等功能</p><h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><p>全局安装</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> @halsp/cli <span class="token parameter variable">-g</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>或项目中安装</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> @halsp/cli <span class="token parameter variable">-D</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="快速开始" tabindex="-1"><a class="header-anchor" href="#快速开始" aria-hidden="true">#</a> 快速开始</h2><p>下面列出的是常用命令</p><ol><li>创建一个项目</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>halsp create
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="2"><li>编译项目</li></ol><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>halsp build
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="3"><li>运行项目</li></ol><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>halsp start
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="项目配置" tabindex="-1"><a class="header-anchor" href="#项目配置" aria-hidden="true">#</a> 项目配置</h2><p>在项目根目录下有配置文件，用来存放 CLI 的相关配置</p><p>文件名称可以是以下其中之一</p><ul><li>.halsprc.ts</li><li>.halsprc.js</li><li>.halsprc.json</li><li>halsp.config.ts</li><li>halsp.config.js</li><li>halsp.config.json</li></ul><h3 id="导出内容" tabindex="-1"><a class="header-anchor" href="#导出内容" aria-hidden="true">#</a> 导出内容</h3><p>在配置文件中，可以导出一个 json 对象，或导出一个返回 json 对象的回调函数</p><h4 id="导出-json-对象" tabindex="-1"><a class="header-anchor" href="#导出-json-对象" aria-hidden="true">#</a> 导出 json 对象</h4><p>导出 json 对象比较简单，但不够灵活，只能是固定的一种配置</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>export default {
  build: {},
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>或使用智能提示</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { defineConfig } from &quot;@halsp/cli&quot;;

export default defineConfig({
  start: {}
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="导出回调函数" tabindex="-1"><a class="header-anchor" href="#导出回调函数" aria-hidden="true">#</a> 导出回调函数</h4><p>导出回调函数可以实现动态配置，即根据不同编译条件返回不同配置</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { defineConfig } from &quot;@halsp/cli&quot;;

export default defineConfig(({ mode }) =&gt; {
  return {
    build: {
      copyPackage: mode == &quot;production&quot;,
    },
  };
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置内容" tabindex="-1"><a class="header-anchor" href="#配置内容" aria-hidden="true">#</a> 配置内容</h3><p>配置内容是一个 json 对象，该 json 对象目前有如下内容</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>export interface Configuration {
  build?: {
    prebuild?: Prebuild[];
    postbuild?: Postbuild[];

    beforeHooks?: CompilerHook&lt;ts.SourceFile&gt;[];
    afterHooks?: CompilerHook&lt;ts.SourceFile&gt;[];
    afterDeclarationsHooks?: CompilerHook&lt;ts.SourceFile | ts.Bundle&gt;[];

    deleteOutDir?: boolean;
    assets?: AssetConfig[];

    watch?: boolean;
    watchAssets?: boolean;
    preserveWatchOutput?: boolean;

    sourceMap?: boolean;
    copyPackage?: boolean;
    removeDevDeps?: boolean;

    cacheDir?: string;
  };
  start?: {
    port?: number;
    binaryToRun?: string;
    inspect?: boolean | string;
    startupFile?: string;
  };
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>build: 编译相关的配置</li><li>start: 调试相关的配置，<code>build</code> 部分的配置也起作用</li></ul><h4 id="prebuild" tabindex="-1"><a class="header-anchor" href="#prebuild" aria-hidden="true">#</a> prebuild</h4><p>编译前钩子</p><h4 id="postbuild" tabindex="-1"><a class="header-anchor" href="#postbuild" aria-hidden="true">#</a> postbuild</h4><p>编译后钩子</p><h4 id="beforehooks" tabindex="-1"><a class="header-anchor" href="#beforehooks" aria-hidden="true">#</a> beforeHooks</h4><p>ts 编译钩子</p><p>ts 代码编译前触发，可以更改编译行为</p><h4 id="afterhooks" tabindex="-1"><a class="header-anchor" href="#afterhooks" aria-hidden="true">#</a> afterHooks</h4><p>ts 编译钩子</p><p>ts 代码编译完，生成目标代码前触发，可以更改编译行为</p><h4 id="afterdeclarationshooks" tabindex="-1"><a class="header-anchor" href="#afterdeclarationshooks" aria-hidden="true">#</a> afterDeclarationsHooks</h4><p>ts 编译钩子</p><p>ts 类型解析后触发，可以更改编译行为</p><h4 id="deleteoutdir" tabindex="-1"><a class="header-anchor" href="#deleteoutdir" aria-hidden="true">#</a> deleteOutDir</h4><p>编译前删除目标文件夹</p><h4 id="assets" tabindex="-1"><a class="header-anchor" href="#assets" aria-hidden="true">#</a> assets</h4><p>资源文件，数组类型，编译时会将指定资源文件拷贝到目标文件夹</p><p>支持 glob 语法</p><p>数组元素有两种类型</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>export type AssetConfig =
  | {
      include: string | string[];
      exclude?: string | string[];
      outDir?: string;
      root?: string;
    }
  | string;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>字符串表示哪些文件是资源文件</p><p>对象结构可以配置更复杂的资源文件</p><ul><li>include 包含哪些文件，可以是 glob 字符串，也可以是 glob 字符串数组</li><li>exclude 排除哪些文件，是从 <code>include</code> 中的文件排除，可以是 glob 字符串，也可以是 glob 字符串数组</li><li>outDir 目标文件夹</li><li>root 根目录地址</li></ul><p>root 参数用于路径提升，如以下示例：</p><blockquote><p><strong>目标</strong></p><ul><li>资源文件为 <code>src/imgs/**</code>，而不是 <code>imgs/**</code></li><li>编译中需要拷贝到 <code>dist/imgs</code>，而不是 <code>dist/src/imgs</code></li></ul><p><strong>设置参数</strong></p><ol><li>设置 <code>include</code> 为 <code>src/imgs/**</code></li><li>设置 <code>root</code> 为 <code>src</code></li></ol></blockquote><h4 id="watch" tabindex="-1"><a class="header-anchor" href="#watch" aria-hidden="true">#</a> watch</h4><p>是否开启 watch 模式</p><p><code>start</code> 命令默认默认值为 <code>true</code><code>build</code> 命令默认默认值为 <code>false</code></p><h4 id="watchassets" tabindex="-1"><a class="header-anchor" href="#watchassets" aria-hidden="true">#</a> watchAssets</h4><p>是否监控资源文件，监控所有 <code>assets</code> 参数指定的文件</p><p>默认值为 <code>false</code></p><h4 id="preservewatchoutput" tabindex="-1"><a class="header-anchor" href="#preservewatchoutput" aria-hidden="true">#</a> preserveWatchOutput</h4><p>是否保留控制台输出</p><p>默认为取自 <code>tsconfig.json</code> 中的 <code>compilerOptions.preserveWatchOutput</code> 值</p><p>如果 <code>tsconfig.json</code> 中也没有配置，则默认值为 <code>false</code></p><h4 id="sourcemap" tabindex="-1"><a class="header-anchor" href="#sourcemap" aria-hidden="true">#</a> sourceMap</h4><p>是否输出 map 文件</p><p>用于断点调试时定位编译后的 js 和源文件 ts 的代码</p><p><code>start</code> 命令会忽略该配置，值始终为 <code>true</code></p><h4 id="copypackage" tabindex="-1"><a class="header-anchor" href="#copypackage" aria-hidden="true">#</a> copyPackage</h4><p>值为 <code>true</code> 则拷贝 <code>package.json</code> 文件</p><p>默认为 <code>false</code></p><h4 id="removedevdeps" tabindex="-1"><a class="header-anchor" href="#removedevdeps" aria-hidden="true">#</a> removeDevDeps</h4><p>如果为 <code>true</code> 则移除拷贝后 <code>package.json</code> 文件 <code>devDependencies</code> 中的依赖</p><p>使用云函数环境 <code>@halsp/lambda</code> 和 <code>@halsp/alifc</code> 时，该值默认为 <code>true</code></p><h4 id="cachedir" tabindex="-1"><a class="header-anchor" href="#cachedir" aria-hidden="true">#</a> cacheDir</h4><p>本地运行时，缓存文件路径</p><p>默认为 <code>node_modules/.halsp</code></p><h4 id="port" tabindex="-1"><a class="header-anchor" href="#port" aria-hidden="true">#</a> port</h4><p>调试时启动的端口</p><h4 id="binarytorun" tabindex="-1"><a class="header-anchor" href="#binarytorun" aria-hidden="true">#</a> binaryToRun</h4><p>调试时启动的环境，默认为 <code>node</code></p><h4 id="inspect" tabindex="-1"><a class="header-anchor" href="#inspect" aria-hidden="true">#</a> inspect</h4><p>V8 引擎的调试工具</p><h4 id="startupfile" tabindex="-1"><a class="header-anchor" href="#startupfile" aria-hidden="true">#</a> startupFile</h4><p>启动文件的路径，默认为 CLI 调试时生成的文件</p><p>默认按以下顺序查找</p><ul><li>index.ts</li><li>main.ts</li><li>native.ts</li></ul><p>一般用于同时支持多种环境</p><h2 id="支持的命令" tabindex="-1"><a class="header-anchor" href="#支持的命令" aria-hidden="true">#</a> 支持的命令</h2><p>执行命令 <code>halsp -h</code> 即可列出所有命令</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Usage: halsp &lt;command&gt; [options]

Options:
  -v, --version, -V, -version            output the version number
  -h, --help                             display help for command

Commands:
  create|c [options] [name]              Generate Halsp application
  build|b [options] [app]                Build Halsp application
  start|s [options] [app]                Run Halsp application
  info|i [options] [app]                 Display halsp project details
  update|u [options] [app]               Update halsp dependencies
  serve [options] [app]                  Serve static web by @halsp/static and @halsp/native
  help [command]                         display help for command
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="create" tabindex="-1"><a class="header-anchor" href="#create" aria-hidden="true">#</a> create</h2><p>用于新建项目，可以选择插件、运行环境等</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>halsp create <span class="token operator">&lt;</span>project-name<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="使用方式" tabindex="-1"><a class="header-anchor" href="#使用方式" aria-hidden="true">#</a> 使用方式</h3><p>命令如下</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Usage: halsp create|c [options] [name]

Generate Halsp application

Arguments:
  name                                    Aapplication name

Options:
  -f, --force                             Force create application, delete existing files.  (default: false)
  --override                              Override existing files.  (default: false)
  -e, --env &lt;env&gt;                         The environment to run application. (lambda/native/azure/micro-tcp/...)
  -pm, --packageManager &lt;packageManager&gt;  Specify package manager. (npm/yarn/pnpm/cnpm)
  --registry &lt;url&gt;                        Override configuration registry
  --debug                                 Debug mode
  -ps, --plugins &lt;plugins&gt;                Plugins to add (e.g. view,router,inject)
  -si, --skipInstall                      Skip install project
  -se, --skipEnv                          Skip adding environment files
  -sg, --skipGit                          Skip git repository initialization
  -sp, --skipPlugins                      No plugins will be added
  -sr, --skipRun                          Skip running after completion
  --forceInit                             Force init scaffold
  -t, --template [url]                    Generate a project from a remote template
  -b, --branch &lt;branch&gt;                   The name of template repository branch
  --path &lt;path&gt;                           Path to template files
  --skipCheckUpdate                       Skip to check update version
  -h, --help                              display help for command
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="关于插件" tabindex="-1"><a class="header-anchor" href="#关于插件" aria-hidden="true">#</a> 关于插件</h3><p>在创建过程中，需要选择插件，也可以用参数 <code>--plugins</code> 指定插件</p><p>如果选择的某个插件需要引用另一个插件，另一个插件即使没有选择，也会自动被添加</p><p>比如 <code>pipe</code> 依赖于 <code>inject</code>，若选择了 <code>pipe</code> 将自动加入 <code>inject</code></p><h3 id="模板" tabindex="-1"><a class="header-anchor" href="#模板" aria-hidden="true">#</a> 模板</h3><p>参数 -t 指定模板，根据现有模板创建项目</p>`,107),p={href:"https://github.com/halsp/template",target:"_blank",rel:"noopener noreferrer"},u={href:"https://github.com/halsp/template",target:"_blank",rel:"noopener noreferrer"},v=s(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>halsp create -t start
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>halsp create -t grpc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>自定义模板库可以省略 <code>https://github.com</code>，或其他完整路径，或</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>halsp create -t username/repos
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>halsp create -t https://gitee.com/username/repos
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="build" tabindex="-1"><a class="header-anchor" href="#build" aria-hidden="true">#</a> build</h2><p>用于编译项目</p><p>编译输出位置，是在 <code>tsconfig.json</code> 中配置 <code>compilerOptions.outDir</code></p><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>CLI 有极高的扩展性，在编译过程中可以调起其他插件执行脚本，或动态修改配置</p><p>如 <code>@halsp/router</code> 编译时创建路由映射, <code>@halsp/view</code> 编译时自动修改配置并添加 <code>views</code> 文件夹为资源文件</p></div><h3 id="使用方式-1" tabindex="-1"><a class="header-anchor" href="#使用方式-1" aria-hidden="true">#</a> 使用方式</h3><p>命令如下</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Usage: halsp build|b [options] [app]

Build Halsp application

Arguments:
  app                           Where is the app

Options:
  -m, --mode &lt;mode&gt;             Run mode (e.g., development,production). (default: &quot;production&quot;)
  -c, --config &lt;path&gt;           Path to configuration file.
  -jc, --jsonConfig &lt;json&gt;      Json string of Halsp configuration.
  -fc, --funcConfig &lt;function&gt;  Function string to build Halsp configuration.
  -tc, --tsconfigPath &lt;path&gt;    Path to tsconfig.json file.
  -w, --watch                   Run in watch mode (live-reload).
  -wa, --watchAssets            Watch non-ts (e.g., .views) files mode.
  --assets &lt;assets&gt;             Copy files to dist (e.g. views/**/*||static/**/*)
  --cacheDir &lt;cacheDir&gt;         Cache dir (default: /node_modules/.halsp)
  -sm, --sourceMap              Whether to generate source map files.
  -cp, --copyPackage            Copy package.json to out dir.
  --removeDevDeps               Remove devDependencies in package.json file when --copyPackage is true.
  --skipCheckUpdate             Skip to check update version
  -h, --help                    display help for command
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="扩展编译功能" tabindex="-1"><a class="header-anchor" href="#扩展编译功能" aria-hidden="true">#</a> 扩展编译功能</h3><p>如果你需要实现一个插件，并且有以下任一需求</p><ul><li>在编译过程执行特定的代码，那么就需要扩展脚本</li><li>编译前动态修改配置，那么就需要拓展配置</li></ul><p>插件命名需要满足以下任意一个条件</p><ul><li>以 <code>@halsp/</code> 开头的 scope 包，属于 Halsp 官方插件</li><li>以 <code>halsp-</code> 开头，如 <code>halsp-xxx</code></li><li>以 <code>@&lt;score&gt;/halsp-</code> 开头的 scope 包，如 <code>@my-name/halsp-xxx</code></li></ul><h4 id="插件脚本" tabindex="-1"><a class="header-anchor" href="#插件脚本" aria-hidden="true">#</a> 插件脚本</h4><p>插件脚本主要分为两种，TS 编译钩子和编译前后的脚本</p><h5 id="ts-编译钩子" tabindex="-1"><a class="header-anchor" href="#ts-编译钩子" aria-hidden="true">#</a> TS 编译钩子</h5><p>在插件中，导出以下脚本作用于 ts 编译的钩子</p><ul><li>beforeCompile</li><li>afterCompile</li><li>afterCompileDeclarations</li></ul><h5 id="编译前后的脚本" tabindex="-1"><a class="header-anchor" href="#编译前后的脚本" aria-hidden="true">#</a> 编译前后的脚本</h5><p>在插件中，导出以下脚本，作用于编译前后运行</p><ul><li>postbuild 编译完成后运行</li><li>prebuild 编译之前运行</li></ul><p>脚本为一个函数，接收一个对象类型的参数，包含以下属性</p><ul><li>config 配置对象</li><li>cacheDir 编译使用的缓存目录，所有编译文件都将输出到这里</li><li>mode 编译命令指定的 --mode 参数，默认为 <code>production</code></li><li>command 命令类型，值为 build 或 start</li></ul><p><code>postbuild</code> 函数如果返回 false， 将终止编译</p><h4 id="动态修改配置" tabindex="-1"><a class="header-anchor" href="#动态修改配置" aria-hidden="true">#</a> 动态修改配置</h4><p>在插件中导出 <code>cliConfigHook</code> 函数，可以在编译阶段，动态修改配置文件中读取的配置</p><p>注意，此操作不会更新配置文件</p><p>可以在函数中修改当前配置对象，或返回一个新的配置对象</p><p><code>cliConfigHook</code> 函数，有两个参数</p><ul><li>config: 当前的配置对象，可以修改</li><li>options: <code>ConfigEnv</code> 类型的对象，包含以下字段 <ul><li>mode: CLI 命令传入的 mode 参数，默认为 <code>production</code></li><li>command: 命令类型，<code>start</code> 或 <code>build</code></li></ul></li></ul><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Configuration, ConfigEnv } from &quot;@halsp/cli&quot;;

export const cliConfigHook = (config: Configuration, env: ConfigEnv) =&gt; {
  config.build = config.build ?? {};
  config.build.assets = config.build.assets ?? [];
  config.build.assets.push({
    include: &quot;your-assets/*&quot;,
    root: &quot;src&quot;,
  });
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>若插件导出上述 <code>cliConfigHook</code> 函数，每次 CLI 编译都会执行该函数以动态修改配置</p><h3 id="指定目录" tabindex="-1"><a class="header-anchor" href="#指定目录" aria-hidden="true">#</a> 指定目录</h3><p>可以指定应用所在目录</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>halsp build path/to/project
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="start" tabindex="-1"><a class="header-anchor" href="#start" aria-hidden="true">#</a> start</h2><p>用于启动并调试项目，先编译后启动，编译过程同 <code>build</code> 命令</p><h3 id="使用方式-2" tabindex="-1"><a class="header-anchor" href="#使用方式-2" aria-hidden="true">#</a> 使用方式</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Usage: halsp start|s [options] [app]

Run Halsp application

Arguments:
  app                           Where is the app

Options:
  -m, --mode &lt;mode&gt;             Run mode (e.g., development,production). (default: &quot;development&quot;)
  -c, --config &lt;path&gt;           Path to configuration file.
  -jc, --jsonConfig &lt;json&gt;      Json string of Halsp configuration.
  -fc, --funcConfig &lt;function&gt;  Function string to build Halsp configuration.
  -tc, --tsconfigPath &lt;path&gt;    Path to tsconfig.json file.
  -w, --watch                   Run in watch mode (live-reload).
  -wa, --watchAssets            Watch non-ts (e.g., .views) files mode.
  --assets &lt;assets&gt;             Copy files to dist (e.g. views/**/*||static/**/*)
  --cacheDir &lt;cacheDir&gt;         Cache dir (default: /node_modules/.halsp)
  --startupFile &lt;path&gt;          The file to startup
  -b, --binaryToRun &lt;program&gt;   Binary to run application (e.g., node, ts-node)
  -p, --port &lt;port&gt;             The port on http listens
  --inspect &lt;hostport&gt;          Run in inspect mode
  --skipCheckUpdate             Skip to check update version
  -h, --help                    display help for command
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="指定目录-1" tabindex="-1"><a class="header-anchor" href="#指定目录-1" aria-hidden="true">#</a> 指定目录</h3><p>可以指定应用所在目录</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>halsp start path/to/project
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="startup-入口" tabindex="-1"><a class="header-anchor" href="#startup-入口" aria-hidden="true">#</a> Startup 入口</h3><p>入口文件默认为 <code>index.ts</code></p><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>如果存在 <code>native.ts</code> 文件，则入口文件优先取 <code>native.ts</code></p><p>Serverless 环境的本地调试用到了这个特性</p></div><p>启动项目时会在本地创建一个 http 服务，因此 serverless 项目也可以本地运行</p><h2 id="info" tabindex="-1"><a class="header-anchor" href="#info" aria-hidden="true">#</a> info</h2><p>可以显示项目信息，主要用于排查问题</p><h3 id="使用方式-3" tabindex="-1"><a class="header-anchor" href="#使用方式-3" aria-hidden="true">#</a> 使用方式</h3><p>命令如下</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Usage: halsp info|i [options] [app]

Display halsp project details

Arguments:
  app                Where is the app

Options:
  --skipCheckUpdate  Skip to check update version
  -h, --help         display help for command
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行结果如</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>  _   _    _    _     ____  ____   ____ _     ___
 | | | |  / \\  | |   / ___||  _ \\ / ___| |   |_ _|
 | |_| | / _ \\ | |   \\___ \\| |_) | |   | |    | |
 |  _  |/ ___ \\| |___ ___) |  __/| |___| |___ | |
 |_| |_/_/   \\_\\_____|____/|_|    \\____|_____|___|


[System Information]
OS Type        : Windows_NT
OS Platform    : win32
OS Release     : 10.0.22621
NodeJS Version : v16.20.0

[Halsp CLI]
Halsp CLI Version : 0.4.4

[Halsp Packages Version]
@halsp/alifc       : ^2.1.1
@halsp/core        : ^2.1.1
@halsp/cors        : ^2.1.1
@halsp/env         : ^2.1.1
@halsp/filter      : ^2.1.1
@halsp/inject      : ^2.1.1
@halsp/jwt         : ^2.1.1
@halsp/lambda      : ^2.1.1
@halsp/logger      : ^2.1.1
@halsp/micro       : ^2.1.1
@halsp/micro-grpc  : ^2.1.1
@halsp/micro-mqtt  : ^2.1.1
@halsp/micro-nats  : ^2.1.1
@halsp/micro-redis : ^2.1.1
@halsp/micro-tcp   : ^2.1.1
@halsp/mva         : ^2.1.1
@halsp/native      : ^2.1.1
@halsp/pipe        : ^2.1.1
@halsp/router      : ^2.1.1
@halsp/static      : ^2.1.1
@halsp/swagger     : ^2.1.1
@halsp/validator   : ^2.1.1
@halsp/view        : ^2.1.1
@halsp/ws          : ^2.1.1
@halsp/cli         : ../
@halsp/native      : ^2.1.1
@halsp/testing     : ^2.1.1
@halsp/http        : ^2.1.1
@halsp/body        : ^2.1.1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="指定目录-2" tabindex="-1"><a class="header-anchor" href="#指定目录-2" aria-hidden="true">#</a> 指定目录</h3><p>可以指定应用所在目录</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>halsp info path/to/project
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="update" tabindex="-1"><a class="header-anchor" href="#update" aria-hidden="true">#</a> update</h2><p>用于升级 Halsp 依赖版本</p><h3 id="使用方式-4" tabindex="-1"><a class="header-anchor" href="#使用方式-4" aria-hidden="true">#</a> 使用方式</h3><p>命令如下</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Usage: halsp update|u [options] [app]

Update halsp dependencies

Arguments:
  app                                    Where is the app

Options:
  -n, --name &lt;name&gt;                      Specify to update a package
  -a, --all                              Update all dependencies (default: false)
  -t, --tag &lt;tag&gt;                        Upgrade to tagged packages (latest | beta | rc | next tag) (default: &quot;latest&quot;)
  -su, --skipUpgrade                     Display version information without upgrading (default: false)
  -si, --skipInstall                     Skip installation (default: false)
  -p, --packageManager &lt;packageManager&gt;  Specify package manager. (npm/yarn/pnpm/cnpm)
  --registry &lt;url&gt;                       Override configuration registry
  --skipCheckUpdate                      Skip to check update version
  -h, --help                             display help for command
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="指定目录-3" tabindex="-1"><a class="header-anchor" href="#指定目录-3" aria-hidden="true">#</a> 指定目录</h3><p>可以指定应用所在目录</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>halsp update path/to/project
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="serve" tabindex="-1"><a class="header-anchor" href="#serve" aria-hidden="true">#</a> serve</h2><p>用于托管静态网站，使用了 <code>@halsp/static</code> 和 <code>@halsp/native</code></p><h3 id="使用方式-5" tabindex="-1"><a class="header-anchor" href="#使用方式-5" aria-hidden="true">#</a> 使用方式</h3><p>命令如下</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Usage: halsp serve [options] [app]

Serve static web by @halsp/static and @halsp/native

Arguments:
  app                    Where is the app

Options:
  -p, --port &lt;port&gt;      The port on http listens
  --hostname &lt;hostname&gt;  The hostname on http listens
  --hideDir              Do not list dir
  --exclude &lt;files&gt;      Exclude files, glob string, separate with space (e.g. &quot;**/*.key secret/*.crt&quot;)
  --prefix &lt;prefix&gt;      File prefix
  --encoding &lt;encoding&gt;  Buffer encoding (e.g. utf8)
  --skipCheckUpdate      Skip to check update version
  -h, --help             display help for command
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="指定目录-4" tabindex="-1"><a class="header-anchor" href="#指定目录-4" aria-hidden="true">#</a> 指定目录</h3><p>可以指定应用所在目录</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>halsp serve path/to/project
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="create-halsp" tabindex="-1"><a class="header-anchor" href="#create-halsp" aria-hidden="true">#</a> create-halsp</h2><p>包 <code>create-halsp</code> 使用了 <code>@halsp/cli</code> 的能力，能够快速创建 Halsp 应用且无需安装任何包</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> init halsp
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>相当于执行</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> @halsp/cli <span class="token parameter variable">-g</span>
halsp create
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,81);function h(m,b){const a=l("ExternalLinkIcon");return r(),t("div",null,[o,i("p",null,[e("支持官方模板库 "),i("a",p,[e("halsp/template"),n(a)]),e(" 和自定义模板")]),i("p",null,[e("官方模板库名称为 "),i("a",u,[e("halsp/template"),n(a)]),e(" 中的文件夹名，如")]),v])}const f=d(c,[["render",h],["__file","cli.html.vue"]]);export{f as default};
