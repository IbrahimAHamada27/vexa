import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrganizationService } from '../../../core/services/organization.service';
import { DepartmentService } from '../../../core/services/department.service';
import { Organization } from '../../../core/models/organization.model';
import { Department } from '../../../core/models/department.model';
import { OrganizationCardComponent } from '../../../shared/components/organization-card/organization-card.component';
import { ApiResponse, PaginatedData } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-organization-list',
  standalone: true,
  imports: [RouterLink, FormsModule, OrganizationCardComponent],
  templateUrl: './organization-list.component.html',
  styleUrl: './organization-list.component.css'
})
export class OrganizationListComponent implements OnInit {
  private readonly orgService = inject(OrganizationService);
  private readonly deptService = inject(DepartmentService);

  // Search & Filter Signals
  searchQuery = signal('');
  selectedType = signal<string>('');
  selectedDepartment = signal<string>('');
  selectedCity = signal<string>('');

  // Async States
  isLoading = signal(true);
  errorMsg = signal<string | null>(null);

  // Data Signals
  organizations = signal<Organization[]>([]);
  departments = signal<Department[]>([]);

  // Normalized Filtered List
  filteredOrganizations = computed(() => {
    const query = this.searchQuery().toLowerCase().trim().replace(/\s+/g, ' ');
    const type = this.selectedType();
    const dept = this.selectedDepartment().toLowerCase().trim();
    const city = this.selectedCity();

    return this.organizations().filter(org => {
      // Type Filter
      if (type && org.type !== type) {
        return false;
      }

      // City/Location Filter
      if (city && org.city.toLowerCase() !== city.toLowerCase()) {
        return false;
      }

      // Query Search (matches name, description, city, address)
      if (query) {
        const normName = org.name.toLowerCase();
        const normDesc = org.description.toLowerCase();
        const normCity = org.city.toLowerCase();
        const normAddr = org.address.toLowerCase();

        const matchesQuery = normName.includes(query) ||
                             normDesc.includes(query) ||
                             normCity.includes(query) ||
                             normAddr.includes(query);
        if (!matchesQuery) {
          return false;
        }
      }

      // Department Filter
      if (dept) {
        const normDesc = org.description.toLowerCase();
        const normName = org.name.toLowerCase();
        if (!normDesc.includes(dept) && !normName.includes(dept)) {
          return false;
        }
      }

      return true;
    });
  });

  // Check if any filter is active
  hasActiveFilters = computed(() => {
    return !!(this.searchQuery().trim() || this.selectedType() || this.selectedDepartment() || this.selectedCity());
  });

  // Active filter summary label string
  activeFiltersText = computed(() => {
    const parts: string[] = [];
    if (this.searchQuery().trim()) parts.push(`"${this.searchQuery().trim()}"`);
    if (this.selectedDepartment()) parts.push(this.selectedDepartment());
    if (this.selectedCity()) parts.push(this.selectedCity());
    if (this.selectedType()) parts.push(this.formatType(this.selectedType()));
    return parts.length ? `Filters: ${parts.join(' · ')}` : '';
  });

  ngOnInit(): void {
    this.loadDepartments();
    this.loadOrganizations();
  }

  loadOrganizations(): void {
    this.isLoading.set(true);
    this.errorMsg.set(null);

    this.orgService.getOrganizations().subscribe({
      next: (res: ApiResponse<PaginatedData<Organization>>) => {
        this.isLoading.set(false);
        if (res.success && res.data?.items?.length) {
          this.organizations.set(res.data.items);
        } else {
          this.organizations.set(this.getFallbackOrganizations());
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.organizations.set(this.getFallbackOrganizations());
      }
    });
  }

  private loadDepartments(): void {
    this.deptService.getDepartments().subscribe({
      next: (res: ApiResponse<Department[]>) => {
        if (res.success && res.data?.length) {
          this.departments.set(res.data);
        } else {
          this.departments.set(this.getFallbackDepartments());
        }
      },
      error: () => {
        this.departments.set(this.getFallbackDepartments());
      }
    });
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedType.set('');
    this.selectedDepartment.set('');
    this.selectedCity.set('');
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

  // --- Fallback Data ---
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
      },
      {
        id: 'org-4',
        name: 'Giza Children & Maternity Hospital',
        type: 'hospital',
        description: 'Dedicated pediatric & maternity center providing comprehensive neonatal intensive care and child wellness programs.',
        city: 'Giza',
        address: 'Pyramids Avenue, Sector 3',
        phone: '+20 2 3380 4444',
        email: 'care@gizachildren.com',
        rating: 4.9,
        reviewCount: 165,
        departmentsCount: 8,
        doctorsCount: 32,
        isVerified: true,
        createdAt: '2026-01-12'
      },
      {
        id: 'org-5',
        name: 'Capital Neurological & Brain Institute',
        type: 'medical_center',
        description: 'Specialized brain & spine center delivering advanced neurosurgery, stroke management, and neurology diagnostics.',
        city: 'Cairo',
        address: 'Maadi Degla, Road 218',
        phone: '+20 2 2519 5555',
        email: 'info@capitalneuro.org',
        rating: 4.8,
        reviewCount: 89,
        departmentsCount: 5,
        doctorsCount: 14,
        isVerified: true,
        createdAt: '2026-01-15'
      },
      {
        id: 'org-6',
        name: 'Alexandria Orthopedic & Sports Medicine Clinic',
        type: 'clinic',
        description: 'Leading sports rehabilitation, joint replacement, and orthopedic trauma clinic on the Mediterranean coast.',
        city: 'Alexandria',
        address: 'Sidi Gaber, Tram Station Square',
        phone: '+20 3 5400 777',
        email: 'rehab@alexortho.com',
        rating: 4.6,
        reviewCount: 62,
        departmentsCount: 3,
        doctorsCount: 10,
        isVerified: false,
        createdAt: '2026-01-18'
      }
    ];
  }

  private getFallbackDepartments(): Department[] {
    return [
      { id: 'dept-1', organizationId: 'org-1', name: 'Cardiology', description: 'Heart & vascular medicine' },
      { id: 'dept-2', organizationId: 'org-1', name: 'Dermatology', description: 'Skin & cosmetic care' },
      { id: 'dept-3', organizationId: 'org-1', name: 'Pediatrics', description: 'Child & neonatal health' },
      { id: 'dept-4', organizationId: 'org-4', name: 'Neurology', description: 'Brain & nerve specialist care' },
      { id: 'dept-5', organizationId: 'org-6', name: 'Orthopedics', description: 'Bones & joint surgery' },
      { id: 'dept-6', organizationId: 'org-1', name: 'General Medicine', description: 'Internal medicine & primary care' }
    ];
  }
}
