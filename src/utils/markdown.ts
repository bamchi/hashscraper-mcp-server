import TurndownService from "turndown";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

// Remove unnecessary elements
turndown.remove(["script", "style", "noscript", "iframe"]);

// Image handling - include alt text and URL
turndown.addRule("images", {
  filter: "img",
  replacement: (content, node) => {
    const img = node as HTMLImageElement;
    const alt = img.alt || "image";
    const src = img.src;
    if (!src) return "";
    return `![${alt}](${src})`;
  },
});

// Link handling
turndown.addRule("links", {
  filter: "a",
  replacement: (content, node) => {
    const anchor = node as HTMLAnchorElement;
    const href = anchor.href;
    const text = content.trim();
    if (!href || !text) return text || "";
    return `[${text}](${href})`;
  },
});

export function htmlToMarkdown(html: string, url?: string): string {
  try {
    // Parse with JSDOM
    const dom = new JSDOM(html, { url });
    const document = dom.window.document;

    // Extract main content with Readability (removes ads, navigation)
    const reader = new Readability(document.cloneNode(true) as Document);
    const article = reader.parse();

    if (article?.content) {
      // Convert extracted content to Markdown
      const markdown = turndown.turndown(article.content);
      return cleanMarkdown(markdown);
    }

    // If Readability fails, convert entire body
    const body = document.body;
    if (body) {
      // Remove unnecessary elements
      const selectorsToRemove = [
        "nav",
        "header",
        "footer",
        "aside",
        ".sidebar",
        ".menu",
        ".navigation",
        ".advertisement",
        ".ad",
        ".ads",
        "#cookie-banner",
        ".cookie-notice",
      ];
      selectorsToRemove.forEach((selector) => {
        body.querySelectorAll(selector).forEach((el) => el.remove());
      });

      const markdown = turndown.turndown(body.innerHTML);
      return cleanMarkdown(markdown);
    }

    return "Unable to extract content.";
  } catch (error) {
    console.error("Markdown conversion error:", error);
    return "An error occurred during content conversion.";
  }
}

function cleanMarkdown(markdown: string): string {
  return (
    markdown
      // Remove consecutive blank lines
      .replace(/\n{3,}/g, "\n\n")
      // Remove trailing whitespace
      .replace(/[ \t]+$/gm, "")
      // Trim leading/trailing whitespace
      .trim()
  );
}
