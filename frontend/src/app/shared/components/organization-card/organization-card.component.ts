import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Organization } from '../../../core/models/organization.model';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-organization-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="org-card">
      <div class="card-header">
        <div class="org-icon">
          <span>{{ getInitials(organization().name) }}</span>
        </div>
        <div class="header-content">
          <div class="type-badge">{{ formatType(organization().type) }}</div>
          <h3 class="org-name">
            {{ organization().name }}
            @if (organization().isVerified) {
              <span class="verified-icon" title="Verified Hospital Node">✓</span>
            }
          </h3>
          <div class="rating-row">
            <span class="star">★</span>
            <span class="rating-score">{{ organization().rating || 4.9 }}</span>
            <span class="review-count">({{ organization().reviewCount || 120 }} {{ langService.t('reviews') }})</span>
          </div>
        </div>
      </div>

      <div class="card-body">
        <p class="org-location">📍 {{ organization().city }} · {{ organization().address }}</p>
        <p class="org-desc">{{ organization().description }}</p>
      </div>

      <div class="card-footer">
        <a [routerLink]="['/organizations', organization().id]" class="btn-card">{{ langService.t('viewOrgProfile') }}</a>
      </div>
    </div>
  `,
  styles: [`
    .org-card {
      background: var(--bg-glass);
      backdrop-filter: blur(16px);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      height: 100%;
      box-shadow: var(--shadow-card);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .org-card:hover {
      border-color: var(--color-border-glow);
      transform: translateY(-4px);
      box-shadow: var(--shadow-glow);
    }

    .card-header {
      display: flex;
      gap: 1.25rem;
      align-items: flex-start;
      margin-bottom: 1.25rem;
    }

    .org-icon {
      width: 54px;
      height: 54px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.3rem;
      flex-shrink: 0;
      box-shadow: var(--shadow-glow);
    }

    .header-content {
      flex: 1;
    }

    .type-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-primary);
      background: var(--color-primary-glow);
      border: 1px solid var(--color-border-glow);
      padding: 0.25rem 0.7rem;
      border-radius: var(--radius-pill);
      margin-bottom: 0.35rem;
    }

    .org-name {
      font-size: 1.2rem;
      font-weight: 800;
      margin: 0.2rem 0;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--color-text-main);
    }

    .verified-icon {
      background: #10b981;
      color: white;
      font-size: 0.65rem;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .rating-row {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.85rem;
    }

    .star {
      color: #f59e0b;
    }

    .rating-score {
      font-weight: 700;
      color: var(--color-text-main);
    }

    .review-count {
      color: var(--color-text-subtle);
    }

    .card-body {
      flex: 1;
      margin-bottom: 1.5rem;
    }

    .org-location {
      font-size: 0.875rem;
      color: var(--color-text-muted);
      margin-bottom: 0.6rem;
    }

    .org-desc {
      font-size: 0.925rem;
      color: var(--color-text-muted);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-footer {
      border-top: 1px solid var(--color-border);
      padding-top: 1.25rem;
    }

    .btn-card {
      display: inline-block;
      width: 100%;
      text-align: center;
      background: var(--bg-card);
      color: var(--color-primary);
      border: 1px solid var(--color-border);
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      font-weight: 700;
      font-size: 0.9rem;
      transition: all 0.25s ease;
    }

    .btn-card:hover {
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
      color: #ffffff;
      border-color: var(--color-primary);
      box-shadow: var(--shadow-glow);
      text-decoration: none;
    }
  `]
})
export class OrganizationCardComponent {
  readonly organization = input.required<Organization>();
  readonly langService = inject(LanguageService);

  getInitials(name: string): string {
    if (!name) return 'VX';
    return name
      .split(' ')
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }

  formatType(type: string): string {
    const isAr = this.langService.currentLang() === 'ar';
    switch (type?.toUpperCase()) {
      case 'HOSPITAL': return isAr ? 'مستشفى خاص' : 'Private Hospital';
      case 'CLINIC': return isAr ? 'عيادة تخصصية' : 'Specialized Clinic';
      case 'MEDICAL_CENTER': return isAr ? 'مركز طبي' : 'Medical Center';
      default: return isAr ? 'منشأة معتمدة' : 'Verified Node';
    }
  }
}
