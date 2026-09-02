document.addEventListener("DOMContentLoaded", () => {
  const nodes = document.querySelectorAll("[data-katex]");
  let errors = 0;

  nodes.forEach((node) => {
    try {
      window.katex.render(node.dataset.katex || "", node, {
        displayMode: node.dataset.displayMode === "true",
        throwOnError: true,
        strict: "warn",
      });
      node.dataset.katexRendered = "true";
    } catch (error) {
      errors += 1;
      node.dataset.katexError = String(error);
    }
  });

  document.documentElement.dataset.pastExamKatexCount = String(nodes.length);
  document.documentElement.dataset.pastExamKatexErrors = String(errors);
});
