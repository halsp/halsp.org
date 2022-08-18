!(() => {
  const nodes = document
    .getElementsByClassName("theme-default-content")
    .item(0)
    ?.getElementsByTagName("div")
    ?.item(0)?.childNodes;
  if (!nodes) return;

  const nums = [];
  nodes.forEach((node) => {
    if (node.nodeName.match(/^[hH][2-6]$/)) {
      const index = Number(node.nodeName.substring(1)) - 2;
      if (nums[index] == undefined) {
        nums[index] = 0;
      }
      nums[index]++;
      nums.splice(index + 1);

      const prefix = nums.join(".") + " ";
      const lastChild = node.lastChild;
      if (!lastChild.textContent.startsWith(prefix)) {
        node.replaceChild(
          document.createTextNode(prefix + lastChild.textContent),
          lastChild
        );
      }
    }
  });
})();
