export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderBody(markdown: string): string {
  const output: string[] = [];
  let paragraph: string[] = [];
  let code: string[] = [];
  let language = "plaintext";
  let inCodeBlock = false;

  const renderParagraph = () => {
    if (!paragraph.length) return;
    const html = escapeHtml(paragraph.join("\n"))
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      .replaceAll("\n", "<br />");
    output.push(`<p>${html}</p>`);
    paragraph = [];
  };

  const renderCodeBlock = () => {
    const body = code.join("\n");
    const highlighted = language === "rust"
      ? hljs.highlight(body, { language: "rust" }).value
      : escapeHtml(body);
    output.push(`<pre class="code-block language-${language}"><code>${highlighted}</code></pre>`);
    code = [];
  };

  markdown.trim().split("\n").forEach((line) => {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        renderCodeBlock();
        inCodeBlock = false;
      } else {
        renderParagraph();
        language = line.slice(3).trim() || "plaintext";
        inCodeBlock = true;
      }
      return;
    }
    if (inCodeBlock) {
      code.push(line);
    } else if (line.trim()) {
      paragraph.push(line);
    } else {
      renderParagraph();
    }
  });

  if (inCodeBlock) renderCodeBlock();
  renderParagraph();
  return output.join("\n");
}

export function setMeta(title: string, description: string): void {
  const lowercaseTitle = title.toLowerCase();
  const lowercaseDescription = description.toLowerCase();
  document.title = lowercaseTitle;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", lowercaseDescription);
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", lowercaseTitle);
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute("content", lowercaseDescription);
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", `${location.origin}${location.pathname}`);
}
import hljs from "highlight.js/lib/common";
