import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { DoctorService } from '../../../core/services/doctor.service';
import { LanguageService } from '../../../core/services/language.service';
import { Doctor } from '../../../core/models/doctor.model';

@Component({
  selector: 'app-admin-doctors',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './admin-doctors.component.html',
  styleUrl: './admin-doctors.component.css'
})
export class AdminDoctorsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly doctorService = inject(DoctorService);
  readonly langService = inject(LanguageService);

  isLoading = signal(true);
  filterQuery = signal('');
  doctors = signal<Doctor[]>([]);
  showModal = signal(false);
  editingId = signal<string | null>(null);
  deletingDoc = signal<Doctor | null>(null);
  viewBioModal = signal<Doctor | null>(null);

  filteredDoctors = computed(() => {
    const q = this.filterQuery().toLowerCase().trim();
    if (!q) return this.doctors();
    return this.doctors().filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.specialty.toLowerCase().includes(q) ||
      (d.bio && d.bio.toLowerCase().includes(q))
    );
  });

  doctorForm: FormGroup = this.fb.group({
    title: ['أ.د.', Validators.required],
    name: ['', Validators.required],
    specialty: ['', Validators.required],
    experienceYears: [15, [Validators.required, Validators.min(1)]],
    consultationFee: [450, [Validators.required, Validators.min(0)]],
    bio: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.isLoading.set(true);
    this.doctorService.getDoctors().subscribe({
      next: (res) => {
        const data = res.data;
        if (Array.isArray(data) && data.length) {
          this.doctors.set(data);
        } else if (data && 'items' in data && Array.isArray(data.items) && data.items.length) {
          this.doctors.set(data.items);
        } else {
          this.doctors.set(this.getFallbackDoctors());
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.doctors.set(this.getFallbackDoctors());
        this.isLoading.set(false);
      }
    });
  }

  openAddModal(): void {
    this.editingId.set(null);
    this.doctorForm.reset({
      title: 'أ.د.',
      experienceYears: 15,
      consultationFee: 450
    });
    this.showModal.set(true);
  }

  editDoctor(doc: Doctor): void {
    this.editingId.set(doc.id);
    this.doctorForm.patchValue({
      title: doc.title || 'أ.د.',
      name: doc.name,
      specialty: doc.specialty,
      experienceYears: doc.experienceYears,
      consultationFee: doc.consultationFee,
      bio: doc.bio
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveDoctor(): void {
    if (this.doctorForm.invalid) return;

    const val = this.doctorForm.value;
    const currentId = this.editingId();

    if (currentId) {
      this.doctors.update(list => list.map(d => d.id === currentId ? {
        ...d,
        title: val.title,
        name: val.name,
        specialty: val.specialty,
        experienceYears: Number(val.experienceYears),
        consultationFee: Number(val.consultationFee),
        bio: val.bio
      } : d));
    } else {
      const newDoc: Doctor = {
        id: `doc-${Date.now()}`,
        organizationId: 'org-1',
        departmentId: 'dept-1',
        name: val.name,
        title: val.title,
        specialty: val.specialty,
        bio: val.bio,
        experienceYears: Number(val.experienceYears),
        languages: ['العربية', 'English'],
        rating: 5.0,
        reviewCount: 1,
        consultationFee: Number(val.consultationFee),
        currency: 'EGP',
        isAvailableForBooking: true
      };
      this.doctors.update(list => [...list, newDoc]);
    }

    this.closeModal();
  }

  confirmDelete(doc: Doctor): void {
    this.deletingDoc.set(doc);
  }

  deleteDoctor(): void {
    const target = this.deletingDoc();
    if (target) {
      this.doctors.update(list => list.filter(d => d.id !== target.id));
      this.deletingDoc.set(null);
    }
  }

  // --- Rich Executive Demo Data of Department Chairs & Consultants ---
  private getFallbackDoctors(): Doctor[] {
    return [
      {
        id: 'doc-1',
        organizationId: 'org-1',
        departmentId: 'dept-1',
        name: 'أ.د. أحمد عبد الرحمن الحسين',
        title: 'أ.د.',
        specialty: 'رئيس قسم أمراض القلب والقسطرة التداخلية',
        bio: 'أستاذ ورئيس قسم القسطرة التداخلية وشرايين القلب، زميل الكلية الأمريكية للقلب FACC ومجلس الإنعاش الأوروبي. أشرف على تنفيذ أكثر من 4,500 عملية قسطرة ناجحة وزراعة دعامات دقيقة بالمستشفى الدولي.',
        experienceYears: 22,
        languages: ['العربية', 'English'],
        rating: 4.95,
        reviewCount: 180,
        consultationFee: 500,
        currency: 'EGP',
        isAvailableForBooking: true
      },
      {
        id: 'doc-2',
        organizationId: 'org-1',
        departmentId: 'dept-2',
        name: 'أ.د. محمود الشريف',
        title: 'أ.د.',
        specialty: 'رئيس قسم جراحة المخ والأعصاب والعمود الفقري',
        bio: 'أستاذ وجراح جراحات القاع والجمجمة والجراحة الميكروسكوبية للانزلاق الغضروفي. رئيس الجمعية المصرية لجراحي المخ والأعصاب وخبير الأورام العصبية المستعصية.',
        experienceYears: 25,
        languages: ['العربية', 'English', 'German'],
        rating: 4.98,
        reviewCount: 210,
        consultationFee: 600,
        currency: 'EGP',
        isAvailableForBooking: true
      },
      {
        id: 'doc-3',
        organizationId: 'org-3',
        departmentId: 'dept-3',
        name: 'د. مريم الشناوي',
        title: 'د.',
        specialty: 'رئيس قسم الجلدية والتجميل والعلاج بالليزر',
        bio: 'استشاري ورئيس مركز الجلدية والليزر. حاصلة على الدبلومة الأوروبية لطب الجلد التجميلي، متخصصة في العلاج الضوئي للصدفية والبهاق وحب الشباب وجراحات الجلد الدقيقة.',
        experienceYears: 14,
        languages: ['العربية', 'English', 'French'],
        rating: 4.88,
        reviewCount: 112,
        consultationFee: 400,
        currency: 'EGP',
        isAvailableForBooking: true
      },
      {
        id: 'doc-4',
        organizationId: 'org-1',
        departmentId: 'dept-4',
        name: 'د. خالد مصطفى السويفي',
        title: 'د.',
        specialty: 'رئيس قسم طب وجراحة الأطفال وحديثي الولادة',
        bio: 'استشاري الأطفال ورئيس وحدة مبتسري حديثي الولادة والمبتسرين. متخصص في حساسية الصدر، النزلات المعوية الحادة، ومتابعة معدلات الذكاء والنمو الجسدي للأطفال.',
        experienceYears: 18,
        languages: ['العربية', 'English'],
        rating: 4.92,
        reviewCount: 145,
        consultationFee: 350,
        currency: 'EGP',
        isAvailableForBooking: true
      },
      {
        id: 'doc-5',
        organizationId: 'org-2',
        departmentId: 'dept-5',
        name: 'د. نادية عبد الوهاب',
        title: 'د.',
        specialty: 'مديرة مركز الكشف المبكر والأورام',
        bio: 'استشاري ومسؤولة بروتوكولات العلاج الكيماوي والأورام. عضو الجمعية الأمريكية لأورام الدم ASCO وخبير التشخيص المبكر لأورام الثدي والجهاز الهضمي.',
        experienceYears: 19,
        languages: ['العربية', 'English'],
        rating: 4.94,
        reviewCount: 130,
        consultationFee: 450,
        currency: 'EGP',
        isAvailableForBooking: true
      },
      {
        id: 'doc-6',
        organizationId: 'org-1',
        departmentId: 'dept-6',
        name: 'د. شريف العريان',
        title: 'د.',
        specialty: 'رئيس قسم جراحة العظام والمفاصل والمناظير',
        bio: 'استشاري جراحات تغيير المفاصل الصناعية والمناظير الطبية للركبة والكتف. زميل المعهد الملكي البريطاني لإصابات الملعب والرياضيين.',
        experienceYears: 16,
        languages: ['العربية', 'English'],
        rating: 4.87,
        reviewCount: 98,
        consultationFee: 420,
        currency: 'EGP',
        isAvailableForBooking: true
      },
      {
        id: 'doc-7',
        organizationId: 'org-1',
        departmentId: 'dept-7',
        name: 'د. طارق الفاروق',
        title: 'د.',
        specialty: 'مدير قسم الطوارئ والعناية المركزة (ICU)',
        bio: 'استشاري الطب الحرج ومدير شبكة غرف العناية المركزة وطوارئ الأزمات 137. خبير إدارة الحالات الحرجة وتجهيزات الإنعاش القلبي الرئوي.',
        experienceYears: 20,
        languages: ['العربية', 'English'],
        rating: 4.96,
        reviewCount: 165,
        consultationFee: 500,
        currency: 'EGP',
        isAvailableForBooking: true
      }
    ];
  }
}
