param(
    [string]$BaseUrl = "https://lexus-ec.com/",
    [string]$OutDir = "reports",
    [int]$MaxPages = 0,
    [int]$MaxAssets = 350
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$UserAgent = "Mozilla/5.0 (compatible; CodexSiteAudit/1.0; +https://openai.com/)"
$RunStarted = Get-Date
$RootUri = [System.Uri]::new($BaseUrl)
$Options = [System.Text.RegularExpressions.RegexOptions]"IgnoreCase, Singleline"

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

function Convert-Headers {
    param($Headers)
    $map = [ordered]@{}
    if ($null -eq $Headers) { return $map }
    foreach ($key in $Headers.Keys) {
        $value = $Headers[$key]
        if ($value -is [System.Array]) {
            $map[$key] = ($value -join ", ")
        } else {
            $map[$key] = [string]$value
        }
    }
    return $map
}

function Invoke-AuditRequest {
    param(
        [Parameter(Mandatory = $true)][string]$Url
    )

    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    try {
        $response = Invoke-WebRequest `
            -UseBasicParsing `
            -Uri $Url `
            -TimeoutSec 35 `
            -MaximumRedirection 8 `
            -Headers @{ "User-Agent" = $UserAgent; "Accept" = "*/*" }
        $sw.Stop()

        return [pscustomobject]@{
            Ok = $true
            Url = $response.BaseResponse.ResponseUri.AbsoluteUri
            RequestedUrl = $Url
            Status = [int]$response.StatusCode
            ElapsedMs = [int]$sw.ElapsedMilliseconds
            RawLength = [int64]$response.RawContentLength
            Headers = Convert-Headers $response.Headers
            Content = [string]$response.Content
            Error = $null
        }
    } catch {
        $sw.Stop()
        $status = $null
        if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
            $status = [int]$_.Exception.Response.StatusCode
        }
        return [pscustomobject]@{
            Ok = $false
            Url = $Url
            RequestedUrl = $Url
            Status = $status
            ElapsedMs = [int]$sw.ElapsedMilliseconds
            RawLength = 0
            Headers = [ordered]@{}
            Content = ""
            Error = $_.Exception.Message
        }
    }
}

function Get-HeaderValue {
    param($Headers, [string]$Name)
    if ($null -eq $Headers) { return "" }
    foreach ($key in $Headers.Keys) {
        if ($key -ieq $Name) { return [string]$Headers[$key] }
    }
    return ""
}

function Get-AbsoluteUrl {
    param([string]$Base, [string]$Url)
    if ([string]::IsNullOrWhiteSpace($Url)) { return $null }

    $candidate = [System.Net.WebUtility]::HtmlDecode($Url.Trim())
    if ($candidate.StartsWith("#")) { return $null }
    if ($candidate -match "^(data|mailto|tel|sms|javascript):") { return $null }

    if ($candidate.StartsWith("//")) {
        $candidate = "$($RootUri.Scheme):$candidate"
    }

    try {
        $absolute = [System.Uri]::new([System.Uri]$Base, $candidate).AbsoluteUri
        return ($absolute -replace "#.*$", "")
    } catch {
        return $null
    }
}

function Get-Attribute {
    param([string]$Tag, [string]$Name)
    $match = [regex]::Match($Tag, "\b$([regex]::Escape($Name))\s*=\s*[""'](?<value>[^""']+)[""']", $Options)
    if ($match.Success) { return $match.Groups["value"].Value }
    return $null
}

function Add-UrlToSet {
    param(
        [hashtable]$Set,
        [string]$Url
    )
    if (-not [string]::IsNullOrWhiteSpace($Url)) {
        $Set[$Url] = $true
    }
}

function Add-Resource {
    param(
        [System.Collections.ArrayList]$List,
        [string]$PageUrl,
        [string]$Type,
        [string]$Url
    )
    if ([string]::IsNullOrWhiteSpace($Url)) { return }
    [void]$List.Add([pscustomobject]@{
        PageUrl = $PageUrl
        Type = $Type
        Url = $Url
    })
}

function Expand-SrcSet {
    param([string]$SrcSet)
    $urls = New-Object System.Collections.ArrayList
    if ([string]::IsNullOrWhiteSpace($SrcSet)) { return $urls }
    foreach ($part in ($SrcSet -split ",")) {
        $first = ($part.Trim() -split "\s+")[0]
        if (-not [string]::IsNullOrWhiteSpace($first)) {
            [void]$urls.Add($first)
        }
    }
    return $urls
}

function Get-LocValues {
    param([string]$XmlText)
    $locs = New-Object System.Collections.ArrayList
    foreach ($match in [regex]::Matches($XmlText, "<loc>\s*(?:<!\[CDATA\[)?(?<loc>.*?)(?:\]\]>)?\s*</loc>", $Options)) {
        $loc = [System.Net.WebUtility]::HtmlDecode($match.Groups["loc"].Value.Trim())
        if (-not [string]::IsNullOrWhiteSpace($loc)) {
            [void]$locs.Add($loc)
        }
    }
    return $locs
}

function Get-PathExtension {
    param([string]$Url)
    try {
        $uri = [System.Uri]::new($Url)
        return [System.IO.Path]::GetExtension($uri.AbsolutePath).ToLowerInvariant()
    } catch {
        return ""
    }
}

function Get-HostName {
    param([string]$Url)
    try {
        return [System.Uri]::new($Url).Host.ToLowerInvariant()
    } catch {
        return ""
    }
}

function Get-AssetKey {
    param([string]$Url)
    try {
        $uri = [System.Uri]::new($Url)
        $keptQuery = New-Object System.Collections.ArrayList
        if (-not [string]::IsNullOrWhiteSpace($uri.Query)) {
            foreach ($part in ($uri.Query.TrimStart("?") -split "&")) {
                if ([string]::IsNullOrWhiteSpace($part)) { continue }
                $name = ($part -split "=", 2)[0]
                if ($name -ieq "wpr_t") { continue }
                [void]$keptQuery.Add($part)
            }
        }

        $builder = [System.UriBuilder]::new($uri)
        if ($keptQuery.Count -gt 0) {
            $builder.Query = ($keptQuery -join "&")
        } else {
            $builder.Query = ""
        }
        $builder.Fragment = ""
        return $builder.Uri.AbsoluteUri
    } catch {
        return $Url
    }
}

function Get-PluginSlug {
    param([string]$Url)
    $match = [regex]::Match($Url, "/wp-content/plugins/(?<slug>[^/?#]+)", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    if ($match.Success) { return $match.Groups["slug"].Value.ToLowerInvariant() }
    return ""
}

function Get-ThemeSlug {
    param([string]$Url)
    $match = [regex]::Match($Url, "/wp-content/themes/(?<slug>[^/?#]+)", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    if ($match.Success) { return $match.Groups["slug"].Value.ToLowerInvariant() }
    return ""
}

function Get-SumBytes {
    param($Rows)
    $measure = $Rows | Measure-Object Bytes -Sum
    if ($null -eq $measure -or $null -eq $measure.Sum) { return [int64]0 }
    return [int64]$measure.Sum
}

function Get-Title {
    param([string]$Html)
    $match = [regex]::Match($Html, "<title[^>]*>(?<title>.*?)</title>", $Options)
    if ($match.Success) {
        return ([System.Net.WebUtility]::HtmlDecode(($match.Groups["title"].Value -replace "\s+", " ").Trim()))
    }
    return ""
}

function Get-Canonical {
    param([string]$Html, [string]$PageUrl)
    foreach ($match in [regex]::Matches($Html, "<link\b(?<tag>[^>]+)>", $Options)) {
        $tag = $match.Groups["tag"].Value
        $rel = Get-Attribute $tag "rel"
        if ($rel -and $rel -match "(^|\s)canonical(\s|$)") {
            return Get-AbsoluteUrl $PageUrl (Get-Attribute $tag "href")
        }
    }
    return ""
}

function Get-ResourcesFromHtml {
    param([string]$Html, [string]$PageUrl)
    $resources = New-Object System.Collections.ArrayList

    foreach ($match in [regex]::Matches($Html, "<script\b(?<tag>[^>]*)>", $Options)) {
        $src = Get-Attribute $match.Groups["tag"].Value "src"
        Add-Resource $resources $PageUrl "js" (Get-AbsoluteUrl $PageUrl $src)
    }

    foreach ($match in [regex]::Matches($Html, "<link\b(?<tag>[^>]+)>", $Options)) {
        $tag = $match.Groups["tag"].Value
        $href = Get-Attribute $tag "href"
        $rel = Get-Attribute $tag "rel"
        $as = Get-Attribute $tag "as"
        $absolute = Get-AbsoluteUrl $PageUrl $href
        if (-not $absolute) { continue }

        if ($rel -and $rel -match "stylesheet") {
            Add-Resource $resources $PageUrl "css" $absolute
        } elseif ($rel -and $rel -match "preload" -and $as -match "style") {
            Add-Resource $resources $PageUrl "css-preload" $absolute
        } elseif ($rel -and $rel -match "preload" -and $as -match "script") {
            Add-Resource $resources $PageUrl "js-preload" $absolute
        } elseif ($rel -and $rel -match "preload" -and $as -match "image") {
            Add-Resource $resources $PageUrl "image-preload" $absolute
        } elseif ($absolute -match "\.(css)(\?|$)") {
            Add-Resource $resources $PageUrl "css" $absolute
        }
    }

    foreach ($match in [regex]::Matches($Html, "<img\b(?<tag>[^>]+)>", $Options)) {
        $tag = $match.Groups["tag"].Value
        foreach ($attr in @("src", "data-src", "data-lazy-src")) {
            Add-Resource $resources $PageUrl "image" (Get-AbsoluteUrl $PageUrl (Get-Attribute $tag $attr))
        }
        foreach ($srcsetAttr in @("srcset", "data-srcset", "data-lazy-srcset")) {
            $srcset = Get-Attribute $tag $srcsetAttr
            foreach ($src in (Expand-SrcSet $srcset)) {
                Add-Resource $resources $PageUrl "image" (Get-AbsoluteUrl $PageUrl $src)
            }
        }
    }

    foreach ($match in [regex]::Matches($Html, "<source\b(?<tag>[^>]+)>", $Options)) {
        $tag = $match.Groups["tag"].Value
        Add-Resource $resources $PageUrl "source" (Get-AbsoluteUrl $PageUrl (Get-Attribute $tag "src"))
        foreach ($src in (Expand-SrcSet (Get-Attribute $tag "srcset"))) {
            Add-Resource $resources $PageUrl "source" (Get-AbsoluteUrl $PageUrl $src)
        }
    }

    foreach ($match in [regex]::Matches($Html, "<video\b(?<tag>[^>]+)>", $Options)) {
        $tag = $match.Groups["tag"].Value
        Add-Resource $resources $PageUrl "video" (Get-AbsoluteUrl $PageUrl (Get-Attribute $tag "src"))
        Add-Resource $resources $PageUrl "image" (Get-AbsoluteUrl $PageUrl (Get-Attribute $tag "poster"))
    }

    foreach ($match in [regex]::Matches($Html, "<iframe\b(?<tag>[^>]+)>", $Options)) {
        Add-Resource $resources $PageUrl "iframe" (Get-AbsoluteUrl $PageUrl (Get-Attribute $match.Groups["tag"].Value "src"))
    }

    return $resources
}

function Count-Matches {
    param([string]$Text, [string]$Pattern)
    return ([regex]::Matches($Text, $Pattern, $Options)).Count
}

function Add-Count {
    param([hashtable]$Table, [string]$Key)
    if ([string]::IsNullOrWhiteSpace($Key)) { return }
    if ($Table.ContainsKey($Key)) { $Table[$Key]++ } else { $Table[$Key] = 1 }
}

$robots = Invoke-AuditRequest "$($RootUri.Scheme)://$($RootUri.Host)/robots.txt"
$sitemapQueue = New-Object System.Collections.Queue
$seenSitemaps = @{}
$pageSet = @{}

if ($robots.Ok) {
    foreach ($line in ($robots.Content -split "`n")) {
        if ($line -match "^\s*Sitemap:\s*(?<url>\S+)") {
            $sitemapQueue.Enqueue($matches["url"])
        }
    }
}

if ($sitemapQueue.Count -eq 0) {
    $sitemapQueue.Enqueue("$($RootUri.Scheme)://$($RootUri.Host)/sitemap.xml")
}

while ($sitemapQueue.Count -gt 0) {
    $sitemapUrl = [string]$sitemapQueue.Dequeue()
    if ($seenSitemaps.ContainsKey($sitemapUrl)) { continue }
    $seenSitemaps[$sitemapUrl] = $true

    $sitemap = Invoke-AuditRequest $sitemapUrl
    if (-not $sitemap.Ok) { continue }

    foreach ($loc in (Get-LocValues $sitemap.Content)) {
        $locHost = Get-HostName $loc
        if ($locHost -and $locHost -ne $RootUri.Host.ToLowerInvariant()) { continue }
        if ($loc -match "sitemap.*\.xml(\?|$)" -or $loc -match "-sitemap\.xml(\?|$)") {
            $sitemapQueue.Enqueue($loc)
        } elseif ($loc -match "^https?://" -and $loc -notmatch "/wp-content/") {
            $pageSet[$loc] = $true
        }
    }
}

$pageSet[$BaseUrl] = $true
$pageUrls = @($pageSet.Keys | Sort-Object)
if ($MaxPages -gt 0) {
    $pageUrls = @($pageUrls | Select-Object -First $MaxPages)
}

$pageRows = New-Object System.Collections.ArrayList
$resourceRows = New-Object System.Collections.ArrayList
$pluginCounts = @{}
$themeCounts = @{}
$cssSignatures = @{}

$pageIndex = 0
foreach ($pageUrl in $pageUrls) {
    $pageIndex++
    if ($pageIndex -eq 1 -or $pageIndex % 50 -eq 0 -or $pageIndex -eq $pageUrls.Count) {
        Write-Host "Fetching pages: $pageIndex / $($pageUrls.Count)"
    }
    $page = Invoke-AuditRequest $pageUrl
    if (-not $page.Ok) {
        [void]$pageRows.Add([pscustomobject]@{
            Url = $pageUrl
            Status = $page.Status
            Ok = $false
            Title = ""
            Canonical = ""
            HtmlBytes = 0
            ElapsedMs = $page.ElapsedMs
            CssCount = 0
            JsCount = 0
            ImageCount = 0
            IframeCount = 0
            StyleTagCount = 0
            InlineStyleAttrCount = 0
            ScriptTagCount = 0
            InlineScriptCount = 0
            ElementorClassCount = 0
            ElementorAssetCount = 0
            WordPressAssetCount = 0
            Error = $page.Error
        })
        continue
    }

    $html = $page.Content
    $resources = Get-ResourcesFromHtml $html $page.Url
    foreach ($resource in $resources) {
        [void]$resourceRows.Add($resource)
        $plugin = Get-PluginSlug $resource.Url
        $theme = Get-ThemeSlug $resource.Url
        Add-Count $pluginCounts $plugin
        Add-Count $themeCounts $theme
    }

    foreach ($pluginMatch in [regex]::Matches($html, "/wp-content/plugins/(?<slug>[^/?#""']+)", $Options)) {
        Add-Count $pluginCounts ($pluginMatch.Groups["slug"].Value.ToLowerInvariant())
    }
    foreach ($themeMatch in [regex]::Matches($html, "/wp-content/themes/(?<slug>[^/?#""']+)", $Options)) {
        Add-Count $themeCounts ($themeMatch.Groups["slug"].Value.ToLowerInvariant())
    }

    $cssUrls = @($resources | Where-Object { $_.Type -match "^css" } | Select-Object -ExpandProperty Url -Unique | Sort-Object)
    $signature = ($cssUrls -join "|")
    if ($cssSignatures.ContainsKey($signature)) { $cssSignatures[$signature]++ } else { $cssSignatures[$signature] = 1 }

    $scriptTags = Count-Matches $html "<script\b"
    $externalScripts = @($resources | Where-Object { $_.Type -eq "js" } | Select-Object -ExpandProperty Url -Unique).Count

    [void]$pageRows.Add([pscustomobject]@{
        Url = $page.Url
        Status = $page.Status
        Ok = $true
        Title = Get-Title $html
        Canonical = Get-Canonical $html $page.Url
        HtmlBytes = [int][System.Text.Encoding]::UTF8.GetByteCount($html)
        ElapsedMs = $page.ElapsedMs
        CssCount = @($resources | Where-Object { $_.Type -match "^css" } | Select-Object -ExpandProperty Url -Unique).Count
        JsCount = $externalScripts
        ImageCount = @($resources | Where-Object { $_.Type -match "image|source|video" } | Select-Object -ExpandProperty Url -Unique).Count
        IframeCount = @($resources | Where-Object { $_.Type -eq "iframe" } | Select-Object -ExpandProperty Url -Unique).Count
        StyleTagCount = Count-Matches $html "<style\b"
        InlineStyleAttrCount = Count-Matches $html "\sstyle\s*="
        ScriptTagCount = $scriptTags
        InlineScriptCount = [Math]::Max(0, $scriptTags - $externalScripts)
        ElementorClassCount = Count-Matches $html "elementor-"
        ElementorAssetCount = @($resources | Where-Object { $_.Url -match "elementor|elementor-pro|uploads/elementor" } | Select-Object -ExpandProperty Url -Unique).Count
        WordPressAssetCount = @($resources | Where-Object { $_.Url -match "/wp-(content|includes)/" } | Select-Object -ExpandProperty Url -Unique).Count
        Error = ""
    })
}

$uniqueAssets = @(
    $resourceRows |
        Where-Object { $_.Url -and $_.Type -notin @("iframe", "video") } |
        ForEach-Object {
            [pscustomobject]@{
                Url = $_.Url
                AssetKey = Get-AssetKey $_.Url
                Type = $_.Type
            }
        } |
        Group-Object AssetKey |
        ForEach-Object {
            $first = $_.Group[0]
            [pscustomobject]@{
                Url = $_.Name
                Type = $first.Type
                PageRefCount = $_.Count
            }
        } |
        Sort-Object @{ Expression = { if ($_.Type -match "css|js") { 0 } else { 1 } } }, Url
)

if ($MaxAssets -gt 0) {
    $uniqueAssets = @($uniqueAssets | Select-Object -First $MaxAssets)
}

$assetRows = New-Object System.Collections.ArrayList
$assetIndex = 0
foreach ($asset in $uniqueAssets) {
    $assetIndex++
    if ($assetIndex -eq 1 -or $assetIndex % 50 -eq 0 -or $assetIndex -eq $uniqueAssets.Count) {
        Write-Host "Fetching assets: $assetIndex / $($uniqueAssets.Count)"
    }
    $assetResponse = Invoke-AuditRequest $asset.Url
    $headers = $assetResponse.Headers
    [void]$assetRows.Add([pscustomobject]@{
        Url = $asset.Url
        Type = $asset.Type
        Host = Get-HostName $asset.Url
        Extension = Get-PathExtension $asset.Url
        PageRefCount = $asset.PageRefCount
        Ok = $assetResponse.Ok
        Status = $assetResponse.Status
        Bytes = $assetResponse.RawLength
        ElapsedMs = $assetResponse.ElapsedMs
        ContentType = Get-HeaderValue $headers "Content-Type"
        CacheControl = Get-HeaderValue $headers "Cache-Control"
        Expires = Get-HeaderValue $headers "Expires"
        LastModified = Get-HeaderValue $headers "Last-Modified"
        ETag = Get-HeaderValue $headers "ETag"
        Server = Get-HeaderValue $headers "Server"
        CfCacheStatus = Get-HeaderValue $headers "CF-Cache-Status"
        Age = Get-HeaderValue $headers "Age"
        Error = $assetResponse.Error
    })
}

$assetStats = @(
    $assetRows |
        Group-Object Type |
        ForEach-Object {
            [pscustomobject]@{
                Type = $_.Name
                Count = $_.Count
                Bytes = [int64](($_.Group | Measure-Object Bytes -Sum).Sum)
            }
        } |
        Sort-Object Type
)

$topAssets = @(
    $assetRows |
        Sort-Object Bytes -Descending |
        Select-Object -First 25 Url, Type, Bytes, CacheControl, CfCacheStatus, ContentType
)

$plugins = @(
    $pluginCounts.GetEnumerator() |
        Sort-Object Value -Descending |
        ForEach-Object { [pscustomobject]@{ Slug = $_.Key; Count = $_.Value } }
)

$themes = @(
    $themeCounts.GetEnumerator() |
        Sort-Object Value -Descending |
        ForEach-Object { [pscustomobject]@{ Slug = $_.Key; Count = $_.Value } }
)

$homePage = $pageRows | Where-Object { $_.Url -eq $BaseUrl -or $_.Url.TrimEnd("/") -eq $BaseUrl.TrimEnd("/") } | Select-Object -First 1
$summary = [pscustomobject]@{
    RunStarted = $RunStarted.ToString("o")
    RunEnded = (Get-Date).ToString("o")
    BaseUrl = $BaseUrl
    Robots = [pscustomobject]@{
        Ok = $robots.Ok
        Status = $robots.Status
        Content = $robots.Content
        Headers = $robots.Headers
    }
    SitemapCount = $seenSitemaps.Count
    PageCount = $pageRows.Count
    SuccessfulPageCount = @($pageRows | Where-Object { $_.Ok }).Count
    ResourceReferenceCount = $resourceRows.Count
    UniqueFetchedAssetCount = $assetRows.Count
    CssSignatureCount = $cssSignatures.Count
    HomePage = $homePage
    Plugins = $plugins
    Themes = $themes
    AssetStats = $assetStats
    TopAssets = $topAssets
}

$pageCsv = Join-Path $OutDir "page-inventory.csv"
$resourceCsv = Join-Path $OutDir "resource-references.csv"
$assetCsv = Join-Path $OutDir "asset-inventory.csv"
$summaryJson = Join-Path $OutDir "audit-summary.json"
$reportMd = Join-Path $OutDir "initial-audit.md"

$pageRows | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $pageCsv
$resourceRows | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $resourceCsv
$assetRows | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $assetCsv
$summary | ConvertTo-Json -Depth 8 | Set-Content -Encoding UTF8 -Path $summaryJson

$totalFetchedBytes = Get-SumBytes $assetRows
$cssBytes = Get-SumBytes @($assetRows | Where-Object { $_.Type -match "^css" })
$jsBytes = Get-SumBytes @($assetRows | Where-Object { $_.Type -match "^js" })
$imageBytes = Get-SumBytes @($assetRows | Where-Object { $_.Type -match "image|source" })
$cfRows = @($assetRows | Where-Object { $_.CfCacheStatus })
$uncachedStatic = @($assetRows | Where-Object {
    $_.Type -match "css|js|image|source" -and
    ($_.CacheControl -notmatch "max-age|s-maxage|immutable|public" -or $_.CfCacheStatus -match "DYNAMIC|BYPASS|MISS|EXPIRED")
})

$md = New-Object System.Collections.ArrayList
[void]$md.Add("# Lexus EC initial audit")
[void]$md.Add("")
[void]$md.Add("- Run: $($RunStarted.ToString("yyyy-MM-dd HH:mm:ss zzz"))")
[void]$md.Add("- Base URL: $BaseUrl")
[void]$md.Add("- Pages discovered: $($pageRows.Count) from $($seenSitemaps.Count) sitemap files")
[void]$md.Add("- Resource references found: $($resourceRows.Count)")
[void]$md.Add("- Unique assets fetched: $($assetRows.Count)")
[void]$md.Add("- CSS signature variants across pages: $($cssSignatures.Count)")
[void]$md.Add("")
[void]$md.Add("## Homepage")
if ($homePage) {
    [void]$md.Add("")
    [void]$md.Add("- HTML bytes: $($homePage.HtmlBytes)")
    [void]$md.Add("- External CSS: $($homePage.CssCount)")
    [void]$md.Add("- External JS: $($homePage.JsCount)")
    [void]$md.Add("- Images/media refs: $($homePage.ImageCount)")
    [void]$md.Add("- Inline style attrs: $($homePage.InlineStyleAttrCount)")
    [void]$md.Add("- Style tags: $($homePage.StyleTagCount)")
    [void]$md.Add("- Script tags: $($homePage.ScriptTagCount)")
    [void]$md.Add("- Elementor asset refs: $($homePage.ElementorAssetCount)")
    [void]$md.Add("- WordPress asset refs: $($homePage.WordPressAssetCount)")
}
[void]$md.Add("")
[void]$md.Add("## Fetched asset bytes")
[void]$md.Add("")
[void]$md.Add("- Total: $totalFetchedBytes")
[void]$md.Add("- CSS: $cssBytes")
[void]$md.Add("- JS: $jsBytes")
[void]$md.Add("- Images/sources: $imageBytes")
[void]$md.Add("")
[void]$md.Add("## WordPress/plugin signals")
[void]$md.Add("")
foreach ($plugin in ($plugins | Select-Object -First 20)) {
    [void]$md.Add("- Plugin: $($plugin.Slug) ($($plugin.Count) refs)")
}
foreach ($theme in ($themes | Select-Object -First 10)) {
    [void]$md.Add("- Theme: $($theme.Slug) ($($theme.Count) refs)")
}
[void]$md.Add("")
[void]$md.Add("## Cache/CDN signals")
[void]$md.Add("")
[void]$md.Add("- Assets with CF-Cache-Status header: $($cfRows.Count)")
[void]$md.Add("- Static assets that need cache review: $($uncachedStatic.Count)")
[void]$md.Add("")
[void]$md.Add("## Largest fetched assets")
[void]$md.Add("")
foreach ($asset in $topAssets) {
    [void]$md.Add("- $($asset.Bytes) bytes [$($asset.Type)] $($asset.Url)")
}
[void]$md.Add("")
[void]$md.Add("## Generated files")
[void]$md.Add("")
[void]$md.Add("- page-inventory.csv")
[void]$md.Add("- resource-references.csv")
[void]$md.Add("- asset-inventory.csv")
[void]$md.Add("- audit-summary.json")

$md -join "`n" | Set-Content -Encoding UTF8 -Path $reportMd

Write-Host ""
Write-Host "Audit complete."
Write-Host "Report: $reportMd"
Write-Host "Summary JSON: $summaryJson"
