---
title: About
description: このサイトについて
draft: false
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

# About

このサイトは、漫画、ガジェット、ゲーム、PC、日々のメモなどを雑に置いていくめちゃくちゃ個人的なブログです。
Obsidianで書いたメモをもとに、あとから読み返せる形で公開しています。

## 書いている人

普段は絵を描いてご飯を食べてる者です。
仕事に限らず気になったもの、試してみたこと、調べたこと、考えたことなどをあまり肩肘張らずに書いていきます。

## このブログで扱うこと

主に、次のようなテーマを扱います。

* 漫画・創作
* PC・ガジェット
* ゲーム
* Python
* Obsidianやブログ運用
* 買ってよかったもの、試してよかったもの

## このサイトについて

このサイトはObsidianで書いた記事をQuartzで静的サイト化し、GitHub Pagesで公開しています。
なるべく軽く、長く続けやすい形を目指しています。
主にChatGPTやCodexでのバイブコーディングで実装していますが、ちょこちょこ自分で手直しもしてみています。

## リンク

* [Home](./)
* [Archive](./Archive)
* [Tags](./Tags)
* [Sitemap](./Sitemap)

<div class="blog-footer">
<p>© zakki</p>
<p><a href="./">Home</a> / <a href="./Archive">Archive</a> / <a href="./Tags">Tags</a></p>
</div>