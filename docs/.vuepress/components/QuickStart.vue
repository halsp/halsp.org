<template>
  <div class="quick-start-container">
    <div v-if="loading" class="placeholder">{{ placeholder }}</div>
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

const iframeRef = ref<HTMLIFrameElement>(null!);
const src = computed(
  () =>
    `${quickstartOrigin}/#/iframe?origin=${location.origin}&lang=${pageLang.value}`
);

const placeholder = computed(() =>
  pageLang.value.startsWith("zh")
    ? "加载中，请耐心等待 ..."
    : "Loading. Please wait..."
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

  loadIFrame();
});

const loading = ref(true);
async function loadIFrame() {
  await new Promise<void>((resolve) => {
    if (iframeRef.value["attachEvent"]) {
      iframeRef.value["attachEvent"]("onload", () => {
        resolve();
      });
    } else {
      iframeRef.value.onload = () => {
        resolve();
      };
    }
  });

  loading.value = false;
}
</script>

<style lang="scss" scoped>
.quick-start-container {
  padding: 20px 24px 0 20px;
  border: 2px solid var(--c-text-accent);
  border-radius: 4px;
  position: relative;

  .placeholder {
    z-index: 1;
    text-align: center;
    font-weight: bold;
    font-size: 1.2rem;
    opacity: 0.7;
    position: absolute;
    left: 0;
    top: 1rem;
    right: 0;
  }
}
</style>
