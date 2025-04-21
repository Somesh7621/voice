
// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
  readonly resultIndex: number;
}

interface SpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  abort(): void;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognitionStatic {
  new(): SpeechRecognition;
  prototype: SpeechRecognition;
}

// Global extensions
interface Window {
  SpeechRecognition?: SpeechRecognitionStatic;
  webkitSpeechRecognition?: SpeechRecognitionStatic;
}

// Speech Synthesis definitions (for completeness)
interface SpeechSynthesisUtterance extends EventTarget {
  lang: string;
  onboundary: (this: SpeechSynthesisUtterance, ev: Event) => any;
  onend: (this: SpeechSynthesisUtterance, ev: Event) => any;
  onerror: (this: SpeechSynthesisUtterance, ev: Event) => any;
  onmark: (this: SpeechSynthesisUtterance, ev: Event) => any;
  onpause: (this: SpeechSynthesisUtterance, ev: Event) => any;
  onresume: (this: SpeechSynthesisUtterance, ev: Event) => any;
  onstart: (this: SpeechSynthesisUtterance, ev: Event) => any;
  pitch: number;
  rate: number;
  text: string;
  voice: SpeechSynthesisVoice | null;
  volume: number;
}

interface SpeechSynthesisUtteranceStatic {
  new(text?: string): SpeechSynthesisUtterance;
  prototype: SpeechSynthesisUtterance;
}

interface Window {
  SpeechSynthesisUtterance: SpeechSynthesisUtteranceStatic;
}
