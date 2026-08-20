import { Injectable, signal, computed, effect } from '@angular/core';

export type LanguageCode = 'ar' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANG_KEY = 'vexa_language_mode';

  // Language signal (Default: 'ar' for Arabic)
  readonly currentLang = signal<LanguageCode>(this.getInitialLang());
  readonly isRtl = computed(() => this.currentLang() === 'ar');

  // Translations dictionary
  private readonly translations: Record<LanguageCode, Record<string, string>> = {
    ar: {
      // Navbar & General
      brandName: 'فيكسا',
      brandTagline: 'منظومة التشغيل والبحث الطبي الذكي',
      navHome: 'الرئيسية',
      navOrganizations: 'المستشفيات والعيادات',
      navBooking: 'الحجز الذكي',
      navAdminPortal: '🏥 إدارة المستشفى',
      navDoctorPortal: '👨‍⚕️ بوابة الطبيب',
      navSignIn: 'تسجيل الدخول',
      navSignOut: 'تسجيل الخروج',
      
      // Hero Section
      heroBadge: '⚡ اكتشاف الرعاية الطبية بالذكاء الاصطناعي',
      heroTitle: 'اعثر على أفضل الرعاية الطبية والأطباء في أكبر المستشفيات',
      heroSubtitle: 'اخبر VEXA بما تبحث عنه وسنقوم بترشيح أفضل المستشفيات والعيادات ونخبة الاستشاريين المناسبين لحالتك فوراً.',
      searchPlaceholder: 'مثال: أحتاج استشاري أمراض جلدية في الشروق أو التجمع',
      findProvidersBtn: 'البحث عن المستشفيات والعيادات ←',
      findingProvidersBtn: 'جاري جلب الترشيحات الطبية...',
      trySearching: 'مقترحات بحث شائعة:',

      // Trust Grid
      trustTitle1: 'مستشفيات خاصة معتمدة',
      trustDesc1: 'شبكة موثوقة تضم كبرى المستشفيات والمراكز الطبية المعتمدة.',
      trustTitle2: 'ترشيح ذكي دقيق',
      trustDesc2: 'خوارزمية ذكاء اصطناعي تفهم الأعراض وترشح لك التخصص الأمثل.',
      trustTitle3: 'حجز فوري مؤكد',
      trustDesc3: 'مواعيد حقيقية محدثة مباشرة مع جدول العيادات والاستشاريين.',
      trustTitle4: 'خصوصية وأمان بياناتك',
      trustDesc4: 'التزام تام بأعلى معايير تشفير وحماية البيانات الطبية للمرضى.',

      // Sections
      topOrganizationsTitle: 'أبرز المستشفيات والمراكز الطبية',
      topOrganizationsSub: 'استكشف كبرى المنشآت الطبية المجهزة بأحدث التقنيات وأفضل الأطقم الطبية.',
      viewAllOrgs: 'عرض جميع المستشفيات والعيادات ←',
      
      topDoctorsTitle: 'نخبة الأطباء والاستشاريين',
      topDoctorsSub: 'حجز مباشر مع كبار الاستشاريين وأساتذة الطب في مختلف التخصصات.',
      viewAllDoctors: 'عرض كل الأطباء والتخصصات ←',

      howItWorksTitle: 'كيف تعمل منظومة VEXA الطبية؟',
      howItWorksSub: 'ثلاث خطوات بسيطة للحصول على أفضل رعاية صحية لك ولأسرتك.',
      step1Title: '١. ادخل الأعراض أو التخصص',
      step1Desc: 'اكتب ما تشعر به أو حدد التخصص والمنطقة الجغرافية المطلوبة.',
      step2Title: '٢. اختر الطبيب أو المستشفى',
      step2Desc: 'استعرض الملفات الشاملة، التقييمات، والخبرات وسعر الكشف بكل شفافية.',
      step3Title: '٣. تأكيد الحجز الفوري',
      step3Desc: 'اختر اليوم والوقت المناسب واحصل على رقم تأكيد الحجز المباشر.',

      // Footer
      footerTagline: 'تمكين شبكات المستشفيات الخاصة والعمليات الإكلينيكية والحجز الذكي في كبرى المنشآت الطبية.',
      footerDisclaimer: '🛡️ إخلاء مسؤولية طبية: منصة VEXA تسهل اكتشاف الخدمات الطبية وحجز المواعيد ولا تستبدل الاستجابة للطوارئ الفورية.',
      footerRights: 'جميع الحقوق محفوظة © ٢٠٢٦ منصة VEXA للتكنولوجيا الطبية.',

      // Filter Labels
      searchOrgPlaceholder: 'ابحث باسم المستشفى، التخصص، أو المدينة...',
      filterTypeAll: 'جميع المنشآت',
      filterTypeHospital: 'مستشفى خاص',
      filterTypeClinic: 'عيادة تخصصية',
      filterTypeMedicalCenter: 'مركز طبي متكامل',
      filterCityAll: 'جميع المدن',
      filterCityCairo: 'القاهرة',
      filterCityShorouk: 'الشروق',
      filterCityNewCairo: 'التجمع الخامس',
      filterCityGiza: 'الجيزة',
      filterCityAlex: 'الإسكندرية',

      // Doctor & Org Cards
      rating: 'التقييم',
      reviews: 'تقييم',
      consultationFee: 'قيمة الكشف',
      experienceYears: 'سنوات الخبرة',
      languages: 'اللغات',
      viewProfile: 'عرض الملف الكامل ←',
      viewOrgProfile: 'عرض ملف المنشأة ←',
      verifiedNode: 'منشأة معتمدة',

      // Booking Flow
      bookingTitle: 'الحجز الطبي الذكي',
      bookingSub: 'خطوات حجز موعد مؤكد مع الطبيب أو المنشأة الطبية',
      stepSelectProvider: '١. اختيار المنشأة والطبيب',
      stepSelectTime: '٢. تحديد الموعد المناسب',
      stepPatientDetails: '٣. بيانات المريض والـتأكيد',
      confirmBookingBtn: 'تأكيد الحجز الفوري ←',
      bookingSuccessTitle: 'تم تأكيد حجزك بنجاح! 🎉',
      bookingSuccessDesc: 'تم تسجيل موعدك في جدول العيادة مباشرة وسنرسل لك تفاصيل التذكير.',
      refNumber: 'رقم المرجعية:',
      backToHome: 'العودة للرئيسية',
      bookAnother: 'حجز موعد جديد',

      // Admin & Doctor Portals
      adminPortalTitle: 'مركز قيادة وإدارة المستشفى',
      adminPortalSub: 'منظومة VEXA السحابية لإدارة المنشآت والعيادات والأطقم الطبية',
      doctorPortalTitle: 'بوابة الطبيب والاستشاري',
      doctorPortalSub: 'متابعة جدول الكشوفات اليومية والمواعيد المتاحة للمرضى',
      confirmedStatus: 'مؤكد',
      pendingStatus: 'قيد الانتظار',
      cancelledStatus: 'ملغي',
      confirmAction: 'تأكيد',
      cancelAction: 'إلغاء'
    },
    en: {
      // Navbar & General
      brandName: 'VEXA',
      brandTagline: 'Clinical OS & Smart Discovery',
      navHome: 'Home',
      navOrganizations: 'Organizations',
      navBooking: 'Smart Booking',
      navAdminPortal: '🏥 Hospital Admin',
      navDoctorPortal: '👨‍⚕️ Doctor Portal',
      navSignIn: 'Sign In',
      navSignOut: 'Sign Out',
      
      // Hero Section
      heroBadge: '⚡ AI-POWERED HEALTHCARE DISCOVERY',
      heroTitle: 'Find Top-Tier Healthcare Providers & Senior Consultants',
      heroSubtitle: 'Tell VEXA what kind of medical care you need, and our intelligent clinical engine will recommend the best hospitals, clinics, and specialists instantly.',
      searchPlaceholder: 'e.g. I need a dermatologist consultant near El Shorouk',
      findProvidersBtn: 'Find Hospitals & Clinics ←',
      findingProvidersBtn: 'Analyzing clinical recommendations...',
      trySearching: 'Popular search queries:',

      // Trust Grid
      trustTitle1: 'Verified Private Hospitals',
      trustDesc1: 'A trusted network of accredited multi-specialty hospitals and medical centers.',
      trustTitle2: 'Accurate AI Matching',
      trustDesc2: 'Intelligent clinical algorithms matching your symptoms with the right specialty.',
      trustTitle3: 'Instant Confirmed Slots',
      trustDesc3: 'Real-time updated availability synchronized directly with clinic schedules.',
      trustTitle4: 'Enterprise Data Security',
      trustDesc4: 'Strict compliance with global health data privacy and encryption standards.',

      // Sections
      topOrganizationsTitle: 'Premier Hospitals & Medical Centers',
      topOrganizationsSub: 'Discover state-of-the-art medical institutions with world-class facilities and senior care teams.',
      viewAllOrgs: 'View All Healthcare Institutions ←',
      
      topDoctorsTitle: 'Senior Consultants & Specialists',
      topDoctorsSub: 'Direct appointment booking with leading professors and board-certified consultants.',
      viewAllDoctors: 'Explore Specialist Directory ←',

      howItWorksTitle: 'How VEXA Clinical Platform Works',
      howItWorksSub: 'Three simple steps to secure world-class healthcare for you and your family.',
      step1Title: '1. Describe Symptoms or Specialty',
      step1Desc: 'Enter your medical condition, preferred location, or target medical specialty.',
      step2Title: '2. Select Doctor or Hospital',
      step2Desc: 'Review transparent doctor profiles, ratings, consultation fees, and patient feedback.',
      step3Title: '3. Instant Appointment Confirmation',
      step3Desc: 'Choose an available time slot and receive an instant booking reference number.',

      // Footer
      footerTagline: 'Empowering private hospital networks, clinical operations, and AI-driven appointment discovery.',
      footerDisclaimer: '🛡️ Private Healthcare Network Disclaimer: VEXA is a clinical technology platform facilitating appointment scheduling and doctor discovery. It does not replace direct emergency response.',
      footerRights: '© 2026 VEXA HealthTech Inc. All Rights Reserved. Private Hospital Edition.',

      // Filter Labels
      searchOrgPlaceholder: 'Search hospital name, specialty, or location...',
      filterTypeAll: 'All Facilities',
      filterTypeHospital: 'Private Hospital',
      filterTypeClinic: 'Specialized Clinic',
      filterTypeMedicalCenter: 'Medical Center',
      filterCityAll: 'All Cities',
      filterCityCairo: 'Cairo',
      filterCityShorouk: 'El Shorouk',
      filterCityNewCairo: 'New Cairo',
      filterCityGiza: 'Giza',
      filterCityAlex: 'Alexandria',

      // Doctor & Org Cards
      rating: 'Rating',
      reviews: 'reviews',
      consultationFee: 'Consultation Fee',
      experienceYears: 'Years Experience',
      languages: 'Languages',
      viewProfile: 'View Full Profile ←',
      viewOrgProfile: 'View Institution Profile ←',
      verifiedNode: 'Verified Node',

      // Booking Flow
      bookingTitle: 'Smart Clinical Booking',
      bookingSub: 'Confirmed appointment scheduling with healthcare providers',
      stepSelectProvider: '1. Select Provider',
      stepSelectTime: '2. Choose Time Slot',
      stepPatientDetails: '3. Patient Info & Confirm',
      confirmBookingBtn: 'Confirm Instant Booking ←',
      bookingSuccessTitle: 'Appointment Confirmed Successfully! 🎉',
      bookingSuccessDesc: 'Your appointment has been registered directly in the clinic schedule.',
      refNumber: 'Booking Reference:',
      backToHome: 'Return to Home',
      bookAnother: 'Book Another M.D.',

      // Admin & Doctor Portals
      adminPortalTitle: 'Hospital Command & Operations OS',
      adminPortalSub: 'VEXA Cloud OS for facility, department, and medical staff administration',
      doctorPortalTitle: 'Consultant Clinical Portal',
      doctorPortalSub: 'Daily clinical schedule, patient queue, and availability slot management',
      confirmedStatus: 'Confirmed',
      pendingStatus: 'Pending',
      cancelledStatus: 'Cancelled',
      confirmAction: 'Confirm',
      cancelAction: 'Cancel'
    }
  };

  constructor() {
    effect(() => {
      const lang = this.currentLang();
      this.applyLanguageToDocument(lang);
    });
  }

  toggleLanguage(): void {
    const nextLang: LanguageCode = this.currentLang() === 'ar' ? 'en' : 'ar';
    this.currentLang.set(nextLang);
    localStorage.setItem(this.LANG_KEY, nextLang);
  }

  setLanguage(lang: LanguageCode): void {
    this.currentLang.set(lang);
    localStorage.setItem(this.LANG_KEY, lang);
  }

  t(key: string): string {
    const lang = this.currentLang();
    return this.translations[lang]?.[key] || this.translations['en']?.[key] || key;
  }

  private getInitialLang(): LanguageCode {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.LANG_KEY) as LanguageCode | null;
      if (saved === 'ar' || saved === 'en') {
        return saved;
      }
    }
    return 'ar'; // Default to Arabic as requested by user
  }

  private applyLanguageToDocument(lang: LanguageCode): void {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    if (lang === 'ar') {
      html.setAttribute('dir', 'rtl');
    } else {
      html.setAttribute('dir', 'ltr');
    }
  }
}
