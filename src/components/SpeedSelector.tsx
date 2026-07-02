const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

interface Props {
  speed: number;
  onChange: (speed: number) => void;
  bordered?: boolean;
}

export default function SpeedSelector({ speed, onChange, bordered }: Props) {
  function cycle() {
    const idx = SPEEDS.indexOf(speed);
    const next = SPEEDS[(idx + 1) % SPEEDS.length];
    onChange(next);
  }

  return (
    <button
      onClick={cycle}
      className={`font-semibold text-[12px] text-pill-speed cursor-pointer transition-opacity hover:opacity-70
        ${bordered ? 'border border-pill-speed-border px-[10px] py-2 rounded-2xl' : 'bg-transparent border-none'}`}
    >
      {speed}×
    </button>
  );
}
