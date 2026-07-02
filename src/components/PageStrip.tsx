import { useEffect, useRef } from 'react';
import type { Chapter, FileType } from '../types';

interface Props {
  chapters: Chapter[];
  activeIndex: number;
  fileType: FileType | null;
  onSelect: (index: number) => void;
}

export default function PageStrip({ chapters, activeIndex, fileType, onSelect }: Props) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  }, [activeIndex]);

  function label(ch: Chapter): string {
    if (fileType === 'pdf') return `Pg ${ch.number}`;
    return ch.title.length > 20 ? ch.title.slice(0, 18) + '…' : ch.title;
  }

  return (
    <div className="flex gap-3.5 overflow-x-auto border-b border-border px-5 scrollbar-none">
      {chapters.map((ch, i) => (
        <button
          key={ch.number}
          ref={i === activeIndex ? activeRef : null}
          onClick={() => onSelect(i)}
          className={`font-serif text-[13px] py-2 px-[2px] pb-[10px] whitespace-nowrap cursor-pointer
            border-b-[2.5px] transition-colors
            ${i === activeIndex
              ? 'font-semibold text-text border-b-accent'
              : 'text-text-muted border-b-transparent hover:text-text-secondary'
            }`}
        >
          {label(ch)}
        </button>
      ))}
    </div>
  );
}
