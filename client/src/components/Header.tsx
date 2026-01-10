"use client";

import { useEffect, useState, useMemo } from "react";
import "../styles/Header.css";
import { getThemeManager } from "./theme/theme";

interface ThemeManagerType {
  getCurrentTheme: () => string;
  toggleTheme: () => void;
}

export default function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

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

      return () => {
        window.removeEventListener("themechange", handleThemeChange);
      };
    } catch (error) {
      console.error("Theme initialization error:", error);
    }
  }, []);

  const handleToggleTheme = () => {
    try {
      const themeManager = getThemeManager() as ThemeManagerType;
      themeManager.toggleTheme();
    } catch (error) {
      console.error("Theme toggle error:", error);
    }
  };

  // ✅ Deterministic logo selection based on theme
  const logoSrc = useMemo(() => {
    return theme === "dark" ? "/logo-dark.png" : "/logo-light.png";
  }, [theme]);

  if (!mounted) return null;

  return (
    <header className="header">
      {/* Logo */}
      <div className="header-logo">
        <img
          src={logoSrc}
          alt="Openroot Logo"
          className="header-logo-img"
          draggable={false}
        />
      </div>

      {/* Right Section */}
      <div className="header-right">
        <button
          className="theme-toggle"
          onClick={handleToggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-label={`Toggle theme (currently ${theme})`}
          type="button"
        >
          <span className="theme-toggle-icon">
            {theme === "dark" ? "☀️" : "🌙"}
          </span>
        </button>

        <button className="auth-button" type="button">
          Sign In
        </button>
      </div>
    </header>
  );
}
