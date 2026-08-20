import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Organization } from '../../../core/models/organization.model';

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
              <span class="verified-icon" title="Verified Organization">✓</span>
            }
          </h3>
          <div class="rating-row">
            <span class="star">★</span>
            <span class="rating-score">{{ organization().rating }}</span>
            <span class="review-count">({{ organization().reviewCount }} reviews)</span>
          </div>
        </div>
      </div>

      <div class="card-body">
        <p class="org-location">📍 {{ organization().city }} - {{ organization().address }}</p>
        <p class="org-desc">{{ organization().description }}</p>
      </div>

      <div class="card-footer">
        <a [routerLink]="['/organizations', organization().id]" class="btn-card">View Organization &rarr;</a>
      </div>
    </div>
  `,
  styles: [`
    .org-card {
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

    .org-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .org-icon {
      width: 50px;
      height: 50px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--color-primary), #0274cb);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .header-content {
      flex: 1;
    }

    .type-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-primary);
      background-color: rgba(13, 137, 236, 0.1);
      padding: 0.2rem 0.6rem;
      border-radius: 20px;
      margin-bottom: 0.25rem;
    }

    .org-name {
      font-size: 1.15rem;
      font-weight: 700;
      margin: 0.2rem 0;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .verified-icon {
      background-color: var(--color-success);
      color: white;
      font-size: 0.65rem;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .rating-row {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.85rem;
    }

    .star {
      color: #f59e0b;
    }

    .rating-score {
      font-weight: 700;
      color: var(--color-text);
    }

    .review-count {
      color: var(--color-muted);
    }

    .card-body {
      flex: 1;
      margin-bottom: 1.25rem;
    }

    .org-location {
      font-size: 0.85rem;
      color: var(--color-muted);
      margin-bottom: 0.5rem;
    }

    .org-desc {
      font-size: 0.9rem;
      color: #334155;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
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
export class OrganizationCardComponent {
  readonly organization = input.required<Organization>();

  getInitials(name: string): string {
    if (!name) return 'VX';
    return name
      .split(' ')
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }

  formatType(type: string): string {
    switch (type) {
      case 'hospital': return 'Hospital';
      case 'clinic': return 'Specialized Clinic';
      case 'medical_center': return 'Medical Center';
      case 'research_institute': return 'Research Institute';
      default: return type;
    }
  }
}
