import { defaultTheme, defineUserConfig } from "vuepress";

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
            children: ["/usage/custom-env"],
          },
          {
            text: "基础",
            children: ["/usage/http", "/usage/lambda", "/usage/alifc"],
          },
          {
            text: "其他",
            children: ["/usage/koa-env"],
          },
        ],
      },
      {
        text: "拓展和插件",
        link: "/plugin/",
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
    sidebar: {
      "/usage/": [
        {
          text: "新手指南",
          children: ["intro", "quickstart", "appoint"],
        },
        {
          text: "基础",
          children: ["startup", "middleware", "result", "inject", "router"],
        },
        {
          text: "进阶",
          children: ["cli", "view", "filter", "mva", "pipe", "error"],
        },
        {
          text: "运行环境",
          children: ["custom-env", "http", "lambda", "alifc", "koa-env"],
        },
        {
          text: "测试",
          children: ["debug", "testing"],
        },
      ],
      "/plugin/": [
        {
          text: "常用",
          children: ["static", "swagger", "logger"],
        },
        {
          text: "安全性",
          children: ["jwt", "validator"],
        },
        {
          text: "数据存储",
          children: ["typeorm", "redis", "mongoose"],
        },
        {
          text: "其他",
          children: ["koa", "cors", "cookie"],
        },
      ],
    },
  }),
  head: [
    [
      "script",
      {
        type: "text/javascript",
        src: "/js/headerIndex.js",
      },
    ],
  ],
});
