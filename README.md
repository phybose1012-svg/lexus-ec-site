# Lexus EC modernization workspace

This workspace is prepared for the `https://lexus-ec.com/` performance and style-system overhaul.

## Current files

- `scripts/audit-lexus-site.ps1` - repeatable public-site crawler and asset inventory script.
- `reports/initial-audit.md` - latest generated audit summary.
- `reports/audit-summary.json` - machine-readable audit summary.
- `reports/page-inventory.csv` - page-level HTML/resource metrics.
- `reports/resource-references.csv` - every resource reference found in page HTML.
- `reports/asset-inventory.csv` - fetched asset headers and byte sizes.
- `docs/modernization-plan.md` - current plan and next execution phases.

## Re-run audit

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\audit-lexus-site.ps1 -BaseUrl 'https://lexus-ec.com/' -OutDir 'reports' -MaxPages 0 -MaxAssets 900
```

Use `-MaxPages 50` for a faster smoke audit.

## Frontend prototype

The first replacement candidate is the homepage.

```powershell
cd C:\---hp\frontend
npm.cmd run dev -- --port 4321 --strictPort
```

Current homepage replacement status:

- Source: `frontend/src/pages/index.astro`
- Data: `frontend/src/data/home.ts`
- Styles: `frontend/src/styles/global.css`
- Built output: `frontend/dist/index.html`
- SEO comparison: `reports/home-seo-comparison.json`
- Current generated size: about 17KB HTML and 9KB CSS, with no iframe and no client-side JavaScript other than JSON-LD.

Open `http://127.0.0.1:4321/`.

Build and compare SEO-critical tags:

```powershell
cd C:\---hp
npm.cmd --prefix .\frontend run build
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\compare-seo-baseline.ps1 -BaselineJson 'baseline\home.seo.json' -CandidateHtml 'frontend\dist\index.html' -OutPath 'reports\home-seo-comparison.json'
```
