import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrganizationService } from '../../../core/services/organization.service';
import { DepartmentService } from '../../../core/services/department.service';
import { LanguageService } from '../../../core/services/language.service';
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
  readonly langService = inject(LanguageService);

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

        const matchText = normName.includes(query) || normDesc.includes(query) || normCity.includes(query) || normAddr.includes(query);
        if (!matchText) return false;
      }

      return true;
    });
  });

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading.set(true);
    this.errorMsg.set(null);

    this.orgService.getOrganizations().subscribe({
      next: (res: ApiResponse<Organization[] | PaginatedData<Organization>>) => {
        this.isLoading.set(false);
        const data = res.data;

        if (Array.isArray(data) && data.length) {
          this.organizations.set(data);
        } else if (data && 'items' in data && Array.isArray(data.items) && data.items.length) {
          this.organizations.set(data.items);
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

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedType.set('');
    this.selectedDepartment.set('');
    this.selectedCity.set('');
  }

  private getFallbackOrganizations(): Organization[] {
    return [
      {
        id: '1',
        name: 'مستشفى الشروق الدولي التخصصي',
        type: 'hospital',
        description: 'مستشفى استثماري مجهز بالكامل بوحدات القسطرة القلبية والرعاية المركزة وغرف العمليات الكبرى.',
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
        description: 'عيادات تخصصية متكاملة تشمل الأوعية الدموية، الجلدية والتجميل، وطب الأطفال.',
        address: 'شارع التسعين الجنوبي - التجمع الخامس',
        city: 'القاهرة الجديده',
        phone: '01000000002',
        email: 'contact@vexa-center.com',
        rating: 4.85,
        reviewCount: 98,
        isVerified: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'مستشفى السلام الدولي بالمعادي',
        type: 'hospital',
        description: 'أعرق الصروح الطبية الخاصة الرائدة في جراحات المخ والأعصاب وزراعة الأعضاء.',
        address: 'كورنيش المعادي',
        city: 'القاهرة',
        phone: '01000000003',
        email: 'info@alsalamhospital.com',
        rating: 4.95,
        reviewCount: 310,
        isVerified: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        name: 'مجمع عيادات النيل التخصصي',
        type: 'clinic',
        description: 'مجمع عيادات شامل لاستشاريين وأساتذة الجامعات في طب وجراحة العيون والأنف والأذن.',
        address: 'الدقي - الجيزة',
        city: 'الجيزة',
        phone: '01000000004',
        email: 'nileclinics@vexa-health.com',
        rating: 4.75,
        reviewCount: 64,
        isVerified: true,
        createdAt: new Date().toISOString()
      }
    ];
  }
}
