<template>
  <div
    style="
      padding: 20px 24px 0 20px;
      border: 2px solid var(--c-text-accent);
      border-radius: 4px;
    "
  >
    <iframe
      ref="iframeRef"
      :src="src"
      width="100%"
      frameborder="no"
      scrolling="no"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { usePageLang } from "@vuepress/client";

const quickstartOrigin = "https://quickstart.halsp.org";
const pageLang = usePageLang();

const iframeRef = ref<HTMLIFrameElement>();
const src = computed(
  () =>
    `${quickstartOrigin}/#/iframe?origin=${location.origin}&lang=${pageLang.value}`
);

onMounted(() => {
  window.addEventListener("message", (event) => {
    if (!iframeRef.value) return;

    if (event.origin != quickstartOrigin) {
      return;
    }
    if (typeof event.data != "object") {
      return;
    }
    if (!("height" in event.data)) {
      return;
    }

    const { height } = event.data;
    iframeRef.value.height = height;
  });
});
</script>
