import fs from "fs";
import path from "path";
import { createBlogFooter, createMarkdownPageShell } from "./site-parts.mjs";

const home = process.env.USERPROFILE;

const postShellHtml = createMarkdownPageShell({ prefix: "../" });

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

function isDraftMarkdown(text) {
  const cleanText = text.replace(/^\uFEFF/, "");
  const match = cleanText.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);

  if (!match) {
    return false;
  }

  const yaml = match[1];
  const draftMatch = yaml.match(/^draft:\s*(.+)$/m);

  if (!draftMatch) {
    return false;
  }

  return draftMatch[1].trim().toLowerCase() === "true";
}

function splitFrontmatter(text) {
  const cleanText = text.replace(/^\uFEFF/, "");
  const match = cleanText.match(/^(---\s*\r?\n[\s\S]*?\r?\n---\s*)([\s\S]*)$/);

  if (!match) {
    return {
      frontmatter: "",
      body: cleanText,
    };
  }

  return {
    frontmatter: match[1].trimEnd(),
    body: match[2].replace(/^\s+/, ""),
  };
}

function parseFrontmatter(text) {
  const cleanText = text.replace(/^\uFEFF/, "");
  const match = cleanText.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);

  if (!match) {
    return {};
  }

  const data = {};
  const lines = match[1].split(/\r?\n/);
  let currentKey = null;

  for (const line of lines) {
    const keyValueMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (keyValueMatch) {
      const key = keyValueMatch[1];
      let value = keyValueMatch[2].trim();

      if (value === "") {
        data[key] = [];
        currentKey = key;
      } else {
        data[key] = value.replace(/^["']|["']$/g, "");
        currentKey = key;
      }

      continue;
    }

    const listItemMatch = line.match(/^\s*-\s*(.*)$/);

    if (listItemMatch && currentKey) {
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = [];
      }

      data[currentKey].push(listItemMatch[1].trim());
    }
  }

  return data;
}

function formatDisplayDate(dateText) {
  if (!dateText) {
    return "";
  }

  return String(dateText).replaceAll("-", ".");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function normalizePostImagePath(image) {
  if (typeof image !== "string") {
    return "";
  }

  const trimmedImage = image.trim();

  if (!trimmedImage) {
    return "";
  }

  if (
    trimmedImage.startsWith("http://") ||
    trimmedImage.startsWith("https://") ||
    trimmedImage.startsWith("/") ||
    trimmedImage.startsWith("../")
  ) {
    return trimmedImage;
  }

  const withoutCurrentDir = trimmedImage.replace(/^\.\//, "");

  if (withoutCurrentDir.startsWith("images/")) {
    return `../${withoutCurrentDir}`;
  }

  return `../images/${withoutCurrentDir}`;
}

function createPostMeta(frontmatter) {
  const updated = frontmatter.updated || frontmatter.modified || frontmatter.date;

  if (!updated) {
    return "";
  }

  return `<div class="post-title-meta">
<span>UPDATED: ${formatDisplayDate(updated)}</span>
</div>`;
}

function createPostHeroImage(frontmatter) {
  const imagePath = normalizePostImagePath(frontmatter.image);

  if (!imagePath) {
    return "";
  }

  return `<figure class="post-hero-image">
<img src="${escapeHtml(imagePath)}" alt="${escapeHtml(frontmatter.title || "")}">
</figure>`;
}

function insertPostIntro(body, introHtml) {
  if (!introHtml) {
    return body;
  }

  const headingMatch = body.match(/^(# .+?)(\r?\n)([\s\S]*)$/);

  if (!headingMatch) {
    return `${introHtml}\n\n${body}`;
  }

  return `${headingMatch[1]}${headingMatch[2]}\n${introHtml}\n\n${headingMatch[3]}`;
}

function buildPublishedPost(text) {
  const { frontmatter, body } = splitFrontmatter(text);
  const parsedFrontmatter = parseFrontmatter(text);
  const frontmatterBlock = frontmatter ? `${frontmatter}\n\n` : "";
  const introHtml = [
    createPostMeta(parsedFrontmatter),
    createPostHeroImage(parsedFrontmatter),
  ]
    .filter(Boolean)
    .join("\n\n");
  const bodyWithIntro = insertPostIntro(body, introHtml);

  return `${frontmatterBlock}${postShellHtml}

${bodyWithIntro}

${createBlogFooter("../")}`;
}

function copyMarkdownFiles(sourceDir, destDir) {
  const files = fs.readdirSync(sourceDir);

  for (const file of files) {
    if (!file.endsWith(".md")) {
      continue;
    }

    const source = path.join(sourceDir, file);
    const dest = path.join(destDir, file);
    const text = fs.readFileSync(source, "utf8");

    if (isDraftMarkdown(text)) {
      if (fs.existsSync(dest)) {
        fs.unlinkSync(dest);
        console.log(`Removed draft post from public folder: ${file}`);
      } else {
        console.log(`Skipped draft post: ${file}`);
      }

      continue;
    }

    fs.writeFileSync(dest, buildPublishedPost(text), "utf8");
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
