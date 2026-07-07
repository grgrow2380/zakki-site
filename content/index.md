---
title: zakki

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
<h1>LATEST POSTS</h1>
<article class="post-card">
<a class="post-card-image-link" href="./posts/%E3%82%B5%E3%83%A0%E3%83%8D%E7%94%BB%E5%83%8F%EF%BC%86%E6%9C%AC%E6%96%87%E7%94%BB%E5%83%8F%E3%81%82%E3%82%8A%E3%83%86%E3%82%B9%E3%83%88%E6%8A%95%E7%A8%BF">
  <img class="post-card-image" src="./images/post3.png" alt="サムネ画像＆本文画像ありテスト投稿">
</a>
<div class="post-card-body">
<h3><a href="./posts/%E3%82%B5%E3%83%A0%E3%83%8D%E7%94%BB%E5%83%8F%EF%BC%86%E6%9C%AC%E6%96%87%E7%94%BB%E5%83%8F%E3%81%82%E3%82%8A%E3%83%86%E3%82%B9%E3%83%88%E6%8A%95%E7%A8%BF">サムネ画像＆本文画像ありテスト投稿</a></h3>
<div class="post-card-meta">
  <span>2026-07-08</span>
  <span>/</span>
  <a href="./Blog">Blog</a>
</div>
<p class="post-card-description">この記事は、サムネ画像＆本文画像ありテスト投稿です。 以下、画像です。 以上、画像でした。 文字列文字列文字列文字列文字列文字列文字列文字列文字列文字列文字列文字列文字列文字列文字列文字列文字列文字列文字列文字列文字列文字列文字列文字列文字...</p>
<a class="post-card-more" href="./posts/%E3%82%B5%E3%83%A0%E3%83%8D%E7%94%BB%E5%83%8F%EF%BC%86%E6%9C%AC%E6%96%87%E7%94%BB%E5%83%8F%E3%81%82%E3%82%8A%E3%83%86%E3%82%B9%E3%83%88%E6%8A%95%E7%A8%BF">more</a>
<div class="post-card-tags"><a href="./tag-blog">#blog</a> <a href="./tag-memo">#memo</a> <a href="./tag-obsidian">#obsidian</a> <a href="./tag-test">#test</a></div>
</div>
</article>

<article class="post-card post-card-no-image">

<div class="post-card-body">
<h3><a href="./posts/%E3%81%AF%E3%81%98%E3%82%81%E3%81%A6%E3%81%AE%E6%8A%95%E7%A8%BF">はじめての投稿</a></h3>
<div class="post-card-meta">
  <span>2026-06-28</span>
  <span>/</span>
  <a href="./Blog">Blog</a>
</div>
<p class="post-card-description">Obsidianで書いたメモを、Quartzを使って公開できるようにしました。 このサイトでは、漫画、ガジェット、ゲーム、PC、日々のメモなどを雑に置いていく予定です。 Next: サムネ画像＆本文画像ありテスト投稿 Previous: テ...</p>
<a class="post-card-more" href="./posts/%E3%81%AF%E3%81%98%E3%82%81%E3%81%A6%E3%81%AE%E6%8A%95%E7%A8%BF">more</a>
<div class="post-card-tags"><a href="./tag-blog">#blog</a> <a href="./tag-obsidian">#obsidian</a></div>
</div>
</article>

<article class="post-card">
<a class="post-card-image-link" href="./posts/%E3%83%86%E3%82%B9%E3%83%88%E6%8A%95%E7%A8%BF">
  <img class="post-card-image" src="./images/second-post.jpg" alt="テスト投稿">
</a>
<div class="post-card-body">
<h3><a href="./posts/%E3%83%86%E3%82%B9%E3%83%88%E6%8A%95%E7%A8%BF">テスト投稿</a></h3>
<div class="post-card-meta">
  <span>2026-06-28</span>
  <span>/</span>
  <a href="./Blog">Blog</a>
</div>
<p class="post-card-description">本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文...</p>
<a class="post-card-more" href="./posts/%E3%83%86%E3%82%B9%E3%83%88%E6%8A%95%E7%A8%BF">more</a>
<div class="post-card-tags"><a href="./tag-obsidian">#obsidian</a> <a href="./tag-memo">#memo</a></div>
</div>
</article>

<article class="post-card post-card-no-image">

<div class="post-card-body">
<h3><a href="./posts/%E7%94%BB%E5%83%8F%E3%81%AA%E3%81%97%E3%83%86%E3%82%B9%E3%83%88%E8%A8%98%E4%BA%8B">画像なしテスト記事</a></h3>
<div class="post-card-meta">
  <span>2026-06-28</span>
  <span>/</span>
  <a href="./Blog">Blog</a>
</div>
<p class="post-card-description">これは、アイキャッチ画像を設定していない記事の表示確認用です。 トップページの記事カードで、画像がない場合でも見た目が崩れないかを確認します。 画像なしでもカードが自然に見える タイトル、日付、説明文、タグの余白がきれい カード上部にミント...</p>
<a class="post-card-more" href="./posts/%E7%94%BB%E5%83%8F%E3%81%AA%E3%81%97%E3%83%86%E3%82%B9%E3%83%88%E8%A8%98%E4%BA%8B">more</a>
<div class="post-card-tags"><a href="./tag-test">#test</a></div>
</div>
</article>

<article class="post-card post-card-no-image">

<div class="post-card-body">
<h3><a href="./posts/%E8%A8%98%E4%BA%8B%E5%86%85%E3%83%95%E3%83%83%E3%82%BF%E3%83%BC%E3%83%86%E3%82%B9%E3%83%88%E8%A8%98%E4%BA%8B">記事内フッターテスト記事</a></h3>
<div class="post-card-meta">
  <span>2026-06-28</span>
  <span>/</span>
  <a href="./Blog">Blog</a>
</div>
<p class="post-card-description">本文を書く。 この記事を読み終えたら Home Archive Tags Next: 画像なしテスト記事</p>
<a class="post-card-more" href="./posts/%E8%A8%98%E4%BA%8B%E5%86%85%E3%83%95%E3%83%83%E3%82%BF%E3%83%BC%E3%83%86%E3%82%B9%E3%83%88%E8%A8%98%E4%BA%8B">more</a>
<div class="post-card-tags"><a href="./tag-test">#test</a> <a href="./tag-blog">#blog</a></div>
</div>
</article>
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
