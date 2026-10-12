"use strict";

const copyButton = document.querySelector("[data-copy]");
if (copyButton) {
  copyButton.addEventListener("click", async () => {
    const citation = document.getElementById(copyButton.dataset.copy);
    const status = document.getElementById("copy-status");
    if (!citation || !status) return;
    try {
      await navigator.clipboard.writeText(citation.textContent);
      status.textContent = "BibTeX copied.";
    } catch {
      const range = document.createRange();
      range.selectNodeContents(citation);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = "Citation selected. Press Ctrl+C or Command+C to copy.";
    }
  });
}
