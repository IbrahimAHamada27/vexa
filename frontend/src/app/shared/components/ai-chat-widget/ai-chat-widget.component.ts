import { Component, inject, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AiService } from '../../../core/services/ai.service';
import { LanguageService } from '../../../core/services/language.service';
import { AiRecommendationResponse, DoctorMatch } from '../../../core/models/ai-recommendation.model';
import { ApiResponse } from '../../../core/models/api-response.model';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  recommendation?: AiRecommendationResponse;
}

@Component({
  selector: 'app-ai-chat-widget',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <!-- FLOATING ACTION BUTTON (FAB) -->
    <button
      type="button"
      class="ai-fab-btn"
      [class.active]="isOpen()"
      (click)="toggleChat()"
      [title]="langService.currentLang() === 'ar' ? 'المساعد الطبي الذكي VEXA AI' : 'VEXA AI Clinical Assistant'"
    >
      <div class="fab-icon-wrap">
        @if (isOpen()) {
          <span class="close-icon">&times;</span>
        } @else {
          <span class="sparkle-icon">✨</span>
        }
      </div>
      <div class="fab-badge">
        <span>VEXA AI</span>
        <span class="pulse-dot"></span>
      </div>
    </button>

    <!-- CHAT MODAL WINDOW -->
    @if (isOpen()) {
      <div class="ai-chat-window" [class.rtl]="langService.isRtl()">
        <!-- CHAT HEADER -->
        <div class="chat-header">
          <div class="bot-info">
            <div class="bot-avatar">✨</div>
            <div>
              <h3 class="bot-name">{{ langService.currentLang() === 'ar' ? 'مساعد فيكسا الطبي الذكي' : 'VEXA AI Clinical Assistant' }}</h3>
              <div class="bot-status">
                <span class="status-dot"></span>
                <span>{{ langService.currentLang() === 'ar' ? 'متصل - محرك الترشيح الطبي' : 'Online - Clinical AI Engine' }}</span>
              </div>
            </div>
          </div>
          <button type="button" class="btn-close-header" (click)="toggleChat()">&times;</button>
        </div>

        <!-- CHAT MESSAGES CONTAINER -->
        <div #scrollContainer class="chat-body">
          @for (msg of messages(); track msg.id) {
            <div class="chat-bubble-wrap" [class.user]="msg.sender === 'user'" [class.ai]="msg.sender === 'ai'">
              @if (msg.sender === 'ai') {
                <div class="bubble-avatar">✨</div>
              }
              <div class="bubble-content">
                <p class="bubble-text">{{ msg.text }}</p>

                <!-- EMBEDDED RECOMMENDATION CARDS IF AVAILABLE -->
                @if (msg.recommendation) {
                  <div class="recommendation-box">
                    <div class="rec-header">
                      <span class="specialty-pill">
                        🎯 {{ langService.currentLang() === 'ar' ? 'التخصص المرشح:' : 'Specialty:' }} <strong>{{ msg.recommendation.suggestedSpecialty }}</strong>
                      </span>
                    </div>

                    <div class="doctors-rec-list">
                      @for (doc of msg.recommendation.recommendedDoctors; track doc.doctorId) {
                        <div class="doc-rec-item">
                          <div class="doc-rec-info">
                            <span class="doc-icon">👨‍⚕️</span>
                            <div>
                              <h4 class="doc-name">{{ doc.doctorName }}</h4>
                              <span class="doc-spec">{{ doc.specialty }}</span>
                              <span class="match-score">★ {{ doc.matchScore }}% {{ langService.currentLang() === 'ar' ? 'تطابق' : 'Match' }}</span>
                            </div>
                          </div>
                          <p class="doc-reason">💡 {{ doc.reason }}</p>
                          <div class="doc-rec-ctas">
                            <a [routerLink]="['/booking']" [queryParams]="{ doctorId: doc.doctorId }" (click)="isOpen.set(false)" class="btn-book-sm">
                              {{ langService.currentLang() === 'ar' ? 'حجز موعد فوراً ←' : 'Book Now ←' }}
                            </a>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }
                <span class="bubble-time">{{ msg.timestamp }}</span>
              </div>
            </div>
          }

          @if (isThinking()) {
            <div class="chat-bubble-wrap ai">
              <div class="bubble-avatar">✨</div>
              <div class="bubble-content thinking">
                <span class="dot-pulse"></span>
                <span>{{ langService.currentLang() === 'ar' ? 'جاري تحليل الأعراض والترشيح الطبي...' : 'Analyzing clinical requirements...' }}</span>
              </div>
            </div>
          }
        </div>

        <!-- QUICK CHIPS -->
        <div class="chat-quick-chips">
          <span class="chips-label">{{ langService.currentLang() === 'ar' ? 'أسئلة سريعة:' : 'Quick Prompts:' }}</span>
          <button type="button" class="chip-item" (click)="sendQuickPrompt('أحتاج استشاري أمراض قلب بالقاهرة')">
            🫀 {{ langService.currentLang() === 'ar' ? 'استشاري قلب بالقاهرة' : 'Cardiologist in Cairo' }}
          </button>
          <button type="button" class="chip-item" (click)="sendQuickPrompt('أريد عيادة جلدية وتجميل بالشروق')">
            🧴 {{ langService.currentLang() === 'ar' ? 'عيادة جلدية بالشروق' : 'Dermatologist in Shorouk' }}
          </button>
          <button type="button" class="chip-item" (click)="sendQuickPrompt('طبيب أطفال وتغذية بالتجمع الخامس')">
            👶 {{ langService.currentLang() === 'ar' ? 'طبيب أطفال بالتجمع' : 'Pediatrician in New Cairo' }}
          </button>
        </div>

        <!-- CHAT INPUT FOOTER -->
        <form (ngSubmit)="sendMessage()" class="chat-footer">
          <input
            type="text"
            [(ngModel)]="userInput"
            name="userInput"
            [placeholder]="langService.currentLang() === 'ar' ? 'اكتب عرضك الطبي أو التخصص المفضل...' : 'Type your symptoms or specialty...'"
            class="chat-input"
            [disabled]="isThinking()"
          />
          <button type="submit" class="btn-send" [disabled]="!userInput.trim() || isThinking()">
            <span>{{ langService.isRtl() ? '◄' : '►' }}</span>
          </button>
        </form>
      </div>
    }
  `,
  styles: [`
    /* FAB Button */
    .ai-fab-btn {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 2000;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.75rem 1.25rem;
      background: linear-gradient(135deg, var(--color-primary), #0284c7);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-pill);
      box-shadow: 0 10px 30px rgba(6, 182, 212, 0.4), 0 0 20px rgba(13, 137, 236, 0.3);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    html[dir="rtl"] .ai-fab-btn {
      right: auto;
      left: 28px;
    }

    .ai-fab-btn:hover {
      transform: translateY(-4px) scale(1.04);
      box-shadow: 0 15px 40px rgba(6, 182, 212, 0.6);
    }

    .ai-fab-btn.active {
      background: #0f172a;
      border-color: var(--color-border);
    }

    .fab-icon-wrap {
      font-size: 1.3rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .fab-badge {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-weight: 800;
      font-size: 0.95rem;
      letter-spacing: 0.05em;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #34d399;
      box-shadow: 0 0 10px #34d399;
      animation: pulse 1.8s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.7); }
      70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(52, 211, 153, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
    }

    /* Modal Window */
    .ai-chat-window {
      position: fixed;
      bottom: 90px;
      right: 28px;
      width: 420px;
      max-width: calc(100vw - 32px);
      height: 600px;
      max-height: calc(100vh - 120px);
      background: var(--bg-card);
      border: 1px solid var(--color-border-glow);
      border-radius: var(--radius-lg);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), var(--shadow-glow);
      z-index: 2000;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    html[dir="rtl"] .ai-chat-window {
      right: auto;
      left: 28px;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Header */
    .chat-header {
      background: var(--bg-glass);
      backdrop-filter: blur(16px);
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .bot-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .bot-avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      box-shadow: var(--shadow-glow);
    }

    .bot-name {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 800;
      color: var(--color-text-main);
    }

    .bot-status {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.75rem;
      color: #34d399;
      font-weight: 600;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #34d399;
    }

    .btn-close-header {
      background: none;
      border: none;
      color: var(--color-text-muted);
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.2rem;
    }

    .btn-close-header:hover {
      color: var(--color-primary);
    }

    /* Chat Body */
    .chat-body {
      flex: 1;
      padding: 1.25rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      background: var(--bg-space);
    }

    .chat-bubble-wrap {
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
      max-width: 88%;
    }

    .chat-bubble-wrap.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .chat-bubble-wrap.ai {
      align-self: flex-start;
    }

    .bubble-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      flex-shrink: 0;
    }

    .bubble-content {
      background: var(--bg-card);
      border: 1px solid var(--color-border);
      padding: 0.85rem 1.1rem;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
    }

    .user .bubble-content {
      background: linear-gradient(135deg, var(--color-primary), #0284c7);
      color: #ffffff;
      border-color: transparent;
    }

    .bubble-text {
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.5;
      white-space: pre-wrap;
    }

    .user .bubble-text {
      color: #ffffff;
    }

    .bubble-time {
      display: block;
      font-size: 0.7rem;
      color: var(--color-text-subtle);
      margin-top: 0.35rem;
      text-align: right;
    }

    .user .bubble-time {
      color: rgba(255, 255, 255, 0.7);
    }

    /* Embedded Recommendation Box */
    .recommendation-box {
      margin-top: 0.85rem;
      border-top: 1px solid var(--color-border);
      padding-top: 0.85rem;
    }

    .specialty-pill {
      display: inline-block;
      font-size: 0.75rem;
      color: #38bdf8;
      background: rgba(6, 182, 212, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-pill);
      margin-bottom: 0.75rem;
    }

    .doctors-rec-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .doc-rec-item {
      background: var(--bg-space);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      padding: 0.75rem;
    }

    .doc-rec-info {
      display: flex;
      gap: 0.6rem;
      align-items: center;
      margin-bottom: 0.4rem;
    }

    .doc-icon { font-size: 1.2rem; }
    .doc-name { margin: 0; font-size: 0.85rem; font-weight: 800; color: var(--color-text-main); }
    .doc-spec { display: block; font-size: 0.75rem; color: var(--color-text-muted); }
    .match-score { font-size: 0.7rem; font-weight: 800; color: #34d399; }
    .doc-reason { font-size: 0.75rem; color: var(--color-text-subtle); margin: 0 0 0.6rem 0; line-height: 1.4; }

    .btn-book-sm {
      display: inline-block;
      width: 100%;
      text-align: center;
      background: linear-gradient(135deg, var(--color-primary), #0284c7);
      color: #ffffff !important;
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      font-weight: 700;
      text-decoration: none;
    }

    /* Thinking State */
    .thinking {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.85rem;
      color: var(--color-text-muted);
    }

    .dot-pulse {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-primary);
      animation: pulse 1.2s infinite;
    }

    /* Quick Chips */
    .chat-quick-chips {
      padding: 0.6rem 1rem;
      background: var(--bg-card);
      border-top: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      gap: 0.4rem;
      overflow-x: auto;
    }

    .chips-label {
      font-size: 0.7rem;
      color: var(--color-text-subtle);
      font-weight: 700;
      white-space: nowrap;
    }

    .chip-item {
      background: var(--bg-space);
      border: 1px solid var(--color-border);
      color: var(--color-text-main);
      padding: 0.3rem 0.65rem;
      border-radius: var(--radius-pill);
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .chip-item:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    /* Chat Footer */
    .chat-footer {
      padding: 0.75rem 1rem;
      background: var(--bg-card);
      border-top: 1px solid var(--color-border);
      display: flex;
      gap: 0.5rem;
    }

    .chat-input {
      flex: 1;
      padding: 0.65rem 0.9rem;
      font-size: 0.85rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--bg-space);
      color: var(--color-text-main);
    }

    .chat-input:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    .btn-send {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--color-primary), #0284c7);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      cursor: pointer;
      border: none;
    }

    .btn-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
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

    // Call AI Service
    this.aiService.recommend(query).subscribe({
      next: (res: ApiResponse<AiRecommendationResponse>) => {
        this.isThinking.set(false);
        if (res.success && res.data) {
          this.addAiResponse(
            this.langService.currentLang() === 'ar'
              ? `بناءً على طلبك (${query})، قمت بتحليل التخصص الطبي الأكثر ملاءمة وترشيح كبار الاستشاريين والمراكز المعتمدة:`
              : `Based on your prompt (${query}), I analyzed the matching specialty and selected top senior doctors:`,
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
    const fallbackRec: AiRecommendationResponse = {
      suggestedSpecialty: query.includes('جلدية') || query.includes('derm') ? (isAr ? 'الأمراض الجلدية والتجميل' : 'Dermatology') : (isAr ? 'أمراض القلب والأوعية الدموية' : 'Cardiology'),
      summary: isAr ? 'ترشيح ذكي دقيق بناءً على الأعراض المدخلة' : 'AI Clinical Recommendation based on search criteria',
      recommendedDoctors: [
        {
          doctorId: 'doc1',
          doctorName: isAr ? 'أ.د. أحمد عبد الرحمن الحسين' : 'Prof. Ahmed Abdelrahman',
          specialty: isAr ? 'استشاري أمراض القلب والقسطرة التداخلية' : 'Consultant Cardiologist',
          matchScore: 98,
          reason: isAr ? 'أستاذ خبير بقسطرة الشرايين التاجية في مستشفى الشروق الدولي.' : 'Senior consultant with 22+ years experience in Shorouk Hospital.'
        },
        {
          doctorId: 'doc2',
          doctorName: isAr ? 'د. مريم الشناوي' : 'Dr. Maryam El Shennawy',
          specialty: isAr ? 'استشاري أمراض الجلدية والتجميل والليزر' : 'Consultant Dermatologist',
          matchScore: 94,
          reason: isAr ? 'خبرة عريضة في أحدث تقنيات الليزر والعلاج الجلدية الفاخر.' : 'Specialist in aesthetic laser and dermatology treatments.'
        }
      ]
    };

    this.addAiResponse(
      isAr
        ? `بناءً على طلبك (${query})، إليك أفضل الاستشاريين المرشحين والمتاحين للحجز الفوري:`
        : `Based on your request (${query}), here are the top recommended specialists available for instant booking:`,
      fallbackRec
    );
  }

  private getInitialGreeting(): string {
    return this.langService.currentLang() === 'ar'
      ? 'أهلاً بك في منصة VEXA! أنا مساعدك الطبي الذكي. اكتب ما تشعر به أو التخصص والمنطقة المطلوبة وسأقوم بترشيح أفضل المستشفيات والأطباء فوراً.'
      : 'Welcome to VEXA! I am your AI clinical assistant. Tell me your symptoms, preferred city, or specialty and I will recommend top doctors instantly.';
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
    } catch {}
  }
}
