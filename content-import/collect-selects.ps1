# Kija Creative: collect Portfolio Selects from the shared drive, resize for the web, zip for upload.
# Paste this whole block into Windows PowerShell and press Enter.
Add-Type -AssemblyName System.Drawing
$src = 'H:\Shared drives\KIJA CREATIVE\KIJA TOP-LEVEL\01_INTERNAL\Media\Portfolio Selects 2026-11'
if (-not (Test-Path -LiteralPath $src)) { Write-Host "Can't find: $src  (is Google Drive for desktop running?)" -ForegroundColor Red; return }
$out  = Join-Path $HOME 'Downloads\kija-selects'
$skip = @('Kink')                       # marked mature content in the index
$max  = 1800                            # longest edge, px
if (Test-Path $out) { Remove-Item $out -Recurse -Force }
$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters 1
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 80L
function Uses-Alpha($bmp) {             # sample a grid; true only if some pixel is actually see-through
  if (-not [System.Drawing.Image]::IsAlphaPixelFormat($bmp.PixelFormat)) { return $false }
  for ($i = 0; $i -lt 12; $i++) { for ($j = 0; $j -lt 12; $j++) {
    $x = [int](($bmp.Width - 1) * $i / 11); $y = [int](($bmp.Height - 1) * $j / 11)
    if ($bmp.GetPixel($x, $y).A -lt 250) { return $true } } }
  return $false
}
$videos = @(); $pdfs = @(); $n = 0
Get-ChildItem -LiteralPath $src -Recurse -File | ForEach-Object {
  $rel = $_.FullName.Substring($src.Length + 1)
  $client = $rel.Split('\')[0]
  if ($skip -contains $client) { return }
  $ext = $_.Extension.ToLower()
  $destDir = Join-Path $out (Split-Path $rel)
  New-Item -ItemType Directory -Force -Path $destDir | Out-Null
  if ($ext -in '.jpg', '.jpeg', '.png') {
    try {
      $img = New-Object System.Drawing.Bitmap $_.FullName
      $alpha = Uses-Alpha $img
      $scale = [Math]::Min(1, $max / [Math]::Max($img.Width, $img.Height))
      $w = [int]($img.Width * $scale); $h = [int]($img.Height * $scale)
      $fmt = if ($alpha) { [System.Drawing.Imaging.PixelFormat]::Format32bppArgb } else { [System.Drawing.Imaging.PixelFormat]::Format24bppRgb }
      $bmp = New-Object System.Drawing.Bitmap $w, $h, $fmt
      $g = [System.Drawing.Graphics]::FromImage($bmp)
      if (-not $alpha) { $g.Clear([System.Drawing.Color]::White) }
      $g.InterpolationMode = 'HighQualityBicubic'; $g.SmoothingMode = 'HighQuality'; $g.PixelOffsetMode = 'HighQuality'
      $g.DrawImage($img, 0, 0, $w, $h)
      $base = [IO.Path]::GetFileNameWithoutExtension($_.Name)
      if ($alpha) { $bmp.Save((Join-Path $destDir "$base.png"), [System.Drawing.Imaging.ImageFormat]::Png) }
      else { $bmp.Save((Join-Path $destDir "$base.jpg"), $jpeg, $ep) }
      $g.Dispose(); $bmp.Dispose(); $img.Dispose(); $n++
      Write-Host "ok       $rel"
    } catch { Write-Host "SKIPPED  $rel  ($($_.Exception.Message))" -ForegroundColor Yellow }
  } elseif ($ext -in '.webp', '.svg', '.csv') { Copy-Item -LiteralPath $_.FullName -Destination $destDir; $n++ }
  elseif ($ext -in '.mp4', '.mov') { $videos += ('{0,6} MB  {1}' -f [math]::Round($_.Length / 1MB, 1), $rel) }
  elseif ($ext -eq '.pdf') { $pdfs += ('{0,6} MB  {1}' -f [math]::Round($_.Length / 1MB, 1), $rel) }
}
# Marshman Design portfolio images (already web-sized .webp): Root Pilates, SGI, Camp Firewalker, Lisa Kalmin, Enzo's
$mm = Get-ChildItem -LiteralPath 'H:\Shared drives\KIJA CREATIVE' -Directory -Recurse -Depth 6 -Filter 'marshman-design-built-site' -ErrorAction SilentlyContinue | Select-Object -First 1
if ($mm -and (Test-Path (Join-Path $mm.FullName 'work'))) {
  $dest = Join-Path $out '_marshman'; New-Item -ItemType Directory -Force -Path $dest | Out-Null
  Get-ChildItem (Join-Path $mm.FullName 'work') -File -Filter *.webp | Copy-Item -Destination $dest
  Write-Host "ok       Marshman images ($((Get-ChildItem $dest).Count))"
} else { Write-Host "Marshman folder not found (skipped)" -ForegroundColor Yellow }

# pack client folders into zips of at most ~25 MB each
$folders = Get-ChildItem $out -Directory | Sort-Object Name
$root = Get-ChildItem $out -File
$zips = @(); $batch = @(); $size = 0; $k = 1
foreach ($f in $folders) {
  $fs = (Get-ChildItem $f.FullName -Recurse -File | Measure-Object Length -Sum).Sum
  if ($batch.Count -and ($size + $fs) -gt 25MB) { $zips += ,@($batch); $batch = @(); $size = 0 }
  $batch += $f.FullName; $size += $fs
}
if ($batch.Count) { $zips += ,@($batch) }
foreach ($b in $zips) {
  $zip = Join-Path $HOME ("Downloads\kija-selects-$k.zip")
  if (Test-Path $zip) { Remove-Item $zip }
  $paths = @($b); if ($k -eq 1 -and $root) { $paths += $root.FullName }
  Compress-Archive -Path $paths -DestinationPath $zip
  Write-Host ("`nkija-selects-$k.zip  {0} MB  ({1})" -f [math]::Round((Get-Item $zip).Length / 1MB, 1), (($b | ForEach-Object { Split-Path $_ -Leaf }) -join ', ')) -ForegroundColor Green
  $k++
}
Write-Host "`n$n images ready." -ForegroundColor Green
if ($videos.Count) { Write-Host "`nVideos (send the ones you want separately, each under ~30 MB):" -ForegroundColor Cyan; $videos | ForEach-Object { Write-Host "  $_" } }
if ($pdfs.Count) { Write-Host "`nPDFs (not zipped; send any you want turned into images):" -ForegroundColor Cyan; $pdfs | ForEach-Object { Write-Host "  $_" } }
explorer.exe (Join-Path $HOME 'Downloads')
