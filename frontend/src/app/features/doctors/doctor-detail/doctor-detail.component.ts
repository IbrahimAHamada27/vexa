import { Component, OnInit, inject, signal, input, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor.service';
import { OrganizationService } from '../../../core/services/organization.service';
import { LanguageService } from '../../../core/services/language.service';
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
  readonly langService = inject(LanguageService);

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
    if (!languages) return this.langService.currentLang() === 'ar' ? 'العربية، English' : 'English, Arabic';
    if (Array.isArray(languages)) return languages.map(l => this.langService.localizeText(l)).join(', ');
    if (typeof languages === 'string') return this.langService.localizeText(languages);
    return this.langService.currentLang() === 'ar' ? 'العربية، English' : 'English, Arabic';
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
        name: 'أ.د. أحمد عبد الرحمن الحسين',
        title: 'أ.د.',
        specialty: 'استشاري أمراض القلب والأوعية الدموية والقسطرة',
        bio: 'أستاذ أمراض القلب بكلية الطب، زميل الكلية الأمريكية للقلب FACC، خبرة أكثر من 22 عاماً في قسطرة الشرايين التاجية وتوسيع الصمامات.',
        experienceYears: 22,
        languages: ['العربية', 'English'],
        rating: 4.95,
        reviewCount: 180,
        consultationFee: 450,
        currency: 'EGP',
        isAvailableForBooking: true
      },
      'doc-2': {
        id: 'doc-2',
        organizationId: 'org-3',
        departmentId: 'dept-2',
        name: 'د. مريم الشناوي',
        title: 'د.',
        specialty: 'استشاري أمراض الجلدية والتجميل والليزر',
        bio: 'استشاري جراحات الجلد والتجميل، خبرة 14 عاماً في علاج الصدفية والبهاق وحب الشباب المستعصي وأحدث تقنيات الفيلر والخيوط الفرنسية.',
        experienceYears: 14,
        languages: ['العربية', 'English'],
        rating: 4.88,
        reviewCount: 112,
        consultationFee: 350,
        currency: 'EGP',
        isAvailableForBooking: true
      },
      'doc-3': {
        id: 'doc-3',
        organizationId: 'org-1',
        departmentId: 'dept-3',
        name: 'د. خالد مصطفى السويفي',
        title: 'د.',
        specialty: 'استشاري طب وجراحة الأطفال والحديثي الولادة',
        bio: 'استشاري الأطفال ورعاية الحديثي الولادة، متخصص في أمراض الصدر والحساسية ومتابعة النمو والتغذية السليمة للأطفال.',
        experienceYears: 16,
        languages: ['العربية', 'English'],
        rating: 4.9,
        reviewCount: 95,
        consultationFee: 300,
        currency: 'EGP',
        isAvailableForBooking: true
      }
    };

    return fallbacks[id] || fallbacks['doc-1'];
  }

  private getFallbackOrganization(orgId: string): Organization {
    return {
      id: orgId,
      name: 'مستشفى الشروق الدولي التخصصي',
      type: 'hospital',
      description: 'صرح طبي استثماري متكامل بمدينة الشروق يضم وحدات القسطرة القلبية، الطوارئ على مدار 24 ساعة، وجراحات المناظير المتقدمة.',
      city: 'الشروق',
      address: 'حي الأشجار، الحي السابع - مدينة الشروق',
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
