import { useState, useEffect, useRef } from 'react';

export default function useVoices() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const hasSetDefault = useRef(false);

  useEffect(() => {
    function loadVoices() {
      const available = speechSynthesis.getVoices();
      setVoices(available);
      if (available.length > 0 && !hasSetDefault.current) {
        hasSetDefault.current = true;
        const englishLocal = available.find((v) => v.lang.startsWith('en') && v.localService);
        const english = available.find((v) => v.lang.startsWith('en'));
        setSelectedVoice(englishLocal ?? english ?? available[0]);
      }
    }

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  return { voices, selectedVoice, setSelectedVoice };
}
