import{_ as e,o as i,c as n,e as d}from"./app-0418676b.js";const s={},a=d(`<h1 id="依赖注入-halsp-inject" tabindex="-1"><a class="header-anchor" href="#依赖注入-halsp-inject" aria-hidden="true">#</a> 依赖注入 <code>(@halsp/inject)</code></h1><p>添加 <code>@halsp/inject</code> 以实现 <code>Halsp</code> 的依赖注入</p><p>在 Halsp 中，有很多插件基于依赖注入</p><p>通过装饰器使用依赖注入，能够更好的管理代码</p><p>项目中的业务逻辑一般写在服务（Service）中，相关的操作会被抽象到一个或多个服务中，服务方便被多处使用</p><p>为了管理这些服务，<code>@halsp/inject</code> 可以集中托管服务的创建、获取、销毁</p><h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> @halsp/inject
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="名词解释" tabindex="-1"><a class="header-anchor" href="#名词解释" aria-hidden="true">#</a> 名词解释</h2><ol><li>服务：是指需要通过依赖注入管理的类</li><li>服务实例：是指依赖注入自动通过服务创建的对象</li></ol><h2 id="快速开始" tabindex="-1"><a class="header-anchor" href="#快速开始" aria-hidden="true">#</a> 快速开始</h2><p>定义服务，主要写业务逻辑</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Inject } from &quot;@halsp/inject&quot;;

class TestService1 {}

class TestService2 {
  @Inject
  private readonly testService1!: TestService1;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>定义中间件类，派生自 <code>Middleware</code>，或其他派生自 <code>Middleware</code> 的类</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &quot;@halsp/core&quot;;
import { Inject } from &quot;@halsp/inject&quot;;

class TestMiddleware extends Middleware {
  @Inject
  private readonly testService1!: TestService1;
  @Inject
  private readonly testService2!: TestService2;

  invoke() {
    this.ok();
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 <code>index.ts</code> 中</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/inject&quot;;
startup.useInject().add(TestMiddleware);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码中的 <code>startup.useInject</code> 会启用依赖注入</p><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>需要注意的是，自动依赖注入只会在 <code>startup.useInject</code> 之后的中间件中生效，因此你需要把 <code>useInject</code> 放在靠前的位置，根据实际项目决定</p></div><div class="custom-container warning"><p class="custom-container-title">WARNING</p><p>如果没有调用过 <code>startup.useInject</code>，<code>ctx.getService</code> 执行将报错</p></div><h2 id="装饰器" tabindex="-1"><a class="header-anchor" href="#装饰器" aria-hidden="true">#</a> 装饰器</h2><p>你需要开启装饰器功能以使用依赖注入</p><p>装饰器有两种方式修饰中间件或服务</p><ol><li>修饰服务类</li><li>修饰声明字段</li></ol><p>正常使用二者没有区别，但服务创建的时机有些区别，详细请阅读后面的 <code>生命周期</code> 部分</p><h3 id="修饰声明字段" tabindex="-1"><a class="header-anchor" href="#修饰声明字段" aria-hidden="true">#</a> 修饰声明字段</h3><p>在服务或中间件的字段声明，使用装饰器 <code>@Inject</code>，<code>@halsp/inject</code> 将在服务初始化后注入对应服务</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &quot;@halsp/core&quot;;
import { Inject } from &quot;@halsp/inject&quot;;

class TestService1 {}

class TestService2 {
  @Inject
  private readonly testService1!: TestService1;
}

class TestMiddleware extends Middleware {
  @Inject
  private readonly testService1!: TestService1;
  @Inject
  private readonly testService2!: TestService2;

  invoke() {
    this.ok();
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的代码，在使用依赖注入后，创建 <code>TestMiddleware</code> 中间件实例，会给字段 <code>testService1</code>,<code>testService2</code> 自动赋值</p><p>同样也会递归的给 <code>testService2.testService1</code> 字段赋值，服务可以多层嵌套</p><h3 id="修饰服务类" tabindex="-1"><a class="header-anchor" href="#修饰服务类" aria-hidden="true">#</a> 修饰服务类</h3><p>在服务类定义时使用装饰器 <code>@Inject</code>，并在类构造函数中添加服务，<code>@halsp/inject</code> 会在初始化类时注入对应服务</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Inject } from &quot;@halsp/inject&quot;;
import { Middleware } from &quot;@halsp/core&quot;;

class OtherService(){}

@Inject
class TestService{
  constructor(
    readonly otherService: OtherService,
    @Inject(&quot;KEY1&quot;) private readonly params1: number
  ){}
}

@Inject
class TestMiddleware extends Middleware {
  constructor(
    private readonly testService: TestService, // TestService object
    @Inject(&quot;KEY1&quot;) private readonly params1: number, // 2333
    @Inject(&quot;KEY2&quot;) private readonly params2: any // true
  ){
    super();
  }

  async invoke(): Promise&lt;void&gt; {
    this.ok({
      service: this.testService.constructor.name,
      params1: this.params1,
      params2: this.params2
    });
  }
}

startup
  .useInject()
  .inject(&quot;KEY1&quot;, 2333)
  .inject(&quot;KEY2&quot;, true)
  .add(TestMiddleware);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>需要注意的是，添加的中间件必须是中间件的构造器</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.add(YourMiddleware)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>因此下面添加中间件的方式，将不能使用类装饰器</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.add(async (ctx, next) =&gt; {});
startup.add(new YourMiddleware());
startup.add(() =&gt; new YourMiddleware());
startup.add(async () =&gt; await Factory.creatMiddleware());
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="作用域" tabindex="-1"><a class="header-anchor" href="#作用域" aria-hidden="true">#</a> 作用域</h2><p>服务的作用域分为三种</p><ol><li>Singleton：单例服务，nodejs 运行期间只初始化一次，即多次使用只会存在一个对象</li><li>Scoped：单次请求，每次请求会初始化一次，每次请求结束后此对象不会再使用</li><li>Transient：瞬时，每次使用都会被实例化</li></ol><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/inject&quot;;
import { InjectType } from &quot;@halsp/inject&quot;;

startup
  .inject(IService, Service, InjectType.Singleton)
  .inject(IService, Service, InjectType.Scoped)
  .inject(IService, Service, InjectType.Transient)
  .inject(&quot;KEY&quot;, Service, InjectType.Scoped)
  .inject(Service, InjectType.Scoped);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>需要注意的是，在云函数中，不能保证服务是单例的，因为云函数在调用完毕可能被销毁，下次调用可能会启动新实例</p><h2 id="生命周期" tabindex="-1"><a class="header-anchor" href="#生命周期" aria-hidden="true">#</a> 生命周期</h2><p>不同作用域的服务，生命周期不同，体现在创建实例和销毁实例的时机不同</p><h3 id="创建实例" tabindex="-1"><a class="header-anchor" href="#创建实例" aria-hidden="true">#</a> 创建实例</h3><p>依赖注入的服务实例是按需创建的</p><ul><li>中间件在创建时，会同时创建用到的服务</li><li>服务在创建时，如果用到了其他服务，那么其他服务也会被创建</li><li>如果作用域是 <code>Transient</code>，每次都会创建一个新实例</li></ul><p>用 <code>@Inject</code> 修饰的字段</p><ul><li>如果是在中间件中，那么服务将在 <code>invoke</code> 函数被执行前实例化</li><li>如果是在服务中，子服务会在父服务构造函数执行完毕后，立即初始化</li></ul><h3 id="销毁实例" tabindex="-1"><a class="header-anchor" href="#销毁实例" aria-hidden="true">#</a> 销毁实例</h3><p><code>Singleton</code> 作用域的服务不会被框架销毁，如有特定需求，你需要手动销毁实例</p><p><code>Scoped</code> 和 <code>Transient</code> 作用域的服务会在每次请求结束后调用实例的 <code>dispose</code> 函数</p><p>因此如果需要框架自动销毁服务，服务需要继承 <code>IService</code> 接口并实现 <code>dispose</code> 函数</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { IService } from &quot;@halsp/inject&quot;;

class CustomService implements IService {
  dispose() {
    // TODO
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>dispose</code> 函数可以返回 <code>void</code> 或 <code>Promise&lt;void&gt;</code></p><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>你也可以直接给已有的服务添加 <code>dispose</code> 函数，如 <code>@halsp/logger</code> 和 <code>@halsp/redis</code> 等插件就是这样实现的</p></div><h2 id="服务的注册" tabindex="-1"><a class="header-anchor" href="#服务的注册" aria-hidden="true">#</a> 服务的注册</h2><p>服务的注册总体分为两类</p><ol><li>通过类注册</li><li>使用键值对注册</li></ol><p>通过类注册比较简单，使用时可以通过 TypeScript 的类型声明找到服务</p><p>通过键值对方式注册，需要定义唯一的字符串，用于标识服务，可以处理更复杂的情况</p><h3 id="通过类注册服务" tabindex="-1"><a class="header-anchor" href="#通过类注册服务" aria-hidden="true">#</a> 通过类注册服务</h3><p>服务的注册分为自动注册和显式注册</p><h4 id="显式注册" tabindex="-1"><a class="header-anchor" href="#显式注册" aria-hidden="true">#</a> 显式注册</h4><p>可以指定实例化派生类或服务的作用域，以实现控制反转</p><p>使用 <code>startup.inject()</code> 显式注册</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/inject&quot;;

// 类映射本身实例对象
startup.inject(Service);
// 父类映射实例对象（实现控制反转）
startup.inject(ParentService, Service);
// 类映射特定实例对象，注意此方式仅能用于单例，因为服务没有交给框架实例化，若用于其他类型的依赖注入，可能会出现不可预知的问题。
startup.inject(ParentService, new Service(), InjectType.Singleton);
// 类映射特定值，值可以是实例对象，也可以是其他任意值如 Number/Date/Stream 等类型
startup.inject(ParentService, async (ctx) =&gt; await createService(ctx));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>显式注册并不会立即实例化服务，依赖注入都是按需实例化，因此显式注册并不会占用多少计算资源，本质仅添加了一条字典记录</p><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>需要注意的是， 显式注册 <code>startup.inject</code> 仅作用于其后的中间件，因此你可能需要在靠前的位置显式注册服务</p></div><div class="custom-container warning"><p class="custom-container-title">WARNING</p><p>使用依赖注入的父类和子类，必须都是类，不能是接口 <code>interface</code></p><p>如上面代码的 <code>IService</code> 和 <code>Service</code> 都必须是类</p></div><h4 id="自动注册" tabindex="-1"><a class="header-anchor" href="#自动注册" aria-hidden="true">#</a> 自动注册</h4><p><code>@halsp/inject</code> 可以自动实例化服务和中间件，自动注册服务的作用域都是 <code>Scoped</code></p><p>没有使用 <code>startup.inject</code> 显式注册的服务和中间件，都会被自动注册</p><h4 id="使用" tabindex="-1"><a class="header-anchor" href="#使用" aria-hidden="true">#</a> 使用</h4><p>在其他服务或中间件中使用</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>class TestMiddleware extends Middleware {
  @Inject
  private readonly service1!: TestService;
  @Inject
  private readonly service2!: ParentService;

  invoke(){
    this.ok();
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="通过键值注册服务" tabindex="-1"><a class="header-anchor" href="#通过键值注册服务" aria-hidden="true">#</a> 通过键值注册服务</h3><p>键是字符串，即指定字符串映射指定实例对象或其他值</p><p>在 <code>index.ts</code> 中</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &quot;@halsp/inject&quot;;

// 字符串映射服务
startup.inject(&quot;SERVICE_KEY&quot;, Service);
// 字符串映射特定服务实例，注意此方式仅能用于单例，因为服务没有交给框架实例化
startup.inject(&quot;SERVICE_KEY&quot;, new Service(), InjectType.Singleton);
// 字符串映射特定值，值可以是实例对象，也可以是其他任意值如 Number/Date/Stream 等类型
startup.inject(&quot;SERVICE_KEY&quot;, async (ctx) =&gt; await createService(ctx));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在服务或中间件中使用</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>class TestMiddleware extends Middleware {
  @Inject(&quot;KEY1&quot;)
  private readonly service1!: TestService;
  @Inject(&quot;KEY2&quot;)
  private readonly service2!: any;

  invoke(){
    this.ok();
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>除服务外，甚至可以注入常量值</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>startup.inject(&quot;KEY1&quot;, true);
startup.inject(&quot;KEY2&quot;, &quot;str&quot;);
startup.inject(&quot;KEY3&quot;, () =&gt; 2333);
startup.inject(
  &quot;KEY4&quot;,
  (ctx) =&gt; new Promise&lt;symbol&gt;((resolve) =&gt; resolve(Symbol()))
);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>class TestMiddleware extends Middleware {
  @Inject(&quot;KEY1&quot;)
  private readonly key1!: boolean; // true
  @Inject(&quot;KEY2&quot;)
  private readonly key2!: any; // &quot;str&quot;
  @Inject(&quot;KEY3&quot;)
  private readonly key3!: number; // 2333
  @Inject(&quot;KEY4&quot;)
  private readonly key4!: Symbol; // symbol
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="服务的嵌套" tabindex="-1"><a class="header-anchor" href="#服务的嵌套" aria-hidden="true">#</a> 服务的嵌套</h2><p>嵌套的服务也能被正确初始化</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>class TestService1(){}

class TestService2{
  @Inject
  private readonly service1!: TestService1;
}

class TestService3{
  @Inject
  private readonly service1!: TestService1;

  @Inject
  service2!: TestService2;
}

class TestMiddleware extends Middleware{
  @Inject
  private readonly service1!: TestService1;

  @Inject
  private readonly service2!: TestService2;

  @Inject
  private readonly service3!: TestService3;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="手动创建服务" tabindex="-1"><a class="header-anchor" href="#手动创建服务" aria-hidden="true">#</a> 手动创建服务</h2><p>有些服务可能没有写在其他服务或中间件中，就无法自动获取服务</p><p>利用 <code>ctx.getService</code> 函数可手动获取一个服务实例</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import &#39;@halsp/inject&#39;

const service1 = await ctx.getService(ParentService);
const service2 = await ctx.getService(&quot;KEY&quot;);
const service3 = await ctx.getService(new Service()); // 不推荐
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述 <code>service3</code> 方式无法控制服务的生命周期，也无法实例化构造函数中的服务</p><p>由于 <code>service3</code> 的实例是手动创建的，其作用域等同于 <code>Transient</code></p><h2 id="自定义注入" tabindex="-1"><a class="header-anchor" href="#自定义注入" aria-hidden="true">#</a> 自定义注入</h2><p>可以利用提供的装饰器 <code>Inject</code> 和函数 <code>createInject</code> ，创建自定义注入</p><p>自定义注入的自由性比较高，不局限于服务</p><p>如你可以从 <code>ctx</code> 实例对象中取值，也可以创建一个新的装饰器</p><h3 id="自定义-inject" tabindex="-1"><a class="header-anchor" href="#自定义-inject" aria-hidden="true">#</a> 自定义 <code>Inject</code></h3><p><code>Inject</code> 即是装饰器，也是能够创建装饰器的函数</p><p>传入以下参数返回一个新的装饰器：</p><ul><li>handler: 回调函数，支持异步，返回值将作为装饰的字段值。当下面第二个的参数 type 不为 <code>Singleton</code> 时，参数为中间件管道对象 <code>Context</code></li><li>type: 可选，服务的作用域，<code>InjectType</code> 类型，与前面介绍的 <strong>作用域</strong> 的概念相同。这里是用于控制 <code>handler</code> 回调函数的作用域 <ul><li>Singleton: <code>handler</code> 回调只会执行一次，因此装饰的不同字段值始终相同，回调函数没有 <code>Context</code> 参数</li><li>Scoped: <code>handler</code> 回调每次网络请求只会执行一次，装饰的不同字段值在单次网络访问期间相同，回调函数有参数 <code>Context</code></li><li>Transient: <code>handler</code> 回调在每个装饰的字段都会执行一次，回调函数有参数 <code>Context</code></li></ul></li></ul><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Inject } from &quot;@halsp/inject&quot;;

// 创建一个 @CustomHost 装饰器
const CustomHost = Inject((ctx) =&gt; ctx.req.get(&quot;Host&quot;));
// 创建一个 @CustomUserID 装饰器
const CustomUserID = Inject((ctx) =&gt; ctx.req.query[&quot;uid&quot;]);

// 在中间件或服务中使用
class TestMiddleware extends Middleware {
  @CustomHost
  readonly host!: string;
  @CustomUserID
  private userId!: string;

  invoke() {
    this.ok({
      host: this.host,
      userId: this.userId,
    });
  }
}

// 或通过构造函数注入
class TestMiddleware extends Middleware {
  constructor(
    @CustomHost readonly host: string,
    @CustomUserID private userId: string
  ) {
    super();
  }

  invoke() { }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="自定义-createinject" tabindex="-1"><a class="header-anchor" href="#自定义-createinject" aria-hidden="true">#</a> 自定义 <code>createInject</code></h3><p>用于创建更复杂的自定义注入装饰器，一般在已有装饰器函数内部使用</p><p>比自定义 <code>Inject</code> 能实现的功能更多，但同时需要传入更多参数</p><p><code>createInject</code> 无返回值， 接收以下参数</p><ul><li>handle: 同自定义 <code>Inject</code> 中的 <code>handler</code> 回调函数</li><li>target: 装饰的类或类的原型，从装饰器参数取得</li><li>propertyKey: 装饰的属性名，从属性装饰器参数取得</li><li>parameterIndex: 装饰的参数索引，从参数装饰器参数取得</li><li>type: <code>InjectType</code> 类型，作用同上面自定义 <code>Inject</code> 的 <code>type</code> 参数</li></ul><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Inject } from &quot;@halsp/inject&quot;;

// 创建一个 @CustomUserID 装饰器
function CustomUserID(target:any, propertyKey: string|symbol){
  // do more work
  return createInject((ctx) =&gt; ctx.req.query[&quot;uid&quot;], target, propertyKey);
}

// 在中间件或服务中使用
class TestMiddleware extends Middleware {
  @CustomUserID
  readonly userId!: string;

  async invoke() {
    this.ok({
      userId: this.userId,
    });
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="自定义支持嵌套服务" tabindex="-1"><a class="header-anchor" href="#自定义支持嵌套服务" aria-hidden="true">#</a> 自定义支持嵌套服务</h3><p>通过自定义装饰器，也支持嵌套服务，示例代码如下</p><p>定义</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Inject } from &quot;@halsp/inject&quot;;

class TestService1{}
class TestService2{
  @Inject
  service1: TestService1;
}
class TestService3{
  @Inject
  service1: TestService1;
  @Inject
  service2: TestService2;
}

const Service3 = Inject((ctx) =&gt; new TestService3());
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>中间件</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>import { Middleware } from &quot;@halsp/core&quot;;

class TestMiddleware extends Middleware {
  @Service3
  readonly service1!: Service3;
  @Service3
  readonly service2!: any;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>OR</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>@Inject
class TestMiddleware extends Middleware {
  constructor(
    @Service3 readonly service1: Service3,
    @Service3 readonly service2: any
  ){
    super();
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="context" tabindex="-1"><a class="header-anchor" href="#context" aria-hidden="true">#</a> Context</h2><p>已默认注入了 <code>Context</code> 示例，因此在中间件或服务中，可以直接通过依赖注入获取</p><div class="language-TS line-numbers-mode" data-ext="TS"><pre class="language-TS"><code>class CustomService {
  @Inject
  private readonly ctx!: Context;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,120),l=[a];function c(r,v){return i(),n("div",null,l)}const u=e(s,[["render",c],["__file","inject.html.vue"]]);export{u as default};
