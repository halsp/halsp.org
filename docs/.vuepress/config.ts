import { defaultTheme, defineUserConfig } from "vuepress";

export default defineUserConfig({
  lang: "zh-CN",
  title: "Ipare 文档",
  description: "面向云的现代渐进式轻量 Node.js 框架",
  base: "/",
  theme: defaultTheme({
    docsRepo: "https://github.com/ipare/ipare.org",
    docsBranch: "main",
    docsDir: "docs",
    editLinkPattern: ":repo/edit/:branch/:path",
    editLinks: true,
    editLinkText: "编辑此页",
    home: "/index.md",
    logo: "/images/logo.png",
    sidebarDepth: 1,
    searchMaxSuggestions: 10,
    backToHome: "返回主页",
    notFound: ["你访问的页面不存在"],
    navbar: [
      {
        text: "使用文档",
        link: "/usage/intro",
      },
      {
        text: "运行环境",
        link: "/usage/env",
      },
      {
        text: "更多插件",
        link: "/plugin/intro",
      },
      {
        text: "GitHub",
        link: "https://github.com/ipare",
      },
    ],
    sidebar: {
      "/usage/": [
        {
          text: "新手指南",
          children: ["intro", "quickstart"],
        },
        {
          text: "基础",
          children: ["startup", "middleware", "result", "inject", "router"],
        },
        {
          text: "进阶",
          children: [
            "cli",
            "view",
            "mva",
            "filter",
            "pipe",
            "koa",
            "static",
            "debug",
          ],
        },
        {
          text: "运行环境",
          children: ["env", "http", "lambda", "alifunc", "koa-env"],
        },
      ],
      "/plugin/": ["intro", "jwt", "swagger"],
    },
  }),
});
