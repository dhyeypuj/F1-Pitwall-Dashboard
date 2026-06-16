# 🏁 F1 Pit Wall Dashboard · 2026 Edition

> A high-performance, immersive racing dashboard designed for the future of Formula 1.

<p align="center">
  <img src="screenshots/dashboard_full.png" alt="Full Dashboard Preview" width="100%">
</p>

## 🏎️ Overview

The **F1 Pit Wall Dashboard** is a premium web application built for the 2026 season. It provides enthusiasts with a real-time command center experience, blending cutting-edge aesthetics with deep data integration. Whether you're tracking the championship lead or checking the next session's countdown, the Pit Wall puts you in the engineer's seat.

---

## ✨ Key Features & Enhancements

The application integrates live data pipelines, custom customization engines, and production-grade instrumentation, making it a paddock-ready telemetry center:

### 📡 1. Live Pit Wall Telemetry & Commentary Screen
Step onto the pit wall with a live, real-time telemetry page (`LiveFeedPage`) featuring two main synchronized monitoring panels:
- **Telemetry Monitor**:
  - Displays real-time session tracking metadata, counting down to upcoming sessions or displaying active session timers using high-resolution intervals.
  - Dynamically updates environmental track indicators: **Track Temperature**, **Air Temperature**, **Humidity**, and **Wind Speed**.
  - A real-time **Telemetry Monitor Grid** listing the top 14 drivers with columns for position, car number, name, team name, lap count, gap margins, speed, gear, and DRS activation flags.
  - Interactive color-coded accents that highlight each row according to the team's custom styling rules.
  - Dynamic flag banners indicating session status (**GREEN FLAG**, **RED FLAG**, **SAFETY CAR**, or **VSC ACTIVE**) parsed on-the-fly from commentary text blocks.
- **Live Commentary Widget** (`LiveCommentary`):
  - Automatically fetches the latest session text notifications, rendering cards detailing elapsed timestamps, lap numbers, event categorization badges (e.g. `DRS`, `PIT`, `PENALTY`, `FLAG`, `INFO`), and descriptions.
  - Supports configurable **Auto-Scroll** preferences that keep the newest messages in view (persisted in `localStorage` caches).
  - High-performance refresh mechanisms including manual force-refresh buttons and a "Jump to Live" scroll-assist action.
- **Data Integration & Fallbacks**:
  - Leverages OpenF1 REST API (`api.openf1.org`) endpoints to fetch active meeting lists, session details, and historical race control logs.
  - Employs resilient fallback handling: when OpenF1 endpoints restrict access (e.g. during live races), the UI switches to a simulated feed, rendering a warning banner to maintain dashboard operations.
- **Custom Access Overlay Modal**:
  - If a user clicks to enter the live Pit Wall screen while no session is active, the app displays a custom confirmation overlay notifying them of the inactive session, allowing them to return to the dashboard or proceed with viewing the layout.

### 🌓 2. Dual-Mode Aesthetics & Team Personalization
Experience the dashboard in sleek **Dark Mode** or high-contrast **Light Mode**, with a full theme engine that adapts to your favorite F1 team's identity. The styling engine reads color tokens dynamically to change gradients, borders, and active highlights.

<table align="center">
  <tr>
    <td align="center"><b>Dark Mode</b></td>
    <td align="center"><b>Light Mode</b></td>
  </tr>
  <tr>
    <td><img src="screenshots/hero_dark.png" alt="Dark Mode Hero" width="100%"></td>
    <td><img src="screenshots/hero_light.png" alt="Light Mode Hero" width="100%"></td>
  </tr>
</table>

### 📅 3. Smart Calendar & Sessions
Never miss a session. The dashboard automatically calculates local times and countdowns for every FP1, Qualifying, Sprint, and Race day, shifting focus as the weekend progresses.

<p align="center">
  <img src="screenshots/calendar.png" alt="Season Calendar" width="100%">
</p>

### 🛠️ 4. Personalization Command Center
Tailor your experience. Choose your favorite team, toggle dashboard widgets (News, Standings, Podium), and persist your preferences across sessions directly linked with your Firebase user profile.

<p align="center">
  <img src="screenshots/settings.png" alt="Settings Panel" width="80%">
</p>

### 🔢 5. Colorized Official Driver Numbers
Personalize the grid layout with official driver assets:
- **Vector SVG Pipeline**: Integrates cropped, high-contrast vector SVGs served locally (`/assets/driver-numbers/`) for each driver (e.g. Hamilton's `44`, Leclerc's `16`, Norris's `1`, Verstappen's `3`).
- **Interactive Micro-Animations**: Highlights drivers on hover, scaling the vector graphic up (+25%) smoothly.
- **Reliable Fallbacks**: If a driver code does not have a local vector file, the system queries the official Formula 1 CDN, fetching webp representations dynamically.

### 🌀 6. Widget Loading Skeleton Screens
To provide fluid, premium visual transitions and eliminate layout shift jank, we have designed customized loading skeletons for every core dashboard panel:
- **Comprehensive Coverage**: Skeletons are implemented for the **Podium**, **Drivers Standings**, **Constructors Standings**, **News Feed**, **Stats Ribbon**, **Calendar Strip**, and **Hero countdown widgets**.
- **Modern Shimmer System**: Styled via CSS using a linear repeating `@keyframes skeleton-shimmer` animation running at `1.5s` intervals.
- **Jank Elimination**: Employs CSS rules that bypass entrance animation delays (`!important`) when active loading skeleton states are rendered, preventing visual lag or jumpy staggered transitions.

### 📊 7. Structured Monitoring & Performance Instrumentation
Designed for production-grade telemetry and observability:
- **Sentry Integration**: Initialized via `@sentry/react` at startup, logging unhandled React errors (caught by a custom `ErrorBoundary`), tracking routing latency, and binding Firebase user identifiers dynamically upon authentication.
- **Vercel Web Analytics & Speed Insights**: Automatically monitors web vitals (LCP, CLS, INP, TTFB) and registers custom events when users interact with the dashboard (e.g. toggling widget visibility, updating theme modes, switching team preferences, and completing onboarding).
- **Structured Contextual Logging**: The client-side logging client (`logger.js`) switches behaviors between environments. In development, it prints formatted logs to the console; in production, it silences debug output, stores info/warning statements as Sentry breadcrumbs, and reports errors directly to Sentry streams.
- **Firestore Writes Throttling**: Employs a `1500ms` debounce timer when syncing user preferences (widgets selection, theme appearance, constructor affiliation) to Firestore collections, optimizing network traffic and database transaction counts.

### 🚀 8. Parallel Development Server Launcher
Streamline your local workspace startup with a single click:
- **Concurrent Execution Engine**: A Node.js startup script (`scripts/start-all.js`) spawns both the Vite frontend server (port 5173) and the local proxy API server (port 3001) concurrently.
- **Formatted Logging Stream**: Pipes stdout and stderr logs from child processes into the main console, prefixing logs with colors (Green for `[Backend]`, Cyan for `[Frontend]`) for clear diagnostics.
- **Double-Click Executable**: Exposes a Windows batch file (`start.bat`) that launches this script, alongside npm script wrappers (`npm run dev:all` or `npm start`).
- **Clean Shutdown**: Listens to process signals (Ctrl+C, termination commands) to automatically clean up and kill child processes cleanly.

---

## 📁 Project Directory Structure

```text
├── public/
│   ├── assets/
│   │   ├── driver-numbers/     # Cropped high-contrast vector SVGs for F1 drivers
│   │   └── logos/              # Constructor team badges and details
│   ├── favicon.svg
│   └── icons.svg
├── scripts/
│   ├── start-all.js            # Node concurrent process execution orchestrator
│   ├── local-api.js            # Mock backend endpoint for parsing RSS news feeds
│   ├── download-driver-numbers.cjs # Vector downloader script
│   └── normalize-driver-numbers.cjs # SVG path styling normalizer
├── src/
│   ├── components/             # Reusable UI widgets and commenting modules
│   ├── config/                 # Centralized APIs, schedules, and themes
│   ├── hooks/                  # Custom state hooks
│   ├── layout/                 # Grid wrappers and column placements
│   ├── pages/                  # Top-level screen components (Auth, LiveFeed)
│   ├── services/               # Jolpi & OpenF1 connections, sentry/analytics loggers
│   ├── store/                  # Zustand global application states
│   ├── utils/                  # Utility helpers and diagnostics
│   ├── App.jsx                 # Core routing, auth wrapper, and alert systems
│   ├── index.css               # Global semantic variables, animations, and loaders
│   └── main.jsx                # Observability mounts and React entrypoint
├── start.bat                   # One-click developer launcher batch file
└── package.json
```

---

## ⚙️ Environment Variables Configuration

Create a `.env` file in the root directory and configure the following parameters to ensure full auth, persistence, and observability operations:

```ini
# Firebase Config (Web Integration SDK)
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Observability Configuration
VITE_SENTRY_DSN=your_sentry_dsn_here

# API Routing Customization (Optional overrides)
VITE_ERGAST_API_URL=https://api.jolpi.ca/ergast/f1
VITE_OPENF1_API_URL=https://api.openf1.org/v1
```

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite 8
- **State Management**: Zustand 5
- **Styling**: Vanilla CSS (Semantic Variable System)
- **Backend/Auth**: Firebase 11 (Firestore & Authentication)
- **Data Sources**: Ergast API (Jolpi Mirror), OpenF1 API, RSS News Feeds
- **Observability**: `@sentry/react` & Vercel Web Analytics / Speed Insights

---

## 🏁 Quick Start

To spin up the development environment locally (spawning both backend proxies and front-end dev servers):

### Option A: Windows double-click
Simply double-click the **`start.bat`** file in the root folder of the project.

### Option B: Command Line
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the concurrent dev launcher:
   ```bash
   npm run dev:all
   ```

---

## 📊 Developer Testing & Diagnostics

### A. Simulating a Sentry Exception
To verify that Sentry integration is running correctly:
1. Fire up the developer server and open browser DevTools (`F12`).
2. Execute the helper method in the console:
   ```javascript
   window.triggerTestSentryError()
   ```
3. Check the console and your Sentry Issue stream to confirm the crash was logged.

### B. Checking API Latency & Caching
To inspect processed backend latency:
1. Open your browser DevTools **Network** tab.
2. Select any request to `/api/news`.
3. Verify the presence of the `X-Response-Time` (processing milliseconds) and `X-Cache` (`HIT` or `MISS` news cache status) headers.

---

## 🎨 Dynamic Styling & Constructor Brand System

The dashboard implements a modular styling framework that dynamically shifts colors, hover states, backgrounds, and drop shadows to match the branding of any of the **10 Formula 1 constructors** selected by the user.

### Constructor Color Configurations:
The team metadata is centralized in [themes.js](file:///c:/Users/Dhyey%20Pujara/Downloads/F1%20Dashboard/src/config/themes.js) and maps constructors to their exact primary accent colors:
* **Ferrari**: `#E10600` (Classic Racing Red)
* **Mercedes**: `#00A19B` (AMG Petronas Teal)
* **Red Bull Racing**: `#0600EF` (Deep Oracle Blue)
* **McLaren**: `#FF8700` (McLaren Papaya Orange)
* **Aston Martin**: `#006F62` (Aramco Emerald Green)
* **Alpine**: `#0090FF` (BWT Alpine Blue)
* **Williams**: `#005AFF` (Williams Racing Blue)
* **Haas**: `#E6002B` (MoneyGram Crimson)
* **Racing Bulls**: `#6692FF` (Visa Cash App Electric Blue)
* **Audi**: `#F50537` (Audi Sport Red)
* **Cadillac**: `#FFD700` (Cadillac Gold)

### CSS Property Injection:
When a team is selected, the application updates the Zustand preference store. The root component translates the selected team’s hex value and updates CSS custom properties dynamically on the document root or container, enabling real-time color shifts across the dashboard cards, buttons, standings highlights, and charts.

---

## 🔌 News Aggregator & Serverless API Routes

The backend features high-performance serverless endpoints under the `api/` directory that act as proxies for news curation, preventing client-side CORS issues and optimizing data request cycles:

### A. `/api/news` Endpoint (Serverless Aggregator)
* **Aggregated Sources**: BBC Sport F1, Motorsport F1, and Formula1.com.
* **Aggregator Pipeline**: Parses XML feeds asynchronously using `rss-parser`, merges articles chronologically based on publish date, and returns the top 15 normalized articles.
* **Warm-Instance Caching**: Uses a memory-based cache layer with a **10-minute Time-To-Live (TTL)**. Subsequent requests during the TTL window return cached data in `< 10ms` and set the header `X-Cache: HIT`.
* **Telemetry Headers**:
  - `X-Cache`: Returns `HIT` or `MISS` depending on the aggregator cache state.
  - `X-Response-Time`: Reports the exact server execution latency in milliseconds.

### B. `/api/health` Endpoint (Status Diagnostics)
* Returns `{ status: "ok" }` and is used to test network connectivity and serverless routing health.

---

## 🧠 Global State Management & Persistence Flow

The application state is centralized via **Zustand**, managing modular states across pages, authentication boundaries, and local user settings.

### Zustand Store Structure (`useStore.js`):
- **User Authentication**: Keeps the active user payload, mapping `authReady` status to prevent layout flashing before the Firebase auth handshake completes.
- **User Preferences**: Controls `team` branding selection, `theme` (light/dark), `appearance` type (system/dark/light), and visibility flags for widgets (News, Standings, Podium, Stats, Calendar).
- **Live Telemetry & Commentary**: Manages race commentary arrays, telemetry lists, and flag state banners.

### Debounced Persistence Pipeline:
To optimize database throughput, preferences are synced to the **Firebase Cloud Firestore** database using a **1500ms debounce timer** via `src/services/db.js`. If a user rapidly updates their preferences, only the final state is written to the cloud, preventing unnecessary write usage.
If the client goes offline, the store catches the writing failure, falls back to `localStorage`, and updates the dashboard immediately in offline state.

---

## 📐 Driver Vector Asset Pipelines (Local Scrapers & Crops)

The visual driver numbers shown next to each entry are high-definition vector SVGs colorized using SVG matrix filters to match their respective team colors. We use custom automation scripts under the `scripts/` directory to manage these assets:

### A. Scraper & Converter: `download-driver-numbers.cjs`
* Downloads the official cropped white driver numbers from the Formula 1 CDN.
* Embeds the downloaded WebP asset as a base64 inline URI inside a clean SVG layout.
* Inserts an SVG `<filter>` block that replaces all white pixels with the constructor's team hex color dynamically.
* **Run command**:
  ```bash
  node scripts/download-driver-numbers.cjs
  ```

### B. ViewBox Normalizer: `normalize-driver-numbers.cjs`
* Solves the issue where driver numbers have inconsistent bounding boxes, making them render at unequal heights.
* Uses pre-measured bounding coordinates (min/max X & Y) of each digit to recalculate a customized, padded `viewBox` attribute.
* Re-writes the SVGs so that all 22 driver numbers scale to the exact same visual height in grid tables.
* **Run command**:
  ```bash
  node scripts/normalize-driver-numbers.cjs
  ```

---

## ✅ System QA Validation Checklist

Use these validation items when deploying updates to a staging or production dashboard:
* **Auth Systems**: Validate Google OAuth popup, email login/registration, and cleanup of Zustand and local storage on logout.
* **Firestore Writes**: Open the browser console, update the theme, and verify Firestore writes are debounced (only 1 write after 1.5 seconds of inactivity).
* **RSS Proxy Routing**: Inspect `/api/news` headers, verifying `X-Cache: HIT` is present on reload and response times are below `10ms`.
* **Sentry Integration**: Invoke `window.triggerTestSentryError()` to check end-to-end exception logging and source map resolution in development.

---

> [!TIP]
> Use the **Dashboard Settings** to toggle the News Feed if you want a more focused data view.

> [!IMPORTANT]
> The 2026 season data is live. Race schedules, session timings, and historical round results are pulled dynamically from the active F1 database.

---

*Designed for the Paddock · 2026 Personal Edition*
