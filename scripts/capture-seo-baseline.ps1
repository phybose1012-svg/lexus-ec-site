param(
    [string[]]$Urls = @("https://lexus-ec.com/"),
    [string]$OutDir = "baseline"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

$UserAgent = "Mozilla/5.0 (compatible; CodexSeoBaseline/1.0; +https://openai.com/)"
$Options = [System.Text.RegularExpressions.RegexOptions]"IgnoreCase, Singleline"

function Get-SafeName {
    param([string]$Url)
    $uri = [System.Uri]::new($Url)
    $path = $uri.AbsolutePath.Trim("/")
    if ([string]::IsNullOrWhiteSpace($path)) { return "home" }
    return (($path -replace "[^a-zA-Z0-9._-]+", "-").Trim("-"))
}

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

function Get-MetaMap {
    param([string]$Html)
    $meta = [ordered]@{}
    foreach ($match in [regex]::Matches($Html, "<meta\b(?<tag>[^>]+)>", $Options)) {
        $tag = $match.Groups["tag"].Value
        $name = Get-Attribute $tag "name"
        $property = Get-Attribute $tag "property"
        $content = Get-Attribute $tag "content"
        if (-not [string]::IsNullOrWhiteSpace($name)) {
            $meta[$name] = $content
        } elseif (-not [string]::IsNullOrWhiteSpace($property)) {
            $meta[$property] = $content
        }
    }
    return $meta
}

function Get-LinkMap {
    param([string]$Html)
    $links = [ordered]@{}
    foreach ($match in [regex]::Matches($Html, "<link\b(?<tag>[^>]+)>", $Options)) {
        $tag = $match.Groups["tag"].Value
        $rel = Get-Attribute $tag "rel"
        $href = Get-Attribute $tag "href"
        if (-not [string]::IsNullOrWhiteSpace($rel) -and -not [string]::IsNullOrWhiteSpace($href)) {
            $links[$rel] = $href
        }
    }
    return $links
}

function Get-JsonLd {
    param([string]$Html)
    $items = New-Object System.Collections.ArrayList
    foreach ($match in [regex]::Matches($Html, "<script\b(?<tag>[^>]*)>(?<body>.*?)</script>", $Options)) {
        $type = Get-Attribute $match.Groups["tag"].Value "type"
        if ($type -ieq "application/ld+json") {
            $body = [System.Net.WebUtility]::HtmlDecode($match.Groups["body"].Value.Trim())
            if (-not [string]::IsNullOrWhiteSpace($body)) {
                [void]$items.Add($body)
            }
        }
    }
    return $items
}

$results = New-Object System.Collections.ArrayList

foreach ($url in $Urls) {
    $safeName = Get-SafeName $url
    $htmlPath = Join-Path $OutDir "$safeName.html"
    $jsonPath = Join-Path $OutDir "$safeName.seo.json"

    $response = Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 40 -Headers @{ "User-Agent" = $UserAgent }
    $html = [string]$response.Content
    Set-Content -Encoding UTF8 -Path $htmlPath -Value $html

    $baseline = [ordered]@{
        url = $url
        finalUrl = $response.BaseResponse.ResponseUri.AbsoluteUri
        status = [int]$response.StatusCode
        capturedAt = (Get-Date).ToString("o")
        htmlBytes = [System.Text.Encoding]::UTF8.GetByteCount($html)
        title = Get-TagInnerText $html "title"
        meta = Get-MetaMap $html
        links = Get-LinkMap $html
        h1 = @([regex]::Matches($html, "<h1\b[^>]*>(?<value>.*?)</h1>", $Options) | ForEach-Object {
            [System.Net.WebUtility]::HtmlDecode(($_.Groups["value"].Value -replace "<[^>]+>", " " -replace "\s+", " ").Trim())
        })
        jsonLd = Get-JsonLd $html
        htmlPath = $htmlPath
        jsonPath = $jsonPath
    }

    $baseline | ConvertTo-Json -Depth 8 | Set-Content -Encoding UTF8 -Path $jsonPath
    [void]$results.Add($baseline)
}

$indexPath = Join-Path $OutDir "seo-baseline-index.json"
$results | ConvertTo-Json -Depth 8 | Set-Content -Encoding UTF8 -Path $indexPath
Write-Host "Captured $($results.Count) URL(s)."
Write-Host "Index: $indexPath"
