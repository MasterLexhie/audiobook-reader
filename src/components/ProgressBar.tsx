interface Props {
  current: number;
  total: number;
  label: string;
  onClick: (index: number) => void;
}

export default function ProgressBar({ current, total, label, onClick }: Props) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const index = Math.round(ratio * (total - 1));
    onClick(Math.max(0, Math.min(index, total - 1)));
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="h-[3px] bg-pill-progress-track rounded-[2px] relative cursor-pointer"
        onClick={handleClick}
      >
        <div
          className="absolute left-0 top-0 bottom-0 bg-pill-accent rounded-[2px] transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between font-mono text-[9.5px] text-text-faint">
        <span>{current + 1}/{total}</span>
        <span>{label}</span>
      </div>
    </div>
  );
}
