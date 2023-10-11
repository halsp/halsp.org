!(() => {
  if (window.location.pathname == "/" || window.location.pathname == "") {
    if (window.navigator?.language?.startsWith("zh")) {
      window.open("/zh/usage/intro", "_self");
    } else {
      window.open("/en/usage/intro", "_self");
    }
  }
})();
