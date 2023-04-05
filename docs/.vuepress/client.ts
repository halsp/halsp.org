import { defineClientConfig } from "@vuepress/client";

export default defineClientConfig({
  enhance: ({ router }) => {
    router.beforeEach(async (to) => {
      if (to.path == "/" || to.path == "") {
        if (window.navigator?.language?.startsWith("zh")) {
          return "/zh/usage/intro";
        } else {
          return "/en/usage/intro";
        }
      }
    });
  },
});
