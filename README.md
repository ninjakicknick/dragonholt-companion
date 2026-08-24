# Legacy of Dragonholt Companion

A mobile-friendly, offline-capable PWA campaign companion.

## What was added
- Automatic on-device saving with `localStorage`
- JSON Backup / Restore buttons
- PWA manifest and offline service worker
- Mobile home-screen installation support
- Tailwind + Lucide setup matching the original component

## Run locally
1. Install Node.js 20+.
2. In this folder run `npm install`.
3. Run `npm run dev`.

## Build
Run `npm run build`. The deployable site will be in `dist/`.

## Put it on your phone
The easiest free route is Netlify Drop:
1. Run `npm install` and `npm run build` on a computer.
2. Go to https://app.netlify.com/drop and drop the **dist** folder onto the page.
3. Open the resulting HTTPS address in Chrome on Android.
4. Chrome menu → **Add to Home screen** / **Install app**.
5. Launch it from the Dragonholt icon. After the first load, the app is cached for offline use.

You can also deploy the `dist/` directory to Vercel, Cloudflare Pages, GitHub Pages (with appropriate base-path configuration), or any static HTTPS host.

## Saves
Campaign data is stored locally in the browser/app installation. Use **Backup** periodically to download a JSON save file. **Restore** imports one of those files.
