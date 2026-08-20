import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Seed Data ──────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding VEXA database...\n');

  // Clean existing data (order matters for FK constraints)
  await prisma.conference.deleteMany();
  await prisma.research.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.availabilitySlot.deleteMany();
  await prisma.medicalService.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.department.deleteMany();
  await prisma.organization.deleteMany();

  console.log('  🗑️  Cleared existing data');

  // ─── Organizations ──────────────────────────────────────────────────────

  const orgShorouk = await prisma.organization.create({
    data: {
      name: 'El Shorouk Medical Center',
      type: 'MedicalCenter',
      description:
        'A leading multi-specialty medical center in El Shorouk City, providing comprehensive healthcare services with state-of-the-art facilities and a team of renowned specialists.',
      phone: '+20-2-2655-0100',
      email: 'info@shoroukmedical.com',
      website: 'https://shoroukmedical.com',
      address: '15 El Horreya Boulevard, El Shorouk City',
      city: 'El Shorouk',
      logoUrl: 'https://placehold.co/200x200?text=SMC',
      imageUrl: 'https://placehold.co/800x400?text=El+Shorouk+Medical+Center',
    },
  });

  const orgVexa = await prisma.organization.create({
    data: {
      name: 'VEXA Specialized Hospital',
      type: 'Hospital',
      description:
        'VEXA Specialized Hospital is a premier 200-bed facility in New Cairo, offering advanced surgical procedures, 24/7 emergency care, and cutting-edge diagnostic imaging.',
      phone: '+20-2-2758-3200',
      email: 'contact@vexahospital.com',
      website: 'https://vexahospital.com',
      address: '88 Medical District, Fifth Settlement',
      city: 'New Cairo',
      logoUrl: 'https://placehold.co/200x200?text=VEXA',
      imageUrl: 'https://placehold.co/800x400?text=VEXA+Hospital',
    },
  });

  const orgClinic = await prisma.organization.create({
    data: {
      name: 'Cairo Heart & Vascular Clinic',
      type: 'Clinic',
      description:
        'A private specialized clinic focused on cardiovascular health, offering preventive screenings, interventional cardiology, and cardiac rehabilitation programs.',
      phone: '+20-2-2411-7890',
      email: 'appointments@cairoheartclinic.com',
      website: 'https://cairoheartclinic.com',
      address: '42 Nile Corniche, Garden City',
      city: 'Cairo',
      logoUrl: 'https://placehold.co/200x200?text=CHC',
      imageUrl: 'https://placehold.co/800x400?text=Cairo+Heart+Clinic',
    },
  });

  const orgDerm = await prisma.organization.create({
    data: {
      name: 'Glow Dermatology & Aesthetics',
      type: 'Clinic',
      description:
        'Premium dermatology and aesthetic clinic in El Shorouk offering medical dermatology, cosmetic procedures, laser treatments, and skincare consultations.',
      phone: '+20-2-2655-4321',
      email: 'hello@glowderm.com',
      website: 'https://glowderm.com',
      address: '7 Al Andalus Street, El Shorouk City',
      city: 'El Shorouk',
      logoUrl: 'https://placehold.co/200x200?text=GLOW',
      imageUrl: 'https://placehold.co/800x400?text=Glow+Dermatology',
    },
  });

  console.log('  🏥  Created 4 organizations');

  // ─── Departments ────────────────────────────────────────────────────────

  // El Shorouk Medical Center departments
  const deptCardioSMC = await prisma.department.create({
    data: {
      name: 'Cardiology',
      description: 'Heart and cardiovascular diseases diagnosis and treatment.',
      organizationId: orgShorouk.id,
    },
  });

  const deptDermSMC = await prisma.department.create({
    data: {
      name: 'Dermatology',
      description: 'Skin conditions, cosmetic dermatology, and laser treatments.',
      organizationId: orgShorouk.id,
    },
  });

  const deptPedSMC = await prisma.department.create({
    data: {
      name: 'Pediatrics',
      description: 'Comprehensive child healthcare from infancy through adolescence.',
      organizationId: orgShorouk.id,
    },
  });

  // VEXA Hospital departments
  const deptOrthoVexa = await prisma.department.create({
    data: {
      name: 'Orthopedics',
      description: 'Musculoskeletal system — bones, joints, ligaments, tendons, and muscles.',
      organizationId: orgVexa.id,
    },
  });

  const deptCardioVexa = await prisma.department.create({
    data: {
      name: 'Cardiology',
      description: 'Advanced cardiac care including interventional procedures and surgery.',
      organizationId: orgVexa.id,
    },
  });

  const deptPedVexa = await prisma.department.create({
    data: {
      name: 'Pediatrics',
      description: 'Pediatric emergency, neonatology, and child development services.',
      organizationId: orgVexa.id,
    },
  });

  // Cairo Heart Clinic department
  const deptCardioCHC = await prisma.department.create({
    data: {
      name: 'Interventional Cardiology',
      description: 'Catheter-based treatments for heart diseases including stenting and angioplasty.',
      organizationId: orgClinic.id,
    },
  });

  // Glow Dermatology department
  const deptDermGlow = await prisma.department.create({
    data: {
      name: 'Dermatology & Aesthetics',
      description: 'Medical and cosmetic dermatology, including laser and anti-aging treatments.',
      organizationId: orgDerm.id,
    },
  });

  console.log('  🏬  Created 8 departments');

  // ─── Doctors ────────────────────────────────────────────────────────────

  const drAhmed = await prisma.doctor.create({
    data: {
      fullName: 'Dr. Ahmed Hassan',
      specialty: 'Cardiology',
      bio: 'Board-certified cardiologist with expertise in echocardiography and preventive cardiology. Former chief resident at Cairo University Hospital.',
      experienceYears: 15,
      qualifications: 'MD, FACC — Cairo University',
      imageUrl: 'https://placehold.co/300x300?text=Dr+Ahmed',
      organizationId: orgShorouk.id,
    },
  });

  const drMona = await prisma.doctor.create({
    data: {
      fullName: 'Dr. Mona El-Sayed',
      specialty: 'Dermatology',
      bio: 'Specialist in clinical and cosmetic dermatology with advanced training in laser therapies and skin cancer screening. Published researcher in photodermatology.',
      experienceYears: 12,
      qualifications: 'MD, DABD — Ain Shams University',
      imageUrl: 'https://placehold.co/300x300?text=Dr+Mona',
      organizationId: orgShorouk.id,
    },
  });

  const drKhaled = await prisma.doctor.create({
    data: {
      fullName: 'Dr. Khaled Mansour',
      specialty: 'Dermatology',
      bio: 'Expert dermatologist specializing in psoriasis, eczema, and acne management. Known for patient-centered care and evidence-based treatment plans.',
      experienceYears: 9,
      qualifications: 'MBBCh, MSc Dermatology — Alexandria University',
      imageUrl: 'https://placehold.co/300x300?text=Dr+Khaled',
      organizationId: orgDerm.id,
    },
  });

  const drFatima = await prisma.doctor.create({
    data: {
      fullName: 'Dr. Fatima Al-Rashidi',
      specialty: 'Pediatrics',
      bio: 'Compassionate pediatrician dedicated to child wellness. Specializes in developmental pediatrics and childhood vaccinations.',
      experienceYears: 11,
      qualifications: 'MD Pediatrics — Kasr Al-Ainy',
      imageUrl: 'https://placehold.co/300x300?text=Dr+Fatima',
      organizationId: orgShorouk.id,
    },
  });

  const drOmar = await prisma.doctor.create({
    data: {
      fullName: 'Dr. Omar Nabil',
      specialty: 'Orthopedics',
      bio: 'Orthopedic surgeon specializing in sports medicine, knee arthroscopy, and joint replacement. Team physician for multiple national sports teams.',
      experienceYears: 18,
      qualifications: 'MD, FRCS — Mansoura University',
      imageUrl: 'https://placehold.co/300x300?text=Dr+Omar',
      organizationId: orgVexa.id,
    },
  });

  const drYasmin = await prisma.doctor.create({
    data: {
      fullName: 'Dr. Yasmin Farouk',
      specialty: 'Cardiology',
      bio: 'Interventional cardiologist with expertise in complex PCI and structural heart disease. Pioneer in transcatheter valve therapies in Egypt.',
      experienceYears: 20,
      qualifications: 'MD, PhD Cardiology — Cairo University, Fellowship at Cleveland Clinic',
      imageUrl: 'https://placehold.co/300x300?text=Dr+Yasmin',
      organizationId: orgVexa.id,
    },
  });

  const drTarek = await prisma.doctor.create({
    data: {
      fullName: 'Dr. Tarek Samy',
      specialty: 'Interventional Cardiology',
      bio: 'Highly skilled interventional cardiologist performing 500+ catheterizations annually. Expert in coronary stenting and peripheral vascular interventions.',
      experienceYears: 22,
      qualifications: 'MD, FSCAI — Ain Shams University',
      imageUrl: 'https://placehold.co/300x300?text=Dr+Tarek',
      organizationId: orgClinic.id,
    },
  });

  const drNour = await prisma.doctor.create({
    data: {
      fullName: 'Dr. Nour Abdallah',
      specialty: 'Dermatology',
      bio: 'Aesthetic dermatologist specializing in anti-aging treatments, chemical peels, and dermal fillers. Known for natural-looking cosmetic results.',
      experienceYears: 8,
      qualifications: 'MBBCh, Diploma Aesthetic Medicine — Cairo University',
      imageUrl: 'https://placehold.co/300x300?text=Dr+Nour',
      organizationId: orgDerm.id,
    },
  });

  console.log('  👨‍⚕️  Created 8 doctors');

  // ─── Medical Services ───────────────────────────────────────────────────

  const services = await Promise.all([
    // Cardiology services - SMC
    prisma.medicalService.create({
      data: {
        name: 'ECG & Stress Testing',
        description: 'Electrocardiogram and exercise stress testing for cardiac evaluation.',
        departmentId: deptCardioSMC.id,
        organizationId: orgShorouk.id,
      },
    }),
    prisma.medicalService.create({
      data: {
        name: 'Echocardiography',
        description: 'Ultrasound imaging of the heart to assess structure and function.',
        departmentId: deptCardioSMC.id,
        organizationId: orgShorouk.id,
      },
    }),
    // Dermatology services - SMC
    prisma.medicalService.create({
      data: {
        name: 'Skin Cancer Screening',
        description: 'Full-body skin examination with dermoscopy for early melanoma detection.',
        departmentId: deptDermSMC.id,
        organizationId: orgShorouk.id,
      },
    }),
    prisma.medicalService.create({
      data: {
        name: 'Laser Hair Removal',
        description: 'Advanced diode laser treatment for permanent hair reduction.',
        departmentId: deptDermSMC.id,
        organizationId: orgShorouk.id,
      },
    }),
    // Pediatrics services - SMC
    prisma.medicalService.create({
      data: {
        name: 'Well-Child Visits',
        description: 'Routine developmental checkups and immunizations for children.',
        departmentId: deptPedSMC.id,
        organizationId: orgShorouk.id,
      },
    }),
    // Orthopedics services - VEXA
    prisma.medicalService.create({
      data: {
        name: 'Joint Replacement Surgery',
        description: 'Total hip and knee replacement using minimally invasive techniques.',
        departmentId: deptOrthoVexa.id,
        organizationId: orgVexa.id,
      },
    }),
    prisma.medicalService.create({
      data: {
        name: 'Sports Injury Rehabilitation',
        description: 'Comprehensive rehab program for ligament tears, fractures, and muscle injuries.',
        departmentId: deptOrthoVexa.id,
        organizationId: orgVexa.id,
      },
    }),
    // Cardiology services - VEXA
    prisma.medicalService.create({
      data: {
        name: 'Cardiac Catheterization',
        description: 'Diagnostic and interventional catheterization for coronary artery disease.',
        departmentId: deptCardioVexa.id,
        organizationId: orgVexa.id,
      },
    }),
    // Pediatrics services - VEXA
    prisma.medicalService.create({
      data: {
        name: 'Neonatal Intensive Care',
        description: 'Level III NICU providing specialized care for premature and critically ill newborns.',
        departmentId: deptPedVexa.id,
        organizationId: orgVexa.id,
      },
    }),
    // Cairo Heart Clinic
    prisma.medicalService.create({
      data: {
        name: 'Coronary Angioplasty & Stenting',
        description: 'Minimally invasive procedure to open blocked coronary arteries using balloon and stent.',
        departmentId: deptCardioCHC.id,
        organizationId: orgClinic.id,
      },
    }),
    prisma.medicalService.create({
      data: {
        name: 'Holter Monitoring',
        description: '24-48 hour continuous heart rhythm monitoring for arrhythmia detection.',
        departmentId: deptCardioCHC.id,
        organizationId: orgClinic.id,
      },
    }),
    // Glow Dermatology
    prisma.medicalService.create({
      data: {
        name: 'Acne Treatment Program',
        description: 'Customized acne management including topical, oral, and laser-based therapies.',
        departmentId: deptDermGlow.id,
        organizationId: orgDerm.id,
      },
    }),
    prisma.medicalService.create({
      data: {
        name: 'Anti-Aging & Botox',
        description: 'Non-surgical facial rejuvenation using botulinum toxin and dermal fillers.',
        departmentId: deptDermGlow.id,
        organizationId: orgDerm.id,
      },
    }),
    prisma.medicalService.create({
      data: {
        name: 'Chemical Peels',
        description: 'Medical-grade chemical peels for hyperpigmentation, scars, and skin texture improvement.',
        departmentId: deptDermGlow.id,
        organizationId: orgDerm.id,
      },
    }),
  ]);

  console.log(`  💊  Created ${services.length} medical services`);

  // ─── Availability Slots ─────────────────────────────────────────────────

  const dates = ['2026-08-20', '2026-08-21', '2026-08-22', '2026-08-23'];
  const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30'];

  const allDoctors = [drAhmed, drMona, drKhaled, drFatima, drOmar, drYasmin, drTarek, drNour];
  let slotCount = 0;

  for (const doctor of allDoctors) {
    for (const date of dates) {
      for (const time of timeSlots) {
        // Randomly make ~15% of slots unavailable for realism
        const isAvailable = Math.random() > 0.15;
        await prisma.availabilitySlot.create({
          data: {
            doctorId: doctor.id,
            date,
            time,
            isAvailable,
          },
        });
        slotCount++;
      }
    }
  }

  console.log(`  📅  Created ${slotCount} availability slots`);

  // ─── Sample Appointments ────────────────────────────────────────────────

  const appointments = await Promise.all([
    prisma.appointment.create({
      data: {
        organizationId: orgShorouk.id,
        doctorId: drMona.id,
        patientName: 'Sara Mohamed',
        patientPhone: '+20-100-234-5678',
        patientEmail: 'sara.m@gmail.com',
        date: '2026-08-20',
        time: '09:00',
        status: 'Confirmed',
        notes: 'Follow-up for eczema treatment. Bring previous lab results.',
      },
    }),
    prisma.appointment.create({
      data: {
        organizationId: orgShorouk.id,
        doctorId: drAhmed.id,
        patientName: 'Hassan Ali',
        patientPhone: '+20-101-876-5432',
        patientEmail: 'hassan.ali@outlook.com',
        date: '2026-08-20',
        time: '10:00',
        status: 'Pending',
        notes: 'First visit — chest pain evaluation.',
      },
    }),
    prisma.appointment.create({
      data: {
        organizationId: orgVexa.id,
        doctorId: drOmar.id,
        patientName: 'Layla Ibrahim',
        patientPhone: '+20-112-345-6789',
        date: '2026-08-21',
        time: '14:00',
        status: 'Confirmed',
        notes: 'Post-op follow-up — ACL reconstruction, 6 weeks.',
      },
    }),
    prisma.appointment.create({
      data: {
        organizationId: orgDerm.id,
        doctorId: drKhaled.id,
        patientName: 'Youssef Kamal',
        patientPhone: '+20-100-111-2233',
        patientEmail: 'youssef.k@gmail.com',
        date: '2026-08-21',
        time: '09:30',
        status: 'Pending',
      },
    }),
    prisma.appointment.create({
      data: {
        organizationId: orgClinic.id,
        doctorId: drTarek.id,
        patientName: 'Amira Fathy',
        patientPhone: '+20-109-876-5400',
        patientEmail: 'amira.fathy@hotmail.com',
        date: '2026-08-22',
        time: '11:00',
        status: 'Confirmed',
        notes: 'Pre-procedure consultation for angioplasty.',
      },
    }),
  ]);

  console.log(`  📋  Created ${appointments.length} appointments`);

  // ─── Research ───────────────────────────────────────────────────────────

  const researches = await Promise.all([
    prisma.research.create({
      data: {
        title: 'Efficacy of Topical Retinoids in Egyptian Patients with Moderate Acne Vulgaris',
        description:
          'A randomized controlled trial assessing the effectiveness and tolerability of adapalene 0.3% gel in Egyptian skin types over 12 weeks.',
        publicationDate: new Date('2025-03-15'),
        link: 'https://doi.org/10.1000/example-derm-001',
        doctorId: drMona.id,
        organizationId: orgShorouk.id,
      },
    }),
    prisma.research.create({
      data: {
        title: 'Machine Learning in Early Detection of Melanoma: A Systematic Review',
        description:
          'Comprehensive review of AI-assisted dermoscopy tools for melanoma detection, analyzing sensitivity and specificity across 15 studies.',
        publicationDate: new Date('2024-11-20'),
        link: 'https://doi.org/10.1000/example-derm-002',
        doctorId: drKhaled.id,
        organizationId: orgDerm.id,
      },
    }),
    prisma.research.create({
      data: {
        title: 'Long-term Outcomes of Transcatheter Aortic Valve Replacement in Egyptian Patients',
        description:
          'Five-year follow-up data on TAVR outcomes in 200 Egyptian patients, demonstrating comparable results to international registries.',
        publicationDate: new Date('2025-06-01'),
        link: 'https://doi.org/10.1000/example-cardio-001',
        doctorId: drYasmin.id,
        organizationId: orgVexa.id,
      },
    }),
    prisma.research.create({
      data: {
        title: 'Arthroscopic ACL Reconstruction Using Hamstring Autograft: 10-Year Follow-up',
        description:
          'Retrospective study examining return-to-sport rates and re-tear incidence in 350 patients following ACL reconstruction.',
        publicationDate: new Date('2024-09-10'),
        doctorId: drOmar.id,
        organizationId: orgVexa.id,
      },
    }),
  ]);

  console.log(`  📄  Created ${researches.length} research publications`);

  // ─── Conferences ────────────────────────────────────────────────────────

  const conferences = await Promise.all([
    prisma.conference.create({
      data: {
        title: 'Egyptian Dermatology Society Annual Congress 2026',
        description:
          'Presenting: "Advances in Laser Treatment for Vitiligo" — a review of fractional CO2 laser combined with topical tacrolimus.',
        date: new Date('2026-10-15'),
        location: 'Cairo International Convention Center, Nasr City',
        doctorId: drMona.id,
        organizationId: orgShorouk.id,
      },
    }),
    prisma.conference.create({
      data: {
        title: 'Middle East Cardiology Summit 2026',
        description:
          'Panel moderator: "Innovation in Structural Heart Interventions" — discussing the latest in TAVR, MitraClip, and LAAO devices.',
        date: new Date('2026-11-22'),
        location: 'JW Marriott, Cairo',
        doctorId: drYasmin.id,
        organizationId: orgVexa.id,
      },
    }),
    prisma.conference.create({
      data: {
        title: 'International Sports Medicine Conference 2026',
        description:
          'Keynote speaker: "Biologics in Orthopedic Sports Medicine: PRP and Stem Cell Therapies for Tendon Injuries".',
        date: new Date('2026-09-05'),
        location: 'Hilton Heliopolis, Cairo',
        doctorId: drOmar.id,
        organizationId: orgVexa.id,
      },
    }),
    prisma.conference.create({
      data: {
        title: 'Aesthetic Medicine Forum — North Africa 2026',
        description:
          'Workshop: "Advanced Injection Techniques for Natural Facial Rejuvenation" — hands-on cadaver lab and live demonstration.',
        date: new Date('2026-12-10'),
        location: 'Dusit Thani, New Cairo',
        doctorId: drNour.id,
        organizationId: orgDerm.id,
      },
    }),
  ]);

  console.log(`  🎤  Created ${conferences.length} conferences`);

  // ─── Summary ────────────────────────────────────────────────────────────

  console.log('\n✅ Seeding complete!\n');
  console.log('   Summary:');
  console.log('   ────────────────────────────────');
  console.log(`   Organizations:      4`);
  console.log(`   Departments:        8`);
  console.log(`   Doctors:            8`);
  console.log(`   Medical Services:   ${services.length}`);
  console.log(`   Availability Slots: ${slotCount}`);
  console.log(`   Appointments:       ${appointments.length}`);
  console.log(`   Research Papers:    ${researches.length}`);
  console.log(`   Conferences:        ${conferences.length}`);
  console.log('   ────────────────────────────────\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
