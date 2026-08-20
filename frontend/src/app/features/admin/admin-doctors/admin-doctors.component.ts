import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { DoctorService } from '../../../core/services/doctor.service';
import { Doctor } from '../../../core/models/doctor.model';
import { ApiResponse, PaginatedData } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-admin-doctors',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  template: `
    <div class="admin-doctors-page">
      <header class="page-header">
        <div>
          <h1>Doctors Management</h1>
          <p class="subtitle">Manage medical specialists, consultation fees, and profile availability.</p>
        </div>
        <button type="button" class="btn btn-primary" (click)="openAddModal()">➕ Add Doctor</button>
      </header>

      <!-- FILTER BAR -->
      <div class="filter-bar">
        <input
          type="text"
          placeholder="Filter doctors by name or specialty..."
          [ngModel]="filterQuery()"
          (ngModelChange)="filterQuery.set($event)"
          class="filter-input"
        />
        @if (filterQuery()) {
          <button type="button" class="btn-clear" (click)="filterQuery.set('')">&times;</button>
        }
      </div>

      @if (isLoading()) {
        <div class="state-card">Loading medical staff directory...</div>
      } @else if (filteredDoctors().length === 0) {
        <div class="state-card">
          <p>No doctors found matching your filter criteria.</p>
          <button type="button" class="btn btn-primary" (click)="openAddModal()">Add Doctor</button>
        </div>
      } @else {
        <div class="table-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Specialty</th>
                <th>Experience</th>
                <th>Consultation Fee</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (doc of filteredDoctors(); track doc.id) {
                <tr>
                  <td>
                    <strong>{{ doc.title }} {{ doc.name }}</strong>
                  </td>
                  <td>
                    <span class="specialty-badge">{{ doc.specialty }}</span>
                  </td>
                  <td>{{ doc.experienceYears }} Years</td>
                  <td><strong>{{ doc.consultationFee }} {{ doc.currency }}</strong></td>
                  <td class="text-right actions-cell">
                    <button type="button" class="btn-sm btn-outline" (click)="editDoctor(doc)">Edit</button>
                    <button type="button" class="btn-sm btn-danger" (click)="confirmDelete(doc)">Delete</button>
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
            <h3>{{ editingId() ? 'Edit Doctor Profile' : 'Add New Doctor' }}</h3>
            <form [formGroup]="doctorForm" (ngSubmit)="saveDoctor()">
              <div class="form-grid">
                <div class="form-group">
                  <label for="title">Title *</label>
                  <select id="title" formControlName="title">
                    <option value="Dr.">Dr.</option>
                    <option value="Prof. Dr.">Prof. Dr.</option>
                    <option value="Consultant">Consultant</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="name">Full Name *</label>
                  <input id="name" type="text" formControlName="name" placeholder="e.g. Sarah Mansour" />
                </div>

                <div class="form-group full-width">
                  <label for="specialty">Specialty *</label>
                  <input id="specialty" type="text" formControlName="specialty" placeholder="e.g. Cardiology" />
                </div>

                <div class="form-group">
                  <label for="exp">Experience (Years) *</label>
                  <input id="exp" type="number" formControlName="experienceYears" placeholder="10" />
                </div>

                <div class="form-group">
                  <label for="fee">Consultation Fee (EGP) *</label>
                  <input id="fee" type="number" formControlName="consultationFee" placeholder="400" />
                </div>

                <div class="form-group full-width">
                  <label for="bio">Biography *</label>
                  <textarea id="bio" rows="3" formControlName="bio" placeholder="Brief summary of qualifications and experience..."></textarea>
                </div>
              </div>

              <div class="modal-actions">
                <button type="button" class="btn btn-outline" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="doctorForm.invalid">Save Doctor Profile</button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- DELETE CONFIRMATION -->
      @if (deletingDoc()) {
        <div class="modal-backdrop">
          <div class="modal-card">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{{ deletingDoc()?.name }}</strong>?</p>
            <div class="modal-actions">
              <button type="button" class="btn btn-outline" (click)="deletingDoc.set(null)">Cancel</button>
              <button type="button" class="btn btn-danger" (click)="deleteDoctor()">Delete</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-doctors-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .page-header h1 {
      font-size: 1.6rem;
      font-weight: 800;
      margin: 0 0 0.2rem 0;
    }

    .subtitle { color: var(--color-muted); margin: 0; }

    .filter-bar {
      position: relative;
      max-width: 400px;
    }

    .filter-input {
      width: 100%;
      padding: 0.65rem 2rem 0.65rem 1rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      font-family: inherit;
      font-size: 0.9rem;
    }

    .btn-clear {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      font-size: 1.2rem;
      color: var(--color-muted);
      cursor: pointer;
    }

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

    .specialty-badge {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-secondary);
      background-color: rgba(15, 159, 125, 0.1);
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
      max-width: 560px;
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
    .form-group input, .form-group select, .form-group textarea {
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
export class AdminDoctorsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly doctorService = inject(DoctorService);

  isLoading = signal(true);
  filterQuery = signal('');
  doctors = signal<Doctor[]>([]);
  showModal = signal(false);
  editingId = signal<string | null>(null);
  deletingDoc = signal<Doctor | null>(null);

  filteredDoctors = computed(() => {
    const q = this.filterQuery().toLowerCase().trim();
    if (!q) return this.doctors();
    return this.doctors().filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.specialty.toLowerCase().includes(q)
    );
  });

  doctorForm: FormGroup = this.fb.group({
    title: ['Dr.', Validators.required],
    name: ['', Validators.required],
    specialty: ['', Validators.required],
    experienceYears: [10, [Validators.required, Validators.min(1)]],
    consultationFee: [400, [Validators.required, Validators.min(0)]],
    bio: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.isLoading.set(true);
    this.doctorService.getDoctors().subscribe({
      next: (res: ApiResponse<PaginatedData<Doctor>>) => {
        if (res.data?.items?.length) {
          this.doctors.set(res.data.items);
        } else {
          this.doctors.set(this.getFallbackDoctors());
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.doctors.set(this.getFallbackDoctors());
        this.isLoading.set(false);
      }
    });
  }

  openAddModal(): void {
    this.editingId.set(null);
    this.doctorForm.reset({
      title: 'Dr.',
      experienceYears: 10,
      consultationFee: 400
    });
    this.showModal.set(true);
  }

  editDoctor(doc: Doctor): void {
    this.editingId.set(doc.id);
    this.doctorForm.patchValue({
      title: doc.title || 'Dr.',
      name: doc.name,
      specialty: doc.specialty,
      experienceYears: doc.experienceYears,
      consultationFee: doc.consultationFee,
      bio: doc.bio
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveDoctor(): void {
    if (this.doctorForm.invalid) return;

    const val = this.doctorForm.value;
    const currentId = this.editingId();

    if (currentId) {
      this.doctors.update(list => list.map(d => d.id === currentId ? {
        ...d,
        title: val.title,
        name: val.name,
        specialty: val.specialty,
        experienceYears: Number(val.experienceYears),
        consultationFee: Number(val.consultationFee),
        bio: val.bio
      } : d));
    } else {
      const newDoc: Doctor = {
        id: `doc-${Date.now()}`,
        organizationId: 'org-1',
        departmentId: 'dept-1',
        name: val.name,
        title: val.title,
        specialty: val.specialty,
        bio: val.bio,
        experienceYears: Number(val.experienceYears),
        languages: ['English', 'Arabic'],
        rating: 5.0,
        reviewCount: 1,
        consultationFee: Number(val.consultationFee),
        currency: 'EGP',
        isAvailableForBooking: true
      };
      this.doctors.update(list => [...list, newDoc]);
    }

    this.closeModal();
  }

  confirmDelete(doc: Doctor): void {
    this.deletingDoc.set(doc);
  }

  deleteDoctor(): void {
    const target = this.deletingDoc();
    if (target) {
      this.doctors.update(list => list.filter(d => d.id !== target.id));
      this.deletingDoc.set(null);
    }
  }

  private getFallbackDoctors(): Doctor[] {
    return [
      {
        id: 'doc-1',
        organizationId: 'org-1',
        departmentId: 'dept-1',
        name: 'Sarah Mansour',
        title: 'Dr.',
        specialty: 'Cardiology & Cardiovascular Medicine',
        bio: 'Dr. Sarah Mansour is a Senior Consultant Cardiologist.',
        experienceYears: 14,
        languages: ['English', 'Arabic'],
        rating: 4.9,
        reviewCount: 112,
        consultationFee: 450,
        currency: 'EGP',
        isAvailableForBooking: true
      },
      {
        id: 'doc-2',
        organizationId: 'org-1',
        departmentId: 'dept-2',
        name: 'Ahmed Hassan',
        title: 'Dr.',
        specialty: 'Dermatology & Laser Surgery',
        bio: 'Dr. Ahmed Hassan is a Consultant Dermatologist.',
        experienceYears: 10,
        languages: ['English', 'Arabic', 'French'],
        rating: 4.8,
        reviewCount: 84,
        consultationFee: 350,
        currency: 'EGP',
        isAvailableForBooking: true
      }
    ];
  }
}
