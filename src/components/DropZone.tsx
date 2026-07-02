import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';

interface Props {
  onFileSelect: (file: File) => void;
}

export default function DropZone({ onFileSelect }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  }

  return (
    <div
      className={`w-full max-w-[300px] bg-surface border border-border rounded-[4px] p-[36px_30px]
        flex flex-col items-center gap-4 cursor-pointer
        transition-all duration-200
        shadow-[0_12px_32px_rgba(60,50,35,.10),0_2px_6px_rgba(60,50,35,.06)]
        ${isDragging ? 'border-accent shadow-[0_12px_32px_rgba(60,50,35,.18),0_0_0_2px_var(--color-accent)] scale-[1.02]' : ''}
        max-sm:max-w-full max-sm:p-[34px_26px]`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
    >
      <div
        className="w-16 h-[84px] border border-cover-border rounded-[3px_8px_8px_3px] border-l-[4px] border-l-accent"
        style={{
          background: 'repeating-linear-gradient(0deg, var(--color-cover-stripe-a) 0 6px, var(--color-cover-stripe-b) 6px 12px)',
        }}
      />
      <div className="font-serif font-semibold text-[17px] leading-tight text-text text-center">
        Choose a book
      </div>
      <div className="text-[12.5px] leading-normal text-text-muted text-center max-sm:hidden">
        Drag a file anywhere on this page,<br />or browse your library
      </div>
      <div className="text-[12.5px] leading-normal text-text-muted text-center hidden max-sm:block">
        Tap to browse your files
      </div>
      <button
        className="bg-text text-bg font-medium text-[13px] px-[26px] py-3 rounded-[3px] tracking-wide
          hover:opacity-85 transition-opacity cursor-pointer max-sm:px-[30px] max-sm:py-3.5 max-sm:text-[13.5px]"
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
      >
        Open PDF or EPUB
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.epub"
        hidden
        onChange={handleChange}
      />
    </div>
  );
}
