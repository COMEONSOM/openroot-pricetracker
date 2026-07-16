"use client";

/**
 * HEADER - OPENROOT
 * Clean header with theme toggle
 */

import { useCallback, useEffect, useState, memo } from "react";
import { Moon, SunMedium } from "lucide-react";
import "../../styles/Header.css";
import { getThemeManager } from "./theme";

type Theme = "light" | "dark";

interface ThemeManager {
  getCurrentTheme: () => Theme;
  toggleTheme: () => void;
}

interface ThemeChangeEvent extends CustomEvent {
  detail: { theme: Theme };
}

const getInitialTheme = (): Theme => {
  if (typeof document !== "undefined") {
    const activeTheme = document.documentElement.getAttribute("data-theme");
    if (activeTheme === "light" || activeTheme === "dark") {
      return activeTheme;
    }
  }

  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
};

function Header() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const themeManager = getThemeManager() as ThemeManager;
    setTheme(themeManager.getCurrentTheme() as Theme);

    const handleThemeChange = (event: Event) => {
      setTheme((event as ThemeChangeEvent).detail.theme);
    };

    window.addEventListener("themechange", handleThemeChange);
    return () => window.removeEventListener("themechange", handleThemeChange);
  }, []);

  const handleToggleTheme = useCallback(() => {
    const themeManager = getThemeManager() as ThemeManager;
    themeManager.toggleTheme();
  }, []);

  const logoSrc = `/logo-${theme}.png`;
  const nextTheme = theme === "dark" ? "light" : "dark";
  const ThemeIcon = theme === "dark" ? SunMedium : Moon;

  return (
    <header className="header" role="banner">
      <a href="/" className="header__logo" aria-label="Go to homepage">
        <img
          src={logoSrc}
          alt="Openroot"
          className="header__logo-img"
          width={130}
          height={40}
          draggable={false}
          loading="eager"
        />
      </a>

      <div className="header__actions">
        <button
          type="button"
          className="header__theme-toggle"
          onClick={handleToggleTheme}
          aria-label={`Switch to ${nextTheme} mode`}
          aria-pressed={theme === "dark"}
          data-theme={theme}
        >
          <span className="header__theme-icon" aria-hidden="true">
            <ThemeIcon size={18} strokeWidth={2} />
          </span>
        </button>
      </div>
    </header>
  );
}

export default memo(Header);
