// theme.ts — Global Theme Manager for React/Next.js

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
    STORAGE_KEY: 'user-theme-preference',
    LIGHT: 'light',
    DARK: 'dark',

    getSavedTheme(): string | null {
      if (typeof window === 'undefined') return null;
      try {
        return localStorage.getItem(this.STORAGE_KEY);
      } catch (e) {
        console.warn('localStorage not available:', e);
        return null;
      }
    },

    getSystemTheme(): string {
      if (typeof window === 'undefined') return this.LIGHT;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return this.DARK;
      }
      return this.LIGHT;
    },

    setTheme(theme: string): void {
      if (typeof window === 'undefined') return;

      const validTheme = [this.LIGHT, this.DARK].includes(theme) ? theme : this.LIGHT;

      // Set data-theme attribute on HTML element
      document.documentElement.setAttribute('data-theme', validTheme);

      // Save to localStorage
      try {
        localStorage.setItem(this.STORAGE_KEY, validTheme);
      } catch (e) {
        console.warn('Could not save theme preference:', e);
      }

      // Dispatch custom event for other components to listen to
      window.dispatchEvent(
        new CustomEvent('themechange', { detail: { theme: validTheme } })
      );

      // Update body class for CSS specificity
      document.body.classList.remove(this.LIGHT, this.DARK);
      document.body.classList.add(validTheme);

      console.log(`✅ Theme switched to: ${validTheme}`);
    },

    toggleTheme(): void {
      const currentTheme = this.getCurrentTheme();
      const newTheme = currentTheme === this.DARK ? this.LIGHT : this.DARK;
      this.setTheme(newTheme);
    },

    getCurrentTheme(): string {
      if (typeof window === 'undefined') return this.LIGHT;
      const theme = document.documentElement.getAttribute('data-theme');
      return theme || this.getSystemTheme();
    },

    init(): void {
      if (typeof window === 'undefined') return;

      // Get saved theme or system preference
      const savedTheme = this.getSavedTheme();
      const preferredTheme = savedTheme || this.getSystemTheme();

      // Apply theme
      this.setTheme(preferredTheme);

      // Listen for system theme changes (if no manual override)
      if (window.matchMedia) {
        window
          .matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', (e) => {
            const saved = this.getSavedTheme();
            if (!saved) {
              this.setTheme(e.matches ? this.DARK : this.LIGHT);
            }
          });
      }
    },
  };

  // Initialize on creation
  manager.init();

  return manager;
};

// Create singleton instance
let themeManagerInstance: ThemeManager | null = null;

export const getThemeManager = (): ThemeManager => {
  if (!themeManagerInstance && typeof window !== 'undefined') {
    themeManagerInstance = createThemeManager();
  }
  return themeManagerInstance!;
};