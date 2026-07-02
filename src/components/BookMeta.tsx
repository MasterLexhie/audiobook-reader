import { useReader } from '../context/ReaderContext';

function wordCount(chapters: { text: string }[]): number {
  return chapters.reduce((sum, ch) => sum + ch.text.split(/\s+/).length, 0);
}

function formatTime(words: number): string {
  const minutes = Math.round(words / 150);
  if (minutes < 60) return `≈ ${minutes} m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `≈ ${h} h ${m} m`;
}

function formatNumber(n: number): string {
  return n.toLocaleString();
}

export default function BookMeta() {
  const { state } = useReader();
  const words = wordCount(state.chapters);
  const label = state.fileType === 'epub' ? 'Chapters' : 'Pages';

  return (
    <div className="flex flex-col gap-[9px] text-[12.5px] text-text-secondary border-t border-border pt-4">
      <div className="flex justify-between">
        <span>{label}</span>
        <span className="font-semibold text-text">{state.chapters.length}</span>
      </div>
      <div className="flex justify-between">
        <span>Listening time</span>
        <span className="font-semibold text-text">{formatTime(words)}</span>
      </div>
      <div className="flex justify-between">
        <span>Words</span>
        <span className="font-semibold text-text">{formatNumber(words)}</span>
      </div>
    </div>
  );
}
