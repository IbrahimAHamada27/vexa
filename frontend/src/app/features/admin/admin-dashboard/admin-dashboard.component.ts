import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor.service';
import { DepartmentService } from '../../../core/services/department.service';
import { ServiceService } from '../../../core/services/service.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { OrganizationService } from '../../../core/services/organization.service';
import { ApiResponse, PaginatedData } from '../../../core/models/api-response.model';
import { Doctor } from '../../../core/models/doctor.model';
import { Department } from '../../../core/models/department.model';
import { MedicalService } from '../../../core/models/service.model';
import { Appointment } from '../../../core/models/appointment.model';
import { Organization } from '../../../core/models/organization.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="admin-dashboard">
      <header class="dashboard-header">
        <div>
          <h1 class="title">Organization Dashboard</h1>
          <p class="subtitle">Manage your healthcare presence on VEXA.</p>
        </div>
      </header>

      <!-- ORGANIZATION PROFILE COMPACT CARD -->
      <section class="org-profile-card">
        <div class="org-avatar">🏥</div>
        <div class="org-details">
          <h2>{{ currentOrg()?.name || 'El Shorouk International Hospital' }}</h2>
          <div class="org-meta">
            <span class="org-type-badge">{{ formatType(currentOrg()?.type || 'hospital') }}</span>
            <span class="org-location">📍 {{ currentOrg()?.city || 'El Shorouk' }}, {{ currentOrg()?.address || 'Central District' }}</span>
          </div>
        </div>
        <a routerLink="/admin/organization" class="btn btn-outline">Manage Organization</a>
      </section>

      <!-- STATS SUMMARY CARDS -->
      <section class="stats-grid">
        <a routerLink="/admin/doctors" class="stat-card">
          <div class="stat-icon icon-blue">👨‍⚕️</div>
          <div class="stat-info">
            <span class="stat-label">Medical Staff</span>
            <strong class="stat-value">{{ doctorsCount() !== null ? doctorsCount() : '—' }}</strong>
            <span class="stat-sub">Specialist Doctors</span>
          </div>
        </a>

        <a routerLink="/admin/departments" class="stat-card">
          <div class="stat-icon icon-green">📁</div>
          <div class="stat-info">
            <span class="stat-label">Departments</span>
            <strong class="stat-value">{{ deptsCount() !== null ? deptsCount() : '—' }}</strong>
            <span class="stat-sub">Specialized Units</span>
          </div>
        </a>

        <a routerLink="/admin/services" class="stat-card">
          <div class="stat-icon icon-purple">💉</div>
          <div class="stat-info">
            <span class="stat-label">Medical Services</span>
            <strong class="stat-value">{{ servicesCount() !== null ? servicesCount() : '—' }}</strong>
            <span class="stat-sub">Clinical Offerings</span>
          </div>
        </a>

        <a routerLink="/admin/appointments" class="stat-card">
          <div class="stat-icon icon-amber">📅</div>
          <div class="stat-info">
            <span class="stat-label">Appointments</span>
            <strong class="stat-value">{{ appointmentsCount() !== null ? appointmentsCount() : '—' }}</strong>
            <span class="stat-sub">Scheduled Visits</span>
          </div>
        </a>
      </section>

      <!-- QUICK ACTIONS -->
      <section class="section-block">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <a routerLink="/admin/doctors" class="action-card">
            <span class="action-icon">➕</span>
            <div>
              <h3>Add Doctor</h3>
              <p>View or manage medical specialists.</p>
            </div>
          </a>

          <a routerLink="/admin/departments" class="action-card">
            <span class="action-icon">➕</span>
            <div>
              <h3>Add Department</h3>
              <p>Configure specialized medical units.</p>
            </div>
          </a>

          <a routerLink="/admin/services" class="action-card">
            <span class="action-icon">➕</span>
            <div>
              <h3>Add Service</h3>
              <p>Manage clinical offerings & prices.</p>
            </div>
          </a>

          <a routerLink="/admin/appointments" class="action-card">
            <span class="action-icon">📋</span>
            <div>
              <h3>View Appointments</h3>
              <p>Check incoming patient bookings.</p>
            </div>
          </a>
        </div>
      </section>

      <!-- RECENT APPOINTMENTS -->
      <section class="section-block">
        <div class="section-header">
          <h2>Recent Appointments</h2>
          <a routerLink="/admin/appointments" class="view-all-link">View All &rarr;</a>
        </div>

        @if (recentAppointments().length === 0) {
          <div class="empty-box">
            <p>No appointments yet.</p>
            <a routerLink="/admin/appointments" class="btn btn-outline btn-sm">View Appointments</a>
          </div>
        } @else {
          <div class="recent-table-card">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                @for (app of recentAppointments(); track app.id) {
                  <tr>
                    <td>
                      <strong>{{ app.patient?.firstName || 'Patient' }} {{ app.patient?.lastName || '' }}</strong>
                    </td>
                    <td>{{ getDoctorName(app.doctorId) }}</td>
                    <td>{{ app.appointmentDate }} ({{ app.startTime }})</td>
                    <td>
                      <span class="status-badge" [class]="app.status">{{ app.status }}</span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .title {
      font-size: 1.8rem;
      font-weight: 800;
      margin: 0 0 0.25rem 0;
    }

    .subtitle {
      color: var(--color-muted);
      margin: 0;
    }

    .org-profile-card {
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 16px;
      padding: 1.5rem 2rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .org-avatar {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      background-color: rgba(13, 137, 236, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
    }

    .org-details {
      flex: 1;
      min-width: 240px;
    }

    .org-details h2 {
      font-size: 1.3rem;
      margin: 0 0 0.3rem 0;
    }

    .org-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .org-type-badge {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      background-color: var(--color-background);
      border: 1px solid var(--color-border);
      padding: 0.2rem 0.6rem;
      border-radius: 12px;
    }

    .org-location {
      font-size: 0.85rem;
      color: var(--color-muted);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
    }

    .stat-card {
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 14px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      text-decoration: none;
      color: inherit;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .stat-icon {
      width: 54px;
      height: 54px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .icon-blue { background-color: rgba(13, 137, 236, 0.1); }
    .icon-green { background-color: rgba(16, 185, 129, 0.1); }
    .icon-purple { background-color: rgba(139, 92, 246, 0.1); }
    .icon-amber { background-color: rgba(245, 158, 11, 0.1); }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 0.8rem;
      color: var(--color-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-value {
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--color-text);
      line-height: 1.1;
    }

    .stat-sub {
      font-size: 0.75rem;
      color: var(--color-muted);
    }

    .section-block h2 {
      font-size: 1.3rem;
      margin: 0;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .view-all-link {
      color: var(--color-primary);
      font-size: 0.9rem;
      font-weight: 600;
      text-decoration: none;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
      margin-top: 1rem;
    }

    .action-card {
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      padding: 1.25rem;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      text-decoration: none;
      color: inherit;
      transition: all 0.2s ease;
    }

    .action-card:hover {
      border-color: var(--color-primary);
      background-color: #f0f9ff;
    }

    .action-icon { font-size: 1.2rem; }

    .action-card h3 {
      font-size: 1rem;
      margin: 0 0 0.2rem 0;
    }

    .action-card p {
      font-size: 0.85rem;
      color: var(--color-muted);
      margin: 0;
    }

    .recent-table-card {
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 14px;
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .data-table th, .data-table td {
      padding: 0.85rem 1.25rem;
      border-bottom: 1px solid var(--color-border);
      font-size: 0.9rem;
    }

    .data-table th {
      background-color: var(--color-background);
      font-size: 0.8rem;
      text-transform: uppercase;
      color: var(--color-muted);
    }

    .status-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.6rem;
      border-radius: 12px;
      text-transform: uppercase;
    }

    .status-badge.confirmed { background-color: rgba(16, 185, 129, 0.1); color: var(--color-success); }
    .status-badge.pending { background-color: rgba(245, 158, 11, 0.1); color: #d97706; }
    .status-badge.cancelled { background-color: rgba(239, 68, 68, 0.1); color: #ef4444; }

    .empty-box {
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 14px;
      padding: 2.5rem;
      text-align: center;
      color: var(--color-muted);
    }

    .btn {
      padding: 0.65rem 1.25rem;
      font-size: 0.9rem;
      font-weight: 600;
      border-radius: 8px;
      text-decoration: none;
      cursor: pointer;
      border: 1px solid transparent;
    }

    .btn-outline { background-color: transparent; border-color: var(--color-primary); color: var(--color-primary); }
    .btn-sm { padding: 0.4rem 0.85rem; font-size: 0.8rem; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private readonly doctorService = inject(DoctorService);
  private readonly deptService = inject(DepartmentService);
  private readonly serviceService = inject(ServiceService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly orgService = inject(OrganizationService);

  currentOrg = signal<Organization | null>(null);
  doctorsCount = signal<number | null>(null);
  deptsCount = signal<number | null>(null);
  servicesCount = signal<number | null>(null);
  appointmentsCount = signal<number | null>(null);
  recentAppointments = signal<Appointment[]>([]);

  ngOnInit(): void {
    this.orgService.getOrganizationById('org-1').subscribe({
      next: (res: ApiResponse<Organization>) => {
        if (res.success && res.data) {
          this.currentOrg.set(res.data);
        }
      },
      error: () => {}
    });

    this.doctorService.getDoctors().subscribe({
      next: (res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          this.doctorsCount.set(data.length);
        } else if (data && 'items' in data && Array.isArray(data.items)) {
          this.doctorsCount.set(data.items.length);
        } else {
          this.doctorsCount.set(null);
        }
      },
      error: () => this.doctorsCount.set(null)
    });

    this.deptService.getDepartments().subscribe({
      next: (res: ApiResponse<Department[]>) => {
        this.deptsCount.set(res.data?.length ?? null);
      },
      error: () => this.deptsCount.set(null)
    });

    this.serviceService.getServices().subscribe({
      next: (res: ApiResponse<MedicalService[]>) => {
        this.servicesCount.set(res.data?.length ?? null);
      },
      error: () => this.servicesCount.set(null)
    });

    this.appointmentService.getAppointments().subscribe({
      next: (res: ApiResponse<Appointment[]>) => {
        if (res.data?.length) {
          this.appointmentsCount.set(res.data.length);
          this.recentAppointments.set(res.data.slice(0, 3));
        } else {
          this.appointmentsCount.set(0);
          this.recentAppointments.set([]);
        }
      },
      error: () => {
        this.appointmentsCount.set(null);
        this.recentAppointments.set([]);
      }
    });
  }

  formatType(type: string): string {
    const map: Record<string, string> = {
      hospital: 'Hospital',
      clinic: 'Clinic',
      medical_center: 'Medical Center',
      research_institute: 'Research Institute'
    };
    return map[type] || type;
  }

  getDoctorName(doctorId: string): string {
    const doctorsMap: Record<string, string> = {
      'doc-1': 'Dr. Sarah Mansour',
      'doc-2': 'Dr. Ahmed Hassan',
      'doc-3': 'Dr. Layla Mahmoud'
    };
    return doctorsMap[doctorId] || 'Specialist Doctor';
  }
}
