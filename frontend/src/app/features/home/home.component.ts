import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrganizationService } from '../../core/services/organization.service';
import { DoctorService } from '../../core/services/doctor.service';
import { AiService } from '../../core/services/ai.service';
import { LanguageService } from '../../core/services/language.service';
import { Organization } from '../../core/models/organization.model';
import { Doctor } from '../../core/models/doctor.model';
import { AiRecommendationResponse } from '../../core/models/ai-recommendation.model';
import { OrganizationCardComponent } from '../../shared/components/organization-card/organization-card.component';
import { DoctorCardComponent } from '../../shared/components/doctor-card/doctor-card.component';
import { ApiResponse, PaginatedData } from '../../core/models/api-response.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, OrganizationCardComponent, DoctorCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly orgService = inject(OrganizationService);
  private readonly doctorService = inject(DoctorService);
  private readonly aiService = inject(AiService);
  readonly langService = inject(LanguageService);

  // Reactive Form
  searchForm: FormGroup = this.fb.group({
    query: ['', [Validators.required, Validators.minLength(3)]]
  });

  // AI Recommendation State Signals
  isSearching = signal(false);
  searchError = signal<string | null>(null);
  aiResults = signal<AiRecommendationResponse | null>(null);

  // Data Loading Signals
  isLoadingOrgs = signal(true);
  isLoadingDoctors = signal(true);
  organizations = signal<Organization[]>([]);
  doctors = signal<Doctor[]>([]);

  ngOnInit(): void {
    this.loadOrganizations();
    this.loadDoctors();
  }

  onSearch(): void {
    if (this.searchForm.invalid || this.isSearching()) {
      return;
    }

    const query = this.searchForm.value.query.trim();
    this.isSearching.set(true);
    this.searchError.set(null);

    this.aiService.recommend(query).subscribe({
      next: (res: ApiResponse<AiRecommendationResponse>) => {
        this.isSearching.set(false);
        if (res.success && res.data) {
          this.aiResults.set(res.data);
        } else {
          this.searchError.set('Unable to process AI recommendation. Showing standard search fallback.');
          this.aiResults.set(null);
        }
      },
      error: () => {
        this.isSearching.set(false);
        this.searchError.set('Healthcare provider discovery service is temporarily unavailable. Browse organizations below.');
        this.aiResults.set(null);
      }
    });
  }

  fillSearch(prompt: string): void {
    this.searchForm.patchValue({ query: prompt });
    this.onSearch();
  }

  clearSearch(): void {
    this.aiResults.set(null);
    this.searchError.set(null);
    this.searchForm.reset();
  }

  private loadOrganizations(): void {
    this.isLoadingOrgs.set(true);

    this.orgService.getOrganizations().subscribe({
      next: (res: ApiResponse<Organization[] | PaginatedData<Organization>>) => {
        this.isLoadingOrgs.set(false);
        const data = res.data;
        if (Array.isArray(data) && data.length) {
          this.organizations.set(data.slice(0, 3));
        } else if (data && 'items' in data && Array.isArray(data.items) && data.items.length) {
          this.organizations.set(data.items.slice(0, 3));
        } else {
          this.organizations.set(this.getFallbackOrganizations());
        }
      },
      error: () => {
        this.isLoadingOrgs.set(false);
        this.organizations.set(this.getFallbackOrganizations());
      }
    });
  }

  private loadDoctors(): void {
    this.isLoadingDoctors.set(true);

    this.doctorService.getDoctors().subscribe({
      next: (res: ApiResponse<Doctor[] | PaginatedData<Doctor>>) => {
        this.isLoadingDoctors.set(false);
        const data = res.data;
        if (Array.isArray(data) && data.length) {
          this.doctors.set(data.slice(0, 3));
        } else if (data && 'items' in data && Array.isArray(data.items) && data.items.length) {
          this.doctors.set(data.items.slice(0, 3));
        } else {
          this.doctors.set(this.getFallbackDoctors());
        }
      },
      error: () => {
        this.isLoadingDoctors.set(false);
        this.doctors.set(this.getFallbackDoctors());
      }
    });
  }

  private getFallbackOrganizations(): Organization[] {
    return [
      {
        id: '1',
        name: 'مستشفى الشروق الدولي المخصص',
        type: 'hospital',
        description: 'مستشفى استثماري متكامل يضم كافة التخصصات الدقيقة ووحدات الرعاية المركزة والقسطرة.',
        address: 'حي الأشجار - مدينة الشروق',
        city: 'الشروق',
        phone: '01000000001',
        email: 'info@shoroukhospital.com',
        rating: 4.9,
        reviewCount: 142,
        isVerified: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'مركز فيكسا الطبي المتقدم',
        type: 'medical_center',
        description: 'مركز طوارئ وعيادات تخصصية مجهزة بأحدث أجهزة الأشعة والتحاليل الطبية.',
        address: 'التجمع الخامس - شارع التسعين',
        city: 'القاهرة الجديده',
        phone: '01000000002',
        email: 'contact@vexa-center.com',
        rating: 4.8,
        reviewCount: 98,
        isVerified: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'مستشفى السلام الدولي',
        type: 'hospital',
        description: 'صرح طبي عريق يقدم خدمات الطوارئ على مدار الساعة وجراحات القلب والمناظير.',
        address: 'المعادي - الكورنيش',
        city: 'القاهرة',
        phone: '01000000003',
        email: 'info@alsalamhospital.com',
        rating: 4.95,
        reviewCount: 310,
        isVerified: true,
        createdAt: new Date().toISOString()
      }
    ];
  }

  private getFallbackDoctors(): Doctor[] {
    return [
      {
        id: 'doc1',
        organizationId: '1',
        departmentId: 'dept1',
        name: 'أ.د. أحمد عبد الرحمن الحسين',
        title: 'أ.د.',
        specialty: 'استشاري أمراض القلب والأوعية الدموية والقسطرة',
        bio: 'أستاذ أمراض القلب بكلية الطب، زميل الكلية الأمريكية للقلب، خبرة أكثر من ٢٢ عاماً في قسطرة الشرايين التاجية.',
        consultationFee: 450,
        currency: 'EGP',
        experienceYears: 22,
        rating: 4.95,
        reviewCount: 180,
        isAvailableForBooking: true,
        languages: ['العربية', 'English', 'Français']
      },
      {
        id: 'doc2',
        organizationId: '1',
        departmentId: 'dept2',
        name: 'د. مريم الشناوي',
        title: 'د.',
        specialty: 'استشاري أمراض الجلدية والتجميل والليزر',
        bio: 'خبرة طويلة في علاج الأمراض الجلدية المستعصية وتقنيات النضرة والعلاج بالليزر.',
        consultationFee: 350,
        currency: 'EGP',
        experienceYears: 14,
        rating: 4.88,
        reviewCount: 112,
        isAvailableForBooking: true,
        languages: ['العربية', 'English']
      },
      {
        id: 'doc3',
        organizationId: '2',
        departmentId: 'dept3',
        name: 'د. خالد مصطفى',
        title: 'د.',
        specialty: 'استشاري طب وجراحة الأطفال والحديثي الولادة',
        bio: 'مدرس طب الأطفال، متخصص في متابعة النمو والتغذية وأمراض الصدر للأطفال.',
        consultationFee: 300,
        currency: 'EGP',
        experienceYears: 16,
        rating: 4.9,
        reviewCount: 95,
        isAvailableForBooking: true,
        languages: ['العربية', 'English']
      }
    ];
  }
}
