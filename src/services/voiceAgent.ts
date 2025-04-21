
// Voice Agent Service for handling speech processing and conversation

interface DialogueState {
  currentStep: number;
  collectedData: Record<string, any>;
  jobDetails?: {
    title: string;
    company: string;
  };
  transcript: string[];
}

// Simple dialogue state management
class DialogueManager {
  private state: DialogueState;
  private questions: string[];
  
  constructor(jobTitle: string = "Software Developer", company: string = "Tech Corp") {
    this.state = {
      currentStep: 0,
      collectedData: {},
      jobDetails: {
        title: jobTitle,
        company: company
      },
      transcript: []
    };
    
    this.questions = [
      `Hello, this is ${company} regarding the ${jobTitle} opportunity. Are you interested in this role?`,
      "Great! What is your current notice period?",
      "Can you share your current and expected CTC (Cost to Company)?",
      "When would you be available for an interview next week?"
    ];
  }
  
  getCurrentPrompt(): string {
    if (this.state.currentStep < this.questions.length) {
      return this.questions[this.state.currentStep];
    }
    
    // Confirmation step
    if (this.state.currentStep === this.questions.length) {
      const date = this.state.collectedData.interviewDate || "the requested date";
      return `We've scheduled your interview on ${date}. Is that correct?`;
    }
    
    return "Thank you for your time. We'll be in touch soon!";
  }
  
  processResponse(response: string): { nextPrompt: string, complete: boolean, extractedData: Record<string, any> } {
    // Add to transcript
    this.state.transcript.push(`User: ${response}`);
    
    // Extract entities based on current question
    const extractedData: Record<string, any> = {};
    
    switch(this.state.currentStep) {
      case 0: // Interest in role
        extractedData.interested = this.extractInterest(response);
        break;
      case 1: // Notice period
        extractedData.noticePeriod = this.extractNoticePeriod(response);
        break;
      case 2: // CTC
        const ctc = this.extractCTC(response);
        extractedData.currentCtc = ctc.current;
        extractedData.expectedCtc = ctc.expected;
        break;
      case 3: // Interview availability
        extractedData.interviewDate = this.extractDate(response);
        break;
      case 4: // Confirmation
        extractedData.confirmed = this.extractConfirmation(response);
        break;
    }
    
    // Update collected data
    this.state.collectedData = { ...this.state.collectedData, ...extractedData };
    
    // Check if we need to repeat the question due to unclear response
    if (this.responseNeedsClarification(this.state.currentStep, extractedData)) {
      this.state.transcript.push(`Agent: I'm sorry, I didn't quite catch that.`);
      return { 
        nextPrompt: this.questions[this.state.currentStep],
        complete: false,
        extractedData
      };
    }
    
    // Move to next step
    this.state.currentStep++;
    
    // Check if complete
    const complete = this.state.currentStep > this.questions.length;
    
    // Get next prompt
    const nextPrompt = this.getCurrentPrompt();
    this.state.transcript.push(`Agent: ${nextPrompt}`);
    
    return {
      nextPrompt,
      complete,
      extractedData
    };
  }
  
  reset(): void {
    this.state.currentStep = 0;
    this.state.collectedData = {};
    this.state.transcript = [];
  }
  
  getState(): DialogueState {
    return this.state;
  }
  
  // Entity extraction methods
  private extractInterest(text: string): boolean {
    const positive = ['yes', 'yeah', 'sure', 'interested', 'definitely', 'absolutely'];
    const negative = ['no', 'not', 'don\'t', 'isn\'t', 'nope'];
    
    text = text.toLowerCase();
    
    for (const word of positive) {
      if (text.includes(word)) return true;
    }
    
    for (const word of negative) {
      if (text.includes(word)) return false;
    }
    
    return false; // Default if unclear
  }
  
  private extractNoticePeriod(text: string): string {
    const regex = /(\d+)\s*(day|days|week|weeks|month|months)/i;
    const match = text.match(regex);
    
    if (match) {
      return `${match[1]} ${match[2]}`;
    }
    
    return "unclear";
  }
  
  private extractCTC(text: string): { current: string; expected: string } {
    // Simplistic approach - look for currency symbols or numbers with k/lakh/crore
    const amounts = text.match(/(\d+(\.\d+)?)\s*(k|lakh|crore|million)?/g) || [];
    
    return {
      current: amounts[0] || "unclear",
      expected: amounts[1] || "unclear"
    };
  }
  
  private extractDate(text: string): string {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    text = text.toLowerCase();
    
    for (const day of days) {
      if (text.includes(day)) {
        // Generate a date for next week for the mentioned day
        const today = new Date();
        const dayIndex = days.indexOf(day);
        const targetDate = new Date();
        targetDate.setDate(today.getDate() + (7 - today.getDay() + dayIndex + 1) % 7 + 1);
        
        // Check for time mentions
        let hour = 10; // Default to 10 AM
        if (text.includes('afternoon')) hour = 14;
        if (text.includes('evening')) hour = 17;
        
        // Extract specific time if mentioned
        const timeMatch = text.match(/(\d+)(?::(\d+))?\s*(am|pm)?/i);
        if (timeMatch) {
          hour = parseInt(timeMatch[1]);
          if (timeMatch[3]?.toLowerCase() === 'pm' && hour < 12) {
            hour += 12;
          }
        }
        
        targetDate.setHours(hour, 0, 0, 0);
        return targetDate.toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        });
      }
    }
    
    return "unclear";
  }
  
  private extractConfirmation(text: string): boolean {
    const positive = ['yes', 'yeah', 'correct', 'right', 'sure', 'ok'];
    const negative = ['no', 'not', 'wrong', 'incorrect', 'change'];
    
    text = text.toLowerCase();
    
    for (const word of positive) {
      if (text.includes(word)) return true;
    }
    
    for (const word of negative) {
      if (text.includes(word)) return false;
    }
    
    return true; // Default to positive if unclear
  }
  
  private responseNeedsClarification(step: number, extractedData: Record<string, any>): boolean {
    switch(step) {
      case 1: // Notice period
        return extractedData.noticePeriod === "unclear";
      case 2: // CTC
        return extractedData.currentCtc === "unclear" && extractedData.expectedCtc === "unclear";
      case 3: // Interview date
        return extractedData.interviewDate === "unclear";
      default:
        return false;
    }
  }
}

// Speech recognition and synthesis interfaces
export interface SpeechRecognizer {
  start(): void;
  stop(): void;
  onResult: (text: string) => void;
  onError: (error: any) => void;
}

export interface SpeechSynthesizer {
  speak(text: string): Promise<void>;
  cancel(): void;
  onStart?: () => void;
  onEnd?: () => void;
}

// Implementation using Web Speech API
class BrowserSpeechRecognizer implements SpeechRecognizer {
  private recognition: SpeechRecognition | null = null;
  
  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognitionAPI) {
        this.recognition = new SpeechRecognitionAPI();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        
        this.recognition.onresult = (event) => {
          const last = event.results.length - 1;
          const text = event.results[last][0].transcript;
          if (this.onResult) {
            this.onResult(text);
          }
        };
        
        this.recognition.onerror = (event) => {
          if (this.onError) {
            this.onError(event.error);
          }
        };
      }
    }
  }
  
  start(): void {
    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (e) {
        console.error('Error starting speech recognition:', e);
      }
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }
  
  stop(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.error('Error stopping speech recognition:', e);
      }
    }
  }
  
  onResult: (text: string) => void = () => {};
  onError: (error: any) => void = () => {};
}

class BrowserSpeechSynthesizer implements SpeechSynthesizer {
  private synth: SpeechSynthesis;
  
  constructor() {
    this.synth = window.speechSynthesis;
  }
  
  async speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (this.synth) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        utterance.onstart = () => {
          if (this.onStart) this.onStart();
        };
        
        utterance.onend = () => {
          if (this.onEnd) this.onEnd();
          resolve();
        };
        
        this.synth.speak(utterance);
      } else {
        console.warn('Speech synthesis not supported in this browser');
        resolve();
      }
    });
  }
  
  cancel(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }
  
  onStart?: () => void;
  onEnd?: () => void;
}

// VoiceAgent class to coordinate dialog and speech
export class VoiceAgent {
  private dialogueManager: DialogueManager;
  private recognizer: SpeechRecognizer;
  private synthesizer: SpeechSynthesizer;
  private isListening = false;
  private isComplete = false;
  private onUpdateCallback: (state: any) => void = () => {};
  
  constructor(
    jobTitle: string,
    company: string,
    recognizer: SpeechRecognizer = new BrowserSpeechRecognizer(),
    synthesizer: SpeechSynthesizer = new BrowserSpeechSynthesizer()
  ) {
    this.dialogueManager = new DialogueManager(jobTitle, company);
    this.recognizer = recognizer;
    this.synthesizer = synthesizer;
    
    // Set up event handlers
    this.recognizer.onResult = this.handleSpeechResult.bind(this);
    this.recognizer.onError = this.handleSpeechError.bind(this);
    this.synthesizer.onStart = () => {
      console.log('Speech started');
    };
    this.synthesizer.onEnd = () => {
      if (!this.isComplete) {
        setTimeout(() => {
          this.startListening();
        }, 500);
      }
    };
  }
  
  async start(): Promise<void> {
    this.isComplete = false;
    const initialPrompt = this.dialogueManager.getCurrentPrompt();
    await this.synthesizer.speak(initialPrompt);
  }
  
  stop(): void {
    this.synthesizer.cancel();
    this.stopListening();
    this.isComplete = true;
  }
  
  reset(jobTitle?: string, company?: string): void {
    this.stop();
    this.dialogueManager = new DialogueManager(jobTitle, company);
    this.isComplete = false;
  }
  
  onUpdate(callback: (state: any) => void): void {
    this.onUpdateCallback = callback;
  }
  
  getCurrentState(): any {
    return this.dialogueManager.getState();
  }
  
  // For the testing UI
  async processTextInput(text: string): Promise<void> {
    await this.handleSpeechResult(text);
  }
  
  private startListening(): void {
    if (this.isComplete) return;
    
    this.isListening = true;
    this.recognizer.start();
    this.onUpdateCallback({ ...this.getCurrentState(), listening: true });
  }
  
  private stopListening(): void {
    this.isListening = false;
    this.recognizer.stop();
    this.onUpdateCallback({ ...this.getCurrentState(), listening: false });
  }
  
  private async handleSpeechResult(text: string): Promise<void> {
    this.stopListening();
    
    console.log('Speech result:', text);
    
    const { nextPrompt, complete, extractedData } = this.dialogueManager.processResponse(text);
    this.isComplete = complete;
    
    this.onUpdateCallback({ ...this.getCurrentState(), extractedData });
    
    if (!complete) {
      await this.synthesizer.speak(nextPrompt);
    } else {
      this.onUpdateCallback({ ...this.getCurrentState(), completed: true });
    }
  }
  
  private handleSpeechError(error: any): void {
    console.error('Speech recognition error:', error);
    this.stopListening();
    
    // Retry after a short delay
    setTimeout(() => {
      this.startListening();
    }, 1000);
  }
}

export default VoiceAgent;
