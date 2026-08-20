import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartmentService } from '../../../core/services/department.service';
import { LanguageService } from '../../../core/services/language.service';
import { Department } from '../../../core/models/department.model';

@Component({
  selector: 'app-admin-departments',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-departments.component.html',
  styleUrl: './admin-departments.component.css'
})
export class AdminDepartmentsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly deptService = inject(DepartmentService);
  readonly langService = inject(LanguageService);

  isLoading = signal(true);
  departments = signal<Department[]>([]);
  showModal = signal(false);
  editingId = signal<string | null>(null);
  deletingDept = signal<Department | null>(null);

  deptForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.isLoading.set(true);
    this.deptService.getDepartments().subscribe({
      next: (res) => {
        if (res.data && res.data.length) {
          this.departments.set(res.data);
        } else {
          this.departments.set(this.getFallbackDepartments());
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.departments.set(this.getFallbackDepartments());
        this.isLoading.set(false);
      }
    });
  }

  getChairDoctor(deptName: string): string {
    const isAr = this.langService.currentLang() === 'ar';
    if (deptName.includes('قلب') || deptName.includes('Cardiology')) {
      return isAr ? 'أ.د. أحمد عبد الرحمن الحسين (رئيس القسم)' : 'Prof. Dr. Ahmed Al-Hussein (Chair)';
    }
    if (deptName.includes('مخ') || deptName.includes('Neurosurgery')) {
      return isAr ? 'أ.د. محمود الشريف (رئيس القسم)' : 'Prof. Dr. Mahmoud El-Sherif (Chair)';
    }
    if (deptName.includes('جلدية') || deptName.includes('Dermatology')) {
      return isAr ? 'د. مريم الشناوي (رئيسة القسم)' : 'Dr. Maryam El-Shennawy (Chair)';
    }
    if (deptName.includes('أطفال') || deptName.includes('Pediatrics')) {
      return isAr ? 'د. خالد مصطفى السويفي (رئيس القسم)' : 'Dr. Khaled El-Sweify (Chair)';
    }
    if (deptName.includes('أورام') || deptName.includes('Oncology')) {
      return isAr ? 'د. نادية عبد الوهاب (مديرة المركز)' : 'Dr. Nadia Abdel-Wahab (Director)';
    }
    if (deptName.includes('عظام') || deptName.includes('Orthopedics')) {
      return isAr ? 'د. شريف العريان (رئيس القسم)' : 'Dr. Sherif El-Arian (Chair)';
    }
    return isAr ? 'أ.د. طارق الفاروق (رئيس القسم)' : 'Prof. Dr. Tarek El-Farouk (Chair)';
  }

  openAddModal(): void {
    this.editingId.set(null);
    this.deptForm.reset();
    this.showModal.set(true);
  }

  editDepartment(dept: Department): void {
    this.editingId.set(dept.id);
    this.deptForm.patchValue({
      name: dept.name,
      description: dept.description
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveDepartment(): void {
    if (this.deptForm.invalid) return;

    const val = this.deptForm.value;
    const currentId = this.editingId();

    if (currentId) {
      this.departments.update(list => list.map(d => d.id === currentId ? { ...d, name: val.name, description: val.description } : d));
    } else {
      const newDept: Department = {
        id: `dept-${Date.now()}`,
        organizationId: 'org-1',
        name: val.name,
        description: val.description
      };
      this.departments.update(list => [...list, newDept]);
    }

    this.closeModal();
  }

  confirmDelete(dept: Department): void {
    this.deletingDept.set(dept);
  }

  deleteDepartment(): void {
    const target = this.deletingDept();
    if (target) {
      this.departments.update(list => list.filter(d => d.id !== target.id));
      this.deletingDept.set(null);
    }
  }

  private getFallbackDepartments(): Department[] {
    return [
      {
        id: 'dept-1',
        organizationId: 'org-1',
        name: 'قسم أمراض القلب والقسطرة التداخلية',
        description: 'وحدة متكاملة لعلاج أمراض القسطرة التداخلية للشرايين التاجية، تركيب المنظمات الذكية، ورعاية حالات الجلطات القلبية 24/7.'
      },
      {
        id: 'dept-2',
        organizationId: 'org-1',
        name: 'قسم جراحة المخ والأعصاب والعمود الفقري',
        description: 'جراحات الميكروسكوب والدقة العالية لاستئصال أورام القاع والتثبيت الديناميكي للفقرات بدون تدخل جراحي تقليدي.'
      },
      {
        id: 'dept-3',
        organizationId: 'org-3',
        name: 'مركز الجلدية والتجميل والعلاج بالليزر',
        description: 'وحدة التجميل الطبي المتطور وعلاج الصدفية والبهاق بأحدث أجهزة الليزر الكربوني وحقن البلازما والخيوط التجميلية.'
      },
      {
        id: 'dept-4',
        organizationId: 'org-1',
        name: 'قسم طب وجراحة الأطفال وحديثي الولادة',
        description: 'رعاية مبتسري الولادة والحالات الحرجة للأطفال، وحدات الحضانات الذكية المزودة بأجهزة التنفس الصناعي الدقيق.'
      },
      {
        id: 'dept-5',
        organizationId: 'org-2',
        name: 'مركز الكشف المبكر والأورام',
        description: 'وحدة تشخيص وأورام الثدي والجهاز الهضمي، إعداد بروتوكولات الكيماوي والإشعاعي الموجه تحت إشراف لجنة أورام استشارية.'
      },
      {
        id: 'dept-6',
        organizationId: 'org-1',
        name: 'قسم جراحة العظام والمفاصل والمناظير',
        description: 'جراحات المفاصل الصناعية المتقدمة للركبة والفخذ ومناظير إصابات الملعب والرباط الصليبي.'
      }
    ];
  }
}
