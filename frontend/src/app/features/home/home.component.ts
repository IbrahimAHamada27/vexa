import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrganizationService } from '../../core/services/organization.service';
import { DoctorService } from '../../core/services/doctor.service';
import { AiService } from '../../core/services/ai.service';
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

  // --- Fallback Local Data ---
  private getFallbackOrganizations(): Organization[] {
    return [
      {
        id: 'org-1',
        name: 'El Shorouk International Hospital',
        type: 'hospital',
        description: 'Comprehensive multi-specialty tertiary hospital featuring 24/7 Emergency, Cardiology, Pediatrics & ICU facilities.',
        city: 'El Shorouk',
        address: 'Central District, Block 4',
        phone: '+20 2 2680 0000',
        email: 'info@shorouk-hospital.com',
        rating: 4.9,
        reviewCount: 142,
        departmentsCount: 12,
        doctorsCount: 45,
        isVerified: true,
        createdAt: '2026-01-01'
      },
      {
        id: 'org-2',
        name: 'Cairo Heart & Vascular Center',
        type: 'medical_center',
        description: 'Premier cardiovascular medical center specializing in non-invasive cardiology, angiography, and vascular surgery.',
        city: 'Cairo',
        address: '5th Settlement, 90th Street',
        phone: '+20 2 2790 1111',
        email: 'contact@cairoheart.org',
        rating: 4.8,
        reviewCount: 98,
        departmentsCount: 4,
        doctorsCount: 18,
        isVerified: true,
        createdAt: '2026-01-05'
      },
      {
        id: 'org-3',
        name: 'Nile Skin & Laser Clinic',
        type: 'clinic',
        description: 'Advanced dermatology, cosmetic skin procedures, and laser care center staffed by senior consultants.',
        city: 'New Cairo',
        address: 'Medical Park 1, Office 204',
        phone: '+20 2 2810 2222',
        email: 'appointments@nileskin.com',
        rating: 4.7,
        reviewCount: 76,
        departmentsCount: 2,
        doctorsCount: 8,
        isVerified: true,
        createdAt: '2026-01-10'
      }
    ];
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
        bio: 'Senior Consultant Cardiologist specializing in echocardiography and preventive cardiac health.',
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
        organizationId: 'org-3',
        departmentId: 'dept-2',
        name: 'Ahmed El-Sayed',
        title: 'Dr.',
        specialty: 'Dermatology & Laser Surgery',
        bio: 'Consultant Dermatologist with expertise in aesthetic laser therapy and clinical dermatology.',
        experienceYears: 11,
        languages: ['English', 'Arabic'],
        rating: 4.8,
        reviewCount: 84,
        consultationFee: 400,
        currency: 'EGP',
        isAvailableForBooking: true
      },
      {
        id: 'doc-3',
        organizationId: 'org-4',
        departmentId: 'dept-3',
        name: 'Mona Hassan',
        title: 'Dr.',
        specialty: 'Pediatrics & Neonatal Care',
        bio: 'Pediatric specialist focusing on infant nutrition, growth tracking, and adolescent medicine.',
        experienceYears: 9,
        languages: ['English', 'Arabic', 'French'],
        rating: 4.9,
        reviewCount: 130,
        consultationFee: 350,
        currency: 'EGP',
        isAvailableForBooking: true
      }
    ];
  }
}
