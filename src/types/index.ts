export interface Chapter {
  title: string;
  text: string;
  number: number;
}

export type FileType = 'pdf' | 'epub';

export interface ReaderState {
  chapters: Chapter[];
  currentChapterIndex: number;
  sentences: string[];
  currentSentenceIndex: number;
  isPlaying: boolean;
  speed: number;
  voice: SpeechSynthesisVoice | null;
  fileName: string;
  fileType: FileType | null;
}

export type ReaderAction =
  | { type: 'LOAD_BOOK'; chapters: Chapter[]; fileName: string; fileType: FileType }
  | { type: 'SET_CHAPTER'; index: number }
  | { type: 'SET_SENTENCE'; index: number }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'SET_SPEED'; speed: number }
  | { type: 'SET_VOICE'; voice: SpeechSynthesisVoice }
  | { type: 'RESET' };
