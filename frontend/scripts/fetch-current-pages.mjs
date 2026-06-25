import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const workspace = path.resolve(root, "..");
const outDir = path.join(workspace, "baseline", "pages");

const paths = [
  "/top/voice/",
  "/voice/",
  "/medical-english-training/",
  "/medical-math-training/",
  "/study-support-system/",
  "/top/results/",
  "/results/",
  "/top/teacher/",
  "/top/history/",
  "/top/faq/",
  "/top/course/",
  "/lexus-premier/",
  "/top/course/lexus-premiere-course/",
  "/top/course/lexus-premiere-course/ss/",
  "/top/course/lexus-premiere-course/sa/",
  "/top/course/lexus-premiere-course/advanced/",
  "/top/course/lexus-premiere-course/basic-%ce%b1/",
  "/top/course/lexus-premiere-course/basic-%ce%b2/",
  "/top/course/lexus-premiere-course/introduction/",
  "/top/course/high-level-geneki-course/",
  "/todai-keio-med-special/",
  "/top/course/high-level-geneki-course/nankan-igakubu/",
  "/top/course/high-level-geneki-course/joui-igakubu/",
  "/top/course/custom-made-course/",
  "/top/course/medical-prep/",
  "/top/course/medical-prep-junior/",
  "/top/access/",
  "/top/lexus-garden/",
  "/entrance/",
  "/top/information-kokuritsu/",
  "/top/information-shiritsu/",
  "/information-faq/",
  "/kuriage-information/",
  "/penguin-geometry/",
  "/penguin-integral/",
  "/english-training/",
  "/top/line/",
  "/top/summer-plan/",
  "/mail-01/",
  "/mail-02/",
  "/mail-03/",
  "/past-post/",
  "/%e7%89%b9%e5%ae%9a%e5%95%86%e5%8f%96%e5%bc%95%e6%b3%95%e3%81%ab%e5%9f%ba%e3%81%a5%e3%81%8f%e8%a1%a8%e8%a8%98/",
  "/request-documents/",
  "/top/reservation/",
  "/reservation/",
  "/top/contact/",
  "/test-entry/",
  "/dokkyouika-university-entrance-exam-measures2027/",
  "/jichiika-university-entrance-exam-measures2027/",
  "/saitamaika-university-entrance-exam-measures2027/",
  "/touhokuikayakka-university-entrance-exam-measures2027/",
  "/toukai-university-entrance-exam-measures2027/",
  "/kanazawaika-university-entrance-exam-measures2027/",
];

const safeName = (value) =>
  decodeURIComponent(value)
    .replace(/^\/|\/$/g, "")
    .replace(/[\\/:*?"<>|#%&{}$!'@+`=]/g, "_")
    .replace(/\s+/g, "-") || "home";

await mkdir(outDir, { recursive: true });

const manifest = [];
for (const pagePath of paths) {
  const url = new URL(pagePath, "https://lexus-ec.com");
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; LEXUS-EC-static-rebuild-audit/1.0)",
      accept: "text/html,application/xhtml+xml",
    },
  });
  const html = await response.text();
  const fileName = `${safeName(url.pathname)}.html`;
  await writeFile(path.join(outDir, fileName), html, "utf8");
  manifest.push({
    path: url.pathname,
    url: url.href,
    status: response.status,
    bytes: Buffer.byteLength(html),
    fileName,
  });
  await new Promise((resolve) => setTimeout(resolve, 150));
}

await writeFile(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
console.log(`Fetched ${manifest.length} pages into ${outDir}`);
