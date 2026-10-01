# Sentinel Desk

Interactive security operations dashboard built with **React** and **TypeScript**. It is a portfolio demo, not a live security product: alerts, assets, names and metrics are fictional, and interactions run locally in the browser.

## What you can explore

- Overview of priority alerts and assets at risk
- Alert search, severity and status filters, and a detail panel
- Asset inventory and locally updated acknowledgement state
- Responsive layout and keyboard-friendly controls

## Project structure

- `main.tsx` — React and TypeScript source
- `styles.css` — styles
- `index.html` — page shell
- `app.js` — compiled browser bundle generated from `main.tsx`

## Build

Run `npm install` and `npm run build`. The build updates `app.js`, which the static page loads directly. No backend, API credentials or live integrations are required.

Live demo: https://laanm.github.io/sentinel-desk-demo/
