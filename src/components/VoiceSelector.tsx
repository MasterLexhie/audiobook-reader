interface Props {
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  onChange: (voice: SpeechSynthesisVoice) => void;
}

export default function VoiceSelector({ voices, selectedVoice, onChange }: Props) {
  return (
    <div className="relative flex items-center gap-[5px] text-pill-text text-[11px] cursor-pointer">
      <select
        value={selectedVoice?.name ?? ''}
        onChange={(e) => {
          const voice = voices.find((v) => v.name === e.target.value);
          if (voice) onChange(voice);
        }}
        className="appearance-none bg-transparent border-none text-inherit text-[11px] cursor-pointer
          pr-4 outline-none"
      >
        {voices.map((v) => (
          <option key={v.name} value={v.name}>
            {v.name}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-0 pointer-events-none"
        width="8"
        height="5"
        viewBox="0 0 9 6"
      >
        <polygon points="0,0 9,0 4.5,6" fill="currentColor" />
      </svg>
    </div>
  );
}
