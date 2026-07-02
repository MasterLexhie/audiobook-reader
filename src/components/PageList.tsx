import type { Chapter } from '../types';
import PageListItem from './PageListItem';

interface Props {
  chapters: Chapter[];
  activeIndex: number;
  searchQuery: string;
  onSelect: (index: number) => void;
}

function estimateDuration(text: string): string {
  const words = text.split(/\s+/).length;
  const minutes = Math.round(words / 150);
  return `${minutes} min`;
}

export default function PageList({ chapters, activeIndex, searchQuery, onSelect }: Props) {
  const query = searchQuery.toLowerCase();
  const filtered = chapters
    .map((ch, i) => ({ chapter: ch, originalIndex: i }))
    .filter(({ chapter }) => {
      if (!query) return true;
      return (
        chapter.title.toLowerCase().includes(query) ||
        chapter.text.slice(0, 200).toLowerCase().includes(query)
      );
    });

  return (
    <div className="flex-1 overflow-y-auto px-[30px] py-2 max-sm:px-6 max-sm:pb-[100px]">
      {filtered.map(({ chapter, originalIndex }) => (
        <PageListItem
          key={chapter.number}
          chapter={chapter}
          isActive={originalIndex === activeIndex}
          duration={estimateDuration(chapter.text)}
          onClick={() => onSelect(originalIndex)}
        />
      ))}
      {filtered.length === 0 && (
        <div className="py-8 text-center text-text-muted text-sm">No results found.</div>
      )}
    </div>
  );
}
