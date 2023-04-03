import zhOptions from "./src/zh-cn";
import enOptions from "./src/en-us";

function getLangByKey(options: any, key: string) {
  const keys = key.split(".");
  keys.forEach((k) => {
    options = options[k];
  });
  return options;
}

export const zh = {
  t: (key: string) => getLangByKey(zhOptions, key),
};
export const en = {
  t: (key: string) => getLangByKey(enOptions, key),
};

export type lang = typeof zh | typeof en;
