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
      <!-- TOP EXECUTIVE ANNOUNCEMENT & EMERGENCY BAR -->
      <div class="top-emergency-bar">
        <div class="container emergency-bar-inner">
          <div class="emergency-contacts">
            <span class="pulse-red"></span>
            <span class="bar-label">{{ langService.currentLang() === 'ar' ? 'طوارئ واستغاثة VEXA:' : 'VEXA Emergency Network:' }}</span>
            <a href="tel:123" class="emergency-badge red">🚑 {{ langService.currentLang() === 'ar' ? 'الإسعاف 123' : 'Ambulance 123' }}</a>
            <a href="tel:137" class="emergency-badge orange">🩺 {{ langService.currentLang() === 'ar' ? 'الطوارئ الطبية 137' : 'Medical Hotline 137' }}</a>
            <a href="tel:180" class="emergency-badge dark-red">🚒 {{ langService.currentLang() === 'ar' ? 'المطافئ 180' : 'Fire Dept 180' }}</a>
          </div>
          <div class="system-status-indicator">
            <span class="status-dot-green"></span>
            <span>{{ langService.currentLang() === 'ar' ? 'شبكة المستشفيات والـ AI يعمل بكفاءة 100%' : 'All Systems & AI Services Operational' }}</span>
          </div>
        </div>
      </div>

      <!-- MAIN GLASS NAVIGATION HEADER -->
      <header class="app-header">
        <div class="container header-inner">
          <a routerLink="/" class="brand-logo" (click)="onNavClick()">
            <div class="brand-icon-wrap">
              <span class="brand-icon">❖</span>
              <span class="live-dot"></span>
            </div>
            <div class="brand-text">
              <span class="brand-name">{{ langService.t('brandName') }}</span>
              <span class="brand-tagline">{{ langService.t('brandTagline') }}</span>
            </div>
          </a>

          <!-- MAIN NAVIGATION LINKS -->
          <nav class="main-nav" [class.open]="isMobileMenuOpen()">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="onNavClick()">
              <span class="nav-icon">🏠</span>
              <span>{{ langService.t('navHome') }}</span>
            </a>
            <a routerLink="/organizations" routerLinkActive="active" (click)="onNavClick()">
              <span class="nav-icon">🏥</span>
              <span>{{ langService.t('navOrganizations') }}</span>
            </a>
            <a routerLink="/booking" routerLinkActive="active" (click)="onNavClick()">
              <span class="nav-icon">📅</span>
              <span>{{ langService.t('navBooking') }}</span>
            </a>
            <a routerLink="/faq" routerLinkActive="active" (click)="onNavClick()">
              <span class="nav-icon">💡</span>
              <span>{{ langService.t('navFaq') }}</span>
            </a>
            <a routerLink="/contact" routerLinkActive="active" (click)="onNavClick()">
              <span class="nav-icon">📞</span>
              <span>{{ langService.t('navContact') }}</span>
            </a>
            <a routerLink="/about" routerLinkActive="active" (click)="onNavClick()">
              <span class="nav-icon">📌</span>
              <span>{{ langService.t('navAbout') }}</span>
            </a>

            <div class="nav-divider-mobile"></div>

            @if (authService.isDoctor()) {
              <a routerLink="/doctor-portal" class="nav-portal-badge doctor" (click)="onNavClick()">{{ langService.t('navDoctorPortal') }}</a>
            } @else {
              <a routerLink="/admin" class="nav-portal-badge admin" (click)="onNavClick()">{{ langService.t('navAdminPortal') }}</a>
            }

            @if (authService.isLoggedIn()) {
              <button type="button" class="btn-logout-sm" (click)="logout()">{{ langService.t('navSignOut') }}</button>
            } @else {
              <a routerLink="/login" class="btn-signin-sm" (click)="onNavClick()">{{ langService.t('navSignIn') }}</a>
            }
          </nav>

          <!-- CONTROLS & MOBILE TOGGLE -->
          <div class="header-right-group">
            <button type="button" class="control-pill-btn" (click)="langService.toggleLanguage()" [title]="langService.currentLang() === 'ar' ? 'Switch to English' : 'التحويل للغة العربية'">
              @if (langService.currentLang() === 'ar') {
                <span>🇬🇧 English</span>
              } @else {
                <span>🌐 العربية</span>
              }
            </button>

            <button type="button" class="control-pill-btn theme-toggle" (click)="themeService.toggleTheme()" [title]="'Switch Mode'">
              @if (themeService.currentTheme() === 'light') {
                <span>🌙</span>
              } @else {
                <span>☀️</span>
              }
            </button>

            <button class="mobile-toggle" (click)="toggleMobileMenu()" aria-label="Toggle navigation">
              {{ isMobileMenuOpen() ? '✕' : '☰' }}
            </button>
          </div>
        </div>
      </header>

      <main class="main-content">
        <router-outlet />
      </main>

      <!-- FLOATING AI CLINICAL ASSISTANT CHAT WIDGET -->
      <app-ai-chat-widget />

      <!-- FOOTER -->
      <footer class="app-footer">
        <div class="container footer-inner">
          <div class="footer-brand">
            <div class="brand-logo" (click)="onNavClick()">
              <div class="brand-icon-wrap">
                <span class="brand-icon">❖</span>
              </div>
              <span class="footer-logo">{{ langService.t('brandName') }} Health OS</span>
            </div>
            <p>{{ langService.t('footerTagline') }}</p>
          </div>
          <div class="footer-links">
            <div class="footer-col">
              <h4>{{ langService.currentLang() === 'ar' ? 'المنصة والخدمات' : 'Platform & Services' }}</h4>
              <a routerLink="/" (click)="onNavClick()">{{ langService.t('navHome') }}</a>
              <a routerLink="/organizations" (click)="onNavClick()">{{ langService.t('navOrganizations') }}</a>
              <a routerLink="/booking" (click)="onNavClick()">{{ langService.t('navBooking') }}</a>
              <a routerLink="/faq" (click)="onNavClick()">{{ langService.t('navFaq') }}</a>
              <a routerLink="/contact" (click)="onNavClick()">{{ langService.t('navContact') }}</a>
              <a routerLink="/about" (click)="onNavClick()">{{ langService.t('navAbout') }}</a>
            </div>
            <div class="footer-col">
              <h4>{{ langService.currentLang() === 'ar' ? 'بوابات الإدارة والتحكيم' : 'Portals & Architecture' }}</h4>
              <a routerLink="/login" [queryParams]="{ targetRole: 'admin' }" (click)="onNavClick()">{{ langService.t('navAdminPortal') }}</a>
              <a routerLink="/login" [queryParams]="{ targetRole: 'doctor' }" (click)="onNavClick()">{{ langService.t('navDoctorPortal') }}</a>
              <a routerLink="/about" (click)="onNavClick()">Business Model Canvas (BMC)</a>
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

    /* TOP EMERGENCY & ANNOUNCEMENT BAR */
    .top-emergency-bar {
      background: #0f172a;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0.4rem 0;
      font-size: 0.78rem;
      color: #94a3b8;
    }

    .emergency-bar-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .emergency-contacts {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      flex-wrap: wrap;
    }

    .pulse-red {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #ef4444;
      box-shadow: 0 0 8px #ef4444;
      animation: pulseRed 1.5s infinite;
    }

    @keyframes pulseRed {
      0% { transform: scale(0.95); opacity: 0.7; }
      50% { transform: scale(1.25); opacity: 1; }
      100% { transform: scale(0.95); opacity: 0.7; }
    }

    .bar-label {
      font-weight: 700;
      color: #f1f5f9;
    }

    .emergency-badge {
      padding: 0.15rem 0.6rem;
      border-radius: var(--radius-pill);
      text-decoration: none;
      font-weight: 800;
      font-size: 0.75rem;
      transition: transform 0.2s ease;
    }

    .emergency-badge:hover {
      transform: scale(1.05);
    }

    .emergency-badge.red { background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.4); }
    .emergency-badge.orange { background: rgba(249, 115, 22, 0.2); color: #fdba74; border: 1px solid rgba(249, 115, 22, 0.4); }
    .emergency-badge.dark-red { background: rgba(225, 29, 72, 0.2); color: #fecdd3; border: 1px solid rgba(225, 29, 72, 0.4); }

    .system-status-indicator {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.75rem;
      color: #34d399;
      font-weight: 600;
    }

    .status-dot-green {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #34d399;
      box-shadow: 0 0 6px #34d399;
    }

    /* MAIN HEADER */
    .app-header {
      background: var(--bg-glass);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: var(--shadow-card);
      transition: all 0.3s ease;
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
      gap: 0.85rem;
      text-decoration: none;
      cursor: pointer;
    }

    .brand-icon-wrap {
      position: relative;
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--color-primary), #0284c7);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 800;
      box-shadow: var(--shadow-glow);
    }

    .live-dot {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #10b981;
      border: 2px solid var(--bg-card);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-size: 1.5rem;
      font-weight: 900;
      color: var(--color-text-main);
      letter-spacing: 0.04em;
      line-height: 1;
    }

    .brand-tagline {
      font-size: 0.72rem;
      color: var(--color-primary);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-top: 0.25rem;
    }

    .header-right-group {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .control-pill-btn {
      background: var(--bg-card);
      border: 1px solid var(--color-border);
      color: var(--color-text-main);
      padding: 0.45rem 0.95rem;
      border-radius: var(--radius-pill);
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.25s ease;
    }

    .control-pill-btn:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
      transform: translateY(-1px);
    }

    .mobile-toggle {
      display: none;
      background: var(--bg-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: 1.25rem;
      color: var(--color-text-main);
      padding: 0.4rem 0.75rem;
      cursor: pointer;
    }

    .main-nav {
      display: flex;
      gap: 1.35rem;
      align-items: center;
    }

    .main-nav a {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--color-text-muted);
      font-weight: 700;
      transition: all 0.25s ease;
      font-size: 0.92rem;
      padding: 0.4rem 0.6rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
    }

    .nav-icon {
      font-size: 0.95rem;
      opacity: 0.8;
    }

    .main-nav a:hover,
    .main-nav a.active {
      color: var(--color-primary);
      background: var(--color-primary-glow);
      text-decoration: none;
    }

    .nav-portal-badge {
      padding: 0.45rem 0.95rem !important;
      border-radius: var(--radius-pill) !important;
      font-size: 0.82rem !important;
      border: 1px solid var(--color-border);
    }

    .nav-portal-badge.doctor {
      background: var(--color-secondary-glow) !important;
      color: var(--color-secondary) !important;
      border-color: rgba(16, 185, 129, 0.3) !important;
    }

    .nav-portal-badge.admin {
      background: var(--color-primary-glow) !important;
      color: var(--color-primary) !important;
      border-color: var(--color-border-glow) !important;
    }

    .btn-signin-sm {
      background: linear-gradient(135deg, var(--color-primary), #0284c7) !important;
      color: #ffffff !important;
      padding: 0.5rem 1.25rem !important;
      border-radius: var(--radius-pill) !important;
      font-weight: 800 !important;
      box-shadow: var(--shadow-glow);
    }

    .btn-signin-sm:hover {
      transform: translateY(-2px);
    }

    .btn-logout-sm {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #ef4444;
      padding: 0.45rem 0.95rem;
      border-radius: var(--radius-pill);
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
    }

    .btn-logout-sm:hover {
      background: rgba(239, 68, 68, 0.3);
      color: #ffffff;
    }

    @media (max-width: 1024px) {
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
        gap: 0.85rem;
        align-items: stretch;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      }

      .main-nav.open {
        display: flex;
      }

      .btn-signin-sm, .btn-logout-sm {
        text-align: center;
        justify-content: center;
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
      font-weight: 900;
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
      cursor: pointer;
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

  onNavClick(): void {
    this.isMobileMenuOpen.set(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  logout(): void {
    this.onNavClick();
    this.authService.logout();
  }
}
