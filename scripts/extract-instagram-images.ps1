$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$rootDir = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$outputDir = Join-Path $rootDir 'public\instagram-imports'
$outputJsonPath = Join-Path $rootDir 'src\data\instagram-extracted-images.json'
$importedConfigPath = Join-Path $rootDir 'src\config\importedImages.ts'

$postUrls = @(
  'https://www.instagram.com/p/DV4BQL8DDR5/',
  'https://www.instagram.com/p/DVofjmejNLR/',
  'https://www.instagram.com/p/DVJrlqsjJA2/',
  'https://www.instagram.com/p/DUqq8VEjErn/?img_index=1',
  'https://www.instagram.com/p/DUlWfLjDEU0/',
  'https://www.instagram.com/p/DT0rVa6jHBj/',
  'https://www.instagram.com/p/DOY8YQfCFmk/'
)

$imageAssignments = @{
  hero = 'DVofjmejNLR'
  services = @('DV4BQL8DDR5', 'DVJrlqsjJA2')
  gallery = @('DUlWfLjDEU0', 'DUqq8VEjErn', 'DT0rVa6jHBj')
  about = 'DOY8YQfCFmk'
}

$headers = @{
  'User-Agent' = 'Mozilla/5.0'
  'Accept' = 'image/*,*/*;q=0.8'
  'Referer' = 'https://www.instagram.com/'
}

$contentTypeExtensionMap = @{
  'image/jpeg' = '.jpg'
  'image/jpg' = '.jpg'
  'image/png' = '.png'
  'image/webp' = '.webp'
  'image/gif' = '.gif'
  'image/avif' = '.avif'
}

$maxAttempts = 3

function Normalize-PostUrl {
  param([string]$RawUrl)

  $uri = [System.Uri]$RawUrl
  $segments = $uri.AbsolutePath.Trim('/').Split('/')
  $postId = if ($segments.Length -ge 2) { $segments[1] } else { '' }
  return "https://www.instagram.com/p/$postId/"
}

function Get-PostId {
  param([string]$PostUrl)

  $uri = [System.Uri]$PostUrl
  $segments = $uri.AbsolutePath.Trim('/').Split('/')
  if ($segments.Length -lt 2 -or $segments[0] -ne 'p') {
    throw "Kein gueltiger Instagram-Post-Link: $PostUrl"
  }

  return $segments[1]
}

function Get-MediaUrl {
  param([string]$PostId)
  return "https://www.instagram.com/p/$PostId/media?size=l"
}

function Get-ExtensionFromUrl {
  param([string]$Url)

  try {
    $uri = [System.Uri]$Url
    return [System.IO.Path]::GetExtension($uri.AbsolutePath).ToLowerInvariant()
  } catch {
    return ''
  }
}

function Resolve-Extension {
  param(
    [string]$ContentType,
    [string]$FinalUrl
  )

  $mimeType = ($ContentType -split ';')[0].Trim().ToLowerInvariant()
  if ($contentTypeExtensionMap.ContainsKey($mimeType)) {
    return $contentTypeExtensionMap[$mimeType]
  }

  $urlExtension = Get-ExtensionFromUrl -Url $FinalUrl
  if ($urlExtension) {
    return $urlExtension
  }

  return '.jpg'
}

function Read-ExistingRecords {
  if (-not (Test-Path $outputJsonPath)) {
    return @()
  }

  try {
    $raw = Get-Content -Path $outputJsonPath -Raw -Encoding UTF8
    $parsed = $raw | ConvertFrom-Json
    if ($null -eq $parsed) {
      return @()
    }

    return @($parsed)
  } catch {
    return @()
  }
}

function Invoke-InstagramRequest {
  param(
    [string]$Url,
    [string]$OutFile
  )

  $lastError = $null

  for ($attempt = 1; $attempt -le $maxAttempts; $attempt += 1) {
    try {
      return Invoke-WebRequest -Uri $Url -MaximumRedirection 10 -Headers $headers -OutFile $OutFile -PassThru
    } catch {
      $lastError = $_
      if ($attempt -lt $maxAttempts) {
        Start-Sleep -Seconds $attempt
      }
    }
  }

  throw $lastError.Exception
}

function Build-ImportedConfig {
  param([array]$Records)

  $recordById = @{}
  foreach ($record in $Records) {
    $recordById[$record.postId] = $record
  }

  $hero = if ($recordById.ContainsKey($imageAssignments.hero)) { $recordById[$imageAssignments.hero].localPath } else { '' }
  $services = @($imageAssignments.services | Where-Object { $recordById.ContainsKey($_) } | ForEach-Object { $recordById[$_].localPath })
  $gallery = @($imageAssignments.gallery | Where-Object { $recordById.ContainsKey($_) } | ForEach-Object { $recordById[$_].localPath })
  $about = if ($recordById.ContainsKey($imageAssignments.about)) { $recordById[$imageAssignments.about].localPath } else { '' }
  $enabled = if ($Records.Count -gt 0) { 'true' } else { 'false' }

  return @"
export type ImportedImagesConfig = {
  enabled: boolean;
  slug: string;
  hero: string;
  services: string[];
  gallery: string[];
  about: string;
};

export const importedImagesConfig: ImportedImagesConfig = {
  enabled: $enabled,
  slug: "instagram-extracted-images",
  hero: $($hero | ConvertTo-Json -Compress),
  services: $($services | ConvertTo-Json),
  gallery: $($gallery | ConvertTo-Json),
  about: $($about | ConvertTo-Json -Compress),
};
"@
}

New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
New-Item -ItemType Directory -Force -Path (Split-Path $outputJsonPath -Parent) | Out-Null

$existingRecords = Read-ExistingRecords
$existingRecordById = @{}
foreach ($record in $existingRecords) {
  $existingRecordById[$record.postId] = $record
}

$successes = New-Object System.Collections.Generic.List[object]
$failures = New-Object System.Collections.Generic.List[object]

foreach ($rawPostUrl in $postUrls) {
  $postUrl = Normalize-PostUrl -RawUrl $rawPostUrl

  try {
    $postId = Get-PostId -PostUrl $postUrl
    $mediaUrl = Get-MediaUrl -PostId $postId
    $tempFile = [System.IO.Path]::GetTempFileName()

    try {
      $response = Invoke-InstagramRequest -Url $mediaUrl -OutFile $tempFile
      $contentType = [string]$response.Headers['Content-Type']
      if (-not $contentType.ToLowerInvariant().StartsWith('image/')) {
        throw "Ungueltiger Content-Type: $contentType"
      }

      $finalImageUrl = $response.BaseResponse.RequestMessage.RequestUri.AbsoluteUri
      $extension = Resolve-Extension -ContentType $contentType -FinalUrl $finalImageUrl
      $fileName = "$postId$extension"
      $absoluteFilePath = Join-Path $outputDir $fileName
      $localPath = "/instagram-imports/$fileName"
      $existingRecord = if ($existingRecordById.ContainsKey($postId)) { $existingRecordById[$postId] } else { $null }
      $skipDownload = $false

      if ($null -ne $existingRecord -and $existingRecord.localPath -eq $localPath -and $existingRecord.finalImageUrl -eq $finalImageUrl -and (Test-Path $absoluteFilePath)) {
        $skipDownload = $true
        Remove-Item -Path $tempFile -Force
      } else {
        Move-Item -Path $tempFile -Destination $absoluteFilePath -Force
      }

      $successes.Add([PSCustomObject]@{
        postUrl = $postUrl
        postId = $postId
        mediaUrl = $mediaUrl
        finalImageUrl = $finalImageUrl
        localPath = $localPath
      }) | Out-Null

      $status = if ($skipDownload) { 'SKIP' } else { 'OK' }
      Write-Output ("$status $postId -> $localPath -> $finalImageUrl")
    } finally {
      if (Test-Path $tempFile) {
        Remove-Item -Path $tempFile -Force
      }
    }
  } catch {
    $failures.Add([PSCustomObject]@{
      postUrl = $postUrl
      reason = $_.Exception.Message
    }) | Out-Null

    Write-Output ("ERROR " + $postUrl + " -> " + $_.Exception.Message)
  }
}

$successArray = $successes.ToArray()
$failureArray = $failures.ToArray()
$successArray | ConvertTo-Json -Depth 4 | Set-Content -Path $outputJsonPath -Encoding UTF8
Build-ImportedConfig -Records $successArray | Set-Content -Path $importedConfigPath -Encoding UTF8

Write-Output ''
Write-Output '=== Extraktions-Zusammenfassung ==='
Write-Output ("Erfolgreich extrahiert: " + $successArray.Count)
Write-Output ("Fehlgeschlagen: " + $failureArray.Count)

if ($successArray.Count -gt 0) {
  Write-Output ''
  Write-Output 'Gespeicherte Dateien:'
  foreach ($record in $successArray) {
    Write-Output ("- public" + $record.localPath)
  }
}

if ($failureArray.Count -gt 0) {
  Write-Output ''
  Write-Output 'Fehlgeschlagene Links:'
  foreach ($failure in $failureArray) {
    Write-Output ("- " + $failure.postUrl + " -> " + $failure.reason)
  }
  exit 1
}