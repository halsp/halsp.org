import { defaultTheme, defineUserConfig, NavLink } from "vuepress";

const microLinks: NavLink[] = [
  {
    text: "概览",
    link: "/env/micro-common",
  },
  {
    text: "TCP (@ipare/micro-tcp)",
    link: "/env/micro-tcp",
  },
  {
    text: "gRPC (@ipare/micro-grpc)",
    link: "/env/micro-grpc",
  },
  {
    text: "Redis (@ipare/micro-redis)",
    link: "/env/micro-redis",
  },
  {
    text: "MQTT (@ipare/micro-mqtt)",
    link: "/env/micro-mqtt",
  },
  {
    text: "Nats (@ipare/micro-nats)",
    link: "/env/micro-nats",
  },
];

export default defineUserConfig({
  lang: "zh-CN",
  title: "Ipare 文档",
  description: "面向云的现代渐进式轻量 Node.js 框架",
  base: "/",
  theme: defaultTheme({
    docsRepo: "https://github.com/ipare/ipare.org",
    docsBranch: "main",
    repo: "https://github.com/ipare/ipare",
    docsDir: "docs",
    editLinkPattern: ":repo/edit/:branch/:path",
    editLink: true,
    editLinkText: "编辑此页",
    home: "/index.md",
    logo: "/images/logo.png",
    sidebarDepth: 1,
    backToHome: "返回主页",
    notFound: ["你访问的页面不存在"],
    navbar: [
      {
        text: "使用文档",
        children: [
          {
            text: "新手指南",
            children: ["/usage/intro", "/usage/quickstart", "/usage/appoint"],
          },
          {
            text: "基础",
            children: [
              "/usage/startup",
              "/usage/middleware",
              "/usage/result",
              "/usage/inject",
              "/usage/router",
            ],
          },
          {
            text: "进阶",
            children: [
              "/usage/cli",
              "/usage/view",
              "/usage/pipe",
              "/usage/filter",
              "/usage/mva",
              "/usage/error",
            ],
          },
          {
            text: "测试",
            children: ["/usage/debug", "/usage/testing"],
          },
        ],
      },
      {
        text: "运行环境",
        children: [
          {
            text: "自定义",
            children: ["/env/custom-env"],
          },
          {
            text: "基础",
            children: ["/env/native", "/env/lambda", "/env/alifc"],
          },
          {
            text: "微服务",
            children: microLinks,
          },
          {
            text: "其他",
            children: ["/env/koa-env"],
          },
        ],
      },
      {
        text: "拓展和插件",
        link: "/usage/",
        children: [
          {
            text: "常用",
            children: ["/plugin/static", "/plugin/swagger", "/plugin/logger"],
          },
          {
            text: "安全性",
            children: ["/plugin/jwt", "/plugin/validator"],
          },
          {
            text: "数据存储",
            children: ["/plugin/typeorm", "/plugin/redis", "/plugin/mongoose"],
          },
          {
            text: "其他",
            children: ["/plugin/koa", "/plugin/cors", "/plugin/cookie"],
          },
        ],
      },
      {
        text: "社区",
        children: [
          {
            text: "Discussions",
            link: "https://github.com/ipare/ipare/discussions",
          },
          {
            text: "开黑啦",
            link: "https://kook.top/qdUuDI",
          },
        ],
      },
    ],
    sidebar: [
      {
        text: "新手指南",
        children: ["/usage/intro", "/usage/quickstart", "/usage/appoint"],
      },
      {
        text: "基础",
        children: [
          "/usage/startup",
          "/usage/middleware",
          "/usage/result",
          "/usage/inject",
          "/usage/router",
        ],
      },
      {
        text: "进阶",
        children: [
          "/usage/cli",
          "/usage/view",
          "/usage/filter",
          "/usage/mva",
          "/usage/pipe",
          "/usage/error",
        ],
      },
      {
        text: "运行环境",
        children: [
          "/env/custom-env",
          "/env/native",
          "/env/lambda",
          "/env/alifc",
          "/env/koa-env",
          {
            text: "微服务",
            children: microLinks,
          },
        ],
      },
      {
        text: "测试",
        children: ["/usage/debug", "/usage/testing"],
      },
      {
        text: "扩展和插件",
        children: [
          {
            text: "常用",
            children: ["/plugin/static", "/plugin/swagger", "/plugin/logger"],
          },
          {
            text: "安全性",
            children: ["/plugin/jwt", "/plugin/validator"],
          },
          {
            text: "数据存储",
            children: ["/plugin/typeorm", "/plugin/redis", "/plugin/mongoose"],
          },
          {
            text: "其他",
            children: ["/plugin/koa", "/plugin/cors", "/plugin/cookie"],
          },
        ],
      },
    ],
  }),
  head: [
    [
      "script",
      {
        type: "text/javascript",
        src: "/js/headerIndex.js",
      },
    ],
    ["link", { rel: "icon", href: "/favicon.ico" }],
  ],
});
