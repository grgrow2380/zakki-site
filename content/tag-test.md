---
title: test
generatedBy: zakki-tag-pages

---

<div class="blog-header">

<p class="blog-title"><a href="./">zakki</a></p>

<nav class="blog-nav">
  <a href="./About">about</a>
  <a href="./Sitemap">sitemap</a>
  <a href="./Tags">tags</a>
  <a href="./Archive">archive</a>
  <button class="theme-toggle" type="button" aria-label="toggle theme" onclick="window.zakkiToggleTheme && window.zakkiToggleTheme()">
    <span class="theme-toggle-sun" aria-hidden="true">☀</span>
    <span class="theme-toggle-moon" aria-hidden="true">☾</span>
  </button>
</nav>

<script>
(() => {
  if (window.zakkiThemeReady) return;
  window.zakkiThemeReady = true;
  const root = document.documentElement;
  const storageKey = "zakki-theme";
  const setTheme = (theme) => {
    root.dataset.zakkiTheme = theme;
    try {
      localStorage.setItem(storageKey, theme);
    } catch {}
  };
  window.zakkiToggleTheme = () => {
    setTheme(root.dataset.zakkiTheme === "light" ? "dark" : "light");
  };
  let savedTheme = "dark";
  try {
    savedTheme = localStorage.getItem(storageKey) || "dark";
  } catch {}
  setTheme(savedTheme === "light" ? "light" : "dark");
})();
</script>

</div>

<div class="blog-layout">

<main class="blog-main">
<section class="post-list-section">
<h1>#test</h1>
<p class="page-lead">test タグの記事一覧です。</p>
<ul class="post-link-list">
<li>
  <a href="./posts/%E3%82%B5%E3%83%A0%E3%83%8D%E7%94%BB%E5%83%8F%EF%BC%86%E6%9C%AC%E6%96%87%E7%94%BB%E5%83%8F%E3%81%82%E3%82%8A%E3%83%86%E3%82%B9%E3%83%88%E6%8A%95%E7%A8%BF">サムネ画像＆本文画像ありテスト投稿</a>
  <span>2026-07-08 / Blog</span>
</li>
<li>
  <a href="./posts/%E7%94%BB%E5%83%8F%E3%81%AA%E3%81%97%E3%83%86%E3%82%B9%E3%83%88%E8%A8%98%E4%BA%8B">画像なしテスト記事</a>
  <span>2026-06-28 / Blog</span>
</li>
<li>
  <a href="./posts/%E8%A8%98%E4%BA%8B%E5%86%85%E3%83%95%E3%83%83%E3%82%BF%E3%83%BC%E3%83%86%E3%82%B9%E3%83%88%E8%A8%98%E4%BA%8B">記事内フッターテスト記事</a>
  <span>2026-06-28 / Blog</span>
</li>
</ul>
</section>
</main>

<aside class="blog-sidebar">


<div class="sidebar-box sidebar-about">
<h3>ABOUT</h3>
<p>漫画、ガジェット、ゲーム、PC、日々のメモなどを雑に置いていく個人ブログです。</p>
<p><a href="./About">詳しく見る</a></p>
</div>

<div class="sidebar-box">
<h3>CATEGORY</h3>
<ul class="sidebar-category-list">
<li><a href="./Blog">Blog</a></li>
<li><a href="./漫画・創作">漫画・創作</a></li>
<li><a href="./PC・ガジェット">PC・ガジェット</a></li>
<li><a href="./Python">Python</a></li>
<li><a href="./ゲーム">ゲーム</a></li>
<li><a href="./レビュー">レビュー</a></li>
</ul>
</div>

<div class="sidebar-box">
<h3>TAGS</h3>
<div class="sidebar-tags">
<a href="./tag-blog">#blog (3)</a>
<a href="./tag-memo">#memo (2)</a>
<a href="./tag-obsidian">#obsidian (3)</a>
<a href="./tag-test">#test (3)</a>
</div>
</div>

<div class="sidebar-box">
<h3>ARCHIVE</h3>
<ul class="sidebar-archive-list">
<li><a href="./Archive">2026-07 (1)</a></li>
<li><a href="./Archive">2026-06 (4)</a></li>
</ul>
</div>


</aside>

</div>

<div class="blog-footer">
<p>© zakki</p>
<p><a href="./">Home</a> / <a href="./Archive">Archive</a> / <a href="./Tags">Tags</a></p>
</div>
