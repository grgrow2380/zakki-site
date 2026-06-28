import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "content");
const postsDir = path.join(contentDir, "posts");

const categories = [
  "Blog",
  "漫画・創作",
  "PC・ガジェット",
  "Python",
  "ゲーム",
  "レビュー",
];

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

        // tags: [obsidian, quartz] 形式にも一応対応
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

function toWikiLink(filePath, title) {
  const fileName = path.basename(filePath, ".md");
  return `[[posts/${fileName}|${title}]]`;
}

function formatDate(dateText) {
  if (!dateText) {
    return "日付なし";
  }

  return dateText;
}

function getMonth(dateText) {
  if (!dateText) {
    return "日付なし";
  }

  const match = String(dateText).match(/^(\d{4})-(\d{2})/);

  if (!match) {
    return "日付なし";
  }

  return `${match[1]}-${match[2]}`;
}

const files = readMarkdownFiles(postsDir);

const posts = files
  .map((file) => {
    const text = fs.readFileSync(file, "utf8");
    const frontmatter = parseFrontmatter(text);

    const title = frontmatter.title || path.basename(file, ".md");
    const date = frontmatter.date || "";
    const category = frontmatter.category || "Blog";
    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
    const description = frontmatter.description || "";
    const draft = String(frontmatter.draft).toLowerCase() === "true";

    return {
      file,
      title,
      date,
      category,
      tags,
      description,
      draft,
    };
  })
  .filter((post) => !post.draft)
  .sort((a, b) => {
    return String(b.date).localeCompare(String(a.date));
  });

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

  return [...tagMap.entries()].sort((a, b) => a[0].localeCompare(b[0]));
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

function generatePostCard(post) {
  const description = post.description
    ? `\n  ${post.description}\n`
    : "";

  const tags =
    post.tags.length > 0
      ? `\n  tags: ${post.tags.map((tag) => `#${tag}`).join(" ")}`
      : "";

  return `### ${toWikiLink(post.file, post.title)}

- ${formatDate(post.date)} / [[${post.category}]]

${description}${tags}
`;
}

function generateIndex() {
  const latestPosts = posts
    .slice(0, 10)
    .map((post) => generatePostCard(post))
    .join("\n---\n\n");

  const tagList = collectTags()
    .slice(0, 20)
    .map(([tag, tagPosts]) => `- ${tag} (${tagPosts.length})`)
    .join("\n");

  const archiveList = collectArchives()
    .slice(0, 12)
    .map(([month, archivePosts]) => `- ${month} (${archivePosts.length})`)
    .join("\n");

  return `---
title: zakki
---

# zakki

漫画、ガジェット、ゲーム、PC、日々のメモなどを雑に置いていく場所です。

本業は漫画家ですが、ここでは仕事の話だけでなく、気になったこと・試したこと・考えたことを、肩肘張らずに書いていきます。

[About](./About) / [Sitemap](./Sitemap) / [Tags](./Tags) / [Archive](./Archive)

---

## Latest Posts

${latestPosts || "まだ記事がありません。"}

---

## カテゴリー

${categories.map((category) => `- [[${category}]]`).join("\n")}

---

## タグ

${tagList || "まだタグがありません。"}

[[Tags|すべてのタグを見る]]

---

## アーカイブ

${archiveList || "まだ記事がありません。"}

[[Archive|アーカイブを見る]]

---

## このサイトについて

このサイトは、Obsidianで書いたメモの中から、公開してもよいものをQuartzで公開している雑記サイトです。
`;
}

function generateCategoryPage(category) {
  const categoryPosts = posts.filter((post) => post.category === category);

  const list = categoryPosts
    .map((post) => generatePostCard(post))
    .join("\n---\n\n");

  return `---
title: ${category}
---

# ${category}

## 記事一覧

${list || "まだ記事がありません。"}
`;
}

function generateTagsPage() {
  const tags = collectTags();

  const body = tags
    .map(([tag, tagPosts]) => {
      const list = tagPosts
        .map((post) => `- ${toWikiLink(post.file, post.title)} — ${formatDate(post.date)} / ${post.category}`)
        .join("\n");

      return `## ${tag}

${list}`;
    })
    .join("\n\n---\n\n");

  return `---
title: Tags
---

# Tags

タグ別の記事一覧です。

${body || "まだタグがありません。"}
`;
}

function generateArchivePage() {
  const archives = collectArchives();

  const body = archives
    .map(([month, archivePosts]) => {
      const list = archivePosts
        .map((post) => `- ${toWikiLink(post.file, post.title)} — ${formatDate(post.date)} / ${post.category}`)
        .join("\n");

      return `## ${month}

${list}`;
    })
    .join("\n\n---\n\n");

  return `---
title: Archive
---

# Archive

月別の記事一覧です。

${body || "まだ記事がありません。"}
`;
}

function generateSitemapPage() {
  const list = posts
    .map((post) => `- ${toWikiLink(post.file, post.title)} — ${formatDate(post.date)} / ${post.category}`)
    .join("\n");

  return `---
title: Sitemap
---

# Sitemap

このサイトの記事一覧です。

## 固定ページ

- [[index|Home]]
- [[About]]
- [[Tags]]
- [[Archive]]

## カテゴリー

${categories.map((category) => `- [[${category}]]`).join("\n")}

## 記事

${list || "まだ記事がありません。"}
`;
}

function generateAboutPage() {
  const aboutPath = path.join(contentDir, "About.md");

  if (fs.existsSync(aboutPath)) {
    return;
  }

  const body = `---
title: About
---

# About

このサイトは、漫画、ガジェット、ゲーム、PC、日々のメモなどを置いていく雑記サイトです。

Obsidianで書いたメモの中から、公開してもよいものをQuartzで公開しています。
`;

  fs.writeFileSync(aboutPath, body, "utf8");
}

fs.writeFileSync(path.join(contentDir, "index.md"), generateIndex(), "utf8");

for (const category of categories) {
  fs.writeFileSync(
    path.join(contentDir, `${category}.md`),
    generateCategoryPage(category),
    "utf8"
  );
}

fs.writeFileSync(path.join(contentDir, "Tags.md"), generateTagsPage(), "utf8");
fs.writeFileSync(path.join(contentDir, "Archive.md"), generateArchivePage(), "utf8");
fs.writeFileSync(path.join(contentDir, "Sitemap.md"), generateSitemapPage(), "utf8");

generateAboutPage();

console.log("Blogger風トップページの土台を自動生成しました。");
console.log(`公開記事数: ${posts.length}`);
console.log(`タグ数: ${collectTags().length}`);
console.log(`アーカイブ月数: ${collectArchives().length}`);