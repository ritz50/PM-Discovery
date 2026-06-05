/**
 * Bundle only the content the app reads at runtime (~200 KB).
 * Skips inbox/ and archive/ (raw transcripts) — they are not served by the app.
 */
const fs = require("fs");
const path = require("path");

const sibling = path.join(__dirname, "..", "..", "content");
const bundled = path.join(__dirname, "..", "content-data");

/** Paths under content/ that content.ts actually reads */
const DEPLOY_PATHS = [
  "curriculum",
  "modules",
  "frameworks",
  "case-studies",
  "interview-bank",
  "glossary.md",
];

function copyDeployContent(srcRoot, destRoot) {
  fs.rmSync(destRoot, { recursive: true, force: true });
  fs.mkdirSync(destRoot, { recursive: true });

  for (const rel of DEPLOY_PATHS) {
    const src = path.join(srcRoot, rel);
    const dest = path.join(destRoot, rel);
    if (!fs.existsSync(src)) {
      console.warn(`Skipping missing: ${rel}`);
      continue;
    }
    fs.cpSync(src, dest, { recursive: true });
  }
}

// Git deploy: full repo cloned, ../content exists
if (fs.existsSync(sibling)) {
  copyDeployContent(sibling, bundled);
  console.log("Prepared deploy content from ../content");
} else if (fs.existsSync(bundled)) {
  console.log("Using existing content-data");
} else {
  console.error(
    "Content not found. For CLI deploys run from repo root or ensure content/ is in the repo."
  );
  process.exit(1);
}
