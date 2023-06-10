import { defineClientConfig } from "@vuepress/client";
import QuickStart from "./components/QuickStart.vue";

export default defineClientConfig({
  enhance({ app }) {
    app.component("QuickStart", QuickStart);
  },
});
