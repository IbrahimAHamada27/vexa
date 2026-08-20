import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Doctor } from '../../../core/models/doctor.model';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-doctor-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="doctor-card">
      <div class="card-header">
        <div class="avatar-box">
          <span>{{ getInitials(doctor().name) }}</span>
        </div>
        <div class="doctor-meta">
          <span class="specialty-badge">{{ doctor().specialty }}</span>
          <h3 class="doctor-name">{{ doctor().title || '' }} {{ doctor().name }}</h3>
          <p class="doctor-exp">{{ doctor().experienceYears || 15 }} {{ langService.t('experienceYears') }}</p>
        </div>
      </div>

      <div class="card-body">
        <div class="info-row">
          <span class="label">{{ langService.t('rating') }}</span>
          <span class="value rating">★ {{ doctor().rating || 4.9 }} <small>({{ doctor().reviewCount || 95 }})</small></span>
        </div>
        <div class="info-row">
          <span class="label">{{ langService.t('consultationFee') }}</span>
          <span class="value fee">{{ doctor().consultationFee || 400 }} {{ doctor().currency || (langService.currentLang() === 'ar' ? 'ج.م' : 'EGP') }}</span>
        </div>
        <div class="info-row">
          <span class="label">{{ langService.t('languages') }}</span>
          <span class="value lang">{{ formatLanguages(doctor().languages) }}</span>
        </div>
      </div>

      <div class="card-footer">
        <a [routerLink]="['/doctors', doctor().id]" class="btn-card">{{ langService.t('viewProfile') }}</a>
      </div>
    </div>
  `,
  styles: [`
    .doctor-card {
      background: var(--bg-glass);
      backdrop-filter: blur(16px);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      height: 100%;
      box-shadow: var(--shadow-card);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .doctor-card:hover {
      border-color: var(--color-border-glow);
      transform: translateY(-4px);
      box-shadow: var(--shadow-glow);
    }

    .card-header {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1.25rem;
    }

    .avatar-box {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-secondary), var(--color-primary));
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.3rem;
      flex-shrink: 0;
      box-shadow: var(--shadow-glow);
    }

    .doctor-meta {
      flex: 1;
    }

    .specialty-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--color-secondary);
      background: var(--color-secondary-glow);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-pill);
      margin-bottom: 0.3rem;
    }

    .doctor-name {
      font-size: 1.15rem;
      font-weight: 800;
      margin: 0.1rem 0;
      color: var(--color-text-main);
    }

    .doctor-exp {
      font-size: 0.825rem;
      color: var(--color-text-subtle);
      margin: 0;
    }

    .card-body {
      flex: 1;
      border-top: 1px solid var(--color-border);
      padding-top: 1rem;
      margin-bottom: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
    }

    .label {
      color: var(--color-text-muted);
    }

    .value {
      font-weight: 700;
      color: var(--color-text-main);
    }

    .value.rating {
      color: #f59e0b;
    }

    .value.rating small {
      color: var(--color-text-subtle);
      font-weight: 400;
    }

    .value.fee {
      color: var(--color-primary);
      font-weight: 800;
    }

    .card-footer {
      border-top: 1px solid var(--color-border);
      padding-top: 1rem;
    }

    .btn-card {
      display: inline-block;
      width: 100%;
      text-align: center;
      background: var(--bg-card);
      color: var(--color-primary);
      border: 1px solid var(--color-border);
      padding: 0.65rem 1rem;
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
export class DoctorCardComponent {
  readonly doctor = input.required<Doctor>();
  readonly langService = inject(LanguageService);

  formatLanguages(languages?: string[] | string): string {
    if (!languages) return this.langService.currentLang() === 'ar' ? 'العربية، English' : 'English, Arabic';
    if (Array.isArray(languages)) return languages.join(', ');
    if (typeof languages === 'string') return languages;
    return this.langService.currentLang() === 'ar' ? 'العربية، English' : 'English, Arabic';
  }

  getInitials(name: string): string {
    if (!name) return 'DR';
    return name
      .split(' ')
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }
}
