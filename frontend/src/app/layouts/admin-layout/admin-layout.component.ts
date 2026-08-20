import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  readonly langService = inject(LanguageService);
  readonly isMobileOpen = signal(false);

  closeMobile(): void {
    this.isMobileOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
  }
}
