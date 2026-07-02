import { useEffect, useRef } from 'react';

interface Handlers {
  onTogglePlay: () => void;
  onNextSentence: () => void;
  onPrevSentence: () => void;
}

export default function useKeyboardShortcuts(handlers: Handlers) {
  const ref = useRef(handlers);
  ref.current = handlers;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          ref.current.onTogglePlay();
          break;
        case 'ArrowRight':
          ref.current.onNextSentence();
          break;
        case 'ArrowLeft':
          ref.current.onPrevSentence();
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
