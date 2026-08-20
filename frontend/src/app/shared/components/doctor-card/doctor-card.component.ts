import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Doctor } from '../../../core/models/doctor.model';

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
          <h3 class="doctor-name">{{ doctor().title }} {{ doctor().name }}</h3>
          <p class="doctor-exp">{{ doctor().experienceYears }} Years Experience</p>
        </div>
      </div>

      <div class="card-body">
        <div class="info-row">
          <span class="label">Rating</span>
          <span class="value rating">★ {{ doctor().rating }} <small>({{ doctor().reviewCount }})</small></span>
        </div>
        <div class="info-row">
          <span class="label">Consultation Fee</span>
          <span class="value fee">{{ doctor().consultationFee }} {{ doctor().currency }}</span>
        </div>
        <div class="info-row">
          <span class="label">Languages</span>
          <span class="value lang">{{ formatLanguages(doctor().languages) }}</span>
        </div>
      </div>

      <div class="card-footer">
        <a [routerLink]="['/doctors', doctor().id]" class="btn-card">View Profile &rarr;</a>
      </div>
    </div>
  `,
  styles: [`
    .doctor-card {
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      height: 100%;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .doctor-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1.25rem;
    }

    .avatar-box {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-secondary), #0d89ec);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .doctor-meta {
      flex: 1;
    }

    .specialty-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-secondary);
      background-color: rgba(15, 159, 125, 0.1);
      padding: 0.2rem 0.6rem;
      border-radius: 20px;
      margin-bottom: 0.2rem;
    }

    .doctor-name {
      font-size: 1.1rem;
      font-weight: 700;
      margin: 0.1rem 0;
    }

    .doctor-exp {
      font-size: 0.8rem;
      color: var(--color-muted);
      margin: 0;
    }

    .card-body {
      flex: 1;
      border-top: 1px solid var(--color-border);
      padding-top: 1rem;
      margin-bottom: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
    }

    .label {
      color: var(--color-muted);
    }

    .value {
      font-weight: 600;
      color: var(--color-text);
    }

    .value.rating {
      color: #f59e0b;
    }

    .value.rating small {
      color: var(--color-muted);
      font-weight: 400;
    }

    .value.fee {
      color: var(--color-primary);
    }

    .card-footer {
      border-top: 1px solid var(--color-border);
      padding-top: 1rem;
    }

    .btn-card {
      display: inline-block;
      width: 100%;
      text-align: center;
      background-color: transparent;
      color: var(--color-primary);
      border: 1px solid var(--color-primary);
      padding: 0.6rem 1rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }

    .btn-card:hover {
      background-color: var(--color-primary);
      color: #ffffff;
      text-decoration: none;
    }
  `]
})
export class DoctorCardComponent {
  readonly doctor = input.required<Doctor>();

  formatLanguages(languages?: string[] | string): string {
    if (!languages) return 'English, Arabic';
    if (Array.isArray(languages)) return languages.join(', ');
    if (typeof languages === 'string') return languages;
    return 'English, Arabic';
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
