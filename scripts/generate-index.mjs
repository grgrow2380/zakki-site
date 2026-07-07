import fs from "fs";
import path from "path";
import {
  createBlogHeader,
  createBlogFooter,
  createBlogLayout,
  createMarkdownPageShell,
  createSidebarContent,
  siteCategories,
} from "./site-parts.mjs";

const contentDir = path.join(process.cwd(), "content");
const postsDir = path.join(contentDir, "posts");
const categories = siteCategories.map((category) => category.label);

function readMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`postsフォルダが見つかりません: ${dir}`);
    process.exit(1);
  }

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(dir, file));
}

function parseFrontmatter(text) {
  const cleanText = text.replace(/^\uFEFF/, "");
  const match = cleanText.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);

  if (!match) {
    return {};
  }

  const yaml = match[1];
  const data = {};
  const lines = yaml.split(/\r?\n/);
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
        value = value.replace(/^["']|["']$/g, "");

        if (value.startsWith("[") && value.endsWith("]")) {
          data[key] = value
            .slice(1, -1)
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        } else {
          data[key] = value;
        }

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

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function postSlug(filePath) {
  return path.basename(filePath, ".md");
}

function postHref(filePath, prefix = "./") {
  return `${prefix}posts/${encodeURIComponent(postSlug(filePath))}`;
}

function htmlLink(href, label, className = "") {
  const classAttr = className ? ` class="${className}"` : "";
  return `<a${classAttr} href="${href}">${escapeHtml(label)}</a>`;
}

function markdownLink(href, label) {
  return `[${String(label).replaceAll("[", "\\[").replaceAll("]", "\\]")}](${href})`;
}

function categoryHref(category, prefix = "./") {
  return `${prefix}${encodeURIComponent(category)}`;
}

function tagHref(tag, prefix = "./") {
  return `${prefix}${encodeURIComponent(`tag-${tag}`)}`;
}

function formatDate(dateText) {
  return dateText || "日付なし";
}

function getMonth(dateText) {
  if (!dateText) {
    return "日付なし";
  }

  const match = String(dateText).match(/^(\d{4})-(\d{2})/);
  return match ? `${match[1]}-${match[2]}` : "日付なし";
}

function normalizeImagePath(image) {
  if (typeof image !== "string") return "";

  const trimmedImage = image.trim();
  if (!trimmedImage) return "";

  if (
    trimmedImage.startsWith("./") ||
    trimmedImage.startsWith("/") ||
    trimmedImage.startsWith("http://") ||
    trimmedImage.startsWith("https://")
  ) {
    return trimmedImage;
  }

  return `./images/${trimmedImage}`;
}

function createExcerpt(text, fallback = "") {
  const withoutFrontmatter = text
    .replace(/^\uFEFF/, "")
    .replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*/, "");
  const plainText = withoutFrontmatter
    .replace(/<div class="blog-header">[\s\S]*?<\/div>/g, " ")
    .replace(/<aside class="blog-sidebar">[\s\S]*?<\/aside>/g, " ")
    .replace(/<div class="post-title-meta">[\s\S]*?<\/div>/g, " ")
    .replace(/<figure class="post-hero-image">[\s\S]*?<\/figure>/g, " ")
    .replace(/<div class="blog-footer">[\s\S]*?<\/div>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+.+$/gm, " ")
    .replace(/[>*_`~#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const sourceText = plainText || fallback;

  if (sourceText.length <= 120) {
    return sourceText;
  }

  return `${sourceText.slice(0, 120).trim()}...`;
}

const files = readMarkdownFiles(postsDir);

const posts = files
  .map((file) => {
    const text = fs.readFileSync(file, "utf8");
    const frontmatter = parseFrontmatter(text);

    return {
      file,
      title: frontmatter.title || path.basename(file, ".md"),
      date: frontmatter.date || "",
      category: frontmatter.category || "Blog",
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      description: frontmatter.description || "",
      excerpt: createExcerpt(text, frontmatter.description || ""),
      image: frontmatter.image || "",
      draft: String(frontmatter.draft).toLowerCase() === "true",
    };
  })
  .filter((post) => !post.draft)
  .sort((a, b) => String(b.date).localeCompare(String(a.date)));

function collectTags() {
  const tagMap = new Map();

  for (const post of posts) {
    for (const tag of post.tags) {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, []);
      }

      tagMap.get(tag).push(post);
    }
  }

  return [...tagMap.entries()].sort((a, b) => a[0].localeCompare(b[0], "ja"));
}

function collectArchives() {
  const archiveMap = new Map();

  for (const post of posts) {
    const month = getMonth(post.date);

    if (!archiveMap.has(month)) {
      archiveMap.set(month, []);
    }

    archiveMap.get(month).push(post);
  }

  return [...archiveMap.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

function sidebarHtml(prefix = "./") {
  const tagLinks = collectTags()
    .slice(0, 20)
    .map(([tag, tagPosts]) => htmlLink(tagHref(tag, prefix), `#${tag} (${tagPosts.length})`))
    .join("\n");

  const archiveList = collectArchives()
    .slice(0, 12)
    .map(([month, archivePosts]) => `<li>${htmlLink(`${prefix}Archive`, `${month} (${archivePosts.length})`)}</li>`)
    .join("\n");

  return createSidebarContent({
    prefix,
    tagLinks,
    archiveList,
  });
}

function pageDocument(title, mainHtml, { prefix = "./", frontmatter = "" } = {}) {
  const extraFrontmatter = frontmatter ? `${frontmatter.trim()}\n` : "";

  return `---
title: ${title}
${extraFrontmatter}
---

${createBlogHeader(prefix)}

${createBlogLayout({
  mainHtml,
  sidebarHtml: sidebarHtml(prefix),
})}
`;
}

function markdownPageDocument(title, bodyMarkdown, { prefix = "./", frontmatter = "" } = {}) {
  const extraFrontmatter = frontmatter ? `${frontmatter.trim()}\n` : "";

  return `---
title: ${title}
${extraFrontmatter}
---

${createMarkdownPageShell({ prefix, sidebarHtml: sidebarHtml(prefix) })}

${bodyMarkdown.trimEnd()}

${createBlogFooter(prefix)}
`;
}

function splitMarkdownFrontmatter(text, fallbackTitle) {
  const cleanText = text.replace(/^\uFEFF/, "");
  const match = cleanText.match(/^---\s*\r?\n([\s\S]*?)\r?\n-{3,}\s*\r?\n([\s\S]*)$/);

  if (!match) {
    return {
      frontmatter: `---\ntitle: ${fallbackTitle}\n---`,
      body: cleanText,
    };
  }

  return {
    frontmatter: `---\n${match[1].trim()}\n---`,
    body: match[2],
  };
}

function stripBlogShell(body) {
  return body
    .replace(/^\s*<div class="blog-header">[\s\S]*?<\/div>\s*/m, "")
    .replace(/^\s*<aside class="blog-sidebar">[\s\S]*?<\/aside>\s*/m, "")
    .replace(/\s*<div class="blog-footer">[\s\S]*?<\/div>\s*$/m, "")
    .replace(/^\s+/, "");
}

function generatePostCard(post) {
  const imagePath = normalizeImagePath(post.image);
  const cardClass = imagePath ? "post-card" : "post-card post-card-no-image";
  const href = postHref(post.file);

  const image = imagePath
    ? `<a class="post-card-image-link" href="${href}">
  <img class="post-card-image" src="${imagePath}" alt="${escapeHtml(post.title)}">
</a>`
    : "";

  const tags =
    post.tags.length > 0
      ? `<div class="post-card-tags">${post.tags
          .map((tag) => `<a href="${tagHref(tag)}">#${escapeHtml(tag)}</a>`)
          .join(" ")}</div>`
      : "";

  const description = post.excerpt
    ? `<p class="post-card-description">${escapeHtml(post.excerpt)}</p>
<a class="post-card-more" href="${href}">more</a>`
    : "";

  return `<article class="${cardClass}">
${image}
<div class="post-card-body">
<h3>${htmlLink(href, post.title)}</h3>
<div class="post-card-meta">
  <span>${escapeHtml(formatDate(post.date))}</span>
  <span>/</span>
  ${htmlLink(categoryHref(post.category), post.category)}
</div>
${description}
${tags}
</div>
</article>`;
}

function postListItems(items) {
  return items
    .map(
      (post) => `<li>
  ${htmlLink(postHref(post.file), post.title)}
  <span>${escapeHtml(formatDate(post.date))} / ${escapeHtml(post.category)}</span>
</li>`,
    )
    .join("\n");
}

function postListItemsWithPrefix(items, prefix = "./") {
  return items
    .map(
      (post) => `<li>
  ${htmlLink(postHref(post.file, prefix), post.title)}
  <span>${escapeHtml(formatDate(post.date))} / ${escapeHtml(post.category)}</span>
</li>`,
    )
    .join("\n");
}

function postListMarkdown(items, prefix = "./") {
  return items
    .map(
      (post) =>
        `- ${markdownLink(postHref(post.file, prefix), post.title)} / ${formatDate(post.date)} / ${post.category}`,
    )
    .join("\n");
}

function generateIndex() {
  const latestPosts = posts
    .slice(0, 10)
    .map((post) => generatePostCard(post))
    .join("\n\n");

  const mainHtml = `<section class="post-list-section">
<h1>LATEST POSTS</h1>
${latestPosts || `<p class="empty-message">まだ記事がありません。</p>`}
</section>`;

  return pageDocument("zakki", mainHtml);
}

function generateCategoryPage(category) {
  const categoryPosts = posts.filter((post) => post.category === category);
  const list = categoryPosts.map((post) => generatePostCard(post)).join("\n\n");

  const mainHtml = `<section class="post-list-section">
<h1>${escapeHtml(category)}</h1>
${list || `<p class="empty-message">まだ記事がありません。</p>`}
</section>`;

  return pageDocument(category, mainHtml);
}

function generateTagsPage() {
  const tags = collectTags();
  const body = tags
    .map(([tag, tagPosts]) => `<section class="archive-group">
<h2>${escapeHtml(`#${tag}`)}</h2>
<ul class="post-link-list">
${postListItems(tagPosts)}
</ul>
</section>`)
    .join("\n\n");

  const mainHtml = `<section class="post-list-section">
<h1>Tags</h1>
<p class="page-lead">タグ別の記事一覧です。</p>
${body || `<p class="empty-message">まだタグがありません。</p>`}
</section>`;

  return pageDocument("Tags", mainHtml);
}

function generateTagDetailPage(tag, tagPosts) {
  const mainHtml = `<section class="post-list-section">
<h1>${escapeHtml(`#${tag}`)}</h1>
<p class="page-lead">${escapeHtml(tag)} タグの記事一覧です。</p>
<ul class="post-link-list">
${postListItemsWithPrefix(tagPosts)}
</ul>
</section>`;

  return pageDocument(tag, mainHtml, {
    frontmatter: "generatedBy: zakki-tag-pages",
  });
}

function generateTagDetailPages() {
  const tagsDir = path.join(contentDir, "tags");

  if (fs.existsSync(tagsDir)) {
    for (const file of fs.readdirSync(tagsDir)) {
      if (file.endsWith(".md")) {
        fs.unlinkSync(path.join(tagsDir, file));
      }
    }
  }

  for (const file of fs.readdirSync(contentDir)) {
    if (file.startsWith("tag-") && file.endsWith(".md")) {
      const filePath = path.join(contentDir, file);
      const text = fs.readFileSync(filePath, "utf8");

      if (text.includes("generatedBy: zakki-tag-pages")) {
        fs.unlinkSync(filePath);
      }
    }
  }

  for (const [tag, tagPosts] of collectTags()) {
    fs.writeFileSync(
      path.join(contentDir, `tag-${tag}.md`),
      generateTagDetailPage(tag, tagPosts),
      "utf8",
    );
  }
}

function generateArchivePage() {
  const archives = collectArchives();
  const body = archives
    .map(([month, archivePosts]) => `<section class="archive-group">
<h2>${escapeHtml(month)}</h2>
<ul class="post-link-list">
${postListItems(archivePosts)}
</ul>
</section>`)
    .join("\n\n");

  const mainHtml = `<section class="post-list-section">
<h1>Archive</h1>
<p class="page-lead">月別の記事一覧です。</p>
${body || `<p class="empty-message">まだ記事がありません。</p>`}
</section>`;

  return pageDocument("Archive", mainHtml);
}

function generateSitemapPage() {
  const fixedPages = ["About", "Tags", "Archive"];
  const fixedList = fixedPages
    .map((page) => `<li>${htmlLink(`./${page}`, page)}</li>`)
    .join("\n");

  const categoryList = categories
    .map((category) => `<li>${htmlLink(categoryHref(category), category)}</li>`)
    .join("\n");

  const mainHtml = `<section class="post-list-section">
<h1>Sitemap</h1>
<p class="page-lead">このサイトの記事一覧です。</p>

<section class="archive-group">
<h2>固定ページ</h2>
<ul class="post-link-list">
<li>${htmlLink("./", "Home")}</li>
${fixedList}
</ul>
</section>

<section class="archive-group">
<h2>カテゴリー</h2>
<ul class="post-link-list">
${categoryList}
</ul>
</section>

<section class="archive-group">
<h2>記事</h2>
<ul class="post-link-list">
${postListItems(posts) || `<li>まだ記事がありません。</li>`}
</ul>
</section>
</section>`;

  return pageDocument("Sitemap", mainHtml);
}

function generateAboutPage() {
  const aboutPath = path.join(contentDir, "About.md");

  if (fs.existsSync(aboutPath)) {
    const text = fs.readFileSync(aboutPath, "utf8");
    const { frontmatter, body } = splitMarkdownFrontmatter(text, "About");
    const normalizedBody = stripBlogShell(body);

    fs.writeFileSync(
      aboutPath,
      `${frontmatter}\n\n${createMarkdownPageShell({ prefix: "./", sidebarHtml: sidebarHtml("./") })}\n\n${normalizedBody.trimEnd()}\n\n${createBlogFooter("./")}`,
      "utf8",
    );
    return;
  }

  const body = `# About

このサイトは、漫画、ガジェット、ゲーム、PC、日々のメモなどを置いていく雑記サイトです。

Obsidianで書いたメモの中から、公開してもよいものをQuartzで公開しています。
`;

  fs.writeFileSync(
    aboutPath,
    `---\ntitle: About\n---\n\n${createMarkdownPageShell({ prefix: "./", sidebarHtml: sidebarHtml("./") })}\n\n${body.trimEnd()}\n\n${createBlogFooter("./")}`,
    "utf8",
  );
}

function generateTagsMarkdownPage() {
  const tags = collectTags();
  const body = tags
    .map(([tag, tagPosts]) => `## #${tag}\n\n${postListMarkdown(tagPosts)}`)
    .join("\n\n");

  return markdownPageDocument(
    "Tags",
    `# Tags

タグ別の記事一覧です。

${body || "まだタグがありません。"}`,
  );
}

function generateArchiveMarkdownPage() {
  const archives = collectArchives();
  const body = archives
    .map(([month, archivePosts]) => `## ${month}\n\n${postListMarkdown(archivePosts)}`)
    .join("\n\n");

  return markdownPageDocument(
    "Archive",
    `# Archive

月別の記事一覧です。

${body || "まだ記事がありません。"}`,
  );
}

function generateSitemapMarkdownPage() {
  const fixedPages = ["About", "Tags", "Archive"];
  const fixedList = fixedPages
    .map((page) => `- ${markdownLink(`./${page}`, page)}`)
    .join("\n");
  const categoryList = categories
    .map((category) => `- ${markdownLink(categoryHref(category), category)}`)
    .join("\n");

  return markdownPageDocument(
    "Sitemap",
    `# Sitemap

サイト内ページの一覧です。

## 固定ページ

- ${markdownLink("./", "Home")}
${fixedList}

## カテゴリー

${categoryList}

## 記事

${postListMarkdown(posts) || "まだ記事がありません。"}`,
  );
}

fs.writeFileSync(path.join(contentDir, "index.md"), generateIndex(), "utf8");

for (const category of categories) {
  fs.writeFileSync(
    path.join(contentDir, `${category}.md`),
    generateCategoryPage(category),
    "utf8",
  );
}

fs.writeFileSync(path.join(contentDir, "Tags.md"), generateTagsMarkdownPage(), "utf8");
fs.writeFileSync(path.join(contentDir, "Archive.md"), generateArchiveMarkdownPage(), "utf8");
fs.writeFileSync(path.join(contentDir, "Sitemap.md"), generateSitemapMarkdownPage(), "utf8");

generateAboutPage();
generateTagDetailPages();

console.log("共通ブログレイアウトでページを自動生成しました。");
console.log(`公開記事数: ${posts.length}`);
console.log(`タグ数: ${collectTags().length}`);
console.log(`アーカイブ月数: ${collectArchives().length}`);
