import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useReader } from '../context/ReaderContext';
import BookMeta from '../components/BookMeta';
import SearchBar from '../components/SearchBar';
import PageList from '../components/PageList';

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

export default function ContentsScreen() {
  const { state, dispatch } = useReader();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  if (state.chapters.length === 0) return <Navigate to="/" replace />;

  function handleSelect(index: number) {
    dispatch({ type: 'SET_CHAPTER', index });
    if (!state.isPlaying) dispatch({ type: 'TOGGLE_PLAY' });
    navigate('/player');
  }

  function handlePlayFromStart() {
    dispatch({ type: 'SET_CHAPTER', index: 0 });
    if (!state.isPlaying) dispatch({ type: 'TOGGLE_PLAY' });
    navigate('/player');
  }

  function handleChangeBook() {
    dispatch({ type: 'RESET' });
    navigate('/');
  }

  const displayName = state.fileName.replace(/\.[^.]+$/, '');
  const typeLabel = state.fileType?.toUpperCase() ?? '';
  const words = wordCount(state.chapters);
  const chapterLabel = state.fileType === 'epub' ? 'chapters' : 'pages';

  return (
    <div className="min-h-dvh flex flex-col bg-bg relative">
      <div className="flex-1 flex min-h-0">
        {/* Desktop sidebar */}
        <div className="w-[250px] border-r border-border p-[32px_26px] flex flex-col gap-[18px] bg-bg-alt max-sm:hidden">
          <div
            className="w-[110px] h-[150px] border border-cover-dark-border rounded-[3px_9px_9px_3px]
              border-l-[5px] border-l-accent flex items-end p-[10px]"
            style={{
              background: 'repeating-linear-gradient(0deg, var(--color-cover-dark-stripe-a) 0 7px, var(--color-cover-dark-stripe-b) 7px 14px)',
            }}
          >
            <div className="font-serif font-semibold text-[10px] leading-tight text-cover-text uppercase">
              {displayName}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-serif font-semibold text-xl leading-tight text-text">{displayName}</div>
            <div className="text-[12.5px] text-text-muted">{typeLabel}</div>
          </div>
          <BookMeta />
          <div className="mt-auto flex flex-col gap-2">
            <button
              onClick={handlePlayFromStart}
              className="flex items-center justify-center gap-2 bg-accent text-surface
                font-medium text-[13px] py-3 rounded-[3px] border-none cursor-pointer hover:opacity-85 transition-opacity"
            >
              <svg width="9" height="10" viewBox="0 0 9 10"><polygon points="0,0 9,5 0,10" fill="currentColor" /></svg>
              Play from start
            </button>
            <button
              onClick={handleChangeBook}
              className="text-center text-text-muted text-xs py-[9px] border border-cover-dark-border
                rounded-[3px] bg-surface cursor-pointer hover:bg-bg-alt transition-colors"
            >
              Change book
            </button>
          </div>
        </div>

        {/* Mobile header */}
        <div className="hidden max-sm:flex px-6 pt-6 pb-[18px] border-b border-border bg-bg-alt gap-4 items-center">
          <div
            className="w-16 h-[88px] shrink-0 border border-cover-dark-border rounded-[2px_7px_7px_2px]
              border-l-[4px] border-l-accent"
            style={{
              background: 'repeating-linear-gradient(0deg, var(--color-cover-dark-stripe-a) 0 6px, var(--color-cover-dark-stripe-b) 6px 12px)',
            }}
          />
          <div className="flex flex-col gap-[5px]">
            <div className="font-serif font-semibold text-[19px] leading-tight text-text">{displayName}</div>
            <div className="text-[12.5px] text-text-muted">{typeLabel}</div>
            <div className="text-[11.5px] text-text-secondary">
              {state.chapters.length} {chapterLabel} · {formatTime(words)} · {words.toLocaleString()} words
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-3 px-[30px] pt-6 pb-3.5 border-b border-border
            max-sm:px-6 max-sm:pt-3.5 max-sm:pb-2">
            <div className="font-semibold text-[13px] text-text tracking-[.06em] max-sm:text-xs">CONTENTS</div>
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <PageList
            chapters={state.chapters}
            activeIndex={state.isPlaying ? state.currentChapterIndex : -1}
            searchQuery={search}
            onSelect={handleSelect}
          />
        </div>
      </div>

      {/* Mobile play bar */}
      <div className="hidden max-sm:block fixed left-6 right-6 bottom-5">
        <button
          onClick={handlePlayFromStart}
          className="w-full flex items-center justify-center gap-2 bg-accent text-surface
            font-medium text-sm py-[15px] rounded-[3px] border-none cursor-pointer
            shadow-[0_8px_24px_rgba(60,50,35,.22)]"
        >
          <svg width="9" height="10" viewBox="0 0 9 10"><polygon points="0,0 9,5 0,10" fill="currentColor" /></svg>
          Play from start
        </button>
      </div>
    </div>
  );
}
