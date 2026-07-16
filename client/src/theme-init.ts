// src/theme-init.ts
// Import this at the very top of main.tsx, before React renders,
// to avoid a flash of the wrong theme on load.
(function initTheme() {
  const STORAGE_KEY = "openroot-theme";
  const stored = localStorage.getItem(STORAGE_KEY);
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = stored === "dark" || stored === "light" ? stored : systemDark ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
})();