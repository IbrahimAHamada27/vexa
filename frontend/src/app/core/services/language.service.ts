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
      navFaq: 'الأسئلة الشائعة',
      navContact: 'اتصل بنا',
      navAbout: 'عن المنظومة ورؤيتنا',
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

      // FAQ & Contact
      faqTitle: 'الأسئلة الشائعة والدعم الفني',
      faqSub: 'إجابات شاملة لجميع استفسارات المرضى والأطباء وإدارة المستشفيات',
      contactTitle: 'تواصل مع منصة VEXA',
      contactSub: 'نحن هنا لمساعدتك على مدار الساعة والانضمام لشبكة المستشفيات المعتمدة',
      aboutTitle: 'عن منصة VEXA والنموذج الاستثماري (BMC)',
      aboutSub: 'النموذج التشغيلي والقيم الجوهرية للتحول الرقمي في القطاع الطبي الخاص',

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
      navFaq: 'FAQ',
      navContact: 'Contact Us',
      navAbout: 'About & Business Model',
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

      // FAQ & Contact
      faqTitle: 'Frequently Asked Questions (FAQ)',
      faqSub: 'Comprehensive answers for patients, doctors, and hospital administrators',
      contactTitle: 'Get in Touch with VEXA',
      contactSub: 'Support 24/7 and direct onboarding for accredited healthcare providers',
      aboutTitle: 'About VEXA & Executive Vision',
      aboutSub: 'Operational Architecture and Value Propositions for Private Healthcare Transformation',

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

  // Translation Mappings for Dynamic DB Data
  private readonly entityTranslations: Record<string, { ar: string; en: string }> = {
    // Organizations
    'مستشفى الشروق الدولي التخصصي': { ar: 'مستشفى الشروق الدولي التخصصي', en: 'Shorouk International Specialized Hospital' },
    'مركز فيكسا الطبي المتقدم بالتجمع': { ar: 'مركز فيكسا الطبي المتقدم بالتجمع', en: 'VEXA Advanced Medical Center' },
    'مركز فيكسا الطبي المتقدم': { ar: 'مركز فيكسا الطبي المتقدم', en: 'VEXA Advanced Medical Center' },
    'مستشفى السلام الدولي بالمعادي': { ar: 'مستشفى السلام الدولي بالمعادي', en: 'Al Salam International Hospital (Maadi)' },
    'مستشفى السلام الدولي': { ar: 'مستشفى السلام الدولي', en: 'Al Salam International Hospital' },
    'مستشفى دار الفؤاد 6 أكتوبر': { ar: 'مستشفى دار الفؤاد 6 أكتوبر', en: 'Dar Al Fouad Hospital (6th October)' },
    'مستشفى الصفوة التخصصي بالإسكندرية': { ar: 'مستشفى الصفوة التخصصي بالإسكندرية', en: 'Al Safwa Specialized Hospital (Alexandria)' },
    'مجمع عيادات النيل التخصصية بالدقي': { ar: 'مجمع عيادات النيل التخصصية بالدقي', en: 'Nile Specialized Clinics (Dokki)' },

    // Descriptions
    'صرح طبي استثماري متكامل بمدينة الشروق يضم وحدات القسطرة القلبية، الطوارئ على مدار 24 ساعة، وجراحات المناظير المتقدمة.': {
      ar: 'صرح طبي استثماري متكامل بمدينة الشروق يضم وحدات القسطرة القلبية، الطوارئ على مدار 24 ساعة، وجراحات المناظير المتقدمة.',
      en: 'A premier multi-specialty hospital in El Shorouk featuring 24/7 cardiac catheterization units and advanced laparoscopic surgery.'
    },
    'مركز طبي فاخر بقلب التجمع الخامس يوفر أحدث تقنيات التشخيص، الأشعة المقطعية، وعيادات كبار الاستشاريين أساتذة الجامعات.': {
      ar: 'مركز طبي فاخر بقلب التجمع الخامس يوفر أحدث تقنيات التشخيص، الأشعة المقطعية، وعيادات كبار الاستشاريين أساتذة الجامعات.',
      en: 'A state-of-the-art medical center in New Cairo providing diagnostic imaging, CT scans, and senior university professor clinics.'
    },
    'من أعرق المستشفيات الخاصة في مصر الحاصلة على الاعتماد الدولي JCI، متخصصة في زراعة الأعضاء وجراحات القلب والمخ والأعصاب.': {
      ar: 'من أعرق المستشفيات الخاصة في مصر الحاصلة على الاعتماد الدولي JCI، متخصصة في زراعة الأعضاء وجراحات القلب والمخ والأعصاب.',
      en: 'JCI-accredited landmark hospital in Maadi specializing in organ transplant, open-heart, and neurosurgery.'
    },
    'مركز تميز إقليمي لجراحات القلب والأورام والعظام، مجهز بأحدث الرعايات المركزة وأجنحة الإقامة الفاخرة.': {
      ar: 'مركز تميز إقليمي لجراحات القلب والأورام والعظام، مجهز بأحدث الرعايات المركزة وأجنحة الإقامة الفاخرة.',
      en: 'Regional center of excellence in 6th of October for cardiology, oncology, and orthopedic surgeries.'
    },
    'مستشفى استثماري رائد بالعروس الإسكندرية يقدم خدمات الجراحة العامة، مناظير الجهاز الهضمي، وعيادات طب الأطفال والنساء.': {
      ar: 'مستشفى استثماري رائد بالعروس الإسكندرية يقدم خدمات الجراحة العامة، مناظير الجهاز الهضمي، وعيادات طب الأطفال والنساء.',
      en: 'Leading private hospital in Alexandria offering general surgery, endoscopy, pediatrics, and OB/GYN clinics.'
    },

    // Cities & Addresses
    'الشروق': { ar: 'مدينة الشروق', en: 'El Shorouk City' },
    'القاهرة الجديده': { ar: 'التجمع الخامس - القاهرة الجديدة', en: 'New Cairo (5th Settlement)' },
    'القاهرة': { ar: 'القاهرة', en: 'Cairo' },
    'الجيزة': { ar: 'الجيزة (6 أكتوبر / الدقي)', en: 'Giza (6th October / Dokki)' },
    'الإسكندرية': { ar: 'الإسكندرية', en: 'Alexandria' },

    'حي الأشجار، الحي السابع - مدينة الشروق': { ar: 'حي الأشجار، الحي السابع - مدينة الشروق', en: 'Trees District, 7th Neighborhood - El Shorouk City' },
    'حي الأشجار - مدينة الشروق': { ar: 'حي الأشجار - مدينة الشروق', en: 'Trees District - El Shorouk City' },
    'شارع التسعين الجنوبي، مجمع العيادات الفاخرة - التجمع الخامس': { ar: 'شارع التسعين الجنوبي، مجمع العيادات الفاخرة - التجمع الخامس', en: 'South 90th St, Medical Complex - New Cairo' },
    'التجمع الخامس - شارع التسعين': { ar: 'التجمع الخامس - شارع التسعين', en: 'South 90th St - New Cairo' },
    'كورنيش المعادي، برج الأطباء - القاهرة': { ar: 'كورنيش المعادي، برج الأطباء - القاهرة', en: 'Maadi Corniche, Medical Tower - Cairo' },
    'المعادي - الكورنيش': { ar: 'المعادي - الكورنيش', en: 'Maadi Corniche - Cairo' },
    'امتداد محور 26 يوليو، مدينة 6 أكتوبر': { ar: 'امتداد محور 26 يوليو، مدينة 6 أكتوبر', en: '26th of July Axis - 6th October City' },
    'طريق الجيش، لوران - الإسكندرية': { ar: 'طريق الجيش، لوران - الإسكندرية', en: 'Army Road, Loran - Alexandria' },
    'شارع مصدق، الدقي - الجيزة': { ar: 'شارع مصدق، الدقي - الجيزة', en: 'Mossadak St, Dokki - Giza' },

    // Doctors
    'أ.د. أحمد عبد الرحمن الحسين': { ar: 'أ.د. أحمد عبد الرحمن الحسين', en: 'Prof. Dr. Ahmed Abdelrahman' },
    'د. مريم الشناوي': { ar: 'د. مريم الشناوي', en: 'Dr. Maryam El Shennawy' },
    'د. خالد مصطفى السويفي': { ar: 'د. خالد مصطفى السويفي', en: 'Dr. Khaled M. El Sweify' },
    'د. خالد مصطفى': { ar: 'د. خالد مصطفى', en: 'Dr. Khaled M. El Sweify' },
    'أ.د. عمر نبيل الدسوقي': { ar: 'أ.د. عمر نبيل الدسوقي', en: 'Prof. Dr. Omar N. El Desouky' },
    'أ.د. ياسمين فاروق عبد العزيز': { ar: 'أ.د. ياسمين فاروق عبد العزيز', en: 'Prof. Dr. Yasmine F. Abdelaziz' },
    'د. طارق سامي الشريف': { ar: 'د. طارق سامي الشريف', en: 'Dr. Tarek S. El Sherif' },
    'أ.د. حسام الدين شريف': { ar: 'أ.د. حسام الدين شريف', en: 'Prof. Dr. Hossam El Din Sherif' },
    'د. رانيا المهدي': { ar: 'د. رانيا المهدي', en: 'Dr. Rania El Mahdy' },
    'أ.د. شريف العريان': { ar: 'أ.د. شريف العريان', en: 'Prof. Dr. Sherif El Arian' },
    'د. نورهان عبد السلام': { ar: 'د. نورهان عبد السلام', en: 'Dr. Nourhan Abdel Salam' },
    'د. كريم عبد اللطيف': { ar: 'د. كريم عبد اللطيف', en: 'Dr. Kareem Abdel Latif' },

    // Doctor Specialties
    'استشاري أمراض القلب والأوعية الدموية والقسطرة': { ar: 'استشاري أمراض القلب والأوعية الدموية والقسطرة', en: 'Consultant Cardiologist & Interventional Catheterization' },
    'استشاري أمراض الجلدية والتجميل والليزر': { ar: 'استشاري أمراض الجلدية والتجميل والليزر', en: 'Consultant Dermatologist & Aesthetic Laser Specialist' },
    'استشاري طب وجراحة الأطفال والحديثي الولادة': { ar: 'استشاري طب وجراحة الأطفال والحديثي الولادة', en: 'Consultant Pediatrician & Neonatologist' },
    'استشاري جراحة العظام والمناظير وتغيير المفاصل': { ar: 'استشاري جراحة العظام والمناظير وتغيير المفاصل', en: 'Consultant Orthopedic & Arthroplasty Surgeon' },
    'استشاري أمراض القلب وقسطرة الشرايين التداخلية': { ar: 'استشاري أمراض القلب وقسطرة الشرايين التداخلية', en: 'Consultant Interventional Cardiologist' },
    'استشاري جراحة المخ والأعصاب والعمود الفقري': { ar: 'استشاري جراحة المخ والأعصاب والعمود الفقري', en: 'Consultant Neurosurgeon & Spine Specialist' },
    'أستاذ وجراح القلب المفتوح والأوعية الدموية': { ar: 'أستاذ وجراح القلب المفتوح والأوعية الدموية', en: 'Professor of Open Heart & Vascular Surgery' },
    'استشاري أمراض الجهاز الهضمي والمناظير والكبد': { ar: 'استشاري أمراض الجهاز الهضمي والمناظير والكبد', en: 'Consultant Gastroenterologist & Hepatologist' },
    'استشاري علاج الأورام وجراحات الأورام المتقدمة': { ar: 'استشاري علاج الأورام وجراحات الأورام المتقدمة', en: 'Consultant Oncologist & Surgical Oncology' },
    'استشاري النساء والتوليد والحقن المجهري': { ar: 'استشاري النساء والتوليد والحقن المجهري', en: 'Consultant Obstetrician & Gynecologist (IVF)' },
    'استشاري طب وجراحة العيون واليزك تصحيح الابصار': { ar: 'استشاري طب وجراحة العيون واليزك تصحيح الابصار', en: 'Consultant Ophthalmologist & LASIK Surgeon' },

    // Doctor Bios
    'أستاذ أمراض القلب بكلية الطب، زميل الكلية الأمريكية للقلب، خبرة أكثر من ٢٢ عاماً في قسطرة الشرايين التاجية.': {
      ar: 'أستاذ أمراض القلب بكلية الطب، زميل الكلية الأمريكية للقلب، خبرة أكثر من ٢٢ عاماً في قسطرة الشرايين التاجية.',
      en: 'Professor of Cardiology, Fellow of American College of Cardiology FACC, 22+ years experience in coronary angioplasty.'
    },
    'أستاذ أمراض القلب بكلية الطب، زميل الكلية الأمريكية للقلب FACC، خبرة أكثر من 22 عاماً في قسطرة الشرايين التاجية وتوسيع الصمامات.': {
      ar: 'أستاذ أمراض القلب بكلية الطب، زميل الكلية الأمريكية للقلب FACC، خبرة أكثر من 22 عاماً في قسطرة الشرايين التاجية وتوسيع الصمامات.',
      en: 'Professor of Cardiology, Fellow of American College of Cardiology FACC, 22+ years experience in coronary angioplasty.'
    },
    'خبرة طويلة في علاج الأمراض الجلدية المستعصية وتقنيات النضرة والعلاج بالليزر.': {
      ar: 'خبرة طويلة في علاج الأمراض الجلدية المستعصية وتقنيات النضرة والعلاج بالليزر.',
      en: 'Senior consultant in dermatology, aesthetic laser, psoriasis, and non-surgical cosmetic procedures.'
    },
    'مدرس طب الأطفال، متخصص في متابعة النمو والتغذية وأمراض الصدر للأطفال.': {
      ar: 'مدرس طب الأطفال، متخصص في متابعة النمو والتغذية وأمراض الصدر للأطفال.',
      en: 'Consultant Pediatrician specialized in child nutrition, growth tracking, and pediatric chest care.'
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

  /** Dynamically translates any DB string (Hospital Name, Doctor Name, Specialty, Bio, City) into active language */
  localizeText(input?: string | null): string {
    if (!input) return '';
    const lang = this.currentLang();
    const entry = this.entityTranslations[input.trim()];
    if (entry) {
      return entry[lang] || input;
    }

    // Fallback regex translators if exact entry not in map
    if (lang === 'en') {
      if (input.includes('مستشفى الشروق')) return 'Shorouk International Specialized Hospital';
      if (input.includes('مركز فيكسا')) return 'VEXA Advanced Medical Center';
      if (input.includes('مستشفى السلام')) return 'Al Salam International Hospital';
      if (input.includes('دار الفؤاد')) return 'Dar Al Fouad Hospital (6th October)';
      if (input.includes('الصفوة')) return 'Al Safwa Specialized Hospital';
      if (input.includes('النيل')) return 'Nile Specialized Clinics';
      if (input.includes('الشروق')) return 'El Shorouk City';
      if (input.includes('القاهرة الجديده') || input.includes('التجمع')) return 'New Cairo';
      if (input.includes('القاهرة')) return 'Cairo';
      if (input.includes('الجيزة')) return 'Giza';
      if (input.includes('الإسكندرية')) return 'Alexandria';
      if (input.includes('جلدية')) return 'Dermatology & Laser Specialist';
      if (input.includes('قلب')) return 'Consultant Cardiologist';
      if (input.includes('أطفال')) return 'Consultant Pediatrician';
      if (input.includes('عظام')) return 'Consultant Orthopedic Surgeon';
      if (input.includes('مخ وأعصاب')) return 'Consultant Neurosurgeon';
    }
    return input;
  }

  private getInitialLang(): LanguageCode {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.LANG_KEY) as LanguageCode | null;
      if (saved === 'ar' || saved === 'en') {
        return saved;
      }
    }
    return 'ar';
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
