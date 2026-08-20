import { Component, OnInit, inject, signal, input, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrganizationService } from '../../../core/services/organization.service';
import { DepartmentService } from '../../../core/services/department.service';
import { ServiceService } from '../../../core/services/service.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { LanguageService } from '../../../core/services/language.service';
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
  readonly langService = inject(LanguageService);

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
    const isAr = this.langService.currentLang() === 'ar';
    switch (type?.toLowerCase()) {
      case 'hospital': return isAr ? 'مستشفى خاص' : 'Private Hospital';
      case 'clinic': return isAr ? 'عيادة تخصصية' : 'Specialized Clinic';
      case 'medical_center': return isAr ? 'مركز طبي' : 'Medical Center';
      case 'research_institute': return isAr ? 'معهد أبحاث' : 'Research Institute';
      default: return isAr ? 'منشأة معتمدة' : 'Verified Node';
    }
  }

  // --- Fallback Data for Local Demo ---
  private getFallbackOrganization(id: string): Organization | null {
    const fallbacks: Record<string, Organization> = {
      'org-1': {
        id: 'org-1',
        name: 'مستشفى الشروق الدولي التخصصي',
        type: 'hospital',
        description: 'صرح طبي استثماري متكامل بمدينة الشروق يضم وحدات القسطرة القلبية، الطوارئ على مدار 24 ساعة، وجراحات المناظير المتقدمة.',
        city: 'الشروق',
        address: 'حي الأشجار، الحي السابع - مدينة الشروق',
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
        name: 'مركز فيكسا الطبي المتقدم بالتجمع',
        type: 'medical_center',
        description: 'مركز طبي فاخر بقلب التجمع الخامس يوفر أحدث تقنيات التشخيص، الأشعة المقطعية، وعيادات كبار الاستشاريين أساتذة الجامعات.',
        city: 'القاهرة الجديده',
        address: 'شارع التسعين الجنوبي، مجمع العيادات الفاخرة - التجمع الخامس',
        phone: '+20 2 2790 1111',
        email: 'contact@vexa-center.com',
        website: 'https://vexa-center.com',
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
        name: 'مستشفى السلام الدولي بالمعادي',
        type: 'hospital',
        description: 'من أعرق المستشفيات الخاصة في مصر الحاصلة على الاعتماد الدولي JCI، متخصصة في زراعة الأعضاء وجراحات القلب والمخ والأعصاب.',
        city: 'القاهرة',
        address: 'كورنيش المعادي، برج الأطباء - القاهرة',
        phone: '+20 2 2810 2222',
        email: 'appointments@alsalam.com',
        rating: 4.95,
        reviewCount: 310,
        departmentsCount: 8,
        doctorsCount: 35,
        servicesCount: 28,
        isVerified: true,
        createdAt: '2026-01-10'
      }
    };

    return fallbacks[id] || fallbacks['org-1'];
  }

  private getFallbackDepartments(orgId: string): Department[] {
    return [
      { id: 'dept-1', organizationId: orgId, name: 'قسم أمراض القلب والقسطرة', description: 'تشخيص وعلاج أمراض القسطرة التداخلية والشرايين التاجية.' },
      { id: 'dept-2', organizationId: orgId, name: 'قسم الجلدية والتجميل والليزر', description: 'علاج الأمراض الجلدية والعلاج بالليزر وتقنيات النضارة.' },
      { id: 'dept-3', organizationId: orgId, name: 'قسم طب وجراحة الأطفال', description: 'رعاية صحية شاملة للأطفال والحضانة وحديثي الولادة.' },
      { id: 'dept-4', organizationId: orgId, name: 'قسم المخ والأعصاب والعمود الفقري', description: 'جراحات الغضروف والانزلاق الغضروفي وعلاج الصداع والمخ.' }
    ];
  }

  private getFallbackServices(orgId: string): MedicalService[] {
    return [
      { id: 'srv-1', organizationId: orgId, name: 'رسم القلب الكهربائي واختبار المجهود ECG', category: 'أمراض القلب', description: 'تقييم شامل لسلامة الشرايين التاجية وعضلة القلب.', price: 1200, currency: 'EGP', durationMinutes: 45 },
      { id: 'srv-2', organizationId: orgId, name: 'فحص الجلدية الشامل والديرموسكوب', category: 'الجلدية والتجميل', description: 'تشخيص مبكر للشامات والتغيرات الجلدية وأمراض الصدفية.', price: 500, currency: 'EGP', durationMinutes: 30 },
      { id: 'srv-3', organizationId: orgId, name: 'متابعة نمو وتغذية الأطفال والرضع', category: 'طب الأطفال', description: 'جدول التطعيمات وقياس المعدلات الحركية والذهنية.', price: 400, currency: 'EGP', durationMinutes: 30 }
    ];
  }

  private getFallbackDoctors(orgId: string): Doctor[] {
    return [
      {
        id: 'doc1',
        organizationId: orgId,
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
      {
        id: 'doc2',
        organizationId: orgId,
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
      {
        id: 'doc3',
        organizationId: orgId,
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
    ];
  }
}
