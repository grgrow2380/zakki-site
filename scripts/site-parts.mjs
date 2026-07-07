export const siteCategories = [
  { label: "Blog", href: "Blog" },
  { label: "漫画・創作", href: "漫画・創作" },
  { label: "PC・ガジェット", href: "PC・ガジェット" },
  { label: "Python", href: "Python" },
  { label: "ゲーム", href: "ゲーム" },
  { label: "レビュー", href: "レビュー" },
];

export function createBlogHeader(prefix = "./") {
  return `<div class="blog-header">

<p class="blog-title"><a href="${prefix}">zakki</a></p>

<nav class="blog-nav">
  <a href="${prefix}About">about</a>
  <a href="${prefix}Sitemap">sitemap</a>
  <a href="${prefix}Tags">tags</a>
  <a href="${prefix}Archive">archive</a>
</nav>

</div>`;
}

export function createBlogFooter(prefix = "./") {
  return `<div class="blog-footer">
<p>© zakki</p>
<p><a href="${prefix}">Home</a> / <a href="${prefix}Archive">Archive</a> / <a href="${prefix}Tags">Tags</a></p>
</div>`;
}

export function createSidebarContent({
  prefix = "./",
  tagLinks = "",
  archiveList = "",
  boxClass = "sidebar-box",
} = {}) {
  const categoryList = siteCategories
    .map((category) => `<li><a href="${prefix}${category.href}">${category.label}</a></li>`)
    .join("\n");

  const finalTagLinks =
    tagLinks || `<a href="${prefix}Tags">タグ一覧を見る</a>`;

  const finalArchiveList =
    archiveList || `<li><a href="${prefix}Archive">記事一覧を見る</a></li>`;

  return `

<div class="${boxClass} sidebar-about">
<h3>ABOUT</h3>
<p>漫画、ガジェット、ゲーム、PC、日々のメモなどを雑に置いていく個人ブログです。</p>
<p><a href="${prefix}About">詳しく見る</a></p>
</div>

<div class="${boxClass}">
<h3>CATEGORY</h3>
<ul class="sidebar-category-list">
${categoryList}
</ul>
</div>

<div class="${boxClass}">
<h3>TAGS</h3>
<div class="sidebar-tags">
${finalTagLinks}
</div>
</div>

<div class="${boxClass}">
<h3>ARCHIVE</h3>
<ul class="sidebar-archive-list">
${finalArchiveList}
</ul>
</div>

`;
}

export function createSidebar(options = {}) {
  return `<aside class="blog-sidebar">
${createSidebarContent(options)}
</aside>`;
}

export function createMarkdownPageShell({
  prefix = "./",
  sidebarHtml = "",
} = {}) {
  return `${createBlogHeader(prefix)}

<aside class="blog-sidebar">
${sidebarHtml || createSidebarContent({ prefix })}
</aside>`;
}

export function createBlogLayout({
  mainHtml = "",
  sidebarHtml = "",
} = {}) {
  return `<div class="blog-layout">

<main class="blog-main">
${mainHtml}
</main>

<aside class="blog-sidebar">
${sidebarHtml}
</aside>

</div>

${createBlogFooter()}`;
}
