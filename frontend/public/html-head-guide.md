# Rise & Structure — HTML Head Implementation Guide

> Copy this into your app's <head> section. Paths assume assets are in /public/.

---

## Favicon & App Icons

```html
<!-- Primary favicon -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png">

<!-- Apple Touch Icon (iOS home screen) -->
<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png">
<link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png">
<link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.png">
<link rel="apple-touch-icon" sizes="120x120" href="/icons/icon-120x120.png">

<!-- Microsoft Tiles (Windows) -->
<meta name="msapplication-TileColor" content="#1A5553">
<meta name="msapplication-TileImage" content="/icons/icon-144x144.png">
<meta name="msapplication-config" content="/browserconfig.xml">

<!-- Safari Pinned Tab -->
<link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#1A5553">

<!-- Web App Manifest (PWA) -->
<link rel="manifest" href="/manifest.json">

<!-- Theme Color (browser chrome) -->
<meta name="theme-color" content="#1A5553">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Rise & Structure">
<meta name="mobile-web-app-capable" content="yes">
```

---

## OG Image & Social Sharing

```html
<!-- Open Graph (Facebook, LinkedIn) -->
<meta property="og:title" content="Rise & Structure — Rebuild your health, income, and direction" />
<meta property="og:description" content="A structured guidance system for mid-lifers who want more — more energy, more freedom, more clarity. Start with 15 minutes a day." />
<meta property="og:image" content="https://riseandstructure.com/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content="https://riseandstructure.com" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Rise & Structure" />
<meta property="og:locale" content="en_US" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Rise & Structure — Rebuild. Rise. Thrive." />
<meta name="twitter:description" content="A structured guidance system for mid-lifers rebuilding their health, income, and direction." />
<meta name="twitter:image" content="https://riseandstructure.com/og-image.png" />
<meta name="twitter:site" content="@riseandstruct" />
<meta name="twitter:creator" content="@riseandstruct" />
```

---

## Font Loading (Performance)

```html
<!-- Preload critical fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:opsz,wght,SOFT@9..144,400..600,0..100&display=swap">

<!-- Font stylesheet -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:opsz,wght,SOFT@9..144,400..600,0..100&display=swap" rel="stylesheet">

<!-- Optional: Fallback font observer -->
<style>
  /* Font-display: swap ensures text is visible during load */
  body { font-family: 'Inter', -apple-system, 'Segoe UI', 'Helvetica Neue', sans-serif; }
  h1, h2, h3, h4 { font-family: 'Fraunces', 'Georgia', 'Times New Roman', serif; }
</style>
```

---

## Icon Sizes Generation

Generate these from the `app-icon.png` source (1024×1024) using a tool like `sharp`:

| Size | File | Use |
|------|------|-----|
| 16×16 | favicon-16x16.png | Tiny browser tab |
| 32×32 | favicon-32x32.png | Standard favicon |
| 48×48 | icon-48x48.png | PWA monochrome |
| 72×72 | icon-72x72.png | PWA monochrome |
| 96×96 | icon-96x96.png | PWA shortcut icon |
| 120×120 | icon-120x120.png | iOS Safari |
| 128×128 | icon-128x128.png | Chrome Web Store |
| 144×144 | icon-144x144.png | MS Tile / iOS |
| 152×152 | icon-152x152.png | iOS (iPad) |
| 180×180 | apple-touch-icon.png | iOS home screen |
| 192×192 | icon-192x192.png | PWA install prompt |
| 384×384 | icon-384x384.png | PWA large |
| 512×512 | icon-512x512.png | PWA + App store |

**Sharp command example:**
```bash
npx sharp app-icon.png -o icons/ --resize 192,192 --png
```

Or use the online tool: https://realfavicongenerator.net/

---

## SEO Meta Tags

```html
<meta name="description" content="A structured guidance system for mid-lifers rebuilding their health, income, and direction. Start with 15 minutes a day." />
<meta name="keywords" content="midlife, personal development, wellness, side income, habit building, life coaching, career change, health optimization" />
<meta name="author" content="Rise & Structure" />
<link rel="canonical" href="https://riseandstructure.com" />
```

---

## Directory Structure (Expected)

```
public/
├── favicon/
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   └── favicon.ico
├── icons/
│   ├── apple-touch-icon.png          (180×180)
│   ├── icon-48x48.png through -512x512.png
│   └── safari-pinned-tab.svg
├── og-image.png                      (1200×630)
├── manifest.json
├── sw.js                             (service worker)
├── browserconfig.xml
└── screenshots/
    ├── dashboard-desktop.png
    └── dashboard-mobile.png
```