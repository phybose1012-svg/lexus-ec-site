param(
    [string]$BaselineJson = "baseline/home.seo.json",
    [string]$CandidateHtml = "frontend/dist/index.html",
    [string]$OutPath = "reports/home-seo-comparison.json"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$Options = [System.Text.RegularExpressions.RegexOptions]"IgnoreCase, Singleline"

function Get-Attribute {
    param([string]$Tag, [string]$Name)
    $match = [regex]::Match($Tag, "\b$([regex]::Escape($Name))\s*=\s*[""'](?<value>[^""']*)[""']", $Options)
    if ($match.Success) { return [System.Net.WebUtility]::HtmlDecode($match.Groups["value"].Value) }
    return ""
}

function Get-TagInnerText {
    param([string]$Html, [string]$TagName)
    $match = [regex]::Match($Html, "<$TagName[^>]*>(?<value>.*?)</$TagName>", $Options)
    if ($match.Success) {
        return [System.Net.WebUtility]::HtmlDecode(($match.Groups["value"].Value -replace "\s+", " ").Trim())
    }
    return ""
}

function Get-MetaValue {
    param([string]$Html, [string]$Name)
    foreach ($match in [regex]::Matches($Html, "<meta\b(?<tag>[^>]+)>", $Options)) {
        $tag = $match.Groups["tag"].Value
        if ((Get-Attribute $tag "name") -eq $Name -or (Get-Attribute $tag "property") -eq $Name) {
            return Get-Attribute $tag "content"
        }
    }
    return ""
}

function Get-LinkHref {
    param([string]$Html, [string]$Rel)
    foreach ($match in [regex]::Matches($Html, "<link\b(?<tag>[^>]+)>", $Options)) {
        $tag = $match.Groups["tag"].Value
        if ((Get-Attribute $tag "rel") -eq $Rel) {
            return Get-Attribute $tag "href"
        }
    }
    return ""
}

$baseline = Get-Content -Raw -Encoding UTF8 -Path $BaselineJson | ConvertFrom-Json
$candidate = Get-Content -Raw -Encoding UTF8 -Path $CandidateHtml

$checks = @(
    [pscustomobject]@{
        field = "title"
        baseline = $baseline.title
        candidate = Get-TagInnerText $candidate "title"
    },
    [pscustomobject]@{
        field = "description"
        baseline = $baseline.meta.description
        candidate = Get-MetaValue $candidate "description"
    },
    [pscustomobject]@{
        field = "canonical"
        baseline = $baseline.links.canonical
        candidate = Get-LinkHref $candidate "canonical"
    },
    [pscustomobject]@{
        field = "og:title"
        baseline = $baseline.meta.'og:title'
        candidate = Get-MetaValue $candidate "og:title"
    },
    [pscustomobject]@{
        field = "og:description"
        baseline = $baseline.meta.'og:description'
        candidate = Get-MetaValue $candidate "og:description"
    },
    [pscustomobject]@{
        field = "og:image"
        baseline = $baseline.meta.'og:image'
        candidate = Get-MetaValue $candidate "og:image"
    }
)

$result = [ordered]@{
    baselineJson = $BaselineJson
    candidateHtml = $CandidateHtml
    candidateBytes = [System.Text.Encoding]::UTF8.GetByteCount($candidate)
    baselineBytes = $baseline.htmlBytes
    checks = @($checks | ForEach-Object {
        $_ | Add-Member -NotePropertyName matches -NotePropertyValue ($_.baseline -eq $_.candidate) -PassThru
    })
}

$outDir = Split-Path -Parent $OutPath
if (-not [string]::IsNullOrWhiteSpace($outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
}
$result | ConvertTo-Json -Depth 6 | Set-Content -Encoding UTF8 -Path $OutPath

$result.checks | Format-Table field, matches -AutoSize
Write-Host "Comparison: $OutPath"
