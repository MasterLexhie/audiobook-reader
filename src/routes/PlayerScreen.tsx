import { useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useReader } from '../context/ReaderContext';
import useVoices from '../hooks/useVoices';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';
import PageStrip from '../components/PageStrip';
import SentenceView from '../components/SentenceView';
import PlaybackControls from '../components/PlaybackControls';

export default function PlayerScreen() {
  const { state, dispatch } = useReader();
  const navigate = useNavigate();
  const { voices, selectedVoice, setSelectedVoice } = useVoices();
  const stateRef = useRef(state);
  stateRef.current = state;

  function handleSentenceEnd() {
    const s = stateRef.current;
    if (s.currentSentenceIndex < s.sentences.length - 1) {
      dispatch({ type: 'SET_SENTENCE', index: s.currentSentenceIndex + 1 });
    } else if (s.currentChapterIndex < s.chapters.length - 1) {
      dispatch({ type: 'SET_CHAPTER', index: s.currentChapterIndex + 1 });
    } else {
      dispatch({ type: 'TOGGLE_PLAY' });
    }
  }

  const { speak, stop } = useSpeechSynthesis(handleSentenceEnd);

  useEffect(() => {
    if (selectedVoice && !state.voice) {
      dispatch({ type: 'SET_VOICE', voice: selectedVoice });
    }
  }, [selectedVoice, state.voice, dispatch]);

  useEffect(() => {
    if (state.isPlaying && state.sentences.length > 0) {
      const text = state.sentences[state.currentSentenceIndex];
      if (text) speak(text, state.speed, state.voice);
    } else {
      stop();
    }
  }, [state.isPlaying, state.currentSentenceIndex, state.sentences, state.speed, state.voice, speak, stop]);

  useKeyboardShortcuts({
    onTogglePlay: () => dispatch({ type: 'TOGGLE_PLAY' }),
    onNextSentence: () => {
      if (state.currentSentenceIndex < state.sentences.length - 1) {
        dispatch({ type: 'SET_SENTENCE', index: state.currentSentenceIndex + 1 });
      }
    },
    onPrevSentence: () => {
      if (state.currentSentenceIndex > 0) {
        dispatch({ type: 'SET_SENTENCE', index: state.currentSentenceIndex - 1 });
      }
    },
  });

  if (state.chapters.length === 0) return <Navigate to="/" replace />;

  function handleBack() {
    if (state.isPlaying) dispatch({ type: 'TOGGLE_PLAY' });
    navigate('/contents');
  }

  function handleChapterSelect(index: number) {
    dispatch({ type: 'SET_CHAPTER', index });
  }

  function handleSentenceClick(index: number) {
    dispatch({ type: 'SET_SENTENCE', index });
    if (!state.isPlaying) dispatch({ type: 'TOGGLE_PLAY' });
  }

  function handleSkipBack() {
    const next = Math.max(0, state.currentSentenceIndex - 5);
    dispatch({ type: 'SET_SENTENCE', index: next });
  }

  function handleSkipForward() {
    const next = Math.min(state.sentences.length - 1, state.currentSentenceIndex + 5);
    dispatch({ type: 'SET_SENTENCE', index: next });
  }

  function handlePrevChapter() {
    if (state.currentChapterIndex > 0) {
      dispatch({ type: 'SET_CHAPTER', index: state.currentChapterIndex - 1 });
    }
  }

  function handleNextChapter() {
    if (state.currentChapterIndex < state.chapters.length - 1) {
      dispatch({ type: 'SET_CHAPTER', index: state.currentChapterIndex + 1 });
    }
  }

  function handleVoiceChange(voice: SpeechSynthesisVoice) {
    setSelectedVoice(voice);
    dispatch({ type: 'SET_VOICE', voice });
  }

  const currentChapter = state.chapters[state.currentChapterIndex];
  const chapterDisplay = state.fileType === 'pdf'
    ? `Page ${currentChapter.number}`
    : currentChapter.title;

  return (
    <div className="min-h-dvh flex flex-col bg-bg relative">
      <div className="flex-1 flex min-h-0">
        {/* Desktop sidebar */}
        <div className="w-[190px] border-r border-border bg-bg-alt py-[22px] flex flex-col gap-[2px] overflow-hidden max-sm:hidden">
          <div className="font-semibold text-[10.5px] text-text-faint tracking-[.1em] px-5 pb-3">CHAPTERS</div>
          <div className="flex-1 overflow-y-auto">
            {state.chapters.map((ch, i) => {
              const label = state.fileType === 'pdf' ? `Pg ${ch.number}` : ch.title;
              const short = label.length > 22 ? label.slice(0, 20) + '…' : label;
              return (
                <div
                  key={ch.number}
                  onClick={() => handleChapterSelect(i)}
                  className={`font-serif text-[13px] leading-[1.35] py-[9px] px-5 cursor-pointer transition-colors
                    ${i === state.currentChapterIndex
                      ? 'font-semibold text-text bg-bg pl-4 border-l-4 border-l-accent'
                      : 'text-text-secondary hover:bg-bg'
                    }`}
                >
                  {short}
                </div>
              );
            })}
          </div>
          <button
            onClick={handleBack}
            className="mt-auto px-5 flex items-center gap-[7px] font-medium text-xs text-text-muted
              bg-transparent border-none cursor-pointer hover:text-text transition-colors"
          >
            <svg width="11" height="11" viewBox="0 0 12 12">
              <polygon points="8,1 3,6 8,11" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Contents
          </button>
        </div>

        {/* Mobile header */}
        <div className="hidden max-sm:flex px-5 py-4 items-center gap-[10px]">
          <button
            onClick={handleBack}
            className="flex items-center gap-[7px] text-xs text-text-muted bg-transparent border-none cursor-pointer"
          >
            <svg width="11" height="11" viewBox="0 0 12 12">
              <polygon points="8,1 3,6 8,11" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Contents
          </button>
          <div className="flex-1 text-center font-serif font-semibold text-[12.5px] text-text">
            {state.fileName.replace(/\.[^.]+$/, '')}
          </div>
          <div className="font-mono text-[10.5px] text-text-dim">
            {state.currentChapterIndex + 1}/{state.chapters.length}
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile page strip */}
          <div className="hidden max-sm:block">
            <PageStrip
              chapters={state.chapters}
              activeIndex={state.currentChapterIndex}
              fileType={state.fileType}
              onSelect={handleChapterSelect}
            />
          </div>

          {/* Desktop header */}
          <div className="flex items-baseline justify-between px-[54px] pt-[26px] pb-[10px] max-sm:hidden">
            <div className="font-serif font-semibold text-[21px] leading-tight text-text">{chapterDisplay}</div>
            <div className="font-mono text-[11.5px] text-text-faint">
              sentence {state.currentSentenceIndex + 1} of {state.sentences.length}
            </div>
          </div>

          {/* Reader text */}
          <div className="flex-1 overflow-y-auto px-[54px] pt-2 pb-[120px] font-serif text-[17.5px] leading-[1.9] text-body
            max-sm:px-[26px] max-sm:pb-[180px] max-sm:text-[17px]">
            {state.sentences.map((text, i) => (
              <SentenceView
                key={`${state.currentChapterIndex}-${i}`}
                text={text}
                index={i}
                activeIndex={state.currentSentenceIndex}
                onClick={handleSentenceClick}
              />
            ))}
          </div>
        </div>
      </div>

      <PlaybackControls
        isPlaying={state.isPlaying}
        currentSentence={state.currentSentenceIndex}
        totalSentences={state.sentences.length}
        chapterTitle={chapterDisplay}
        speed={state.speed}
        voices={voices}
        selectedVoice={state.voice}
        onTogglePlay={() => dispatch({ type: 'TOGGLE_PLAY' })}
        onSkipBack={handleSkipBack}
        onSkipForward={handleSkipForward}
        onPrevChapter={handlePrevChapter}
        onNextChapter={handleNextChapter}
        onSeek={(i) => dispatch({ type: 'SET_SENTENCE', index: i })}
        onSpeedChange={(speed) => dispatch({ type: 'SET_SPEED', speed })}
        onVoiceChange={handleVoiceChange}
      />
    </div>
  );
}
