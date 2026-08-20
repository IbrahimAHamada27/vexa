import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-container">
      <aside class="admin-sidebar" [class.open]="isMobileOpen()">
        <div class="sidebar-header">
          <div class="brand-box">
            <span class="sidebar-logo">VEXA</span>
            <span class="badge">Admin</span>
          </div>
          <button type="button" class="mobile-close" (click)="isMobileOpen.set(false)">&times;</button>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMobile()">
            <span class="icon">📊</span> Dashboard
          </a>
          <a routerLink="/admin/organization" routerLinkActive="active" (click)="closeMobile()">
            <span class="icon">🏥</span> Organization Profile
          </a>
          <a routerLink="/admin/departments" routerLinkActive="active" (click)="closeMobile()">
            <span class="icon">📁</span> Departments
          </a>
          <a routerLink="/admin/doctors" routerLinkActive="active" (click)="closeMobile()">
            <span class="icon">👨‍⚕️</span> Doctors
          </a>
          <a routerLink="/admin/services" routerLinkActive="active" (click)="closeMobile()">
            <span class="icon">💉</span> Medical Services
          </a>
          <a routerLink="/admin/appointments" routerLinkActive="active" (click)="closeMobile()">
            <span class="icon">📅</span> Appointments
          </a>
          <a routerLink="/" class="back-link">
            <span class="icon">←</span> Back to Public Site
          </a>
        </nav>
      </aside>

      <div class="admin-body">
        <header class="admin-top-bar">
          <button type="button" class="mobile-toggle" (click)="isMobileOpen.set(true)">☰ Menu</button>
          <h2>Organization Portal</h2>
          <div class="org-context">
            <span class="live-status">● Live Demo Mode</span>
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
    }

    .admin-sidebar {
      width: 260px;
      background-color: #0f172a;
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
      z-index: 1000;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
    }

    .brand-box {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .sidebar-logo {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--color-primary);
    }

    .badge {
      background-color: var(--color-primary);
      color: #fff;
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      text-transform: uppercase;
      font-weight: 700;
    }

    .mobile-close {
      display: none;
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 1.5rem;
      cursor: pointer;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .sidebar-nav a {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #94a3b8;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.95rem;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .sidebar-nav a:hover,
    .sidebar-nav a.active {
      color: #ffffff;
      background-color: #1e293b;
    }

    .sidebar-nav a.active {
      border-left: 4px solid var(--color-primary);
    }

    .back-link {
      margin-top: 2rem;
      border-top: 1px solid #334155;
      padding-top: 1rem !important;
      color: #64748b !important;
    }

    .back-link:hover {
      color: #ffffff !important;
    }

    .admin-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: var(--color-background);
    }

    .admin-top-bar {
      background-color: var(--color-surface);
      padding: 1.25rem 2rem;
      border-bottom: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .admin-top-bar h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
    }

    .mobile-toggle {
      display: none;
      background: none;
      border: 1px solid var(--color-border);
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
    }

    .live-status {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--color-success);
      background-color: rgba(16, 185, 129, 0.1);
      padding: 0.3rem 0.75rem;
      border-radius: 20px;
    }

    .admin-main-content {
      padding: 2rem;
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
        left: -280px;
        transition: left 0.3s ease;
      }

      .admin-sidebar.open {
        left: 0;
      }
    }
  `]
})
export class AdminLayoutComponent {
  readonly isMobileOpen = signal(false);

  closeMobile(): void {
    this.isMobileOpen.set(false);
  }
}
