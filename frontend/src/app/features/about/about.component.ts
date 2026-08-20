import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="about-page container">
      <!-- BREADCRUMB -->
      <nav class="breadcrumb">
        <a routerLink="/">{{ langService.t('navHome') }}</a>
        <span class="separator">/</span>
        <span class="current">{{ langService.t('navAbout') }}</span>
      </nav>

      <!-- PAGE HEADER -->
      <header class="page-header">
        <span class="badge badge-cyan">📌 {{ langService.currentLang() === 'ar' ? 'نموذج العمل التجاري والاستثماري' : 'Business Model Canvas (BMC)' }}</span>
        <h1>{{ langService.t('aboutTitle') }}</h1>
        <p>{{ langService.t('aboutSub') }}</p>
      </header>

      <!-- HERO STATS & VISION BANNER -->
      <div class="about-vision-card">
        <div class="vision-content">
          <h2>{{ langService.currentLang() === 'ar' ? 'التحول الرقمي لمنظومة المستشفيات الخاصة والعيادات' : 'Empowering Digital Health Transformation' }}</h2>
          <p>
            {{ langService.currentLang() === 'ar'
              ? 'تعتبر منصة VEXA منظومة إكلينيكية متكاملة لربط شبكات المستشفيات الخاصة والعيادات والأطقم الطبية بالمرضى، وتسهيل الاكتشاف الطبي بالذكاء الاصطناعي والحجز الفوري.'
              : 'VEXA is a comprehensive clinical OS connecting private hospital networks, clinics, and medical consultants with patients using AI provider discovery and real-time appointment booking.'
            }}
          </p>
        </div>
      </div>

      <!-- INTERACTIVE BUSINESS MODEL CANVAS (BMC) GRID -->
      <section class="bmc-section">
        <div class="section-title-wrap">
          <h2>📌 Business Model Canvas (BMC)</h2>
          <p>{{ langService.currentLang() === 'ar' ? 'مخطط نموذج العمل الاستثماري الجوهري لمنظومة VEXA الطبية' : 'Core Business Architecture & Enterprise Value Proposition' }}</p>
        </div>

        <div class="bmc-grid">
          <!-- 1. KEY PARTNERS -->
          <div class="bmc-card partners">
            <div class="card-header-bar">
              <span class="icon">🤝</span>
              <h3>{{ langService.currentLang() === 'ar' ? 'الشركاء الرئيسيون' : 'Key Partners' }}</h3>
            </div>
            <ul class="sticky-notes">
              <li class="blue">Private Clinics & Hospitals</li>
              <li class="blue">Doctors & Medical Teams</li>
              <li class="blue">Healthcare Service Providers</li>
              <li class="blue">Technology & Cloud Providers</li>
              <li class="blue">Marketing & Healthcare Partners</li>
            </ul>
          </div>

          <!-- 2. KEY ACTIVITIES -->
          <div class="bmc-card activities">
            <div class="card-header-bar">
              <span class="icon">⚡</span>
              <h3>{{ langService.currentLang() === 'ar' ? 'الأنشطة الرئيسية' : 'Key Activities' }}</h3>
            </div>
            <ul class="sticky-notes">
              <li class="purple">Platform Development & Maintenance</li>
              <li class="purple">Clinic/Hospital Onboarding</li>
              <li class="purple">Content & Profile Management</li>
              <li class="purple">Customer Support</li>
              <li class="purple">Platform Security & Reliability</li>
              <li class="purple">Marketing & User Acquisition</li>
            </ul>
          </div>

          <!-- 3. KEY PROPOSITIONS -->
          <div class="bmc-card propositions">
            <div class="card-header-bar">
              <span class="icon">💎</span>
              <h3>{{ langService.currentLang() === 'ar' ? 'القيمة المضافة' : 'Key Propositions' }}</h3>
            </div>
            <ul class="sticky-notes">
              <li class="yellow">One Professional Digital Presence</li>
              <li class="yellow">Showcase Doctors, Departments & Services</li>
              <li class="yellow">Easier Healthcare Discovery</li>
              <li class="yellow">AI-Powered Provider Discovery</li>
              <li class="yellow">Simple Appointment Booking</li>
              <li class="yellow">Professional Medical Profiles</li>
            </ul>
          </div>

          <!-- 4. CUSTOMER RELATIONSHIPS -->
          <div class="bmc-card relationships">
            <div class="card-header-bar">
              <span class="icon">❤️</span>
              <h3>{{ langService.currentLang() === 'ar' ? 'العلاقات مع العملاء' : 'Customer Relationships' }}</h3>
            </div>
            <ul class="sticky-notes">
              <li class="orange">Self-Service Platform</li>
              <li class="orange">Onboarding & Setup Support</li>
              <li class="orange">Customer Support</li>
              <li class="orange">Long-Term Healthcare Partnerships</li>
            </ul>
          </div>

          <!-- 5. CUSTOMER SEGMENTS -->
          <div class="bmc-card segments">
            <div class="card-header-bar">
              <span class="icon">🎯</span>
              <h3>{{ langService.currentLang() === 'ar' ? 'شرائح العملاء' : 'Customer Segments' }}</h3>
            </div>
            <ul class="sticky-notes">
              <li class="pink">Private Clinics</li>
              <li class="pink">Private Hospitals</li>
              <li class="pink">Medical Centers</li>
              <li class="pink">Doctors & Medical Teams</li>
              <li class="pink">Patients & Care Seekers</li>
              <li class="pink">Multi-Branch Healthcare Organizations</li>
            </ul>
          </div>

          <!-- 6. CHANNELS -->
          <div class="bmc-card channels">
            <div class="card-header-bar">
              <span class="icon">📢</span>
              <h3>{{ langService.currentLang() === 'ar' ? 'قنوات التوزيع' : 'Channels' }}</h3>
            </div>
            <ul class="sticky-notes">
              <li class="orange">VEXA Web Platform</li>
              <li class="orange">Direct Sales & Clinic Onboarding</li>
              <li class="orange">Social Media Digital Marketing</li>
              <li class="orange">Healthcare Partnerships</li>
              <li class="orange">Search Engines / SEO</li>
            </ul>
          </div>

          <!-- 7. KEY RESOURCES -->
          <div class="bmc-card resources">
            <div class="card-header-bar">
              <span class="icon">🔑</span>
              <h3>{{ langService.currentLang() === 'ar' ? 'الموارد الرئيسية' : 'Key Resources' }}</h3>
            </div>
            <ul class="sticky-notes">
              <li class="blue">VEXA Platform & Technology</li>
              <li class="blue">Healthcare Organization & Doctor Data</li>
              <li class="blue">Development & Product Team</li>
              <li class="blue">AI & Cloud Infrastructure</li>
            </ul>
          </div>

          <!-- 8. COST STRUCTURE -->
          <div class="bmc-card cost-structure full-row">
            <div class="card-header-bar">
              <span class="icon">📉</span>
              <h3>{{ langService.currentLang() === 'ar' ? 'هيكل التكاليف' : 'Cost Structure' }}</h3>
            </div>
            <ul class="sticky-notes horizontal">
              <li class="green">Platform Development & Maintenance</li>
              <li class="green">Cloud Infrastructure</li>
              <li class="green">AI / API Usage Costs</li>
              <li class="green">Marketing & Acquisition</li>
              <li class="green">Customer Support & Onboarding</li>
              <li class="green">Security & Data Protection</li>
            </ul>
          </div>

          <!-- 9. REVENUE STREAMS -->
          <div class="bmc-card revenue-streams full-row">
            <div class="card-header-bar">
              <span class="icon">💵</span>
              <h3>{{ langService.currentLang() === 'ar' ? 'مصادر الإيرادات' : 'Revenue Streams' }}</h3>
            </div>
            <ul class="sticky-notes horizontal">
              <li class="bright-green">Clinic & Hospital Subscriptions</li>
              <li class="bright-green">Premium Organization Profiles</li>
              <li class="bright-green">Booking / Platform Fees</li>
              <li class="bright-green">Enterprise Plans</li>
              <li class="bright-green">Sponsored Visibility (Future)</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- CTA BANNER -->
      <div class="about-cta-banner">
        <h2>{{ langService.currentLang() === 'ar' ? 'هل ترغب بانضمام مستشفاك لشبكة VEXA؟' : 'Ready to Onboard Your Hospital Network?' }}</h2>
        <p>{{ langService.currentLang() === 'ar' ? 'انضم الآن لشبكة كبرى المستشفيات والعيادات المعتمدة واحصل على ملف منشأة فاخر ولوحة تحكم متكاملة.' : 'Join accredited healthcare providers and access enterprise clinical management tools today.' }}</p>
        <div class="cta-actions">
          <a routerLink="/contact" class="btn btn-primary btn-lg">{{ langService.t('navContact') }} &rarr;</a>
          <a routerLink="/organizations" class="btn btn-outline btn-lg">{{ langService.t('navOrganizations') }}</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .about-page {
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

    .about-vision-card {
      background: var(--bg-glass);
      backdrop-filter: blur(16px);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 3rem 2.5rem;
      margin-bottom: 3.5rem;
      box-shadow: var(--shadow-card);
    }
    .vision-content h2 {
      font-size: 1.8rem;
      margin-bottom: 0.75rem;
    }
    .vision-content p {
      font-size: 1.1rem;
      line-height: 1.7;
      margin: 0;
      color: var(--color-text-muted);
    }

    /* BMC CANVAS DISPLAY */
    .bmc-section {
      margin-bottom: 4rem;
    }

    .section-title-wrap {
      margin-bottom: 2rem;
    }
    .section-title-wrap h2 {
      font-size: 2rem;
      margin-bottom: 0.4rem;
    }

    .bmc-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1.25rem;
    }

    @media (max-width: 1024px) {
      .bmc-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .bmc-grid {
        grid-template-columns: 1fr;
      }
    }

    .bmc-card {
      background: var(--bg-glass);
      backdrop-filter: blur(16px);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 1.35rem;
      box-shadow: var(--shadow-sm);
    }

    .bmc-card.full-row {
      grid-column: 1 / -1;
    }

    .card-header-bar {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 0.6rem;
    }

    .card-header-bar h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 800;

    }

    .sticky-notes {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .sticky-notes.horizontal {
      flex-direction: row;
      flex-wrap: wrap;
    }

    .sticky-notes li {
      padding: 0.65rem 0.85rem;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      font-weight: 700;
      line-height: 1.4;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    }

    .sticky-notes li.blue { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
    .sticky-notes li.purple { background: #f3e8ff; color: #6b21a8; border: 1px solid #e9d5ff; }
    .sticky-notes li.yellow { background: #fef9c3; color: #854d0e; border: 1px solid #fef08a; }
    .sticky-notes li.orange { background: #ffedd5; color: #9a3412; border: 1px solid #fed7aa; }
    .sticky-notes li.pink { background: #ffe4e6; color: #9f1239; border: 1px solid #fecdd3; }
    .sticky-notes li.green { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .sticky-notes li.bright-green { background: #10b981; color: #ffffff; }

    /* CTA BANNER */
    .about-cta-banner {
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      color: #ffffff;
      border-radius: var(--radius-lg);
      padding: 3.5rem 2.5rem;
      text-align: center;
      box-shadow: var(--shadow-glow);
    }

    .about-cta-banner h2 {
      color: #ffffff;
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .about-cta-banner p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.1rem;
      max-width: 680px;
      margin: 0 auto 2rem auto;
    }

    .cta-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
  `]
})
export class AboutComponent {
  readonly langService = inject(LanguageService);
}
