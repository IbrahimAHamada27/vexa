import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment } from '../../../core/models/appointment.model';
import { ApiResponse } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-admin-appointments',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="admin-appointments-page">
      <header class="page-header">
        <div>
          <h1>Appointments Management</h1>
          <p class="subtitle">Monitor incoming patient booking requests and scheduled clinic visits.</p>
        </div>
      </header>

      <!-- FILTER BAR -->
      <div class="filter-row">
        <input
          type="text"
          placeholder="Filter by patient or doctor name..."
          [ngModel]="filterQuery()"
          (ngModelChange)="filterQuery.set($event)"
          class="filter-input"
        />

        <select
          [ngModel]="statusFilter()"
          (ngModelChange)="statusFilter.set($event)"
          class="filter-select"
        >
          <option value="">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      @if (isLoading()) {
        <div class="state-card">Loading appointment schedule...</div>
      } @else if (filteredAppointments().length === 0) {
        <div class="state-card">
          <p>No appointments found matching your filter criteria.</p>
        </div>
      } @else {
        <div class="table-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Contact</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (app of filteredAppointments(); track app.id) {
                <tr>
                  <td>
                    <strong>{{ app.patient?.firstName || 'Patient' }} {{ app.patient?.lastName || '' }}</strong>
                  </td>
                  <td>
                    <span class="contact-info">📞 {{ app.patient?.phone || 'N/A' }}</span>
                    <span class="email-info">{{ app.patient?.email || '' }}</span>
                  </td>
                  <td>{{ getDoctorName(app.doctorId) }}</td>
                  <td>
                    <strong>{{ app.appointmentDate }}</strong>
                    <p class="time-sub">⏰ {{ app.startTime }} - {{ app.endTime }}</p>
                  </td>
                  <td>
                    <span class="status-badge" [class]="app.status">
                      {{ formatStatus(app.status) }}
                    </span>
                  </td>
                  <td class="text-right actions-cell">
                    @if (app.status === 'pending') {
                      <button type="button" class="btn-sm btn-success" (click)="updateStatus(app.id, 'confirmed')">Confirm</button>
                    }
                    @if (app.status !== 'cancelled') {
                      <button type="button" class="btn-sm btn-outline-danger" (click)="updateStatus(app.id, 'cancelled')">Cancel</button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-appointments-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .page-header h1 {
      font-size: 1.6rem;
      font-weight: 800;
      margin: 0 0 0.2rem 0;
    }

    .subtitle { color: var(--color-muted); margin: 0; }

    .filter-row {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .filter-input {
      flex: 1;
      min-width: 240px;
      padding: 0.65rem 1rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      font-family: inherit;
      font-size: 0.9rem;
    }

    .filter-select {
      padding: 0.65rem 1rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      font-family: inherit;
      font-size: 0.9rem;
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

    .contact-info { display: block; font-size: 0.85rem; font-weight: 500; }
    .email-info { display: block; font-size: 0.75rem; color: var(--color-muted); }
    .time-sub { font-size: 0.8rem; color: var(--color-muted); margin: 0; }

    .status-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.65rem;
      border-radius: 20px;
      text-transform: uppercase;
    }

    .status-badge.confirmed { background-color: rgba(16, 185, 129, 0.1); color: var(--color-success); }
    .status-badge.pending { background-color: rgba(245, 158, 11, 0.1); color: #d97706; }
    .status-badge.cancelled { background-color: rgba(239, 68, 68, 0.1); color: #ef4444; }

    .text-right { text-align: right; }
    .actions-cell { display: flex; gap: 0.5rem; justify-content: flex-end; }

    .btn-sm {
      padding: 0.35rem 0.75rem;
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      border: 1px solid transparent;
    }

    .btn-success { background-color: var(--color-success); color: #fff; }
    .btn-outline-danger { background-color: transparent; border-color: #ef4444; color: #ef4444; }
  `]
})
export class AdminAppointmentsComponent implements OnInit {
  private readonly appointmentService = inject(AppointmentService);

  isLoading = signal(true);
  filterQuery = signal('');
  statusFilter = signal('');
  appointments = signal<Appointment[]>([]);

  filteredAppointments = computed(() => {
    const q = this.filterQuery().toLowerCase().trim();
    const st = this.statusFilter();

    return this.appointments().filter(app => {
      if (st && app.status !== st) return false;
      if (q) {
        const pName = `${app.patient?.firstName || ''} ${app.patient?.lastName || ''}`.toLowerCase();
        const docName = this.getDoctorName(app.doctorId).toLowerCase();
        if (!pName.includes(q) && !docName.includes(q)) return false;
      }
      return true;
    });
  });

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading.set(true);
    this.appointmentService.getAppointments().subscribe({
      next: (res: ApiResponse<Appointment[]>) => {
        if (res.data && res.data.length > 0) {
          this.appointments.set(res.data);
        } else {
          this.appointments.set(this.getFallbackAppointments());
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.appointments.set(this.getFallbackAppointments());
        this.isLoading.set(false);
      }
    });
  }

  getDoctorName(doctorId: string): string {
    const doctorsMap: Record<string, string> = {
      'doc-1': 'Dr. Sarah Mansour',
      'doc-2': 'Dr. Ahmed Hassan',
      'doc-3': 'Dr. Layla Mahmoud'
    };
    return doctorsMap[doctorId] || 'Specialist Doctor';
  }

  formatStatus(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  updateStatus(id: string, newStatus: 'confirmed' | 'cancelled'): void {
    this.appointments.update(list => list.map(a => a.id === id ? { ...a, status: newStatus } : a));
  }

  private getFallbackAppointments(): Appointment[] {
    return [
      {
        id: 'app-1',
        patientId: 'pat-1',
        patient: { id: 'pat-1', firstName: 'Mohamed', lastName: 'Ali', email: 'm.ali@example.com', phone: '+20 100 123 4567' },
        doctorId: 'doc-1',
        organizationId: 'org-1',
        slotId: 'slot-1',
        appointmentDate: '2026-08-21',
        startTime: '09:00',
        endTime: '09:30',
        status: 'confirmed',
        createdAt: '2026-08-20'
      },
      {
        id: 'app-2',
        patientId: 'pat-2',
        patient: { id: 'pat-2', firstName: 'Khaled', lastName: 'Ibrahim', email: 'k.ibrahim@example.com', phone: '+20 111 987 6543' },
        doctorId: 'doc-2',
        organizationId: 'org-1',
        slotId: 'slot-4',
        appointmentDate: '2026-08-22',
        startTime: '11:00',
        endTime: '11:30',
        status: 'pending',
        createdAt: '2026-08-20'
      }
    ];
  }
}
