# 🧭 Openroot PriceTracker — Project Structure Notes

This document explains **why the project is structured this way**, what each folder is responsible for, and how developers should work with it.

This file exists so that:

* Future me remembers the design decisions.
* New developers can understand the architecture quickly.
* Refactors remain safe and intentional.
* Accidental coupling and messy structure are avoided.

---

## 📁 Top-Level Structure

```
client/
ai/
server/
```

### ✅ client/

Frontend application (React + Vite).
All UI, state handling, styling, and user interaction lives here.

### ✅ server/

Backend application (FastAPI).
Handles search, scraping, image proxying, pricing intelligence, database, APIs.

### ✅ ai/

Experimental or auxiliary AI utilities (not production critical).

---

# 🎯 Client Folder Architecture

```
client/
└── src/
    ├── assets/
    ├── components/
    │   ├── TextSearch/
    │   ├── LinkSearch/
    │   ├── ImageSearch/
    │   ├── sharedfiles/
    │   └── otherfiles/
    └── styles/
        └── global.css
```

The frontend is organized by **feature ownership instead of random folders.**

Each folder has a clear responsibility.

---

## 🔍 TextSearch/

**Purpose**

* Contains everything related only to TEXT BASED SEARCH UI and logic.

**What goes here**

* TextSearch component
* Local CSS for text search
* Hooks, helpers related only to text search
* Input logic, validations, UI behavior

**What should NOT go here**

* Shared UI components
* Price tables
* Product cards
* Link or image search logic

**Why**
Text search evolves independently. Keeping it isolated prevents accidental side effects when modifying it.

---

## 🔗 LinkSearch/

**Purpose**

* Contains everything related only to LINK BASED SEARCH.

**What goes here**

* Link parsing UI
* Link validation logic
* Link specific loaders
* Link-specific styles

**Why**
Link search has different behavior than text search and should remain independent.

---

## 🖼️ ImageSearch/

**Purpose**

* Contains everything related only to IMAGE BASED SEARCH.

**What goes here**

* Image upload UI
* Preview logic
* Image matching logic
* Image search styles

**Why**
Image search usually evolves faster and uses different APIs and flows.

---

## 🤝 sharedfiles/

**Purpose**

* Shared components used by **TextSearch + LinkSearch + ImageSearch**.

**Examples**

* ProductCard
* SearchResults grid
* PriceComparison table
* PriceRow
* Comparison dashboards
* Shared UI widgets

**Rule**
If a file is used by more than one search type and cannot logically belong to a single domain → it belongs here.

**Why**
Prevents duplication and keeps shared logic centralized.

---

## 🧩 otherfiles/

**Purpose**

* Application infrastructure and non-search components.

**Examples**

* Header
* Footer
* Home layout
* Theme setup
* Loaders
* Charts
* Global utilities

**Why**
Keeps feature folders clean and avoids mixing layout/system logic with business features.

---

## 🎨 styles/global.css

**Purpose**

* Global theme variables
* Dark/light mode tokens
* Base typography
* Reset rules
* Global layout primitives

**Rule**
Component-specific styling should NOT go here.
Only true global styles belong here.

---

## 📦 index.tsx Files (IMPORTANT)

Each major folder contains an `index.tsx` file.

Example:

```
TextSearch/
 ├─ TextSearch.tsx
 ├─ TextSearch.css
 └─ index.tsx
```

**What it does**

```ts
export { default } from "./TextSearch";
```

This allows importing like:

```ts
import TextSearch from "@/components/TextSearch";
```

instead of:

```ts
import TextSearch from "@/components/TextSearch/TextSearch";
```

**Why this exists**

* Cleaner imports
* Safer refactoring
* Folder acts like a module boundary
* Avoids breaking imports when files move

---

## 🛡️ Architecture Rules

1. Each feature owns its folder.
2. No cross-imports between feature folders unless via sharedfiles.
3. Component styles must live next to the component.
4. Global styles stay minimal.
5. Shared logic must be intentional.
6. Avoid deep relative imports — use folder entry points.
7. If something feels duplicated → move to sharedfiles.
8. If something grows large → split into submodules.

---

## 🧠 Why This Architecture Exists

This structure was created to:

* Reduce technical debt
* Enable safe refactoring
* Improve scalability
* Avoid CSS pollution
* Make onboarding easy
* Keep responsibilities clear
* Support long-term growth

---

## ✍️ Maintenance Notes

When changing structure:

* Update this document.
* Keep folder responsibilities strict.
* Avoid shortcuts that create coupling.
* Think in domains, not files.


* HOW TO START?
# Server
# in command prompt

cd server
**python -m venv venv         (If venv is NOT present, you must create it first.)**
venv\Scripts\activate
**pip install sqlalchemy (for this project, one time)**
**pip install requests (one time)**
**pip install python-dotenv (one time)**
**pip install python-multipart (one time)**
**pip install fastapi uvicorn (one time)**
uvicorn app.main:app --reload

# Frontend

cd client
**npm install (one time)**
npm run dev
