import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrganizationService } from '../../../core/services/organization.service';
import { Organization } from '../../../core/models/organization.model';

@Component({
  selector: 'app-admin-organization',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="admin-org-page">
      <header class="page-header">
        <div>
          <h1>Organization Profile</h1>
          <p class="subtitle">Manage basic hospital / clinic information displayed on VEXA.</p>
        </div>
      </header>

      @if (isLoading()) {
        <div class="loading-box">Loading organization details...</div>
      } @else {
        <div class="form-container">
          @if (saveSuccess()) {
            <div class="alert alert-success">✓ Organization details updated successfully.</div>
          }

          <form [formGroup]="orgForm" (ngSubmit)="onSubmit()">
            <div class="form-grid">
              <div class="form-group full-width">
                <label for="name">Organization Name *</label>
                <input id="name" type="text" formControlName="name" placeholder="Hospital or Clinic Name" />
                @if (orgForm.get('name')?.invalid && orgForm.get('name')?.touched) {
                  <span class="field-error">Organization Name is required.</span>
                }
              </div>

              <div class="form-group">
                <label for="type">Facility Type *</label>
                <select id="type" formControlName="type">
                  <option value="hospital">Hospital</option>
                  <option value="clinic">Clinic</option>
                  <option value="medical_center">Medical Center</option>
                  <option value="research_institute">Research Institute</option>
                </select>
              </div>

              <div class="form-group">
                <label for="city">City *</label>
                <input id="city" type="text" formControlName="city" placeholder="e.g. Cairo" />
              </div>

              <div class="form-group full-width">
                <label for="address">Address *</label>
                <input id="address" type="text" formControlName="address" placeholder="Street & District address" />
              </div>

              <div class="form-group">
                <label for="phone">Phone *</label>
                <input id="phone" type="text" formControlName="phone" placeholder="+20 2 0000 0000" />
              </div>

              <div class="form-group">
                <label for="email">Email *</label>
                <input id="email" type="email" formControlName="email" placeholder="contact@facility.com" />
              </div>

              <div class="form-group full-width">
                <label for="website">Website URL (Optional)</label>
                <input id="website" type="text" formControlName="website" placeholder="https://www.facility.com" />
              </div>

              <div class="form-group full-width">
                <label for="description">Organization Description *</label>
                <textarea id="description" rows="4" formControlName="description" placeholder="Comprehensive summary of medical specialties and facility features..."></textarea>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" [disabled]="orgForm.invalid || isSaving()">
                {{ isSaving() ? 'Saving Changes...' : 'Save Profile Changes' }}
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-org-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .page-header h1 {
      font-size: 1.6rem;
      font-weight: 800;
      margin: 0 0 0.2rem 0;
    }

    .subtitle {
      color: var(--color-muted);
      margin: 0;
    }

    .loading-box {
      background-color: var(--color-surface);
      padding: 3rem;
      border-radius: 12px;
      text-align: center;
      color: var(--color-muted);
    }

    .form-container {
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 16px;
      padding: 2rem;
    }

    .alert-success {
      background-color: rgba(16, 185, 129, 0.1);
      color: var(--color-success);
      padding: 0.85rem 1.25rem;
      border-radius: 8px;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;
    }

    @media (min-width: 640px) {
      .form-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .full-width {
        grid-column: span 2;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .form-group label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-text);
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 0.65rem 0.85rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      font-family: inherit;
      font-size: 0.95rem;
    }

    .field-error {
      font-size: 0.75rem;
      color: #ef4444;
    }

    .form-actions {
      margin-top: 1.5rem;
      display: flex;
      justify-content: flex-end;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
    }

    .btn-primary {
      background-color: var(--color-primary);
      color: #fff;
      border: 1px solid var(--color-primary);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class AdminOrganizationComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly orgService = inject(OrganizationService);

  isLoading = signal(true);
  isSaving = signal(false);
  saveSuccess = signal(false);

  orgForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    type: ['hospital', Validators.required],
    city: ['', Validators.required],
    address: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    website: [''],
    description: ['', Validators.required]
  });

  ngOnInit(): void {
    this.orgService.getOrganizationById('org-1').subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.populateForm(res.data);
        } else {
          this.populateDefault();
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.populateDefault();
        this.isLoading.set(false);
      }
    });
  }

  private populateForm(org: Organization): void {
    this.orgForm.patchValue({
      name: org.name,
      type: org.type,
      city: org.city,
      address: org.address,
      phone: org.phone,
      email: org.email,
      website: org.website || '',
      description: org.description
    });
  }

  private populateDefault(): void {
    this.orgForm.patchValue({
      name: 'El Shorouk International Hospital',
      type: 'hospital',
      city: 'El Shorouk',
      address: 'Central District, Block 4',
      phone: '+20 2 2680 0000',
      email: 'info@shorouk-hospital.com',
      website: 'https://shorouk-hospital.com',
      description: 'Comprehensive tertiary hospital with 24/7 Emergency & ICU care.'
    });
  }

  onSubmit(): void {
    if (this.orgForm.invalid) return;

    this.isSaving.set(true);
    this.saveSuccess.set(false);

    // Simulate save / endpoint integration safely
    setTimeout(() => {
      this.isSaving.set(false);
      this.saveSuccess.set(true);
    }, 600);
  }
}
