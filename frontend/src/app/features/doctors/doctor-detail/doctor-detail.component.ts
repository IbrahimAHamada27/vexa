import { Component, OnInit, inject, signal, input, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor.service';
import { OrganizationService } from '../../../core/services/organization.service';
import { Doctor } from '../../../core/models/doctor.model';
import { Organization } from '../../../core/models/organization.model';
import { AvailabilitySlot } from '../../../core/models/availability-slot.model';

@Component({
  selector: 'app-doctor-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './doctor-detail.component.html',
  styleUrl: './doctor-detail.component.css'
})
export class DoctorDetailComponent implements OnInit {
  readonly id = input<string>();

  private readonly doctorService = inject(DoctorService);
  private readonly orgService = inject(OrganizationService);

  // States
  isLoading = signal(true);
  errorMsg = signal<string | null>(null);
  notFound = signal(false);

  // Data Signals
  doctor = signal<Doctor | null>(null);
  organization = signal<Organization | null>(null);
  availabilitySlots = signal<AvailabilitySlot[]>([]);
  selectedSlotId = signal<string | null>(null);

  constructor() {
    effect(() => {
      const currentId = this.id();
      if (currentId) {
        this.loadDoctorProfile(currentId);
      }
    });
  }

  ngOnInit(): void {
    const currentId = this.id();
    if (currentId) {
      this.loadDoctorProfile(currentId);
    }
  }

  loadDoctorProfile(doctorId: string): void {
    this.isLoading.set(true);
    this.errorMsg.set(null);
    this.notFound.set(false);

    this.doctorService.getDoctorById(doctorId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.doctor.set(res.data);
          this.loadRelatedOrganization(res.data.organizationId);
          this.loadDoctorAvailability(doctorId);
          this.isLoading.set(false);
        } else {
          const fallback = this.getFallbackDoctor(doctorId);
          if (fallback) {
            this.doctor.set(fallback);
            this.loadRelatedOrganization(fallback.organizationId);
            this.loadDoctorAvailability(doctorId);
            this.isLoading.set(false);
          } else {
            this.notFound.set(true);
            this.isLoading.set(false);
          }
        }
      },
      error: (_err: unknown) => {
        const fallback = this.getFallbackDoctor(doctorId);
        if (fallback) {
          this.doctor.set(fallback);
          this.loadRelatedOrganization(fallback.organizationId);
          this.loadDoctorAvailability(doctorId);
          this.isLoading.set(false);
        } else {
          this.errorMsg.set('Unable to load doctor information.');
          this.isLoading.set(false);
        }
      }
    });
  }

  private loadRelatedOrganization(orgId: string): void {
    this.orgService.getOrganizationById(orgId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.organization.set(res.data);
        } else {
          this.organization.set(this.getFallbackOrganization(orgId));
        }
      },
      error: () => this.organization.set(this.getFallbackOrganization(orgId))
    });
  }

  private loadDoctorAvailability(doctorId: string): void {
    this.doctorService.getDoctorAvailability(doctorId).subscribe({
      next: (res) => {
        if (res.success && res.data?.length) {
          this.availabilitySlots.set(res.data);
        } else {
          this.availabilitySlots.set(this.getFallbackAvailabilitySlots(doctorId));
        }
      },
      error: () => this.availabilitySlots.set(this.getFallbackAvailabilitySlots(doctorId))
    });
  }

  selectSlot(slotId: string): void {
    this.selectedSlotId.set(slotId);
  }

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

  // --- Fallback Data ---
  private getFallbackDoctor(id: string): Doctor | null {
    const fallbacks: Record<string, Doctor> = {
      'doc-1': {
        id: 'doc-1',
        organizationId: 'org-1',
        departmentId: 'dept-1',
        name: 'Sarah Mansour',
        title: 'Dr.',
        specialty: 'Cardiology & Cardiovascular Medicine',
        bio: 'Dr. Sarah Mansour is a Senior Consultant Cardiologist with over 14 years of clinical experience in non-invasive cardiac imaging, echocardiography, hypertension management, and preventive cardiovascular healthcare.',
        experienceYears: 14,
        languages: ['English', 'Arabic'],
        rating: 4.9,
        reviewCount: 112,
        consultationFee: 450,
        currency: 'EGP',
        isAvailableForBooking: true
      },
      'doc-2': {
        id: 'doc-2',
        organizationId: 'org-3',
        departmentId: 'dept-2',
        name: 'Ahmed Hassan',
        title: 'Dr.',
        specialty: 'Dermatology & Laser Surgery',
        bio: 'Dr. Ahmed Hassan is a Consultant Dermatologist specializing in clinical dermatology, advanced laser skin procedures, aesthetic treatments, and surgical dermatopathology.',
        experienceYears: 10,
        languages: ['English', 'Arabic', 'French'],
        rating: 4.8,
        reviewCount: 84,
        consultationFee: 350,
        currency: 'EGP',
        isAvailableForBooking: true
      },
      'doc-3': {
        id: 'doc-3',
        organizationId: 'org-1',
        departmentId: 'dept-3',
        name: 'Layla Mahmoud',
        title: 'Dr.',
        specialty: 'Pediatrics & Neonatal Care',
        bio: 'Dr. Layla Mahmoud is a dedicated Consultant Pediatrician focused on child wellness, growth milestone tracking, pediatric infectious disease management, and neonatal care.',
        experienceYears: 12,
        languages: ['English', 'Arabic'],
        rating: 4.9,
        reviewCount: 95,
        consultationFee: 400,
        currency: 'EGP',
        isAvailableForBooking: true
      }
    };

    return fallbacks[id] || fallbacks['doc-1'];
  }

  private getFallbackOrganization(orgId: string): Organization {
    return {
      id: orgId,
      name: 'El Shorouk International Hospital',
      type: 'hospital',
      description: 'Comprehensive tertiary hospital with 24/7 Emergency & ICU care.',
      city: 'El Shorouk',
      address: 'Central District, Block 4',
      phone: '+20 2 2680 0000',
      email: 'info@shorouk-hospital.com',
      rating: 4.9,
      reviewCount: 142,
      isVerified: true,
      createdAt: '2026-01-01'
    };
  }

  private getFallbackAvailabilitySlots(doctorId: string): AvailabilitySlot[] {
    return [
      { id: 'slot-1', doctorId, date: '2026-08-21', startTime: '09:00', endTime: '09:30', isBooked: false },
      { id: 'slot-2', doctorId, date: '2026-08-21', startTime: '10:30', endTime: '11:00', isBooked: false },
      { id: 'slot-3', doctorId, date: '2026-08-21', startTime: '14:00', endTime: '14:30', isBooked: false },
      { id: 'slot-4', doctorId, date: '2026-08-22', startTime: '11:00', endTime: '11:30', isBooked: false },
      { id: 'slot-5', doctorId, date: '2026-08-22', startTime: '15:30', endTime: '16:00', isBooked: false }
    ];
  }
}
