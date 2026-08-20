import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { DoctorService } from '../../core/services/doctor.service';
import { AppointmentService } from '../../core/services/appointment.service';
import { LanguageService } from '../../core/services/language.service';
import { Doctor } from '../../core/models/doctor.model';
import { Appointment, AppointmentStatus } from '../../core/models/appointment.model';
import { AvailabilitySlot } from '../../core/models/availability-slot.model';
import { ApiResponse } from '../../core/models/api-response.model';

@Component({
  selector: 'app-doctor-portal',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './doctor-portal.component.html',
  styleUrl: './doctor-portal.component.css'
})
export class DoctorPortalComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly doctorService = inject(DoctorService);
  private readonly appointmentService = inject(AppointmentService);
  readonly langService = inject(LanguageService);

  // Doctor Data
  doctor = signal<Doctor | null>(null);
  appointments = signal<Appointment[]>([]);
  slots = signal<AvailabilitySlot[]>([]);

  // Async States
  isLoading = signal(true);
  isSavingFee = signal(false);

  // Status Filter
  statusFilter = signal<string>('');

  filteredAppointments = computed(() => {
    const filter = this.statusFilter();
    if (!filter) return this.appointments();
    return this.appointments().filter(a => a.status === filter);
  });

  ngOnInit(): void {
    this.loadDoctorProfile();
    this.loadAppointments();
    this.loadAvailabilitySlots();
  }

  loadDoctorProfile(): void {
    this.doctorService.getDoctorById('doc-1').subscribe({
      next: (res: ApiResponse<Doctor>) => {
        if (res.success && res.data) {
          this.doctor.set(res.data);
        } else {
          this.doctor.set(this.getFallbackDoctor());
        }
      },
      error: () => {
        this.doctor.set(this.getFallbackDoctor());
      }
    });
  }

  loadAppointments(): void {
    this.isLoading.set(true);
    this.appointmentService.getAppointments().subscribe({
      next: (res: ApiResponse<Appointment[]>) => {
        this.isLoading.set(false);
        if (res.success && res.data?.length) {
          this.appointments.set(res.data);
        } else {
          this.appointments.set(this.getFallbackAppointments());
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.appointments.set(this.getFallbackAppointments());
      }
    });
  }

  loadAvailabilitySlots(): void {
    this.doctorService.getDoctorAvailability('doc-1').subscribe({
      next: (res: ApiResponse<AvailabilitySlot[]>) => {
        if (res.success && res.data?.length) {
          this.slots.set(res.data);
        } else {
          this.slots.set(this.getFallbackSlots());
        }
      },
      error: () => {
        this.slots.set(this.getFallbackSlots());
      }
    });
  }

  updateAppointmentStatus(id: string, newStatus: AppointmentStatus): void {
    this.appointments.update(list => list.map(a => a.id === id ? { ...a, status: newStatus } : a));
  }

  toggleSlotAvailability(slotId: string): void {
    this.slots.update(list => list.map(s => s.id === slotId ? { ...s, isBooked: !s.isBooked } : s));
  }

  logout(): void {
    this.authService.logout();
  }

  private getFallbackDoctor(): Doctor {
    return {
      id: 'doc-1',
      organizationId: 'org-1',
      departmentId: 'dept-1',
      name: 'أ.د. أحمد عبد الرحمن الحسين',
      title: 'أ.د.',
      specialty: 'استشاري أمراض القلب والأوعية الدموية والقسطرة',
      bio: 'أستاذ أمراض القلب بكلية الطب، خبرة 22 عاماً.',
      experienceYears: 22,
      languages: ['العربية', 'English'],
      rating: 4.95,
      reviewCount: 180,
      consultationFee: 450,
      currency: 'EGP',
      isAvailableForBooking: true
    };
  }

  private getFallbackAppointments(): Appointment[] {
    return [
      {
        id: 'app-1',
        patientId: 'pat-1',
        patient: { id: 'pat-1', firstName: 'محمد', lastName: 'علي سليمان', email: 'm.ali@example.com', phone: '+20 100 123 4567' },
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
        patient: { id: 'pat-2', firstName: 'خالد', lastName: 'إبراهيم', email: 'k.ibrahim@example.com', phone: '+20 111 987 6543' },
        doctorId: 'doc-1',
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

  private getFallbackSlots(): AvailabilitySlot[] {
    return [
      { id: 'slot-1', doctorId: 'doc-1', date: '2026-08-21', startTime: '09:00', endTime: '09:30', isBooked: false },
      { id: 'slot-2', doctorId: 'doc-1', date: '2026-08-21', startTime: '10:30', endTime: '11:00', isBooked: false },
      { id: 'slot-3', doctorId: 'doc-1', date: '2026-08-21', startTime: '14:00', endTime: '14:30', isBooked: false },
      { id: 'slot-4', doctorId: 'doc-1', date: '2026-08-22', startTime: '11:00', endTime: '11:30', isBooked: false }
    ];
  }
}
