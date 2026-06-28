import fs from "fs";
import path from "path";

const home = process.env.USERPROFILE;

const candidateVaultPaths = [
  path.join(home, "iCloudDrive", "Obsidian", "zakki"),
  path.join(home, "iCloudDrive", "Obsidian", "Obsidian", "zakki"),
  path.join(home, "iCloudDrive", "zakki"),
  path.join(home, "Documents", "zakki"),
  path.join(home, "iCloudDrive", "iCloud~md~obsidian","zakki"),
];

const quartzRoot = path.resolve(process.cwd());
const destPosts = path.join(quartzRoot, "content", "posts");
const destImages = path.join(quartzRoot, "content", "images");

function findVaultPath() {
  for (const vaultPath of candidateVaultPaths) {
    const blogPath = path.join(vaultPath, "01 Blog");

    if (fs.existsSync(blogPath)) {
      return vaultPath;
    }
  }

  return null;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyMarkdownFiles(sourceDir, destDir) {
  const files = fs.readdirSync(sourceDir);

  for (const file of files) {
    if (!file.endsWith(".md")) {
      continue;
    }

    const source = path.join(sourceDir, file);
    const dest = path.join(destDir, file);

    fs.copyFileSync(source, dest);
    console.log(`Copied post: ${file}`);
  }
}

function copyImageFiles(sourceDir, destDir) {
  if (!fs.existsSync(sourceDir)) {
    console.log("Attachments folder not found. Skipping images.");
    return;
  }

  const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();

      if (imageExtensions.has(ext)) {
        const dest = path.join(destDir, entry.name);
        fs.copyFileSync(fullPath, dest);
        console.log(`Copied image: ${entry.name}`);
      }
    }
  }

  walk(sourceDir);
}

const vaultPath = findVaultPath();

if (!vaultPath) {
  console.error("Obsidian Vault was not found.");
  console.error("Checked these paths:");

  for (const candidate of candidateVaultPaths) {
    console.error(`- ${candidate}`);
  }

  console.error("");
  console.error("Please edit candidateVaultPaths in scripts/copy-from-obsidian.mjs.");
  process.exit(1);
}

const sourcePosts = path.join(vaultPath, "01 Blog");
const sourceImages = path.join(vaultPath, "Attachments");

console.log(`Obsidian Vault: ${vaultPath}`);

ensureDir(destPosts);
ensureDir(destImages);

console.log("Copying posts...");
copyMarkdownFiles(sourcePosts, destPosts);

console.log("Copying images...");
copyImageFiles(sourceImages, destImages);

console.log("Done.");