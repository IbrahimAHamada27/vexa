import { Component, OnInit, inject, signal, input, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrganizationService } from '../../../core/services/organization.service';
import { DepartmentService } from '../../../core/services/department.service';
import { ServiceService } from '../../../core/services/service.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { Organization } from '../../../core/models/organization.model';
import { Department } from '../../../core/models/department.model';
import { MedicalService } from '../../../core/models/service.model';
import { Doctor } from '../../../core/models/doctor.model';
import { DoctorCardComponent } from '../../../shared/components/doctor-card/doctor-card.component';

@Component({
  selector: 'app-organization-detail',
  standalone: true,
  imports: [RouterLink, DoctorCardComponent],
  templateUrl: './organization-detail.component.html',
  styleUrl: './organization-detail.component.css'
})
export class OrganizationDetailComponent implements OnInit {
  // Input route param from withComponentInputBinding()
  readonly id = input<string>();

  private readonly orgService = inject(OrganizationService);
  private readonly deptService = inject(DepartmentService);
  private readonly serviceService = inject(ServiceService);
  private readonly doctorService = inject(DoctorService);

  // Component States
  isLoading = signal(true);
  errorMsg = signal<string | null>(null);
  notFound = signal(false);

  // Data Signals
  organization = signal<Organization | null>(null);
  departments = signal<Department[]>([]);
  services = signal<MedicalService[]>([]);
  doctors = signal<Doctor[]>([]);

  constructor() {
    // Reload when ID input changes
    effect(() => {
      const currentId = this.id();
      if (currentId) {
        this.loadOrganizationDetails(currentId);
      }
    });
  }

  ngOnInit(): void {
    const currentId = this.id();
    if (currentId) {
      this.loadOrganizationDetails(currentId);
    }
  }

  loadOrganizationDetails(orgId: string): void {
    this.isLoading.set(true);
    this.errorMsg.set(null);
    this.notFound.set(false);

    this.orgService.getOrganizationById(orgId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.organization.set(res.data);
          this.loadRelatedData(orgId);
          this.isLoading.set(false);
        } else {
          // Check fallback dictionary
          const fallback = this.getFallbackOrganization(orgId);
          if (fallback) {
            this.organization.set(fallback);
            this.loadRelatedData(orgId);
            this.isLoading.set(false);
          } else {
            this.notFound.set(true);
            this.isLoading.set(false);
          }
        }
      },
      error: (_err: unknown) => {
        // Fallback check for local UI preview when backend endpoints are offline
        const fallback = this.getFallbackOrganization(orgId);
        if (fallback) {
          this.organization.set(fallback);
          this.loadRelatedData(orgId);
          this.isLoading.set(false);
        } else {
          this.errorMsg.set('Unable to load organization information.');
          this.isLoading.set(false);
        }
      }
    });
  }

  private loadRelatedData(orgId: string): void {
    // Load Departments
    this.deptService.getDepartments(orgId).subscribe({
      next: (res) => {
        if (res.success && res.data?.length) {
          this.departments.set(res.data);
        } else {
          this.departments.set(this.getFallbackDepartments(orgId));
        }
      },
      error: () => this.departments.set(this.getFallbackDepartments(orgId))
    });

    // Load Services
    this.serviceService.getServices(orgId).subscribe({
      next: (res) => {
        if (res.success && res.data?.length) {
          this.services.set(res.data);
        } else {
          this.services.set(this.getFallbackServices(orgId));
        }
      },
      error: () => this.services.set(this.getFallbackServices(orgId))
    });

    // Load Doctors
    this.doctorService.getDoctors(orgId).subscribe({
      next: (res) => {
        const data = res.data;
        if (Array.isArray(data) && data.length) {
          this.doctors.set(data);
        } else if (data && 'items' in data && Array.isArray(data.items) && data.items.length) {
          this.doctors.set(data.items);
        } else {
          this.doctors.set(this.getFallbackDoctors(orgId));
        }
      },
      error: () => this.doctors.set(this.getFallbackDoctors(orgId))
    });
  }

  scrollToDoctors(): void {
    const el = document.getElementById('doctors-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

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

  // --- Fallback Data for Local Demo ---
  private getFallbackOrganization(id: string): Organization | null {
    const fallbacks: Record<string, Organization> = {
      'org-1': {
        id: 'org-1',
        name: 'El Shorouk International Hospital',
        type: 'hospital',
        description: 'Comprehensive multi-specialty tertiary hospital featuring 24/7 Emergency, Cardiology, Pediatrics, Neurology & ICU facilities. Dedicated to world-class medical innovation and compassionate patient care.',
        city: 'El Shorouk',
        address: 'Central District, Block 4',
        phone: '+20 2 2680 0000',
        email: 'info@shorouk-hospital.com',
        website: 'https://shorouk-hospital.com',
        rating: 4.9,
        reviewCount: 142,
        departmentsCount: 12,
        doctorsCount: 45,
        servicesCount: 38,
        isVerified: true,
        createdAt: '2026-01-01'
      },
      'org-2': {
        id: 'org-2',
        name: 'Cairo Heart & Vascular Center',
        type: 'medical_center',
        description: 'Premier cardiovascular medical center specializing in non-invasive cardiology, coronary angiography, heart failure management, and vascular surgery.',
        city: 'Cairo',
        address: '5th Settlement, 90th Street',
        phone: '+20 2 2790 1111',
        email: 'contact@cairoheart.org',
        website: 'https://cairoheart.org',
        rating: 4.8,
        reviewCount: 98,
        departmentsCount: 4,
        doctorsCount: 18,
        servicesCount: 15,
        isVerified: true,
        createdAt: '2026-01-05'
      },
      'org-3': {
        id: 'org-3',
        name: 'Nile Skin & Laser Clinic',
        type: 'clinic',
        description: 'Advanced dermatology, cosmetic skin procedures, aesthetic laser care, and dermatopathology center staffed by European-trained consultants.',
        city: 'New Cairo',
        address: 'Medical Park 1, Office 204',
        phone: '+20 2 2810 2222',
        email: 'appointments@nileskin.com',
        rating: 4.7,
        reviewCount: 76,
        departmentsCount: 2,
        doctorsCount: 8,
        servicesCount: 12,
        isVerified: true,
        createdAt: '2026-01-10'
      }
    };

    return fallbacks[id] || fallbacks['org-1'];
  }

  private getFallbackDepartments(orgId: string): Department[] {
    return [
      { id: 'dept-1', organizationId: orgId, name: 'Cardiology & Vascular Medicine', description: 'Advanced cardiac catheterization, 24/7 chest pain unit, and preventive heart care.' },
      { id: 'dept-2', organizationId: orgId, name: 'Dermatology & Laser Surgery', description: 'Clinical skin treatments, laser therapy, and aesthetic dermatology.' },
      { id: 'dept-3', organizationId: orgId, name: 'Pediatrics & Neonatology', description: 'Comprehensive child healthcare, neonatal ICU, and developmental monitoring.' },
      { id: 'dept-4', organizationId: orgId, name: 'Neurology & Brain Health', description: 'Stroke care unit, epilepsy diagnosis, and neuro-rehabilitation.' }
    ];
  }

  private getFallbackServices(orgId: string): MedicalService[] {
    return [
      { id: 'srv-1', organizationId: orgId, name: 'Comprehensive Cardiac Screening', category: 'Cardiology', description: 'Includes ECG, Echocardiogram, Stress Test, and Consultant Evaluation.', price: 1200, currency: 'EGP', durationMinutes: 45 },
      { id: 'srv-2', organizationId: orgId, name: 'Full Skin & Dermatoscopy Exam', category: 'Dermatology', description: 'Detailed mole mapping, skin cancer screening, and dermatological diagnosis.', price: 500, currency: 'EGP', durationMinutes: 30 },
      { id: 'srv-3', organizationId: orgId, name: 'Pediatric Growth & Wellness Checkup', category: 'Pediatrics', description: 'Growth milestone evaluation, routine vaccination check, and nutritional guidance.', price: 400, currency: 'EGP', durationMinutes: 30 }
    ];
  }

  private getFallbackDoctors(orgId: string): Doctor[] {
    return [
      {
        id: 'doc-1',
        organizationId: orgId,
        departmentId: 'dept-1',
        name: 'Sarah Mansour',
        title: 'Dr.',
        specialty: 'Cardiology & Cardiovascular',
        bio: 'Senior Consultant Cardiologist with 14+ years of expertise in non-invasive cardiac imaging.',
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
        organizationId: orgId,
        departmentId: 'dept-2',
        name: 'Ahmed Hassan',
        title: 'Dr.',
        specialty: 'Dermatology & Cosmetic Care',
        bio: 'Consultant Dermatologist specializing in laser treatments and cosmetic skin surgery.',
        experienceYears: 10,
        languages: ['English', 'Arabic', 'French'],
        rating: 4.8,
        reviewCount: 84,
        consultationFee: 350,
        currency: 'EGP',
        isAvailableForBooking: true
      },
      {
        id: 'doc-3',
        organizationId: orgId,
        departmentId: 'dept-3',
        name: 'Layla Mahmoud',
        title: 'Dr.',
        specialty: 'Pediatrics & Child Health',
        bio: 'Consultant Pediatrician dedicated to pediatric health and neonatal development.',
        experienceYears: 12,
        languages: ['English', 'Arabic'],
        rating: 4.9,
        reviewCount: 95,
        consultationFee: 400,
        currency: 'EGP',
        isAvailableForBooking: true
      }
    ];
  }
}
