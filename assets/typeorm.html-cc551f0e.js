import{_ as d,r as l,o as r,c as t,a as e,b as n,d as s,e as a}from"./app-0418676b.js";const c={},o=e("h1",{id:"typeorm-halsp-typeorm",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#typeorm-halsp-typeorm","aria-hidden":"true"},"#"),n(" TypeORM "),e("code",null,"(@halsp/typeorm)")],-1),u=e("code",null,"@halsp/typeorm",-1),v={href:"https://github.com/typeorm/typeorm",target:"_blank",rel:"noopener noreferrer"},m=e("code",null,"@halsp/typeorm",-1),p={href:"https://github.com/typeorm/typeorm",target:"_blank",rel:"noopener noreferrer"},b=e("code",null,"@halsp/typeorm",-1),h=a(`<h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> @halsp/typeorm
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="快速开始" tabindex="-1"><a class="header-anchor" href="#快速开始" aria-hidden="true">#</a> 快速开始</h2><p>在入口文件中</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &#39;@halsp/typeorm&#39;;

// 此示例使用 sqlite，需要在项目中先安装 sqlite 驱动: npm install sqlite3
startup.useTypeorm({
  type: &#39;sqlite&#39;,
  database: &#39;./test.db&#39;
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 <code>src/entities</code> 定义实体模型</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Entity, PrimaryGeneratedColumn, Column } from &quot;typeorm&quot;

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    age: number
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在中间件或服务中，通过依赖注入获取数据库连接实例 <code>Typeorm</code></p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &#39;@halsp/core&#39;;
import { Typeorm } from &quot;@halsp/typeorm&quot;;

class TestMiddleware extends Middleware {
  @Typeorm
  private readonly dataSource!: Typeorm;

  async invoke(): Promise&lt;void&gt; {
    const userRepository = this.dataSource.getRepository(User);

    const user = new User();
    user.firstName = &quot;Timber&quot;;
    user.lastName = &quot;Saw&quot;;
    user.age = 25;
    await userRepository.save(user);

    const allUsers = await userRepository.find();
    const firstUser = await userRepository.findOneBy({
      id: 1,
    }); // find by id
    const timber = await userRepository.findOneBy({
      firstName: &quot;Timber&quot;,
      lastName: &quot;Saw&quot;,
    }); // find by firstName and lastName

    await userRepository.remove(timber);

    this.ok({
      firstUser,
      allUsers,
    });
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="多数据库连接" tabindex="-1"><a class="header-anchor" href="#多数据库连接" aria-hidden="true">#</a> 多数据库连接</h2><p><code>@halsp/typeorm</code> 支持多数据库连接，只需调用多次 <code>useTypeorm</code> ，并传参 <code>identity</code> 用于区分</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &#39;@halsp/typeorm&#39;;

startup
  .useTypeorm({
    identity: &quot;db1&quot;,
    type: &#39;sqlite&#39;,
    database: &#39;./test.db&#39;,
    // ...
  })
  .useTypeorm({
    identity: &quot;db2&quot;,
    type: &#39;mysql&#39;,
    host: &#39;127.0.0.1&#39;,
    // ...
  })
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在中间件或服务中，给装饰器 <code>@Typeorm()</code> 传参以区分连接</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &#39;@halsp/core&#39;;
import { Typeorm } from &quot;@halsp/typeorm&quot;;

class TestMiddleware extends Middleware {
  @Typeorm(&quot;db1&quot;)
  private readonly dataSource1!: Typeorm;
  @Typeorm(&quot;db2&quot;)
  private readonly dataSource2!: Typeorm;

  async invoke(): Promise&lt;void&gt; {
    const userRepository1 = this.dataSource1.getRepository(User);
    const userRepository2 = this.dataSource2.getRepository(User);
    await this.next();
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container warning"><p class="custom-container-title">注意</p><p>只有在 <code>useTypeorm</code> 之后的中间件，才能获取到数据库连接实例</p></div><h2 id="获取实例" tabindex="-1"><a class="header-anchor" href="#获取实例" aria-hidden="true">#</a> 获取实例</h2><p>你可以通过依赖注入的方式获取实例，也可以用 <code>ctx.getTypeorm</code> 获取实例</p><h3 id="依赖注入" tabindex="-1"><a class="header-anchor" href="#依赖注入" aria-hidden="true">#</a> 依赖注入</h3><p>用 <code>@Typeorm</code> 装饰属性或构造函数参数，通过 <code>@halsp/inject</code> 依赖注入创建实例</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &quot;@halsp/core&quot;;
import { Typeorm } from &quot;@halsp/typeorm&quot;;

@Inject
class TestMiddleware extends Middleware {
  constructor(
    @Typeorm private readonly connection: Typeorm,
    @Typeorm(&quot;id2&quot;) private readonly connection2: Typeorm
  ) {}

  @Typeorm(&quot;id1&quot;)
  private readonly connection1!: Typeorm;

  async invoke(): Promise&lt;void&gt; {
    await this.next();
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container tip"><p class="custom-container-title">TIP</p><p><code>Typeorm</code> 既可以作为装饰器，也可以作为 typeorm 在 <code>TypeScript</code> 中的连接实例类型</p></div><h3 id="ctx-gettypeorm" tabindex="-1"><a class="header-anchor" href="#ctx-gettypeorm" aria-hidden="true">#</a> <code>ctx.getTypeorm</code></h3><p>使用 <code>ctx.getTypeorm</code> 的方式更灵活，但代码易读性不如使用依赖注入</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/typeorm&quot;;

startup.use(async (ctx, next) =&gt; {
  const connection1 = await ctx.getTypeorm(&quot;id1&quot;);
  const connection2 = await ctx.getTypeorm(&quot;id2&quot;);
  const connection = await ctx.getTypeorm();
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="生命周期与作用域" tabindex="-1"><a class="header-anchor" href="#生命周期与作用域" aria-hidden="true">#</a> 生命周期与作用域</h2><h3 id="作用域" tabindex="-1"><a class="header-anchor" href="#作用域" aria-hidden="true">#</a> 作用域</h3><p>通过 <code>startup.useTypeorm</code> 函数传参 <code>injectType</code> 以修改该实例作用域</p>`,27),g={href:"https://halsp.org/usage/inject.html#%E4%BD%9C%E7%94%A8%E5%9F%9F",target:"_blank",rel:"noopener noreferrer"},y=a(`<div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &#39;@halsp/typeorm&#39;;

startup
  .useTypeorm({
    type: &#39;sqlite&#39;,
    database: &#39;./test.db&#39;,
    injectType: InjectType.Singleton
  })
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="生命周期" tabindex="-1"><a class="header-anchor" href="#生命周期" aria-hidden="true">#</a> 生命周期</h3><p>数据库连接实例通过依赖注入 <code>@halsp/inject</code> 创建，因此其生命周期符合 <code>@halsp/inject</code> 规则</p>`,3),T={href:"http://halsp.org/usage/inject.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F",target:"_blank",rel:"noopener noreferrer"},f=a(`<p>销毁的行为是在 <code>startup.useInject</code> 中间件的返回管道中触发，伪代码逻辑如</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>await initInject(); // 初始化依赖注入
await initializeTypeorm(); // 初始化 Typeorm
await next(); // 执行下个中间件
await dispose(); // 销毁
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="数据库驱动" tabindex="-1"><a class="header-anchor" href="#数据库驱动" aria-hidden="true">#</a> 数据库驱动</h2>`,3),x={href:"https://github.com/typeorm/typeorm",target:"_blank",rel:"noopener noreferrer"},S=a(`<p><code>@halsp/typeorm</code> 没有内置数据库驱动</p><p>因此需要配合安装数据库驱动，以支持对应数据库</p><ul><li>MySQL 或 MariaDB</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> mysql <span class="token parameter variable">--save</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>或</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> mysql2 <span class="token parameter variable">--save</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>PostgreSQL 或 CockroachDB</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> pg <span class="token parameter variable">--save</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>SQLite</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> sqlite3 <span class="token parameter variable">--save</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>Microsoft SQL Server</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> mssql <span class="token parameter variable">--save</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>sql.js</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> sql.js <span class="token parameter variable">--save</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>Oracle</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> oracledb <span class="token parameter variable">--save</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>To make the Oracle driver work, you need to follow the installation instructions from their site.</p><ul><li>SAP Hana</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> @sap/hana-client
<span class="token function">npm</span> <span class="token function">install</span> hdb-pool
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>SAP Hana support made possible by the sponsorship of Neptune Software.</p><ul><li>Google Cloud Spanner</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> @google-cloud/spanner <span class="token parameter variable">--save</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="数据库实体模型" tabindex="-1"><a class="header-anchor" href="#数据库实体模型" aria-hidden="true">#</a> 数据库实体模型</h2><p>项目中应该包含 <code>src/entities</code> 目录，默认 <code>src/entities</code> 目录中的数据库实体模型会被自动加载</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>halsp-project
│── src
│   │── index.ts
│   └── entities
│       └── user.entity.ts
│       └── todo.entity.ts
│── package.json
└── tsconfig.json
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>你也可以指定实体模型为其他</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.useTypeorm({
  entities: [UserEntity, TodoEntity]
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>或</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.useTypeorm({
  entities: [&#39;entities/**/*.ts&#39;]
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container warning"><p class="custom-container-title">注意</p><p>默认会将 <code>src</code> 目录下的 <code>.ts</code> 文件编译到 <code>dist</code> 目录，因此配置路径时要使用 <code>entities</code> 而不是 <code>src/entities</code></p><p>具体根据不同项目决定路径</p></div>`,30);function q(k,_){const i=l("ExternalLinkIcon");return r(),t("div",null,[o,e("p",null,[n("添加 "),u,n(" 插件以使用流行 ORM 工具 "),e("a",v,[n("TypeORM"),s(i)])]),e("p",null,[m,n(" 的功能基于 "),e("a",p,[n("TypeORM"),s(i)]),n("，使用 "),b,n(" 可以简化数据库的操作")]),h,e("p",null,[n("参考 "),e("a",g,[n("https://halsp.org/usage/inject.html#作用域"),s(i)])]),y,e("p",null,[n("参考 "),e("a",T,[n("http://halsp.org/usage/inject.html#生命周期"),s(i)])]),f,e("p",null,[n("参考 "),e("a",x,[n("https://github.com/typeorm/typeorm"),s(i)])]),S])}const j=d(c,[["render",q],["__file","typeorm.html.vue"]]);export{j as default};
