import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout-container">
      <header class="app-header">
        <div class="container header-inner">
          <a routerLink="/" class="brand-logo">
            <span class="brand-name">VEXA</span>
            <span class="brand-tagline">Healthcare Discovery</span>
          </a>

          <button class="mobile-toggle" (click)="toggleMobileMenu()" aria-label="Toggle navigation">
            ☰
          </button>

          <nav class="main-nav" [class.open]="isMobileMenuOpen()">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMobileMenu()">Home</a>
            <a routerLink="/organizations" routerLinkActive="active" (click)="closeMobileMenu()">Organizations</a>
            <a routerLink="/booking" routerLinkActive="active" (click)="closeMobileMenu()">Booking</a>
            <a routerLink="/admin" class="nav-admin-link" (click)="closeMobileMenu()">Admin Portal</a>
            <a routerLink="/organizations" class="btn-primary-sm" (click)="closeMobileMenu()">Find Healthcare</a>
          </nav>
        </div>
      </header>

      <main class="main-content">
        <router-outlet />
      </main>

      <footer class="app-footer">
        <div class="container footer-inner">
          <div class="footer-brand">
            <span class="footer-logo">VEXA</span>
            <p>Empowering healthcare discovery & appointment booking across organizations, clinics, and medical specialists.</p>
          </div>
          <div class="footer-links">
            <div class="footer-col">
              <h4>Platform</h4>
              <a routerLink="/">Home</a>
              <a routerLink="/organizations">Organizations</a>
              <a routerLink="/booking">Booking</a>
            </div>
            <div class="footer-col">
              <h4>Portal</h4>
              <a routerLink="/admin">Admin Dashboard</a>
            </div>
          </div>
        </div>

        <div class="container footer-disclaimer">
          <p>
            ℹ️ <strong>Medical Disclaimer:</strong> VEXA helps you discover healthcare providers and book appointments. It does not provide medical diagnosis or treatment advice.
          </p>
        </div>

        <div class="footer-bottom">
          <div class="container">
            <p>&copy; 2026 VEXA Healthcare Discovery Platform. Built for Vibe Coding Arena.</p>
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
      background-color: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    }

    .header-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 70px;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
    }

    .brand-name {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--color-primary);
      letter-spacing: 0.05em;
    }

    .brand-tagline {
      font-size: 0.75rem;
      color: var(--color-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border-left: 1px solid var(--color-border);
      padding-left: 0.5rem;
      display: none;
    }

    @media (min-width: 640px) {
      .brand-tagline {
        display: inline-block;
      }
    }

    .mobile-toggle {
      display: none;
      background: none;
      font-size: 1.5rem;
      color: var(--color-text);
      padding: 0.4rem;
    }

    .main-nav {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .main-nav a {
      color: var(--color-text);
      font-weight: 500;
      transition: color 0.2s ease;
      font-size: 0.95rem;
    }

    .main-nav a:hover,
    .main-nav a.active {
      color: var(--color-primary);
      text-decoration: none;
    }

    .nav-admin-link {
      background-color: rgba(13, 137, 236, 0.08);
      color: var(--color-primary) !important;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      font-weight: 600 !important;
    }

    .btn-primary-sm {
      background-color: var(--color-primary);
      color: #ffffff !important;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 600 !important;
      transition: background-color 0.2s ease;
    }

    .btn-primary-sm:hover {
      background-color: var(--color-primary-hover);
    }

    @media (max-width: 768px) {
      .mobile-toggle {
        display: block;
      }

      .main-nav {
        display: none;
        position: absolute;
        top: 70px;
        left: 0;
        right: 0;
        background-color: var(--color-surface);
        flex-direction: column;
        padding: 1.5rem;
        border-bottom: 1px solid var(--color-border);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        gap: 1rem;
        align-items: stretch;
      }

      .main-nav.open {
        display: flex;
      }

      .btn-primary-sm {
        text-align: center;
      }
    }

    .main-content {
      flex: 1;
    }

    .app-footer {
      background-color: #0f172a;
      color: #94a3b8;
      padding: 3rem 0 0 0;
      margin-top: 4rem;
    }

    .footer-inner {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      padding-bottom: 2rem;
    }

    @media (min-width: 768px) {
      .footer-inner {
        grid-template-columns: 2fr 1fr;
      }
    }

    .footer-logo {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--color-primary);
      display: block;
      margin-bottom: 0.5rem;
    }

    .footer-brand p {
      max-width: 450px;
      font-size: 0.9rem;
      line-height: 1.6;
    }

    .footer-links {
      display: flex;
      gap: 3rem;
    }

    .footer-col h4 {
      color: #ffffff;
      font-size: 0.95rem;
      margin-bottom: 1rem;
    }

    .footer-col a {
      display: block;
      color: #94a3b8;
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
      transition: color 0.2s ease;
    }

    .footer-col a:hover {
      color: #ffffff;
      text-decoration: none;
    }

    .footer-disclaimer {
      border-top: 1px solid #1e293b;
      padding: 1.25rem 0;
      font-size: 0.825rem;
      color: #64748b;
    }

    .footer-disclaimer p {
      margin: 0;
      line-height: 1.5;
    }

    .footer-bottom {
      border-top: 1px solid #1e293b;
      padding: 1.5rem 0;
      font-size: 0.85rem;
      text-align: center;
    }

    .footer-bottom p {
      margin: 0;
    }
  `]
})
export class PublicLayoutComponent {
  readonly isMobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(val => !val);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
