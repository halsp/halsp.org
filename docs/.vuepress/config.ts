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
        text: "GitHub",
        link: "https://github.com/sfajs",
      },
    ],
    sidebar: {
      "/usage/": [
        {
          text: "新手指南",
          children: ["intro.md", "quickstart.md"],
        },
        {
          text: "基础",
          children: [
            "startup.md",
            "middleware.md",
            "result.md",
            "inject.md",
            "router.md",
          ],
        },
        {
          text: "进阶",
          children: ["view.md", "mva.md", "filter.md", "pipe.md", "koa.md"],
        },
        {
          text: "运行环境",
          children: [
            "env.md",
            "http.md",
            "cloudbase.md",
            "alifunc.md",
            "koa-env.md",
          ],
        },
      ],
    },
  }),
});
