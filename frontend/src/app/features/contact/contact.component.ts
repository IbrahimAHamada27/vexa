import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="contact-page container">
      <!-- BREADCRUMB -->
      <nav class="breadcrumb">
        <a routerLink="/">{{ langService.t('navHome') }}</a>
        <span class="separator">/</span>
        <span class="current">{{ langService.t('navContact') }}</span>
      </nav>

      <!-- PAGE HEADER -->
      <header class="page-header">
        <span class="badge badge-emerald">📞 {{ langService.currentLang() === 'ar' ? 'الدعم الفني وشراكات المستشفيات' : '24/7 Support & Hospital Onboarding' }}</span>
        <h1>{{ langService.t('contactTitle') }}</h1>
        <p>{{ langService.t('contactSub') }}</p>
      </header>

      <!-- MAIN CONTENT GRID -->
      <div class="contact-grid">
        <!-- CONTACT FORM CARD -->
        <div class="contact-card form-card">
          <h2>{{ langService.currentLang() === 'ar' ? 'طلب انضمام منشأة أو استفسار عام' : 'Provider Onboarding & Inquiries' }}</h2>
          <p class="form-desc">{{ langService.currentLang() === 'ar' ? 'إذا كنت مستشفى، عيادة، أو طبيب ترغب بالانضمام لشبكة VEXA المعتمدة، املأ البيانات التالية وسيتواصل معك فريق الشراكات فوراً.' : 'Fill out the details below to request hospital network onboarding or general clinical assistance.' }}</p>

          @if (isSubmitted()) {
            <div class="success-box">
              <div class="success-icon">✓</div>
              <h3>{{ langService.currentLang() === 'ar' ? 'تم استلام طلبك بنجاح! 🎉' : 'Request Submitted Successfully! 🎉' }}</h3>
              <p>{{ langService.currentLang() === 'ar' ? 'شكراً لتواصلك مع VEXA. سيتواصل معك أحد ممثلي فريق الشراكات والمستشفيات خلال ساعتين.' : 'Thank you for reaching out to VEXA. A hospital relationship manager will contact you within 2 hours.' }}</p>
              <button type="button" class="btn btn-outline btn-sm" (click)="resetForm()">{{ langService.currentLang() === 'ar' ? 'إرسال طلب جديد' : 'Submit Another Ticket' }}</button>
            </div>
          } @else {
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="contact-form">
              <div class="form-grid">
                <div class="form-group">
                  <label for="name">{{ langService.currentLang() === 'ar' ? 'الاسم بالكامل' : 'Full Name' }} *</label>
                  <input id="name" type="text" formControlName="name" class="form-control" [placeholder]="langService.currentLang() === 'ar' ? 'مثال: أ.د. أحمد الحسين' : 'e.g. Dr. Ahmed Hassan'" />
                </div>

                <div class="form-group">
                  <label for="email">{{ langService.currentLang() === 'ar' ? 'البريد الإلكتروني الرسمي' : 'Official Email' }} *</label>
                  <input id="email" type="email" formControlName="email" class="form-control" placeholder="name@hospital.com" />
                </div>

                <div class="form-group">
                  <label for="phone">{{ langService.currentLang() === 'ar' ? 'رقم الهاتف' : 'Phone Number' }} *</label>
                  <input id="phone" type="tel" formControlName="phone" class="form-control" placeholder="01000000000" />
                </div>

                <div class="form-group">
                  <label for="facilityType">{{ langService.currentLang() === 'ar' ? 'نوع المنشأة / الصفة' : 'Inquiry Type' }}</label>
                  <select id="facilityType" formControlName="facilityType" class="form-select">
                    <option value="hospital">{{ langService.currentLang() === 'ar' ? 'مستشفى خاص' : 'Private Hospital' }}</option>
                    <option value="clinic">{{ langService.currentLang() === 'ar' ? 'عيادة تخصصية' : 'Specialized Clinic' }}</option>
                    <option value="medical_center">{{ langService.currentLang() === 'ar' ? 'مركز طبي متكامل' : 'Medical Center' }}</option>
                    <option value="doctor">{{ langService.currentLang() === 'ar' ? 'طبيب / استشاري مستقل' : 'Doctor / Senior Consultant' }}</option>
                    <option value="patient">{{ langService.currentLang() === 'ar' ? 'مريض / استفسار حجز' : 'Patient / Booking Assistance' }}</option>
                  </select>
                </div>

                <div class="form-group full-width">
                  <label for="message">{{ langService.currentLang() === 'ar' ? 'تفاصيل الرسالة أو الطلب' : 'Message Details' }} *</label>
                  <textarea id="message" formControlName="message" rows="4" class="form-control" [placeholder]="langService.currentLang() === 'ar' ? 'اكتب استفسارك أو تفاصيل العيادة والمستشفى...' : 'Enter your request details...'"></textarea>
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-lg btn-block" [disabled]="contactForm.invalid || isSubmitting()">
                @if (isSubmitting()) {
                  <span>{{ langService.currentLang() === 'ar' ? 'جاري إرسال الطلب...' : 'Sending request...' }}</span>
                } @else {
                  <span>{{ langService.currentLang() === 'ar' ? 'إرسال الطلب لفريق الشراكات ←' : 'Submit Request to VEXA Team ←' }}</span>
                }
              </button>
            </form>
          }
        </div>

        <!-- CONTACT SIDEBAR / INFO CHIPS -->
        <div class="contact-sidebar">
          <div class="contact-card info-card">
            <h3>{{ langService.currentLang() === 'ar' ? 'المقر الرئيسي ووسائل التواصل' : 'HQ & Direct Channels' }}</h3>
            
            <ul class="contact-list">
              <li>
                <span class="icon">📍</span>
                <div>
                  <strong>{{ langService.currentLang() === 'ar' ? 'المقر الرئيسي - التجمع الخامس' : 'Main Office - New Cairo' }}</strong>
                  <p>برج الأطباء الفاخر، شارع التسعين الجنوبي، القاهرة الجديدة</p>
                </div>
              </li>
              <li>
                <span class="icon">🏥</span>
                <div>
                  <strong>{{ langService.currentLang() === 'ar' ? 'فرع مدينة الشروق' : 'Shorouk Medical Branch' }}</strong>
                  <p>الحي السابع، المجمع الطبي التخصصي، مدينة الشروق</p>
                </div>
              </li>
              <li>
                <span class="icon">✉️</span>
                <div>
                  <strong>{{ langService.currentLang() === 'ar' ? 'البريد الإلكتروني للشراكات' : 'Hospital Partnerships' }}</strong>
                  <p>partnerships&#64;vexa-health.com</p>
                </div>
              </li>
              <li>
                <span class="icon">📞</span>
                <div>
                  <strong>{{ langService.currentLang() === 'ar' ? 'الخط الساخن والدعم' : 'Direct Support Hotline' }}</strong>
                  <p>+20 2 2758 3200 / 19000</p>
                </div>
              </li>
            </ul>
          </div>

          <div class="contact-card map-card">
            <h3>{{ langService.currentLang() === 'ar' ? 'ساعات العمل والدعم الفني' : 'Support Availability' }}</h3>
            <div class="hours-list">
              <div class="hour-row">
                <span>{{ langService.currentLang() === 'ar' ? 'منصة الحجز والذكاء الاصطناعي:' : 'AI Engine & Booking OS:' }}</span>
                <strong class="highlight">24/7 {{ langService.currentLang() === 'ar' ? 'على مدار الساعة' : 'Always Online' }}</strong>
              </div>
              <div class="hour-row">
                <span>{{ langService.currentLang() === 'ar' ? 'فريق انضمام المستشفيات:' : 'Hospital Onboarding Team:' }}</span>
                <strong>{{ langService.currentLang() === 'ar' ? 'الأحد - الخميس (9 ص - 6 م)' : 'Sun - Thu (9 AM - 6 PM)' }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-page {
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

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    @media (min-width: 992px) {
      .contact-grid {
        grid-template-columns: 2fr 1fr;
      }
    }

    .contact-card {
      background: var(--bg-glass);
      backdrop-filter: blur(16px);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 2.25rem;
      box-shadow: var(--shadow-card);
    }

    .form-card h2 {
      font-size: 1.6rem;
      margin-bottom: 0.4rem;
    }

    .form-desc {
      color: var(--color-text-muted);
      font-size: 0.95rem;
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;
    }

    @media (min-width: 640px) {
      .form-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .full-width {
        grid-column: span 2;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .form-group label {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--color-text-main);
    }

    .form-control, .form-select {
      padding: 0.85rem 1.1rem;
      font-size: 0.95rem;
      font-family: inherit;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--bg-card);
      color: var(--color-text-main);
    }

    .form-control:focus, .form-select:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    .btn-block {
      width: 100%;
      text-align: center;
    }

    .success-box {
      background: var(--color-secondary-glow);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: var(--radius-md);
      padding: 2.5rem 1.5rem;
      text-align: center;
    }

    .success-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #10b981;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin: 0 auto 1rem auto;
    }

    .contact-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }

    .contact-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .contact-list li {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .contact-list .icon {
      font-size: 1.4rem;
    }

    .contact-list strong {
      display: block;
      color: var(--color-text-main);
      font-size: 0.95rem;
    }

    .contact-list p {
      margin: 0.2rem 0 0 0;
      font-size: 0.875rem;
      color: var(--color-text-muted);
    }

    .hours-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }

    .hour-row {
      display: flex;
      flex-direction: column;
      font-size: 0.85rem;
      gap: 0.2rem;
    }

    .hour-row .highlight {
      color: #34d399;
      font-size: 0.95rem;
    }
  `]
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  readonly langService = inject(LanguageService);

  isSubmitting = signal(false);
  isSubmitted = signal(false);

  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(8)]],
    facilityType: ['hospital'],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  onSubmit(): void {
    if (this.contactForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.isSubmitted.set(true);
    }, 1200);
  }

  resetForm(): void {
    this.isSubmitted.set(false);
    this.contactForm.reset({ facilityType: 'hospital' });
  }
}
