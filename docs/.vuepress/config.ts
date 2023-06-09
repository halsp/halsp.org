import { defaultTheme, defineUserConfig, UserConfig } from "vuepress";
import { searchPlugin } from "@vuepress/plugin-search";
import { zh, en, lang } from "../lang";

const microLinks: string[] = [
  "/env/micro-common",
  "/env/micro-tcp",
  "/env/micro-grpc",
  "/env/micro-redis",
  "/env/micro-mqtt",
  "/env/micro-nats",
];
const guideLinks: string[] = [
  "/usage/intro",
  "/usage/quickstart",
];
const basicLinks: string[] = [
  "/usage/startup",
  "/usage/middleware",
  "/usage/result",
  "/usage/inject",
  "/usage/router",
];
const advanceLinks: string[] = [
  "/usage/cli",
  "/usage/view",
  "/usage/pipe",
  "/usage/filter",
  "/usage/mva",
  "/usage/error",
];

function getLinksWithPrefix<T extends string | string[]>(links: T, l: lang): T {
  let list: string[] = Array.isArray(links) ? links : [links];
  list = list.map((link) => l.t("prefix") + link);
  return (Array.isArray(links) ? list : list[0]) as T;
}

function createNavbar(l: lang) {
  const { t } = l;
  return [
    {
      text: t("menus.guide"),
      children: [
        {
          text: t("menus.start"),
          children: getLinksWithPrefix(guideLinks, l),
        },
        {
          text: t("menus.basic"),
          children: getLinksWithPrefix(basicLinks, l),
        },
        {
          text: t("menus.advance"),
          children: getLinksWithPrefix(advanceLinks, l),
        },
        {
          text: t("menus.debug"),
          children: getLinksWithPrefix(["/usage/debug", "/usage/testing"], l),
        },
      ],
    },
    {
      text: t("menus.environment"),
      children: [
        {
          text: t("menus.custom"),
          children: getLinksWithPrefix(["/env/custom-env"], l),
        },
        {
          text: t("menus.basic"),
          children: getLinksWithPrefix(
            ["/env/native", "/env/lambda", "/env/alifc"],
            l
          ),
        },
        {
          text: t("menus.microservices"),
          children: getLinksWithPrefix(microLinks, l),
        },
        {
          text: t("menus.more"),
          children: getLinksWithPrefix(["/env/koa-env"], l),
        },
      ],
    },
    {
      text: t("menus.plugins"),
      children: [
        {
          text: t("menus.common"),
          children: getLinksWithPrefix(
            ["/plugin/static", "/plugin/swagger", "/plugin/logger"],
            l
          ),
        },
        {
          text: t("menus.safety"),
          children: getLinksWithPrefix(["/plugin/jwt", "/plugin/validator"], l),
        },
        {
          text: t("menus.dataStorage"),
          children: getLinksWithPrefix(
            ["/plugin/typeorm", "/plugin/redis", "/plugin/mongoose"],
            l
          ),
        },
        {
          text: t("menus.more"),
          children: getLinksWithPrefix(
            ["/plugin/koa", "/plugin/cors", "/plugin/cookie"],
            l
          ),
        },
      ],
    },
    {
      text: t("menus.community"),
      children: [
        {
          text: "Discussions",
          link: "https://github.com/halsp/core/discussions",
        },
        {
          text: t("config.kook"),
          link: "https://kook.top/qdUuDI",
        },
      ],
    },
  ];
}
function createSidebar(l: lang) {
  const { t } = l;
  return [
    {
      text: t("menus.start"),
      children: getLinksWithPrefix(guideLinks, l),
    },
    {
      text: t("menus.basic"),
      children: getLinksWithPrefix(basicLinks, l),
    },
    {
      text: t("menus.advance"),
      children: getLinksWithPrefix(advanceLinks, l),
    },
    {
      text: t("menus.environment"),
      children: [
        ...getLinksWithPrefix(
          [
            "/env/custom-env",
            "/env/native",
            "/env/lambda",
            "/env/alifc",
            "/env/koa-env",
          ],
          l
        ),
        {
          text: t("menus.microservices"),
          children: getLinksWithPrefix(microLinks, l),
        },
      ],
    },
    {
      text: t("menus.debug"),
      children: getLinksWithPrefix(["/usage/debug", "/usage/testing"], l),
    },
    {
      text: t("menus.plugins"),
      children: [
        {
          text: t("menus.common"),
          children: getLinksWithPrefix(
            ["/plugin/static", "/plugin/swagger", "/plugin/logger"],
            l
          ),
        },
        {
          text: t("menus.safety"),
          children: getLinksWithPrefix(["/plugin/jwt", "/plugin/validator"], l),
        },
        {
          text: t("menus.dataStorage"),
          children: getLinksWithPrefix(
            ["/plugin/typeorm", "/plugin/redis", "/plugin/mongoose"],
            l
          ),
        },
        {
          text: t("menus.more"),
          children: getLinksWithPrefix(
            ["/plugin/koa", "/plugin/cors", "/plugin/cookie"],
            l
          ),
        },
      ],
    },
  ];
}

function getLocales(l: lang) {
  const { t } = l;
  return {
    lang: t("lang"),
    title: t("title"),
    description: t("description"),
  };
}

function getThemeLocales(l: lang) {
  const { t } = l;
  return {
    selectLanguageName: t("langName"),
    editLinkText: t("config.editLinkText"),
    backToHome: t("config.backToHome"),
    notFound: [t("config.notFound")],
    navbar: createNavbar(l),
    sidebar: createSidebar(l),
    home: t("prefix") + "/usage/intro",
  };
}

const userConfig: UserConfig = {
  lang: "en-US",
  base: "/",
  locales: {
    [en.t("prefix") + "/"]: getLocales(en),
    [zh.t("prefix") + "/"]: getLocales(zh),
  },
  theme: defaultTheme({
    docsRepo: "https://github.com/halsp/halsp.org",
    docsBranch: "main",
    repo: "https://github.com/halsp/core",
    docsDir: "docs",
    editLinkPattern: ":repo/edit/:branch/:path",
    editLink: true,
    logo: "/images/logo.png",
    sidebarDepth: 2,
    locales: {
      [en.t("prefix") + "/"]: getThemeLocales(en),
      [zh.t("prefix") + "/"]: getThemeLocales(zh),
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
    [
      "script",
      {
        type: "text/javascript",
        src: "/js/index.js",
      },
    ],
    ["link", { rel: "icon", href: "/favicon.ico" }],
  ],
  plugins: [
    searchPlugin({
      maxSuggestions: 10,
      locales: {
        [en.t("lang")]: {
          placeholder: en.t("config.searchPlaceholder"),
        },
        [zh.t("lang")]: {
          placeholder: zh.t("config.searchPlaceholder"),
        },
      },
    }),
  ],
};
export default defineUserConfig(userConfig);
