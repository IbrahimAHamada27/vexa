import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding VEXA Enterprise Database with massive demo data...\n');

  // Clean existing data in proper FK order
  await prisma.conference.deleteMany();
  await prisma.research.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.availabilitySlot.deleteMany();
  await prisma.medicalService.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.department.deleteMany();
  await prisma.organization.deleteMany();

  console.log('  🗑️  Cleared existing database records');

  // ─── 1. ORGANIZATIONS (HOSPITALS & CLINICS) ─────────────────────────────

  const orgShorouk = await prisma.organization.create({
    data: {
      name: 'مستشفى الشروق الدولي التخصصي',
      type: 'hospital',
      description: 'صرح طبي استثماري متكامل بمدينة الشروق يضم وحدات القسطرة القلبية، الطوارئ على مدار 24 ساعة، وجراحات المناظير المتقدمة.',
      phone: '+20-2-2655-0100',
      email: 'info@shorouk-hospital.com',
      website: 'https://shorouk-hospital.com',
      address: 'حي الأشجار، الحي السابع - مدينة الشروق',
      city: 'الشروق',
      logoUrl: 'https://placehold.co/200x200?text=Shorouk+Hospital',
      imageUrl: 'https://placehold.co/800x400?text=Shorouk+International+Hospital',
    },
  });

  const orgVexa = await prisma.organization.create({
    data: {
      name: 'مركز فيكسا الطبي المتقدم بالتجمع',
      type: 'medical_center',
      description: 'مركز طبي فاخر بقلب التجمع الخامس يوفر أحدث تقنيات التشخيص، الأشعة المقطعية، وعيادات كبار الاستشاريين أساتذة الجامعات.',
      phone: '+20-2-2758-3200',
      email: 'contact@vexa-center.com',
      website: 'https://vexa-center.com',
      address: 'شارع التسعين الجنوبي، مجمع العيادات الفاخرة - التجمع الخامس',
      city: 'القاهرة الجديده',
      logoUrl: 'https://placehold.co/200x200?text=VEXA+Center',
      imageUrl: 'https://placehold.co/800x400?text=VEXA+Medical+Center',
    },
  });

  const orgSalam = await prisma.organization.create({
    data: {
      name: 'مستشفى السلام الدولي بالمعادي',
      type: 'hospital',
      description: 'من أعرق المستشفيات الخاصة في مصر الحاصلة على الاعتماد الدولي JCI، متخصصة في زراعة الأعضاء وجراحات القلب والمخ والأعصاب.',
      phone: '+20-2-2524-0250',
      email: 'appointments@alsalam-hospital.com',
      website: 'https://alsalam-hospital.com',
      address: 'كورنيش المعادي، برج الأطباء - القاهرة',
      city: 'القاهرة',
      logoUrl: 'https://placehold.co/200x200?text=Al+Salam',
      imageUrl: 'https://placehold.co/800x400?text=Al+Salam+International+Hospital',
    },
  });

  const orgFouad = await prisma.organization.create({
    data: {
      name: 'مستشفى دار الفؤاد 6 أكتوبر',
      type: 'hospital',
      description: 'مركز تميز إقليمي لجراحات القلب والأورام والعظام، مجهز بأحدث الرعايات المركزة وأجنحة الإقامة الفاخرة.',
      phone: '+20-2-3835-6000',
      email: 'info@daralfouad.org',
      website: 'https://daralfouad.org',
      address: 'امتداد محور 26 يوليو، مدينة 6 أكتوبر',
      city: 'الجيزة',
      logoUrl: 'https://placehold.co/200x200?text=Dar+AlFouad',
      imageUrl: 'https://placehold.co/800x400?text=Dar+AlFouad+Hospital',
    },
  });

  const orgSafwa = await prisma.organization.create({
    data: {
      name: 'مستشفى الصفوة التخصصي بالإسكندرية',
      type: 'hospital',
      description: 'مستشفى استثماري رائد بالعروس الإسكندرية يقدم خدمات الجراحة العامة، مناظير الجهاز الهضمي، وعيادات طب الأطفال والنساء.',
      phone: '+20-3-543-9000',
      email: 'contact@alsafwa-alex.com',
      website: 'https://alsafwa-alex.com',
      address: 'طريق الجيش، لوران - الإسكندرية',
      city: 'الإسكندرية',
      logoUrl: 'https://placehold.co/200x200?text=AlSafwa',
      imageUrl: 'https://placehold.co/800x400?text=AlSafwa+Hospital+Alex',
    },
  });

  const orgNile = await prisma.organization.create({
    data: {
      name: 'مجمع عيادات النيل التخصصية بالدقي',
      type: 'clinic',
      description: 'عيادات تخصصية خاصة لأستاذة طب وجراحة العيون والأنف والأذن والحنجرة، وجراحات الجلدية والتجميل.',
      phone: '+20-2-3761-4000',
      email: 'info@nileclinics.com',
      website: 'https://nileclinics.com',
      address: 'شارع مصدق، الدقي - الجيزة',
      city: 'الجيزة',
      logoUrl: 'https://placehold.co/200x200?text=Nile+Clinics',
      imageUrl: 'https://placehold.co/800x400?text=Nile+Specialized+Clinics',
    },
  });

  console.log('  🏥  Created 6 enterprise healthcare organizations');

  // ─── 2. DEPARTMENTS ─────────────────────────────────────────────────────

  const deptCardioShorouk = await prisma.department.create({
    data: { name: 'قسم أمراض القلب والقسطرة', description: 'تشخيص وعلاج أمراض القسطرة التداخلية والشرايين التاجية.', organizationId: orgShorouk.id },
  });
  const deptDermShorouk = await prisma.department.create({
    data: { name: 'قسم الجلدية والتجميل والليزر', description: 'علاج الأمراض الجلدية والعلاج بالليزر وتقنيات النضارة.', organizationId: orgShorouk.id },
  });
  const deptPedShorouk = await prisma.department.create({
    data: { name: 'قسم طب وجراحة الأطفال', description: 'رعاية صحية شاملة للأطفال والحضانة وحديثي الولادة.', organizationId: orgShorouk.id },
  });

  const deptCardioVexa = await prisma.department.create({
    data: { name: 'قسم أمراض القلب والأوعية', description: 'رعاية دقيقة لمرضى ضغط الدم وشرايين القلب والتخطيط.', organizationId: orgVexa.id },
  });
  const deptOrthoVexa = await prisma.department.create({
    data: { name: 'قسم جراحة العظام والمفاصل', description: 'مناظير الركبة والكتف وعلاج الإصابات الرياضية وتغيير المفاصل.', organizationId: orgVexa.id },
  });
  const deptNeuroVexa = await prisma.department.create({
    data: { name: 'قسم المخ والأعصاب والعمود الفقري', description: 'جراحات الغضروف والانزلاق الغضروفي وعلاج الصداع والمخ.', organizationId: orgVexa.id },
  });

  const deptCardioSalam = await prisma.department.create({
    data: { name: 'مركز جراحات القلب المفتوح والقسطرة', description: 'إجراء عمليات القلب المفتوح وتغيير الصمامات بدقة عالية.', organizationId: orgSalam.id },
  });
  const deptGastroSalam = await prisma.department.create({
    data: { name: 'قسم الجهاز الهضمي والمناظير', description: 'مناظير القولون والمعدة والقنوات المرارية وعلاج الكبد.', organizationId: orgSalam.id },
  });

  const deptOncoFouad = await prisma.department.create({
    data: { name: 'مركز دار الفؤاد للأورام والجراحة', description: 'علاج الأورام بالكيماوي والإشعاعي والجراحات الدقيقة.', organizationId: orgFouad.id },
  });

  console.log('  🏬  Created 9 clinical departments');

  // ─── 3. SENIOR CONSULTANT DOCTORS ───────────────────────────────────────

  const doctorsData = [
    {
      fullName: 'أ.د. أحمد عبد الرحمن الحسين',
      specialty: 'استشاري أمراض القلب والأوعية الدموية والقسطرة',
      bio: 'أستاذ أمراض القلب بكلية الطب، زميل الكلية الأمريكية للقلب FACC، خبرة أكثر من 22 عاماً في قسطرة الشرايين التاجية وتوسيع الصمامات.',
      experienceYears: 22,
      qualifications: 'دكتوراه أمراض القلب - جامعة القاهرة، زميل جمعية القلب الأمريكية',
      imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      organizationId: orgShorouk.id,
    },
    {
      fullName: 'د. مريم الشناوي',
      specialty: 'استشاري أمراض الجلدية والتجميل والليزر',
      bio: 'استشاري جراحات الجلد والتجميل، خبرة 14 عاماً في علاج الصدفية والبهاق وحب الشباب المستعصي وأحدث تقنيات الفيلر والخيوط الفرنسية.',
      experienceYears: 14,
      qualifications: 'ماجستير ودكتوراه الأمراض الجلدية - جامعة عين شمس',
      imageUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce78964?auto=format&fit=crop&w=400&q=80',
      organizationId: orgShorouk.id,
    },
    {
      fullName: 'د. خالد مصطفى السويفي',
      specialty: 'استشاري طب وجراحة الأطفال والحديثي الولادة',
      bio: 'استشاري الأطفال ورعاية الحديثي الولادة، متخصص في أمراض الصدر والحساسية ومتابعة النمو والتغذية السليمة للأطفال.',
      experienceYears: 16,
      qualifications: 'دكتوراه طب الأطفال - جامعة القاهرة (قصر العيني)',
      imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
      organizationId: orgShorouk.id,
    },
    {
      fullName: 'أ.د. عمر نبيل الدسوقي',
      specialty: 'استشاري جراحة العظام والمناظير وتغيير المفاصل',
      bio: 'أستاذ جراحة العظام، استشاري مناظير الركبة والكتف، طبيب المنتخب الوطني السابق لإصابات الملاعب.',
      experienceYears: 19,
      qualifications: 'دكتوراه جراحة العظام FRCS - جامعة المنصورة، زمالة جراحة المفاصل بإنجلترا',
      imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
      organizationId: orgVexa.id,
    },
    {
      fullName: 'أ.د. ياسمين فاروق عبد العزيز',
      specialty: 'استشاري أمراض القلب وقسطرة الشرايين التداخلية',
      bio: 'استشاري القسطرة القلبية ورئيس قسم القسطرة السابق، متخصصة في الحالات الحرجة وتركيب الدعامة الحياة.',
      experienceYears: 21,
      qualifications: 'دكتوراه القلب - جامعة عين شمس، زمالة كليفلاند كلينك بأمريكا',
      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
      organizationId: orgVexa.id,
    },
    {
      fullName: 'د. طارق سامي الشريف',
      specialty: 'استشاري جراحة المخ والأعصاب والعمود الفقري',
      bio: 'استشاري جراحات العمود الفقري بالميكروسكوب والمنظار، علاج الانزلاق الغضروفي بدون جراحة وتثبيت الفقرات.',
      experienceYears: 17,
      qualifications: 'دكتوراه جراحة المخ والأعصاب - جامعة الإسكندرية',
      imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      organizationId: orgVexa.id,
    },
    {
      fullName: 'أ.د. حسام الدين شريف',
      specialty: 'أستاذ وجراح القلب المفتوح والأوعية الدموية',
      bio: 'من رائدة جراحات القلب المفتوح وزراعة الشرايين التاجية في مصر والشرق الأوسط، أجرى أكثر من 3000 عملية ناجحة.',
      experienceYears: 26,
      qualifications: 'أستاذ جراحة القلب - جامعة القاهرة، زمالة كلية الجراحين الملكية بلندن',
      imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
      organizationId: orgSalam.id,
    },
    {
      fullName: 'د. رانيا المهدي',
      specialty: 'استشاري أمراض الجهاز الهضمي والمناظير والكبد',
      bio: 'استشاري مناظير المعدة والقولون والقنوات المرارية، متخصصة في علاج جرثومة المعدة القاطعة والقولون العصبي.',
      experienceYears: 15,
      qualifications: 'دكتوراه الجهاز الهضمي والكبد - قصر العيني',
      imageUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce78964?auto=format&fit=crop&w=400&q=80',
      organizationId: orgSalam.id,
    },
    {
      fullName: 'أ.د. شريف العريان',
      specialty: 'استشاري علاج الأورام وجراحات الأورام المتقدمة',
      bio: 'أستاذ علاج الأورام، متخصص في أحدث العلاجات الموجهة والعلاج المناعي وجراحات أورام الثدي والجهاز الهضمي.',
      experienceYears: 24,
      qualifications: 'دكتوراه علاج الأورام - معهد الأورام القومي، عضو الجمعية الأوروبية للأورام ESMO',
      imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
      organizationId: orgFouad.id,
    },
    {
      fullName: 'د. نورهان عبد السلام',
      specialty: 'استشاري النساء والتوليد والحقن المجهري',
      bio: 'استشاري طب الجنين والمتابعة الدقيقة للحمل الخطر، جراحات المناظير النسائية وتأخر الإنجاب.',
      experienceYears: 13,
      qualifications: 'دكتوراه النساء والتوليد - جامعة عين شمس، زمالة الحقن المجهري',
      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
      organizationId: orgSafwa.id,
    },
    {
      fullName: 'د. كريم عبد اللطيف',
      specialty: 'استشاري طب وجراحة العيون واليزك تصحيح الابصار',
      bio: 'استشاري جراحات المياه البيضاء بالموجات فوق الصوتية (الفيكو) والليزك والفيمتو ليزك لجميع أنواع ضعف النظر.',
      experienceYears: 18,
      qualifications: 'دكتوراه طب وجراحة العيون - جامعة القاهرة، زمالة كلية الجراحين الملكية غلاسكو',
      imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      organizationId: orgNile.id,
    }
  ];

  const createdDoctors = [];
  for (const doc of doctorsData) {
    const created = await prisma.doctor.create({ data: doc });
    createdDoctors.push(created);
  }

  console.log(`  👨‍⚕️  Created ${createdDoctors.length} senior consultant doctors`);

  // ─── 4. MEDICAL SERVICES ────────────────────────────────────────────────

  const servicesData = [
    { name: 'رسم القلب الكهربائي واختبار المجهود ECG', description: 'تقييم شامل لسلامة الشرايين التاجية وعضلة القلب.', departmentId: deptCardioShorouk.id, organizationId: orgShorouk.id },
    { name: 'موجات صوتية على القلب (إيكو دقيق)', description: 'فحص صمامات القلب وعضلة البوتين بالأولاد الملونة.', departmentId: deptCardioShorouk.id, organizationId: orgShorouk.id },
    { name: 'فحص الجلدية الشامل والديرموسكوب', description: 'تشخيص مبكر للشامات والتغيرات الجلدية وأمراض الصدفية.', departmentId: deptDermShorouk.id, organizationId: orgShorouk.id },
    { name: 'جلسة نضارة وتقشير كيميائي تخصصي', description: 'علاج آثار حب الشباب والتصبغات الجلدية بأحدث المواد المعتمدة.', departmentId: deptDermShorouk.id, organizationId: orgShorouk.id },
    { name: 'متابعة نمو وتغذية الأطفال والرضع', description: 'جدول التطعيمات وقياس المعدلات الحركية والذهنية.', departmentId: deptPedShorouk.id, organizationId: orgShorouk.id },
    
    { name: 'فحص قسطرة الشرايين الاستكشافية', description: 'تصوير دقيق لشرايين القلب باستخدام الصبغة الملونة.', departmentId: deptCardioVexa.id, organizationId: orgVexa.id },
    { name: 'منظار الركبة التشخيصي والجراحي', description: 'إصلاح الغضروف الهلالي والرباط الصليبي بالمنظار.', departmentId: deptOrthoVexa.id, organizationId: orgVexa.id },
    { name: 'رسم عضلات وأعصاب بالكمبيوتر', description: 'تشخيص حالات اختناق الأعصاب والانزلاق الغضروفي بدقة عالية.', departmentId: deptNeuroVexa.id, organizationId: orgVexa.id },
    
    { name: 'عملية القلب المفتوح وتغيير الصمام', description: 'جراحة دقيقة لإصلاح الصمامات وتغيير الشرايين التاجية.', departmentId: deptCardioSalam.id, organizationId: orgSalam.id },
    { name: 'منظار قولون وتشخيص الجهاز الهضمي', description: 'فحص جدار القولون واستئصال الزوائد اللحمية بدون ألم.', departmentId: deptGastroSalam.id, organizationId: orgSalam.id },
    
    { name: 'جلسات العلاج الموجه والأورام', description: 'بروتوكولات حديثة معتمدة دولياً لعلاج كافة أنواع الأورام.', departmentId: deptOncoFouad.id, organizationId: orgFouad.id }
  ];

  for (const srv of servicesData) {
    await prisma.medicalService.create({ data: srv });
  }

  console.log(`  💊  Created ${servicesData.length} medical services`);

  // ─── 5. AVAILABILITY SLOTS ──────────────────────────────────────────────

  const dates = ['2026-08-20', '2026-08-21', '2026-08-22', '2026-08-23', '2026-08-24', '2026-08-25'];
  const times = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

  let totalSlots = 0;
  for (const doc of createdDoctors) {
    for (const d of dates) {
      for (const t of times) {
        await prisma.availabilitySlot.create({
          data: {
            doctorId: doc.id,
            date: d,
            time: t,
            isAvailable: Math.random() > 0.15,
          }
        });
        totalSlots++;
      }
    }
  }

  console.log(`  📅  Created ${totalSlots} real-time availability slots for doctors`);

  // ─── 6. SAMPLE APPOINTMENTS ─────────────────────────────────────────────

  const samplePatients = [
    { name: 'أحمد محمود سليمان', phone: '01001234567', email: 'ahmed.m@gmail.com', status: 'Confirmed', notes: 'كشف استشاري قلب وقسطرة، يعاني من ارتفاع ضغط الدم.' },
    { name: 'منى سيد عبد الفتاح', phone: '01119876543', email: 'mona.s@hotmail.com', status: 'Pending', notes: 'استشارة جلدية وتجميل، متابعة نضارة البشرة.' },
    { name: 'عمر فاروق الشريف', phone: '01223456789', email: 'omar.f@yahoo.com', status: 'Confirmed', notes: 'متابعة جراحة رباط صليبي بالركبة اليمنى.' },
    { name: 'سارة خالد ابراهيم', phone: '01005554433', email: 'sara.k@gmail.com', status: 'Confirmed', notes: 'فحص دوري للأطفال حديثي الولادة والمعدلات الحركية.' },
    { name: 'محمد عبد الرحمن كمال', phone: '01098765432', email: 'm.kamal@outlook.com', status: 'Cancelled', notes: 'إلغاء الموعد بناء على طلب المريض.' }
  ];

  for (let i = 0; i < samplePatients.length; i++) {
    const doc = createdDoctors[i % createdDoctors.length];
    const patient = samplePatients[i];
    await prisma.appointment.create({
      data: {
        organizationId: doc.organizationId,
        doctorId: doc.id,
        patientName: patient.name,
        patientPhone: patient.phone,
        patientEmail: patient.email,
        date: '2026-08-21',
        time: `${10 + i}:00`,
        status: patient.status,
        notes: patient.notes
      }
    });
  }

  console.log(`  📋  Created ${samplePatients.length} realistic patient appointments`);

  console.log('\n✅ VEXA Database Seeding Successfully Completed!');
  console.log('   Demo dataset is ready for judges and evaluators.\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
