interface ThemeManager {
  STORAGE_KEY: string;
  LIGHT: string;
  DARK: string;
  init: () => void;
  getSavedTheme: () => string | null;
  getSystemTheme: () => string;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
  getCurrentTheme: () => string;
}

export const createThemeManager = (): ThemeManager => {
  const manager: ThemeManager = {
    STORAGE_KEY: "user-theme-preference",
    LIGHT: "light",
    DARK: "dark",

    getSavedTheme(): string | null {
      if (typeof window === "undefined") return null;

      try {
        return localStorage.getItem(this.STORAGE_KEY);
      } catch {
        return null;
      }
    },

    getSystemTheme(): string {
      if (typeof window === "undefined") return this.LIGHT;

      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        return this.DARK;
      }

      return this.LIGHT;
    },

    setTheme(theme: string): void {
      if (typeof window === "undefined") return;

      const validTheme = [this.LIGHT, this.DARK].includes(theme)
        ? theme
        : this.LIGHT;

      document.documentElement.setAttribute("data-theme", validTheme);
      document.body.classList.remove(this.LIGHT, this.DARK);
      document.body.classList.add(validTheme);

      try {
        localStorage.setItem(this.STORAGE_KEY, validTheme);
      } catch {
        /* ignore localStorage errors */
      }

      window.dispatchEvent(
        new CustomEvent("themechange", { detail: { theme: validTheme } })
      );
    },

    toggleTheme(): void {
      const currentTheme = this.getCurrentTheme();
      this.setTheme(currentTheme === this.DARK ? this.LIGHT : this.DARK);
    },

    getCurrentTheme(): string {
      if (typeof window === "undefined") return this.LIGHT;

      const activeTheme = document.documentElement.getAttribute("data-theme");
      return activeTheme || this.getSavedTheme() || this.getSystemTheme();
    },

    init(): void {
      if (typeof window === "undefined") return;

      const savedTheme = this.getSavedTheme();
      const preferredTheme = savedTheme || this.getSystemTheme();

      document.documentElement.setAttribute("data-theme", preferredTheme);
      document.body.classList.remove(this.LIGHT, this.DARK);
      document.body.classList.add(preferredTheme);

      window.dispatchEvent(
        new CustomEvent("themechange", { detail: { theme: preferredTheme } })
      );

      if (window.matchMedia) {
        window
          .matchMedia("(prefers-color-scheme: dark)")
          .addEventListener("change", (event) => {
            if (!this.getSavedTheme()) {
              const nextTheme = event.matches ? this.DARK : this.LIGHT;
              document.documentElement.setAttribute("data-theme", nextTheme);
              document.body.classList.remove(this.LIGHT, this.DARK);
              document.body.classList.add(nextTheme);

              window.dispatchEvent(
                new CustomEvent("themechange", { detail: { theme: nextTheme } })
              );
            }
          });
      }
    },
  };

  manager.init();

  return manager;
};

let themeManagerInstance: ThemeManager | null = null;

export const getThemeManager = (): ThemeManager => {
  if (!themeManagerInstance && typeof window !== "undefined") {
    themeManagerInstance = createThemeManager();
  }

  return themeManagerInstance!;
};
