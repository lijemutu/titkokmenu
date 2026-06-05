# Project Goals: Ojito MVP

This document outlines the product specifications, architecture, and roadmap for **Ojito** (formerly titkokmenu).

---

## 📱 Product Concept
* **Name**: Ojito ("¡Échale un ojito!")
* **Value Prop**: A fast, mobile-first vertical fullscreen video catalog ("TikTok-style" preview) that helps customers instantly visualize products (shoes, clothes, food, drinks) by scanning a QR code.

---

## 🛠️ Stack & Architecture
* **Frontend**: React + Vite + Vanilla CSS
* **Hosting**: Vercel or Netlify (Free Tier)
* **Data Storage**: Local JSON files (e.g., `public/catalogs/cafeluna.json`) in the repository
* **Video Delivery**: Cloudinary CDN (Free Tier) with `f_auto,q_auto` to ensure optimized mobile playback
* **Routing**: Client-side dynamic routing using query parameters (e.g., `/?s=calzados-luna`)

---

## 🗺️ MVP Roadmap & Task List

### Phase 1: Foundation & Setup
* [ ] Initialize project with Vite (React + CSS).
* [ ] Define the JSON schema for the catalogs (item name, price, description, video URL).
* [ ] Create sample catalog data for a dummy shop.

### Phase 2: Core UX (TikTok-Style Vertical Feed)
* [ ] Implement full-screen vertical scroll container (snapping scrolling).
* [ ] Add HTML5 video players that autoplay, loop, and are muted by default.
* [ ] Overlay item name, price, description, and a visual call-to-action button (e.g., "Interested" or "Ask Seller").
* [ ] Design sleek controls (play/mute toggle, swipe hints, elegant transitions).

### Phase 3: QR Code & Routing
* [ ] Implement routing to load the correct catalog dynamically based on URL parameter (e.g., `/?s=calzados-luna` or `/calzados-luna`).
* [ ] Create a helper script or tool to easily generate QR codes pointing to specific catalogs.

### Phase 4: Local Pilot Preparation
* [ ] Create a beautiful placeholder catalog (e.g., local shoe store catalog).
* [ ] Prepare print designs for physical counter QR stands (can be done with Canva or similar tools).
* [ ] Prepare a simple "script" or pitch for when you approach your local shops.
