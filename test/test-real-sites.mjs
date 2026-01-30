import { htmlToMarkdown, htmlToText } from "../dist/utils/markdown.js";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const resultsDir = join(__dirname, "results");

const sites = [
  { name: "hashscraper", url: "https://www.hashscraper.com" },
  { name: "clien", url: "https://clien.net" },
];

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

for (const site of sites) {
  console.log(`\nFetching ${site.url} ...`);
  try {
    const res = await fetch(site.url, { headers: { "User-Agent": UA } });
    const html = await res.text();
    console.log(`  HTTP ${res.status} | HTML ${html.length} chars`);

    // markdown
    const md = htmlToMarkdown(html, site.url);
    const mdPath = join(resultsDir, `${site.name}-markdown.md`);
    writeFileSync(mdPath, md, "utf-8");
    console.log(`  Markdown: ${md.length} chars -> ${mdPath}`);

    // text
    const txt = htmlToText(html, site.url);
    const txtPath = join(resultsDir, `${site.name}-text.txt`);
    writeFileSync(txtPath, txt, "utf-8");
    console.log(`  Text:     ${txt.length} chars -> ${txtPath}`);
  } catch (err) {
    console.error(`  ERROR: ${err.message}`);
  }
}

console.log("\nDone. Results saved to test/results/");
