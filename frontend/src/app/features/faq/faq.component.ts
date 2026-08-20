import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';

export interface FaqItem {
  id: string;
  category: 'booking' | 'doctors' | 'hospitals' | 'ai';
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="faq-page container">
      <!-- BREADCRUMB -->
      <nav class="breadcrumb">
        <a routerLink="/">{{ langService.t('navHome') }}</a>
        <span class="separator">/</span>
        <span class="current">{{ langService.t('navFaq') }}</span>
      </nav>

      <!-- PAGE HEADER -->
      <header class="page-header">
        <span class="badge badge-cyan">💡 {{ langService.currentLang() === 'ar' ? 'مركز المعرفة والدعم' : 'Knowledge & Help Center' }}</span>
        <h1>{{ langService.t('faqTitle') }}</h1>
        <p>{{ langService.t('faqSub') }}</p>
      </header>

      <!-- SEARCH BAR & CATEGORY TABS -->
      <div class="faq-controls">
        <div class="faq-search-box">
          <span class="icon">🔍</span>
          <input
            type="text"
            [placeholder]="langService.currentLang() === 'ar' ? 'ابحث في الأسئلة الشائعة...' : 'Search FAQ questions...'"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            class="faq-search-input"
          />
        </div>

        <div class="faq-tabs">
          <button type="button" class="tab-btn" [class.active]="selectedCategory() === 'all'" (click)="selectedCategory.set('all')">
            🌐 {{ langService.currentLang() === 'ar' ? 'جميع الأسئلة' : 'All FAQs' }}
          </button>
          <button type="button" class="tab-btn" [class.active]="selectedCategory() === 'booking'" (click)="selectedCategory.set('booking')">
            📅 {{ langService.currentLang() === 'ar' ? 'المرضى والحجز' : 'Patients & Booking' }}
          </button>
          <button type="button" class="tab-btn" [class.active]="selectedCategory() === 'doctors'" (click)="selectedCategory.set('doctors')">
            👨‍⚕️ {{ langService.currentLang() === 'ar' ? 'الأطباء والعيادات' : 'Doctors & Clinics' }}
          </button>
          <button type="button" class="tab-btn" [class.active]="selectedCategory() === 'hospitals'" (click)="selectedCategory.set('hospitals')">
            🏥 {{ langService.currentLang() === 'ar' ? 'إدارة المستشفيات' : 'Hospital Management' }}
          </button>
          <button type="button" class="tab-btn" [class.active]="selectedCategory() === 'ai'" (click)="selectedCategory.set('ai')">
            🤖 {{ langService.currentLang() === 'ar' ? 'الذكاء الاصطناعي والأمان' : 'AI & Security' }}
          </button>
        </div>
      </div>

      <!-- FAQ ACCORDION LIST -->
      <div class="faq-list">
        @for (item of filteredFaqs(); track item.id) {
          <div class="faq-card" [class.open]="openFaqId() === item.id">
            <button type="button" class="faq-question-btn" (click)="toggleFaq(item.id)">
              <span class="question-text">
                {{ langService.currentLang() === 'ar' ? item.questionAr : item.questionEn }}
              </span>
              <span class="toggle-icon">{{ openFaqId() === item.id ? '−' : '+' }}</span>
            </button>

            @if (openFaqId() === item.id) {
              <div class="faq-answer-body">
                <p>{{ langService.currentLang() === 'ar' ? item.answerAr : item.answerEn }}</p>
              </div>
            }
          </div>
        }

        @if (filteredFaqs().length === 0) {
          <div class="empty-faq">
            <span class="empty-icon">🔍</span>
            <h3>{{ langService.currentLang() === 'ar' ? 'لم نجد نتائج مطابقة لمحتوى بحثك' : 'No matching FAQ questions found' }}</h3>
            <p>{{ langService.currentLang() === 'ar' ? 'جرب البحث بنص آخر أو تواصل معنا مباشرة.' : 'Try a different query or contact support directly.' }}</p>
            <a routerLink="/contact" class="btn btn-primary">{{ langService.t('navContact') }}</a>
          </div>
        }
      </div>

      <!-- STILL HAVE QUESTIONS CTA -->
      <div class="faq-cta-banner">
        <div class="banner-content">
          <h3>{{ langService.currentLang() === 'ar' ? 'لم تجد إجابة لاستفسارك؟' : 'Still have questions?' }}</h3>
          <p>{{ langService.currentLang() === 'ar' ? 'فريق الدعم الطبي والاستشاريين متواجدون على مدار 24/7 لمساعدتك.' : 'Our medical support team and hospital setup specialists are available 24/7.' }}</p>
        </div>
        <a routerLink="/contact" class="btn btn-primary btn-lg">{{ langService.t('navContact') }} &rarr;</a>
      </div>
    </div>
  `,
  styles: [`
    .faq-page {
      padding-top: 2rem;
      padding-bottom: 5rem;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--color-text-subtle);
      margin-bottom: 1.5rem;
    }
    .breadcrumb a { color: var(--color-text-muted); text-decoration: none; }
    .breadcrumb a:hover { color: var(--color-primary); }
    .breadcrumb .separator { color: var(--color-border); }
    .breadcrumb .current { color: var(--color-text-main); font-weight: 700; }

    .page-header {
      margin-bottom: 2.5rem;
    }
    .page-header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0.5rem 0 0.5rem 0;
    }
    .page-header p {
      color: var(--color-text-muted);
      font-size: 1.1rem;
      margin: 0;
    }

    .faq-controls {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      margin-bottom: 2.5rem;
    }

    .faq-search-box {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: var(--bg-card);
      border: 1px solid var(--color-border);
      padding: 0.85rem 1.25rem;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
    }

    .faq-search-input {
      border: none;
      background: none;
      width: 100%;
      font-size: 1rem;
      color: var(--color-text-main);
      font-family: inherit;
    }
    .faq-search-input:focus { outline: none; }

    .faq-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
    }

    .tab-btn {
      background: var(--bg-card);
      border: 1px solid var(--color-border);
      color: var(--color-text-muted);
      padding: 0.6rem 1.1rem;
      border-radius: var(--radius-pill);
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.25s ease;
    }

    .tab-btn.active, .tab-btn:hover {
      background: var(--color-primary-glow);
      border-color: var(--color-border-glow);
      color: var(--color-primary);
    }

    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 3.5rem;
    }

    .faq-card {
      background: var(--bg-glass);
      backdrop-filter: blur(16px);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      overflow: hidden;
      box-shadow: var(--shadow-card);
      transition: all 0.25s ease;
    }

    .faq-card.open {
      border-color: var(--color-border-glow);
      box-shadow: var(--shadow-glow);
    }

    .faq-question-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.35rem 1.6rem;
      background: none;
      border: none;
      color: var(--color-text-main);
      text-align: inherit;
      font-size: 1.1rem;
      font-weight: 800;
      cursor: pointer;

    }

    .toggle-icon {
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--color-primary);
    }

    .faq-answer-body {
      padding: 0 1.6rem 1.5rem 1.6rem;
      color: var(--color-text-muted);
      font-size: 1rem;
      line-height: 1.7;
      border-top: 1px solid var(--color-border);
      margin-top: 0.5rem;
      padding-top: 1rem;
    }

    .empty-faq {
      padding: 4rem 2rem;
      text-align: center;
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
    }

    .faq-cta-banner {
      background: linear-gradient(135deg, var(--color-primary), #0284c7);
      color: #ffffff;
      border-radius: var(--radius-lg);
      padding: 3rem 2.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      box-shadow: var(--shadow-glow);
      flex-wrap: wrap;
    }

    .faq-cta-banner h3 {
      color: #ffffff;
      font-size: 1.6rem;
      margin-bottom: 0.4rem;
    }
    .faq-cta-banner p {
      color: rgba(255, 255, 255, 0.9);
      margin: 0;
      font-size: 1rem;
    }
  `]
})
export class FaqComponent {
  readonly langService = inject(LanguageService);

  searchQuery = signal('');
  selectedCategory = signal<string>('all');
  openFaqId = signal<string | null>('faq-1');

  faqs: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'booking',
      questionAr: 'كيف يمكنني حجز موعد مع استشاري أو عيادة من خلال منصة VEXA؟',
      questionEn: 'How do I book an appointment with a doctor or hospital on VEXA?',
      answerAr: 'يمكنك إما كتابة ما تشتكي منه في محرك البحث الذكي VEXA AI، أو تصفح قسم "المستشفيات والعيادات"، واختيار التخصص المناسب، ثم تحديد اليوم والساعة المناسبة واختيار تأكيد الحجز الفوري للحصول على كود المرجعية.',
      answerEn: 'You can either type your query into VEXA AI search or browse the Organizations directory, select your target specialty, choose an available date and time slot, and click Confirm to get your instant booking reference.'
    },
    {
      id: 'faq-2',
      category: 'booking',
      questionAr: 'هل الحجز عبر المنصة مجاني وتأكيده فوري؟',
      questionEn: 'Is booking free and instantly confirmed?',
      answerAr: 'نعم! الحجز عبر منصة VEXA مجاني بالكامل للمرضى، ويتم ربطه وتأكيده مباشرة في جدول عيادة الطبيب والمستشفى دون الحاجة للانتظار.',
      answerEn: 'Yes! Booking on VEXA is completely free for patients and synchronized in real-time with the hospital and clinic schedule.'
    },
    {
      id: 'faq-3',
      category: 'hospitals',
      questionAr: 'كيف تضمن VEXA جودة واعتماد المستشفيات والعيادات المنضمة؟',
      questionEn: 'How does VEXA verify accredited hospitals and clinics?',
      answerAr: 'تخضع جميع المنشآت الطبية المنضمة لمنظومة VEXA لمراجعة دقيقة لتراخيص وزارة الصحة، وجودة غرف العمليات والتعقيم، وتأكيد اعتماد الأطقم الطبية.',
      answerEn: 'All healthcare organizations undergo strict verification of medical licenses, MOH accreditations, and senior consultant board certifications before receiving the Verified Node badge.'
    },
    {
      id: 'faq-4',
      category: 'ai',
      questionAr: 'كيف يعمل محرك الذكاء الاصطناعي VEXA AI في ترشيح الأطباء؟',
      questionEn: 'How does the VEXA AI engine recommend specialists?',
      answerAr: 'يعتمد محرك VEXA AI على نماذج الذكاء الاصطناعي المتطورة لفهم الوصف الطبي بالأعراض وتحليل المنطقة الجغرافية، وترشيح التخصص والتأكد من خلوه من أي تشخيص أو نصيحة طبية مباشرة اتباعاً للمعايير الدولية.',
      answerEn: 'VEXA AI parses your natural language input, matches symptoms to standardized medical specialties, filters by location, and returns top verified consultants while adhering strictly to safety guardrails.'
    },
    {
      id: 'faq-5',
      category: 'doctors',
      questionAr: 'كيف يمكن للأطباء والمستشفيات الانضمام وشغل ملفاتهم على المنصة؟',
      questionEn: 'How can doctors and hospital managers join VEXA?',
      answerAr: 'يمكن لإدارات المستشفيات والعيادات التواصل معنا عبر صفحة "اتصل بنا" أو الدخول لبوابة "إدارة المستشفى"، حيث نوفر لوحة تحكم كاملة لإدارة الأقسام والأطباء والخدمات وساعات الكشف.',
      answerEn: 'Hospital administrators and consultants can request onboarding via the Contact Us page or sign in via Hospital Admin OS to manage staff, services, and appointment schedules.'
    },
    {
      id: 'faq-6',
      category: 'ai',
      questionAr: 'كيف تتم حماية وتشفير البيانات الطبية للمرضى؟',
      questionEn: 'How is patient medical data secured and encrypted?',
      answerAr: 'تلتزم VEXA بأعلى معايير تشفير البيانات (256-bit SSL Encryption) وحماية الخصوصية المطلقة للبيانات الشخصية وتأكيد الحجوزات.',
      answerEn: 'VEXA uses enterprise-grade 256-bit SSL encryption and strict data privacy compliance to protect all patient booking records.'
    }
  ];

  filteredFaqs = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();
    const isAr = this.langService.currentLang() === 'ar';

    return this.faqs.filter(item => {
      if (cat !== 'all' && item.category !== cat) return false;
      if (q) {
        const text = isAr ? item.questionAr + item.answerAr : item.questionEn + item.answerEn;
        if (!text.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  });

  toggleFaq(id: string): void {
    this.openFaqId.update(current => current === id ? null : id);
  }
}
