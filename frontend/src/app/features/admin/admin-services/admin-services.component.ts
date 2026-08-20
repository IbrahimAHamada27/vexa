import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceService } from '../../../core/services/service.service';
import { MedicalService } from '../../../core/models/service.model';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="admin-services-page">
      <header class="page-header">
        <div>
          <h1>Services Management</h1>
          <p class="subtitle">Manage procedures, diagnostic tests, and pricing catalogue.</p>
        </div>
        <button type="button" class="btn btn-primary" (click)="openAddModal()">➕ Add Service</button>
      </header>

      @if (isLoading()) {
        <div class="state-card">Loading services catalogue...</div>
      } @else if (services().length === 0) {
        <div class="state-card">
          <p>No services have been added yet.</p>
          <button type="button" class="btn btn-primary" (click)="openAddModal()">Add Service</button>
        </div>
      } @else {
        <div class="table-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Category</th>
                <th>Duration</th>
                <th>Price</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (srv of services(); track srv.id) {
                <tr>
                  <td>
                    <strong>{{ srv.name }}</strong>
                    <p class="desc-sub">{{ srv.description }}</p>
                  </td>
                  <td>
                    <span class="cat-badge">{{ srv.category }}</span>
                  </td>
                  <td>⏱ {{ srv.durationMinutes }} min</td>
                  <td><strong>{{ srv.price }} {{ srv.currency }}</strong></td>
                  <td class="text-right actions-cell">
                    <button type="button" class="btn-sm btn-outline" (click)="editService(srv)">Edit</button>
                    <button type="button" class="btn-sm btn-danger" (click)="confirmDelete(srv)">Delete</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <!-- MODAL FORM -->
      @if (showModal()) {
        <div class="modal-backdrop">
          <div class="modal-card">
            <h3>{{ editingId() ? 'Edit Service' : 'Add Medical Service' }}</h3>
            <form [formGroup]="serviceForm" (ngSubmit)="saveService()">
              <div class="form-grid">
                <div class="form-group full-width">
                  <label for="name">Service Name *</label>
                  <input id="name" type="text" formControlName="name" placeholder="e.g. Echocardiogram" />
                </div>

                <div class="form-group">
                  <label for="category">Category *</label>
                  <input id="category" type="text" formControlName="category" placeholder="e.g. Diagnostic" />
                </div>

                <div class="form-group">
                  <label for="duration">Duration (Minutes) *</label>
                  <input id="duration" type="number" formControlName="durationMinutes" placeholder="30" />
                </div>

                <div class="form-group full-width">
                  <label for="price">Price (EGP) *</label>
                  <input id="price" type="number" formControlName="price" placeholder="500" />
                </div>

                <div class="form-group full-width">
                  <label for="desc">Description *</label>
                  <textarea id="desc" rows="3" formControlName="description" placeholder="Summary of what the procedure includes..."></textarea>
                </div>
              </div>

              <div class="modal-actions">
                <button type="button" class="btn btn-outline" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="serviceForm.invalid">Save Service</button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- DELETE CONFIRMATION -->
      @if (deletingService()) {
        <div class="modal-backdrop">
          <div class="modal-card">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{{ deletingService()?.name }}</strong>?</p>
            <div class="modal-actions">
              <button type="button" class="btn btn-outline" (click)="deletingService.set(null)">Cancel</button>
              <button type="button" class="btn btn-danger" (click)="deleteService()">Delete</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-services-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .page-header h1 {
      font-size: 1.6rem;
      font-weight: 800;
      margin: 0 0 0.2rem 0;
    }

    .subtitle { color: var(--color-muted); margin: 0; }

    .state-card {
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      padding: 3rem;
      text-align: center;
      color: var(--color-muted);
    }

    .table-card {
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 16px;
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .data-table th, .data-table td {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--color-border);
    }

    .data-table th {
      background-color: var(--color-background);
      font-size: 0.8rem;
      text-transform: uppercase;
      color: var(--color-muted);
    }

    .desc-sub {
      font-size: 0.8rem;
      color: var(--color-muted);
      margin: 0.2rem 0 0 0;
    }

    .cat-badge {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-primary);
      background-color: rgba(13, 137, 236, 0.1);
      padding: 0.2rem 0.6rem;
      border-radius: 20px;
    }

    .text-right { text-align: right; }
    .actions-cell { display: flex; gap: 0.5rem; justify-content: flex-end; }

    .btn {
      padding: 0.6rem 1.2rem;
      font-size: 0.9rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      border: 1px solid transparent;
    }
    .btn-primary { background-color: var(--color-primary); color: #fff; }
    .btn-outline { background-color: transparent; border-color: var(--color-border); color: var(--color-text); }
    .btn-danger { background-color: #ef4444; color: #fff; }

    .btn-sm {
      padding: 0.35rem 0.75rem;
      font-size: 0.8rem;
      border-radius: 6px;
      cursor: pointer;
    }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    }

    .modal-card {
      background-color: var(--color-surface);
      border-radius: 16px;
      padding: 2rem;
      width: 100%;
      max-width: 520px;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .modal-card h3 { margin: 0; }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .full-width { grid-column: span 2; }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .form-group label { font-size: 0.85rem; font-weight: 600; }
    .form-group input, .form-group textarea {
      padding: 0.6rem 0.85rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      font-family: inherit;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1rem;
    }
  `]
})
export class AdminServicesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly serviceService = inject(ServiceService);

  isLoading = signal(true);
  services = signal<MedicalService[]>([]);
  showModal = signal(false);
  editingId = signal<string | null>(null);
  deletingService = signal<MedicalService | null>(null);

  serviceForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    category: ['Diagnostic', Validators.required],
    durationMinutes: [30, [Validators.required, Validators.min(5)]],
    price: [500, [Validators.required, Validators.min(0)]],
    description: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.isLoading.set(true);
    this.serviceService.getServices().subscribe({
      next: (res) => {
        if (res.data) {
          this.services.set(res.data);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  openAddModal(): void {
    this.editingId.set(null);
    this.serviceForm.reset({
      category: 'Diagnostic',
      durationMinutes: 30,
      price: 500
    });
    this.showModal.set(true);
  }

  editService(srv: MedicalService): void {
    this.editingId.set(srv.id);
    this.serviceForm.patchValue({
      name: srv.name,
      category: srv.category,
      durationMinutes: srv.durationMinutes,
      price: srv.price,
      description: srv.description
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveService(): void {
    if (this.serviceForm.invalid) return;

    const val = this.serviceForm.value;
    const currentId = this.editingId();

    if (currentId) {
      this.services.update(list => list.map(s => s.id === currentId ? {
        ...s,
        name: val.name,
        category: val.category,
        durationMinutes: Number(val.durationMinutes),
        price: Number(val.price),
        description: val.description
      } : s));
    } else {
      const newSrv: MedicalService = {
        id: `srv-${Date.now()}`,
        organizationId: 'org-1',
        name: val.name,
        category: val.category,
        description: val.description,
        price: Number(val.price),
        currency: 'EGP',
        durationMinutes: Number(val.durationMinutes)
      };
      this.services.update(list => [...list, newSrv]);
    }

    this.closeModal();
  }

  confirmDelete(srv: MedicalService): void {
    this.deletingService.set(srv);
  }

  deleteService(): void {
    const target = this.deletingService();
    if (target) {
      this.services.update(list => list.filter(s => s.id !== target.id));
      this.deletingService.set(null);
    }
  }
}
