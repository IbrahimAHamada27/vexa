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
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.css'
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
