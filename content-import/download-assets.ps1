# Kija Creative: download the live site's images and hero video, then zip them.
# Paste this whole block into Windows PowerShell and press Enter.
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ProgressPreference = 'SilentlyContinue'
$base = 'https://kijacreative.com/wp-content/uploads/'
$out  = Join-Path $HOME 'Downloads\kija-media\wp-uploads'
$files = @(
  '2026/01/Kija-K-Dark-1.png',
  '2026/01/cropped-Kija-Stacked-Multicolored.png',
  '2026/01/cropped-Kija-Stacked-Multicolored-270x270.png',
  '2026/02/kija-rotating-logo-white.png',
  '2026/02/02182.mp4',
  '2026/06/OCP-Logo-Gold_cirlce.png',
  '2026/02/OCP-Grand-Opening-308-scaled.jpg',
  '2026/06/OCP-Uptown-scaled.jpg',
  '2026/06/LowerGreenville-scaled.jpg',
  '2026/02/OCP-Case-Study-Wallpaper-scaled.png',
  '2026/02/CharliesOCPCard-Not-So-AI.jpg',
  '2026/06/BluePlate-Brand-Identity-Evolution.png',
  '2021/11/blueplate-SS.png',
  '2022/08/Jakes_Gameday_Primary_Flat.png',
  '2021/11/bowlounge.jpeg',
  '2026/06/Logo-Color@2x.png',
  '2026/02/09042022-12.jpg',
  '2026/02/Capture.jpg',
  '2026/02/Shopping.jpg',
  '2026/06/MPG-Logo.png',
  '2026/02/ManUP-Logos-wh-OL-01.png',
  '2026/02/Busted-Poster-scaled.jpg',
  '2026/02/MPG-Brand-Guide-Cover-1.jpg',
  '2026/02/Banner-MAN-UP-Poster-Flyer-print-1.jpg',
  '2026/02/MPG-scaled.png',
  '2026/06/Bishop-Sketch.png',
  '2026/06/Bishop-Rendering.png',
  '2026/06/Bishop-Instore.png',
  '2026/02/Veuve-Deer-Head-scaled.jpg',
  '2026/02/AmericanAirlines_Wallwraps_upscaled_4x-1.png',
  '2026/02/CORRALEJO_Silver_NS-scaled.png',
  '2026/02/ShinerTruckISORight.jpg',
  '2026/02/WoodenDisplays-2.jpg',
  '2026/06/VanCountry-Cream-Logo.png',
  '2026/02/LogoShot-1.jpg',
  '2026/06/EventWeis-Napkin-to-Flesh.png',
  '2026/02/LogoCardsShot-scaled.jpg',
  '2026/02/SOM_SHirt-Mockup-scaled.png',
  '2026/02/Banner.jpg'
)
$ok = 0; $missing = @()
foreach ($f in $files) {
  $dest = Join-Path $out ($f -replace '/', '\')
  New-Item -ItemType Directory -Force -Path (Split-Path $dest) | Out-Null
  try { Invoke-WebRequest -Uri ($base + $f) -OutFile $dest -UseBasicParsing; $ok++; Write-Host "ok       $f" }
  catch { $missing += $f; Write-Host "MISSING  $f" -ForegroundColor Yellow }
}
$zip = Join-Path $HOME 'Downloads\kija-media.zip'
if (Test-Path $zip) { Remove-Item $zip }
Compress-Archive -Path (Join-Path $HOME 'Downloads\kija-media\wp-uploads') -DestinationPath $zip
$mb = [math]::Round((Get-Item $zip).Length / 1MB, 1)
Write-Host "`nDone: $ok of $($files.Count) files. Zip: $zip ($mb MB)" -ForegroundColor Green
if ($missing.Count) { Write-Host "Missing: $($missing -join ', ')" -ForegroundColor Yellow }
explorer.exe (Join-Path $HOME 'Downloads')
