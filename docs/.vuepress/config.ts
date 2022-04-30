import { defaultTheme, defineUserConfig } from "vuepress";

export default defineUserConfig({
  lang: "zh-CN",
  title: "SfaJS 文档",
  description: "nodejs 渐进式 web 框架",
  base: "/",
  theme: defaultTheme({
    home: "/index.md",
    logo: "/images/logo.png",
    sidebarDepth: 1,
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
        link: "https://github.com/sfajs",
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
          children: ["view", "mva", "filter", "pipe", "koa", "static", "debug"],
        },
        {
          text: "运行环境",
          children: ["env", "http", "cloudbase", "alifunc", "koa-env"],
        },
      ],
      "/plugin/": ["intro", "jwt", "swagger"],
    },
  }),
});
