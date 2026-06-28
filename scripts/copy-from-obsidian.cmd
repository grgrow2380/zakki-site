@echo off
setlocal

rem Obsidian Vault の場所
rem 場所が違う場合は、この1行だけ修正してください
set "VAULT=%USERPROFILE%\iCloudDrive\Obsidian\zakki"

set "SOURCE_POSTS=%VAULT%\01 Blog"
set "SOURCE_IMAGES=%VAULT%\Attachments"

set "QUARTZ_ROOT=%~dp0.."
set "DEST_POSTS=%QUARTZ_ROOT%\content\posts"
set "DEST_IMAGES=%QUARTZ_ROOT%\content\images"

echo Obsidian Vault: %VAULT%

if not exist "%SOURCE_POSTS%\" (
  echo 記事フォルダが見つかりません: %SOURCE_POSTS%
  exit /b 1
)

if not exist "%DEST_POSTS%\" mkdir "%DEST_POSTS%"
if not exist "%DEST_IMAGES%\" mkdir "%DEST_IMAGES%"

echo 記事をコピーしています...
copy /Y "%SOURCE_POSTS%\*.md" "%DEST_POSTS%\" >nul

if exist "%SOURCE_IMAGES%\" (
  echo 画像をコピーしています...
  for /R "%SOURCE_IMAGES%" %%F in (*.jpg *.jpeg *.png *.webp *.gif) do copy /Y "%%F" "%DEST_IMAGES%\" >nul
) else (
  echo Attachments フォルダが見つからないため、画像コピーはスキップしました。
)

echo コピー完了。