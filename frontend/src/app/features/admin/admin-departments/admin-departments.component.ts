import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartmentService } from '../../../core/services/department.service';
import { Department } from '../../../core/models/department.model';

@Component({
  selector: 'app-admin-departments',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="admin-depts-page">
      <header class="page-header">
        <div>
          <h1>Departments Management</h1>
          <p class="subtitle">Organize and publish specialized medical units.</p>
        </div>
        <button type="button" class="btn btn-primary" (click)="openAddModal()">➕ Add Department</button>
      </header>

      @if (isLoading()) {
        <div class="state-card">Loading departments...</div>
      } @else if (departments().length === 0) {
        <div class="state-card">
          <p>No departments have been added yet.</p>
          <button type="button" class="btn btn-primary" (click)="openAddModal()">Add Department</button>
        </div>
      } @else {
        <div class="table-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Description</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (dept of departments(); track dept.id) {
                <tr>
                  <td>
                    <strong>{{ dept.name }}</strong>
                  </td>
                  <td>{{ dept.description }}</td>
                  <td class="text-right actions-cell">
                    <button type="button" class="btn-sm btn-outline" (click)="editDepartment(dept)">Edit</button>
                    <button type="button" class="btn-sm btn-danger" (click)="confirmDelete(dept)">Delete</button>
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
            <h3>{{ editingId() ? 'Edit Department' : 'Add New Department' }}</h3>
            <form [formGroup]="deptForm" (ngSubmit)="saveDepartment()">
              <div class="form-group">
                <label for="name">Department Name *</label>
                <input id="name" type="text" formControlName="name" placeholder="e.g. Cardiology" />
              </div>
              <div class="form-group">
                <label for="desc">Description *</label>
                <textarea id="desc" rows="3" formControlName="description" placeholder="Summary of services offered in this department..."></textarea>
              </div>

              <div class="modal-actions">
                <button type="button" class="btn btn-outline" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="deptForm.invalid">Save Department</button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- DELETE CONFIRMATION -->
      @if (deletingDept()) {
        <div class="modal-backdrop">
          <div class="modal-card">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{{ deletingDept()?.name }}</strong>?</p>
            <div class="modal-actions">
              <button type="button" class="btn btn-outline" (click)="deletingDept.set(null)">Cancel</button>
              <button type="button" class="btn btn-danger" (click)="deleteDepartment()">Delete</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-depts-page {
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

    .subtitle {
      color: var(--color-muted);
      margin: 0;
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

    .data-table th,
    .data-table td {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--color-border);
    }

    .data-table th {
      background-color: var(--color-background);
      font-size: 0.8rem;
      text-transform: uppercase;
      color: var(--color-muted);
    }

    .text-right {
      text-align: right;
    }

    .actions-cell {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }

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
      max-width: 480px;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .modal-card h3 { margin: 0; }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 1rem;
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
export class AdminDepartmentsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly deptService = inject(DepartmentService);

  isLoading = signal(true);
  departments = signal<Department[]>([]);
  showModal = signal(false);
  editingId = signal<string | null>(null);
  deletingDept = signal<Department | null>(null);

  deptForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.isLoading.set(true);
    this.deptService.getDepartments().subscribe({
      next: (res) => {
        if (res.data) {
          this.departments.set(res.data);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  openAddModal(): void {
    this.editingId.set(null);
    this.deptForm.reset();
    this.showModal.set(true);
  }

  editDepartment(dept: Department): void {
    this.editingId.set(dept.id);
    this.deptForm.patchValue({
      name: dept.name,
      description: dept.description
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveDepartment(): void {
    if (this.deptForm.invalid) return;

    const val = this.deptForm.value;
    const currentId = this.editingId();

    if (currentId) {
      this.departments.update(list => list.map(d => d.id === currentId ? { ...d, name: val.name, description: val.description } : d));
    } else {
      const newDept: Department = {
        id: `dept-${Date.now()}`,
        organizationId: 'org-1',
        name: val.name,
        description: val.description
      };
      this.departments.update(list => [...list, newDept]);
    }

    this.closeModal();
  }

  confirmDelete(dept: Department): void {
    this.deletingDept.set(dept);
  }

  deleteDepartment(): void {
    const target = this.deletingDept();
    if (target) {
      this.departments.update(list => list.filter(d => d.id !== target.id));
      this.deletingDept.set(null);
    }
  }
}
