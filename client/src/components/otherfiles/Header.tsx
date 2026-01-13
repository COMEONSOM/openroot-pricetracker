"use client";

/**
 * ============================================================
 * HEADER — OPENROOT (Theme Only Version)
 * ============================================================
 */

import {
  useState,
  useEffect,
  useCallback,
  memo,
  useMemo,
} from "react";

import "../../styles/Header.css";
import { getThemeManager } from "./theme";

/* ============================================================
   THEME MANAGER TYPE
============================================================ */

interface ThemeManagerType {
  getCurrentTheme: () => string;
  toggleTheme: () => void;
}

/* ============================================================
   HEADER COMPONENT
============================================================ */

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  /* ================= THEME ================= */

  useEffect(() => {
    setMounted(true);

    try {
      const themeManager = getThemeManager() as ThemeManagerType;
      const currentTheme = themeManager.getCurrentTheme();
      setTheme(currentTheme as "light" | "dark");

      const handleThemeChange = (event: Event) => {
        const customEvent = event as CustomEvent;
        setTheme(customEvent.detail.theme as "light" | "dark");
      };

      window.addEventListener("themechange", handleThemeChange);
      return () =>
        window.removeEventListener("themechange", handleThemeChange);
    } catch (error) {
      console.error("Theme init error:", error);
    }
  }, []);

  const handleToggleTheme = useCallback(() => {
    try {
      const themeManager = getThemeManager() as ThemeManagerType;
      themeManager.toggleTheme();
    } catch (error) {
      console.error("Theme toggle error:", error);
    }
  }, []);

  const logoSrc = useMemo(() => {
    return theme === "dark"
      ? "/logo-dark.png"
      : "/logo-light.png";
  }, [theme]);

  if (!mounted) return null;

  return (
    <header className="header" role="banner">
      {/* LOGO */}
      <div className="header-logo">
        <img
          src={logoSrc}
          alt="Openroot Logo"
          className="header-logo-img"
          draggable={false}
        />
      </div>

      {/* RIGHT ACTIONS */}
      <div className="header-right">
        {/* THEME TOGGLE */}
        <button
          className="theme-toggle"
          onClick={handleToggleTheme}
          title={`Switch to ${
            theme === "dark" ? "light" : "dark"
          } mode`}
          aria-label="Toggle theme"
          type="button"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
};

export default memo(Header);
