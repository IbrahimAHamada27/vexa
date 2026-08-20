import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { LanguageService } from '../../core/services/language.service';
import { AiChatWidgetComponent } from '../../shared/components/ai-chat-widget/ai-chat-widget.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AiChatWidgetComponent],
  template: `
    <div class="layout-container">
      <header class="app-header">
        <div class="container header-inner">
          <a routerLink="/" class="brand-logo">
            <div class="brand-icon">❖</div>
            <div class="brand-text">
              <span class="brand-name">{{ langService.t('brandName') }}</span>
              <span class="brand-tagline">{{ langService.t('brandTagline') }}</span>
            </div>
          </a>

          <div class="header-right-group">
            <button type="button" class="control-btn" (click)="langService.toggleLanguage()" [title]="langService.currentLang() === 'ar' ? 'Switch to English' : 'التحويل للغة العربية'">
              @if (langService.currentLang() === 'ar') {
                <span>🇬🇧 English</span>
              } @else {
                <span>🌐 العربية</span>
              }
            </button>

            <button type="button" class="control-btn" (click)="themeService.toggleTheme()" [title]="'Switch to ' + (themeService.currentTheme() === 'light' ? 'Dark' : 'Light') + ' Mode'">
              @if (themeService.currentTheme() === 'light') {
                <span>🌙 {{ langService.currentLang() === 'ar' ? 'داكن' : 'Dark' }}</span>
              } @else {
                <span>☀️ {{ langService.currentLang() === 'ar' ? 'فاتح' : 'Light' }}</span>
              }
            </button>

            <button class="mobile-toggle" (click)="toggleMobileMenu()" aria-label="Toggle navigation">
              ☰
            </button>
          </div>

          <nav class="main-nav" [class.open]="isMobileMenuOpen()">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMobileMenu()">{{ langService.t('navHome') }}</a>
            <a routerLink="/organizations" routerLinkActive="active" (click)="closeMobileMenu()">{{ langService.t('navOrganizations') }}</a>
            <a routerLink="/booking" routerLinkActive="active" (click)="closeMobileMenu()">{{ langService.t('navBooking') }}</a>

            @if (authService.isDoctor()) {
              <a routerLink="/doctor-portal" class="nav-portal-badge doctor" (click)="closeMobileMenu()">{{ langService.t('navDoctorPortal') }}</a>
            } @else {
              <a routerLink="/admin" class="nav-portal-badge admin" (click)="closeMobileMenu()">{{ langService.t('navAdminPortal') }}</a>
            }

            @if (authService.isLoggedIn()) {
              <button type="button" class="btn-logout-sm" (click)="logout()">{{ langService.t('navSignOut') }}</button>
            } @else {
              <a routerLink="/login" class="btn-signin-sm" (click)="closeMobileMenu()">{{ langService.t('navSignIn') }}</a>
            }
          </nav>
        </div>
      </header>

      <main class="main-content">
        <router-outlet />
      </main>

      <!-- FLOATING AI CLINICAL ASSISTANT CHAT WIDGET -->
      <app-ai-chat-widget />

      <footer class="app-footer">
        <div class="container footer-inner">
          <div class="footer-brand">
            <div class="brand-logo">
              <div class="brand-icon">❖</div>
              <span class="footer-logo">{{ langService.t('brandName') }} OS</span>
            </div>
            <p>{{ langService.t('footerTagline') }}</p>
          </div>
          <div class="footer-links">
            <div class="footer-col">
              <h4>{{ langService.currentLang() === 'ar' ? 'المنصة' : 'Platform' }}</h4>
              <a routerLink="/">{{ langService.t('navHome') }}</a>
              <a routerLink="/organizations">{{ langService.t('navOrganizations') }}</a>
              <a routerLink="/booking">{{ langService.t('navBooking') }}</a>
            </div>
            <div class="footer-col">
              <h4>{{ langService.currentLang() === 'ar' ? 'بوابات الإدارة' : 'Portals' }}</h4>
              <a routerLink="/login" [queryParams]="{ targetRole: 'admin' }">{{ langService.t('navAdminPortal') }}</a>
              <a routerLink="/login" [queryParams]="{ targetRole: 'doctor' }">{{ langService.t('navDoctorPortal') }}</a>
            </div>
          </div>
        </div>

        <div class="container footer-disclaimer">
          <p>{{ langService.t('footerDisclaimer') }}</p>
        </div>

        <div class="footer-bottom">
          <div class="container">
            <p>{{ langService.t('footerRights') }}</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .app-header {
      background: var(--bg-glass);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: var(--shadow-sm);
    }

    .header-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 76px;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
    }

    .brand-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      font-weight: 800;
      box-shadow: var(--shadow-glow);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--color-text-main);
      letter-spacing: 0.05em;
      line-height: 1;
    }

    .brand-tagline {
      font-size: 0.7rem;
      color: var(--color-primary);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 0.2rem;
    }

    .header-right-group {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .mobile-toggle {
      display: none;
      background: none;
      font-size: 1.5rem;
      color: var(--color-text-main);
      padding: 0.4rem;
    }

    .main-nav {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .main-nav a {
      color: var(--color-text-muted);
      font-weight: 600;
      transition: all 0.2s ease;
      font-size: 0.95rem;
    }

    .main-nav a:hover,
    .main-nav a.active {
      color: var(--color-primary);
      text-decoration: none;
    }

    .nav-portal-badge {
      padding: 0.45rem 0.9rem;
      border-radius: var(--radius-pill);
      font-size: 0.85rem !important;
      border: 1px solid var(--color-border);
    }

    .nav-portal-badge.doctor {
      background: var(--color-secondary-glow);
      color: var(--color-secondary) !important;
      border-color: rgba(16, 185, 129, 0.3);
    }

    .nav-portal-badge.admin {
      background: var(--color-primary-glow);
      color: var(--color-primary) !important;
      border-color: var(--color-border-glow);
    }

    .btn-signin-sm {
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
      color: #ffffff !important;
      padding: 0.5rem 1.25rem;
      border-radius: var(--radius-md);
      font-weight: 700 !important;
      box-shadow: var(--shadow-glow);
    }

    .btn-signin-sm:hover {
      transform: translateY(-1px);
    }

    .btn-logout-sm {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #ef4444;
      padding: 0.45rem 0.9rem;
      border-radius: var(--radius-md);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-logout-sm:hover {
      background: rgba(239, 68, 68, 0.3);
      color: #ffffff;
    }

    @media (max-width: 768px) {
      .mobile-toggle {
        display: block;
      }

      .main-nav {
        display: none;
        position: absolute;
        top: 76px;
        left: 0;
        right: 0;
        background: var(--bg-card);
        border-bottom: 1px solid var(--color-border);
        flex-direction: column;
        padding: 1.5rem;
        gap: 1rem;
        align-items: stretch;
      }

      .main-nav.open {
        display: flex;
      }

      .btn-signin-sm, .btn-logout-sm {
        text-align: center;
      }
    }

    .main-content {
      flex: 1;
    }

    .app-footer {
      background: var(--bg-card);
      border-top: 1px solid var(--color-border);
      color: var(--color-text-muted);
      padding: 4rem 0 0 0;
      margin-top: 5rem;
    }

    .footer-inner {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2.5rem;
      padding-bottom: 2.5rem;
    }

    @media (min-width: 768px) {
      .footer-inner {
        grid-template-columns: 2fr 1fr;
      }
    }

    .footer-logo {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--color-text-main);
    }

    .footer-brand p {
      max-width: 480px;
      font-size: 0.9rem;
      line-height: 1.6;
      margin-top: 0.75rem;
    }

    .footer-links {
      display: flex;
      gap: 3rem;
    }

    .footer-col h4 {
      color: var(--color-text-main);
      font-size: 0.95rem;
      margin-bottom: 1rem;
    }

    .footer-col a {
      display: block;
      color: var(--color-text-muted);
      font-size: 0.9rem;
      margin-bottom: 0.6rem;
      transition: color 0.2s ease;
    }

    .footer-col a:hover {
      color: var(--color-primary);
      text-decoration: none;
    }

    .footer-disclaimer {
      border-top: 1px solid var(--color-border);
      padding: 1.25rem 0;
      font-size: 0.85rem;
      color: var(--color-text-subtle);
    }

    .footer-disclaimer p {
      margin: 0;
      line-height: 1.5;
    }

    .footer-bottom {
      border-top: 1px solid var(--color-border);
      padding: 1.5rem 0;
      font-size: 0.85rem;
      text-align: center;
      background: var(--bg-space);
    }

    .footer-bottom p {
      margin: 0;
    }
  `]
})
export class PublicLayoutComponent {
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  readonly langService = inject(LanguageService);
  readonly isMobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(val => !val);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  logout(): void {
    this.closeMobileMenu();
    this.authService.logout();
  }
}
