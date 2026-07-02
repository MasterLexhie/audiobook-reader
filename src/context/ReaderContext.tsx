import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import type { ReaderState, ReaderAction } from '../types';
import splitSentences from '../lib/splitSentences';

const initialState: ReaderState = {
  chapters: [],
  currentChapterIndex: 0,
  sentences: [],
  currentSentenceIndex: 0,
  isPlaying: false,
  speed: 1,
  voice: null,
  fileName: '',
  fileType: null,
};

function reducer(state: ReaderState, action: ReaderAction): ReaderState {
  switch (action.type) {
    case 'LOAD_BOOK': {
      const sentences = action.chapters.length > 0 ? splitSentences(action.chapters[0].text) : [];
      return {
        ...initialState,
        chapters: action.chapters,
        sentences,
        fileName: action.fileName,
        fileType: action.fileType,
        voice: state.voice,
        speed: state.speed,
      };
    }
    case 'SET_CHAPTER': {
      const chapter = state.chapters[action.index];
      if (!chapter) return state;
      return {
        ...state,
        currentChapterIndex: action.index,
        currentSentenceIndex: 0,
        sentences: splitSentences(chapter.text),
      };
    }
    case 'SET_SENTENCE':
      return { ...state, currentSentenceIndex: action.index };
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };
    case 'SET_SPEED':
      return { ...state, speed: action.speed };
    case 'SET_VOICE':
      return { ...state, voice: action.voice };
    case 'RESET':
      return { ...initialState, voice: state.voice, speed: state.speed };
  }
}

const ReaderContext = createContext<{
  state: ReaderState;
  dispatch: Dispatch<ReaderAction>;
} | null>(null);

export function ReaderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ReaderContext value={{ state, dispatch }}>
      {children}
    </ReaderContext>
  );
}

export function useReader() {
  const ctx = useContext(ReaderContext);
  if (!ctx) throw new Error('useReader must be used within ReaderProvider');
  return ctx;
}
