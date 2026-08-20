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

  // Search State
  isSearching = signal(false);
  searchError = signal<string | null>(null);
  aiResults = signal<AiRecommendationResponse | null>(null);

  // Reactive Form
  searchForm: FormGroup = this.fb.group({
    query: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]]
  });

  // Organizations State
  isLoadingOrgs = signal(true);
  organizations = signal<Organization[]>([]);

  // Doctors State
  isLoadingDoctors = signal(true);
  doctors = signal<Doctor[]>([]);

  ngOnInit(): void {
    this.loadOrganizations();
    this.loadDoctors();
  }

  // --- Smart Search Submission ---
  onSearch(): void {
    if (this.searchForm.invalid || this.isSearching()) return;

    const queryText = this.searchForm.value.query.trim();
    if (!queryText) return;

    this.isSearching.set(true);
    this.searchError.set(null);
    this.aiResults.set(null);

    this.aiService.getDoctorRecommendations({ query: queryText, symptoms: queryText }).subscribe({
      next: (res: ApiResponse<AiRecommendationResponse>) => {
        this.isSearching.set(false);
        if (res.success && res.data) {
          this.aiResults.set(res.data);
        } else {
          this.searchError.set(res.message || 'We couldn\'t find matching healthcare providers. Try describing a different specialty or location.');
        }
      },
      error: () => {
        this.isSearching.set(false);
        this.searchError.set('Smart Discovery is temporarily unavailable. You can still browse providers manually.');
      }
    });
  }

  fillSearch(exampleText: string): void {
    this.searchForm.patchValue({ query: exampleText });
    this.onSearch();
  }

  clearSearch(): void {
    this.searchForm.reset();
    this.aiResults.set(null);
    this.searchError.set(null);
  }

  // --- Load Featured Data ---
  private loadOrganizations(): void {
    this.isLoadingOrgs.set(true);

    this.orgService.getOrganizations().subscribe({
      next: (res: ApiResponse<PaginatedData<Organization>>) => {
        this.isLoadingOrgs.set(false);
        if (res.success && res.data?.items?.length) {
          this.organizations.set(res.data.items.slice(0, 3));
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
      next: (res: ApiResponse<PaginatedData<Doctor>>) => {
        this.isLoadingDoctors.set(false);
        if (res.success && res.data?.items?.length) {
          this.doctors.set(res.data.items.slice(0, 3));
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
        description: 'Comprehensive multi-specialty tertiary care hospital with 24/7 Emergency & ICU facilities.',
        city: 'El Shorouk',
        address: 'Central District, Block 4',
        phone: '+20 2 2680 0000',
        email: 'info@shorouk-hospital.com',
        rating: 4.9,
        reviewCount: 142,
        isVerified: true,
        createdAt: '2026-01-01'
      },
      {
        id: 'org-2',
        name: 'Cairo Heart & Vascular Center',
        type: 'medical_center',
        description: 'Leading cardiovascular center specializing in non-invasive cardiology and vascular surgery.',
        city: 'Cairo',
        address: '5th Settlement, 90th Street',
        phone: '+20 2 2790 1111',
        email: 'contact@cairoheart.org',
        rating: 4.8,
        reviewCount: 98,
        isVerified: true,
        createdAt: '2026-01-05'
      },
      {
        id: 'org-3',
        name: 'Nile Skin & Laser Clinic',
        type: 'clinic',
        description: 'Advanced dermatology, cosmetology, and laser care center with board-certified consultants.',
        city: 'New Cairo',
        address: 'Medical Park 1, Office 204',
        phone: '+20 2 2810 2222',
        email: 'appointments@nileskin.com',
        rating: 4.7,
        reviewCount: 76,
        isVerified: true,
        createdAt: '2026-01-10'
      }
    ];
  }

  private getFallbackDoctors(): Doctor[] {
    return [
      {
        id: 'doc-1',
        organizationId: 'org-2',
        departmentId: 'dept-1',
        name: 'Sarah Mansour',
        title: 'Dr.',
        specialty: 'Cardiology & Cardiovascular',
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
        name: 'Ahmed Hassan',
        title: 'Dr.',
        specialty: 'Dermatology & Cosmetic Care',
        bio: 'Consultant Dermatologist with expertise in clinical dermatology, laser therapy, and skin surgery.',
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
        organizationId: 'org-1',
        departmentId: 'dept-3',
        name: 'Layla Mahmoud',
        title: 'Dr.',
        specialty: 'Pediatrics & Child Health',
        bio: 'Consultant Pediatrician dedicated to pediatric care, neonatal health, and growth monitoring.',
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
