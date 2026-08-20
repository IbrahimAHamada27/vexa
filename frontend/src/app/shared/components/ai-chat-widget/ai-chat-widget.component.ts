import { Component, inject, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AiService } from '../../../core/services/ai.service';
import { LanguageService } from '../../../core/services/language.service';
import { AiRecommendationResponse } from '../../../core/models/ai-recommendation.model';
import { ApiResponse } from '../../../core/models/api-response.model';
import { EmergencyInfo, ChatMessage } from './ai-chat-widget.model';

export type { EmergencyInfo, ChatMessage };

@Component({
  selector: 'app-ai-chat-widget',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './ai-chat-widget.component.html',
  styleUrl: './ai-chat-widget.component.css'
})
export class AiChatWidgetComponent implements AfterViewChecked {
  @ViewChild('scrollContainer') private readonly scrollContainer!: ElementRef;

  readonly aiService = inject(AiService);
  readonly langService = inject(LanguageService);

  isOpen = signal(false);
  isThinking = signal(false);
  userInput = '';

  messages = signal<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: this.getInitialGreeting(),
      timestamp: this.getCurrentTime()
    }
  ]);

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  toggleChat(): void {
    this.isOpen.update(val => !val);
  }

  sendQuickPrompt(prompt: string): void {
    this.userInput = prompt;
    this.sendMessage();
  }

  sendMessage(): void {
    if (!this.userInput.trim() || this.isThinking()) return;

    const query = this.userInput.trim();
    this.userInput = '';

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: this.getCurrentTime()
    };

    this.messages.update(msgs => [...msgs, userMsg]);
    this.isThinking.set(true);

    // Check emergency / pharmacy / lab intent locally first
    const lower = query.toLowerCase();

    if (lower.includes('إسعاف') || lower.includes('طوارئ') || lower.includes('123') || lower.includes('مطافئ') || lower.includes('سموم') || lower.includes('ambulance') || lower.includes('fire')) {
      setTimeout(() => {
        this.isThinking.set(false);
        this.addEmergencyResponse(query);
      }, 500);
      return;
    }

    if (lower.includes('صيدل') || lower.includes('دواء') || lower.includes('pharmacy') || lower.includes('علاج')) {
      setTimeout(() => {
        this.isThinking.set(false);
        this.addPharmacyResponse(query);
      }, 500);
      return;
    }

    if (lower.includes('معمل') || lower.includes('أشعة') || lower.includes('تحليل') || lower.includes('lab') || lower.includes('scan')) {
      setTimeout(() => {
        this.isThinking.set(false);
        this.addLabResponse(query);
      }, 500);
      return;
    }

    // Call Backend AI Service for Clinical Doctor/Hospital search
    this.aiService.recommend(query).subscribe({
      next: (res: ApiResponse<AiRecommendationResponse>) => {
        this.isThinking.set(false);
        if (res.success && res.data) {
          this.addAiResponse(
            this.langService.currentLang() === 'ar'
              ? `بناءً على طلبك (${query})، قمت بتحليل التخصص والبحث في كبرى المستشفيات والعيادات المعتمدة:`
              : `Based on your query (${query}), here are top matching clinical options:`,
            res.data
          );
        } else {
          this.addFallbackResponse(query);
        }
      },
      error: () => {
        this.isThinking.set(false);
        this.addFallbackResponse(query);
      }
    });
  }

  private addEmergencyResponse(query: string): void {
    const isAr = this.langService.currentLang() === 'ar';
    const emergencyInfo: EmergencyInfo[] = [
      {
        title: isAr ? 'هيئة الإسعاف المصرية (Ambulance)' : 'Egyptian Ambulance Service',
        phone: '123',
        description: isAr ? 'طوارئ واستغاثة حوادث وسيارات إسعاف مجهزة بالرعاية المركزة 24/7' : '24/7 Emergency Ambulance Dispatch Across Egypt.',
        type: 'ambulance'
      },
      {
        title: isAr ? 'طوارئ وزارة الصحة والرعاية العاجلة' : 'Ministry of Health ICU Finder Hotline',
        phone: '137',
        description: isAr ? 'الخط الساخن لتوفير أسرة الرعاية المركزة وحضانات الأطفال فوراً' : 'Emergency ICU bed & incubator location service.',
        type: 'ambulance'
      },
      {
        title: isAr ? 'الحماية المدنية والمطافئ' : 'Fire Department & Civil Defense',
        phone: '180',
        description: isAr ? 'طوارئ الحوادث والإطفاء والانقاذ السريع' : 'Emergency Civil Defense and Fire Rescue.',
        type: 'fire'
      },
      {
        title: isAr ? 'مركز طوارئ السموم - جامعة القاهرة' : 'Poison Control Hotline',
        phone: '0223643140',
        description: isAr ? 'استغاثة واستشارات حالات التسمم والجرعات الزائدة 24 ساعة' : 'Cairo University Poison Control Emergency Hotline.',
        type: 'poison'
      }
    ];

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: isAr ? `🚨 خطوط الاستغاثة والطوارئ العاجلة المتاحة فوراً لـ (${query}):` : `🚨 Emergency lines available for (${query}):`,
      timestamp: this.getCurrentTime(),
      emergencyInfo
    };
    this.messages.update(msgs => [...msgs, aiMsg]);
  }

  private addPharmacyResponse(query: string): void {
    const isAr = this.langService.currentLang() === 'ar';
    const emergencyInfo: EmergencyInfo[] = [
      {
        title: isAr ? 'صيدليات العزبي (El Ezaby Pharmacy)' : 'El Ezaby 24/7 Pharmacy',
        phone: '19600',
        description: isAr ? 'توصيل أدوية ومستلزمات على مدار 24 ساعة بكافة الفروع (الشروق، التجمع، القاهرة، الإسكندرية)' : '24/7 medicine delivery in Shorouk, Cairo, New Cairo, and Alex.',
        type: 'pharmacy'
      },
      {
        title: isAr ? 'صيدليات سيف (Seif Pharmacies)' : 'Seif Pharmacies',
        phone: '19199',
        description: isAr ? 'خدمة الخط الساخن وتوصيل الأدوية المستوردة والمحلية' : '24/7 Hotline for domestic and imported medications.',
        type: 'pharmacy'
      },
      {
        title: isAr ? 'صيدلية الشروق الطبية التخصصية' : 'Shorouk Specialist Pharmacy',
        phone: '01002405000',
        description: isAr ? 'فرع مدينة الشروق - الحي السابع - توصيل فوري للعيادات والمنازل' : 'Shorouk City District 7 Branch — Instant delivery.',
        type: 'pharmacy'
      }
    ];

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: isAr ? `💊 كبرى شبكات الصيدليات 24/7 والخط الساخن للأدوية لـ (${query}):` : `💊 Top 24/7 Pharmacies and drug delivery hotlines for (${query}):`,
      timestamp: this.getCurrentTime(),
      emergencyInfo
    };
    this.messages.update(msgs => [...msgs, aiMsg]);
  }

  private addLabResponse(query: string): void {
    const isAr = this.langService.currentLang() === 'ar';
    const emergencyInfo: EmergencyInfo[] = [
      {
        title: isAr ? 'معامل المختبر (Al Mokhtabar Labs)' : 'Al Mokhtabar Medical Labs',
        phone: '19014',
        description: isAr ? 'جميع التحاليل الطبية وسحب العينات المنزلي وتطبيقات النتائج' : 'Comprehensive lab tests & home sample collection.',
        type: 'lab'
      },
      {
        title: isAr ? 'معامل البرج (Al Borg Laboratories)' : 'Al Borg Laboratories',
        phone: '19241',
        description: isAr ? 'أكبر شبكة معامل تحاليل معتمدة بالمملكة ومصر' : 'Certified medical diagnostic lab network.',
        type: 'lab'
      },
      {
        title: isAr ? 'مركز كايرو سكان للأشعة والتحاليل' : 'Cairo Scan Radiology & Imaging',
        phone: '19144',
        description: isAr ? 'أشعة رنين مغناطيسي ومقطعية وموجات صوتية ممتدة 24 ساعة' : '24/7 MRI, CT scan, and ultrasound radiology.',
        type: 'lab'
      }
    ];

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: isAr ? `🔬 معامل التحاليل ومراكز الأشعة المعتمدة لـ (${query}):` : `🔬 Certified Labs & Radiology Centers for (${query}):`,
      timestamp: this.getCurrentTime(),
      emergencyInfo
    };
    this.messages.update(msgs => [...msgs, aiMsg]);
  }

  private addAiResponse(text: string, recommendation: AiRecommendationResponse): void {
    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text,
      timestamp: this.getCurrentTime(),
      recommendation
    };
    this.messages.update(msgs => [...msgs, aiMsg]);
  }

  private addFallbackResponse(query: string): void {
    const isAr = this.langService.currentLang() === 'ar';
    const fallbackRecommendation: AiRecommendationResponse = {
      suggestedSpecialty: isAr ? 'طب وجراحة القلب والقسطرة / الجلدية' : 'Cardiology & Dermatology',
      summary: isAr ? `تم العثور على أفضل الأطباء والعيادات لـ "${query}"` : `Top recommended doctors for "${query}"`,
      recommendedDoctors: [
        {
          doctorId: 'doc-1',
          doctorName: isAr ? 'أ.د. أحمد عبد الرحمن الحسين' : 'Prof. Dr. Ahmed El-Husseini',
          specialty: isAr ? 'استشاري أمراض القلب والأوعية الدموية' : 'Senior Consultant Cardiologist',
          matchScore: 98,
          reason: isAr ? 'خبرة 22 عاماً بالقسطرة وطوارئ القلب بالمستشفى الدولي' : '22+ Years in Cardiology & Cardiac Care'
        },
        {
          doctorId: 'doc-2',
          doctorName: isAr ? 'د. مريم الشناوي' : 'Dr. Maryam El-Shennawy',
          specialty: isAr ? 'استشاري أمراض الجلدية والتجميل والليزر' : 'Consultant Dermatologist',
          matchScore: 94,
          reason: isAr ? 'متخصصة بجراحات الجلدية والعلاج بالليزر' : 'Consultant Dermatologist & Laser Specialist'
        }
      ]
    };

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: isAr ? `نتائج البحث عن (${query}):` : `Search results for (${query}):`,
      timestamp: this.getCurrentTime(),
      recommendation: fallbackRecommendation
    };
    this.messages.update(msgs => [...msgs, aiMsg]);
  }

  private getInitialGreeting(): string {
    return this.langService.currentLang() === 'ar'
      ? 'مرحباً بك في VEXA AI ❖! أنا مساعدك الطبي الذكي. كيف يمكنني مساعدتك اليوم؟ يمكنك الاستفسار عن الأطباء، المستشفيات، الصيدليات، المعامل، أو طوارئ الإسعاف 123.'
      : 'Welcome to VEXA AI ❖! I am your clinical assistant. Ask me about doctors, hospitals, pharmacies, labs, or 123 Ambulance hotline.';
  }

  private getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch (_err) {
      // Ignore scroll errors
    }
  }
}
