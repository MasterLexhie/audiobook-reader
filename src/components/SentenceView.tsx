import { memo, useEffect, useRef } from 'react';

interface Props {
  text: string;
  index: number;
  activeIndex: number;
  onClick: (index: number) => void;
}

const SentenceView = memo(function SentenceView({ text, index, activeIndex, onClick }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const isCurrent = index === activeIndex;
  const isDone = index < activeIndex;

  useEffect(() => {
    if (isCurrent) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isCurrent]);

  return (
    <span
      ref={ref}
      onClick={() => onClick(index)}
      className={`cursor-pointer transition-colors duration-150
        ${isCurrent ? 'bg-hl-bg text-hl rounded-[2px] shadow-[0_0_0_4px_var(--color-hl-bg)]' : ''}
        ${isDone ? 'text-done' : ''}
        ${!isCurrent && !isDone ? '' : ''}`}
    >
      {text}{' '}
    </span>
  );
});

export default SentenceView;
