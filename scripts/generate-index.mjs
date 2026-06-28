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
  const match = text.match(/^---\s*\n([\s\S]*?)\n---/);

  if (!match) {
    return {};
  }

  const yaml = match[1];
  const data = {};
  const lines = yaml.split("\n");

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
        data[key] = value;
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

const files = readMarkdownFiles(postsDir);

const posts = files
  .map((file) => {
    const text = fs.readFileSync(file, "utf8");
    const frontmatter = parseFrontmatter(text);

    const title = frontmatter.title || path.basename(file, ".md");
    const date = frontmatter.date || "";
    const category = frontmatter.category || "Blog";
    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
    const draft = String(frontmatter.draft).toLowerCase() === "true";

    return {
      file,
      title,
      date,
      category,
      tags,
      draft,
    };
  })
  .filter((post) => !post.draft)
  .sort((a, b) => {
    return String(b.date).localeCompare(String(a.date));
  });

function generateIndex() {
  const latestPosts = posts
    .slice(0, 10)
    .map((post) => {
      return `- ${toWikiLink(post.file, post.title)} — ${formatDate(post.date)} / ${post.category}`;
    })
    .join("\n");

  return `---
title: zakki
---

# zakki

漫画、ガジェット、ゲーム、PC、日々のメモなどを雑に置いていく場所です。

本業は漫画家ですが、ここでは仕事の話だけでなく、気になったこと・試したこと・考えたことを、肩肘張らずに書いていきます。

## カテゴリ

${categories.map((category) => `- [[${category}]]`).join("\n")}

## 最近のメモ

${latestPosts || "まだ記事がありません。"}

## このサイトについて

このサイトは、Obsidianで書いたメモの中から、公開してもよいものをQuartzで公開している雑記サイトです。
`;
}

function generateCategoryPage(category) {
  const categoryPosts = posts.filter((post) => post.category === category);

  const list = categoryPosts
    .map((post) => {
      return `- ${toWikiLink(post.file, post.title)} — ${formatDate(post.date)}`;
    })
    .join("\n");

  return `---
title: ${category}
---

# ${category}

## 記事一覧

${list || "まだ記事がありません。"}
`;
}

fs.writeFileSync(path.join(contentDir, "index.md"), generateIndex(), "utf8");

for (const category of categories) {
  fs.writeFileSync(
    path.join(contentDir, `${category}.md`),
    generateCategoryPage(category),
    "utf8"
  );
}

console.log("記事一覧ページを自動生成しました。");
console.log(`公開記事数: ${posts.length}`);