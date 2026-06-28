# Obsidian Vault の場所
# 場所が違う場合は、この1行だけ修正してください
$VaultPath = "$env:USERPROFILE\iCloudDrive\Obsidian\zakki"

# コピー元
$SourcePosts = Join-Path $VaultPath "01 Blog"
$SourceImages = Join-Path $VaultPath "Attachments"

# Quartz 側
$QuartzRoot = Resolve-Path "$PSScriptRoot\.."
$DestPosts = Join-Path $QuartzRoot "content\posts"
$DestImages = Join-Path $QuartzRoot "content\images"

Write-Host "Obsidian Vault: $VaultPath"

if (!(Test-Path $SourcePosts)) {
  Write-Error "記事フォルダが見つかりません: $SourcePosts"
  exit 1
}

if (!(Test-Path $DestPosts)) {
  New-Item -ItemType Directory -Path $DestPosts | Out-Null
}

if (!(Test-Path $DestImages)) {
  New-Item -ItemType Directory -Path $DestImages | Out-Null
}

Write-Host "記事をコピーしています..."

Copy-Item -Path "$SourcePosts\*.md" -Destination $DestPosts -Force

if (Test-Path $SourceImages) {
  Write-Host "画像をコピーしています..."

  $ImageFiles = Get-ChildItem -Path $SourceImages -Recurse -File |
    Where-Object {
      $_.Extension -in ".jpg", ".jpeg", ".png", ".webp", ".gif"
    }

  foreach ($ImageFile in $ImageFiles) {
    Copy-Item -Path $ImageFile.FullName -Destination $DestImages -Force
  }
}
else {
  Write-Host "Attachments フォルダが見つからないため、画像コピーはスキップしました。"
}

Write-Host "コピー完了。"