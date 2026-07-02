import type { Chapter } from '../types';

interface Props {
  chapter: Chapter;
  isActive: boolean;
  duration: string;
  onClick: () => void;
}

export default function PageListItem({ chapter, isActive, duration, onClick }: Props) {
  return (
    <div
      className={`flex gap-4 items-baseline cursor-pointer transition-colors duration-150
        border-b border-border-subtle last:border-b-0 hover:bg-bg-alt hover:rounded-[3px]
        max-sm:gap-[13px]
        ${isActive
          ? 'px-[10px] py-[15px] bg-active-bg rounded-[3px] -mx-[6px] max-sm:px-2 max-sm:py-3.5'
          : 'px-1 py-[15px] max-sm:px-[2px] max-sm:py-3.5'
        }`}
      onClick={onClick}
    >
      <div className={`font-mono text-[13px] w-[22px] max-sm:text-[12.5px] max-sm:w-5 ${isActive ? 'text-accent' : 'text-text-dim'}`}>
        {chapter.number}
      </div>
      <div className="flex-1 flex flex-col gap-[3px]">
        <div className="font-serif font-semibold text-[15.5px] leading-tight text-text max-sm:text-[15px]">
          {chapter.title}
        </div>
        <div className={`font-serif italic text-[12.5px] leading-[1.45] max-sm:text-[12px] ${isActive ? 'text-accent' : 'text-text-muted'}`}>
          {chapter.text.slice(0, 80)}…
        </div>
      </div>
      {isActive ? (
        <div className="font-medium text-[11.5px] text-accent whitespace-nowrap max-sm:text-[11px]">Now playing</div>
      ) : (
        <div className="text-[11.5px] text-text-dim max-sm:text-[11px]">{duration}</div>
      )}
    </div>
  );
}
