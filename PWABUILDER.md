# PWABuilder — packaging oriz Text for the stores

Live URL: https://text.oriz.in

## Identity
- App name: **oriz Text** (short: **Text**)
- Android package id: **`in.oriz.text`**
- Signing SHA-256: `0C:82:DB:11:57:7E:21:8D:62:1E:54:DF:3B:33:D1:29:6E:77:56:80:36:22:C1:99:36:DF:03:D3:6F:0D:30:36`
- Digital Asset Links: served at `/.well-known/assetlinks.json` (Android TWA verification).

## Package
PWABuilder.com -> enter URL `https://text.oriz.in` -> Package For Stores -> Android (use existing signing key, package `in.oriz.text`) / Windows / iOS.

## Assets shipped
- `manifest.webmanifest` (name/id/scope/display + theme `#b23a2e` on bg `#f6f0e2`)
- Service worker (`sw.js`, Workbox) — app shell precached, AI calls NetworkFirst
- Icons: 192/256/384/512 PNG (`purpose:any`) + maskable 512 + SVG
- Screenshots: desktop (wide) + mobile
- `/.well-known/assetlinks.json` for TWA
