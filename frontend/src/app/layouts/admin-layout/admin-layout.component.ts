import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-container">
      <aside class="admin-sidebar" [class.open]="isMobileOpen()">
        <div class="sidebar-header">
          <div class="brand-box">
            <div class="brand-icon">❖</div>
            <div>
              <span class="sidebar-logo">VEXA</span>
              <span class="badge badge-cyan">Hospital OS</span>
            </div>
          </div>
          <button type="button" class="mobile-close" (click)="isMobileOpen.set(false)">&times;</button>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMobile()">
            <span class="icon">📊</span> Executive Dashboard
          </a>
          <a routerLink="/admin/organization" routerLinkActive="active" (click)="closeMobile()">
            <span class="icon">🏥</span> Organization Profile
          </a>
          <a routerLink="/admin/departments" routerLinkActive="active" (click)="closeMobile()">
            <span class="icon">📁</span> Clinical Departments
          </a>
          <a routerLink="/admin/doctors" routerLinkActive="active" (click)="closeMobile()">
            <span class="icon">👨‍⚕️</span> Staff Consultants
          </a>
          <a routerLink="/admin/services" routerLinkActive="active" (click)="closeMobile()">
            <span class="icon">💉</span> Medical Services
          </a>
          <a routerLink="/admin/appointments" routerLinkActive="active" (click)="closeMobile()">
            <span class="icon">📅</span> Appointments OS
          </a>
          <a routerLink="/" class="back-link">
            <span class="icon">←</span> Public Healthcare Portal
          </a>
        </nav>

        <div class="sidebar-user">
          <div class="user-meta">
            <span class="user-role">ORGANIZATION MANAGER</span>
            <span class="user-name">🏥 Hospital Admin</span>
          </div>
          <button type="button" class="btn-logout" (click)="logout()">Sign Out</button>
        </div>
      </aside>

      <div class="admin-body">
        <header class="admin-top-bar">
          <button type="button" class="mobile-toggle" (click)="isMobileOpen.set(true)">☰ Menu</button>
          <div class="header-title">
            <h2>Hospital Administration Command Center</h2>
            <span class="header-sub">VEXA Private Hospital Network OS</span>
          </div>
          <div class="header-actions">
            <button type="button" class="theme-toggle-btn" (click)="themeService.toggleTheme()" [title]="'Switch to ' + (themeService.currentTheme() === 'light' ? 'Dark' : 'Light') + ' Mode'">
              @if (themeService.currentTheme() === 'light') {
                <span>🌙 Dark</span>
              } @else {
                <span>☀️ Light</span>
              }
            </button>
            <span class="badge badge-emerald">● Enterprise Node Active</span>
          </div>
        </header>

        <main class="admin-main-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      display: flex;
      min-height: 100vh;
      background-color: var(--bg-space);
    }

    .admin-sidebar {
      width: 280px;
      background: var(--bg-card);
      border-right: 1px solid var(--color-border);
      color: var(--color-text-main);
      display: flex;
      flex-direction: column;
      padding: 1.75rem 1.25rem;
      z-index: 1000;
      box-shadow: var(--shadow-sm);
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2.5rem;
    }

    .brand-box {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .brand-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      font-weight: 800;
      box-shadow: var(--shadow-glow);
    }

    .sidebar-logo {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--color-text-main);
      letter-spacing: 0.05em;
      margin-right: 0.4rem;
    }

    .mobile-close {
      display: none;
      background: none;
      border: none;
      color: var(--color-text-muted);
      font-size: 1.5rem;
      cursor: pointer;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }

    .sidebar-nav a {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      color: var(--color-text-muted);
      padding: 0.85rem 1.1rem;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.2s ease;
      text-decoration: none;
      border: 1px solid transparent;
    }

    .sidebar-nav a:hover {
      color: var(--color-text-main);
      background: var(--bg-card-hover);
    }

    .sidebar-nav a.active {
      color: var(--color-primary);
      background: var(--color-primary-glow);
      border-color: var(--color-border-glow);
    }

    .back-link {
      margin-top: 2.5rem;
      border-top: 1px solid var(--color-border);
      padding-top: 1.25rem !important;
      color: var(--color-text-subtle) !important;
    }

    .back-link:hover {
      color: var(--color-primary) !important;
    }

    .sidebar-user {
      margin-top: auto;
      padding-top: 1.25rem;
      border-top: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .user-meta {
      display: flex;
      flex-direction: column;
    }

    .user-role {
      font-size: 0.65rem;
      color: var(--color-primary);
      font-weight: 800;
      letter-spacing: 0.1em;
    }

    .user-name {
      font-size: 0.95rem;
      color: var(--color-text-main);
      font-weight: 700;
    }

    .btn-logout {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.25);
      color: #ef4444;
      padding: 0.6rem;
      border-radius: var(--radius-md);
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
      transition: all 0.2s ease;
    }

    .btn-logout:hover {
      background: rgba(239, 68, 68, 0.25);
      color: #ffffff;
    }

    .admin-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: var(--bg-space);
    }

    .admin-top-bar {
      background: var(--bg-glass);
      backdrop-filter: blur(16px);
      padding: 1.25rem 2.5rem;
      border-bottom: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .header-title h2 {
      margin: 0;
      font-size: 1.3rem;
      font-weight: 800;
    }

    .header-sub {
      font-size: 0.8rem;
      color: var(--color-text-subtle);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .mobile-toggle {
      display: none;
      background: var(--bg-card);
      border: 1px solid var(--color-border);
      color: var(--color-text-main);
      padding: 0.5rem 1rem;
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      cursor: pointer;
    }

    .admin-main-content {
      padding: 2.5rem;
      flex: 1;
    }

    @media (max-width: 768px) {
      .mobile-toggle {
        display: block;
      }

      .mobile-close {
        display: block;
      }

      .admin-sidebar {
        position: fixed;
        top: 0;
        bottom: 0;
        left: -300px;
        transition: left 0.3s ease;
      }

      .admin-sidebar.open {
        left: 0;
      }

      .admin-main-content {
        padding: 1.25rem;
      }
    }
  `]
})
export class AdminLayoutComponent {
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  readonly isMobileOpen = signal(false);

  closeMobile(): void {
    this.isMobileOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
  }
}
