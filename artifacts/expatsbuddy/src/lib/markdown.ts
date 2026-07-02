export function markdownToHtml(md: string): string {
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const lines = html.split("\n");
  const out: string[] = [];
  let inList = false;
  let inOrderedList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const ulMatch = line.match(/^[-*]\s+(.*)/);
    const olMatch = line.match(/^\d+\.\s+(.*)/);

    if (ulMatch) {
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push(`<li>${inline(ulMatch[1])}</li>`);
    } else if (olMatch) {
      if (!inOrderedList) { out.push("<ol>"); inOrderedList = true; }
      out.push(`<li>${inline(olMatch[1])}</li>`);
    } else {
      if (inList) { out.push("</ul>"); inList = false; }
      if (inOrderedList) { out.push("</ol>"); inOrderedList = false; }
      if (line.startsWith("## ")) {
        out.push(`<h2>${inline(line.slice(3))}</h2>`);
      } else if (line.startsWith("# ")) {
        out.push(`<h1>${inline(line.slice(2))}</h1>`);
      } else if (line.trim() === "") {
        out.push("<br>");
      } else {
        out.push(`<p>${inline(line)}</p>`);
      }
    }
  }
  if (inList) out.push("</ul>");
  if (inOrderedList) out.push("</ol>");

  return out.join("\n");
}

function inline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}
