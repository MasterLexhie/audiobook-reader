import { useCallback, useEffect, useRef } from 'react';

export default function useSpeechSynthesis(onEnd: () => void) {
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  const speak = useCallback((text: string, rate: number, voice: SpeechSynthesisVoice | null) => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    if (voice) utterance.voice = voice;
    utterance.onend = () => onEndRef.current();
    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        onEndRef.current();
      }
    };
    speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    return () => { speechSynthesis.cancel(); };
  }, []);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  return { speak, stop, isSupported };
}
