import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'vexa_theme_mode';

  // Theme signal: default to 'light' as requested
  readonly currentTheme = signal<ThemeMode>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const theme = this.currentTheme();
      this.applyThemeToDocument(theme);
    });
  }

  toggleTheme(): void {
    const nextTheme: ThemeMode = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.currentTheme.set(nextTheme);
    localStorage.setItem(this.THEME_KEY, nextTheme);
  }

  setTheme(theme: ThemeMode): void {
    this.currentTheme.set(theme);
    localStorage.setItem(this.THEME_KEY, theme);
  }

  private getInitialTheme(): ThemeMode {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.THEME_KEY) as ThemeMode | null;
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    }
    return 'light'; // Light mode is primary default
  }

  private applyThemeToDocument(theme: ThemeMode): void {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
      html.classList.add('dark');
    } else {
      html.setAttribute('data-theme', 'light');
      html.classList.remove('dark');
    }
  }
}
