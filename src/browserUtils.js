function copyFallback(text, onDone) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.cssText =
    "position:fixed;top:0;left:0;opacity:0;pointer-events:none;";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand("copy");
  } catch (error) {
    console.warn("Copy failed", error);
  }
  document.body.removeChild(textarea);
  onDone();
}

export function writeToClipboard(text, onDone) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(onDone)
      .catch(() => copyFallback(text, onDone));
    return;
  }
  copyFallback(text, onDone);
}

export function downloadBlob(content, type, filename) {
  const blob = new Blob([content], { type });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
}
