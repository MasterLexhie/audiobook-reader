import ProgressBar from './ProgressBar';
import SpeedSelector from './SpeedSelector';
import VoiceSelector from './VoiceSelector';

interface Props {
  isPlaying: boolean;
  currentSentence: number;
  totalSentences: number;
  chapterTitle: string;
  speed: number;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  onTogglePlay: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  onSeek: (index: number) => void;
  onSpeedChange: (speed: number) => void;
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
}

function PlayIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 9 10">
      <polygon points="0,0 9,5 0,10" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <div className="flex gap-[3.5px]">
      <div className="w-1 h-3.5 bg-pill-play-icon rounded-[1px]" />
      <div className="w-1 h-3.5 bg-pill-play-icon rounded-[1px]" />
    </div>
  );
}

function SkipBackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14">
      <polygon points="13,2 7,7 13,12" fill="currentColor" />
      <polygon points="7,2 1,7 7,12" fill="currentColor" />
    </svg>
  );
}

function SkipForwardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14">
      <polygon points="1,2 7,7 1,12" fill="currentColor" />
      <polygon points="7,2 13,7 7,12" fill="currentColor" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12">
      <polygon points="8,1 2,6 8,11" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12">
      <polygon points="2,1 8,6 2,11" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function PlaybackControls(props: Props) {
  return (
    <>
      {/* Desktop pill */}
      <div className="hidden sm:flex fixed bottom-[22px] left-1/2 -translate-x-1/2
        bg-pill-bg rounded-[40px] shadow-[0_10px_30px_rgba(43,41,38,.35)]
        px-[22px] py-3 items-center gap-[18px] z-50">
        <button onClick={props.onPrevChapter} className="text-pill-text hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none">
          <ChevronLeftIcon />
        </button>
        <button onClick={props.onSkipBack} className="flex items-center gap-[2px] font-semibold text-[9.5px] text-pill-text bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity">
          <SkipBackIcon /><span>5</span>
        </button>
        <button
          onClick={props.onTogglePlay}
          className="w-11 h-11 rounded-full bg-pill-play-bg flex items-center justify-center cursor-pointer border-none hover:opacity-85 transition-opacity text-pill-play-icon"
        >
          {props.isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button onClick={props.onSkipForward} className="flex items-center gap-[2px] font-semibold text-[9.5px] text-pill-text bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity">
          <span>5</span><SkipForwardIcon />
        </button>
        <button onClick={props.onNextChapter} className="text-pill-text hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none">
          <ChevronRightIcon />
        </button>
        <div className="w-px h-[22px] bg-pill-divider" />
        <div className="w-[150px]">
          <ProgressBar
            current={props.currentSentence}
            total={props.totalSentences}
            label={props.chapterTitle}
            onClick={props.onSeek}
          />
        </div>
        <div className="w-px h-[22px] bg-pill-divider" />
        <SpeedSelector speed={props.speed} onChange={props.onSpeedChange} />
        <VoiceSelector voices={props.voices} selectedVoice={props.selectedVoice} onChange={props.onVoiceChange} />
      </div>

      {/* Mobile pill */}
      <div className="flex sm:hidden fixed left-3.5 right-3.5 bottom-4
        bg-pill-bg rounded-[22px] shadow-[0_10px_30px_rgba(43,41,38,.35)]
        px-5 py-4 flex-col gap-3.5 z-50">
        <ProgressBar
          current={props.currentSentence}
          total={props.totalSentences}
          label={props.chapterTitle}
          onClick={props.onSeek}
        />
        <div className="flex items-center justify-between">
          <SpeedSelector speed={props.speed} onChange={props.onSpeedChange} bordered />
          <div className="flex items-center gap-[18px]">
            <button onClick={props.onSkipBack} className="flex items-center gap-[2px] font-semibold text-[9.5px] text-pill-text bg-transparent border-none cursor-pointer hover:opacity-70">
              <SkipBackIcon /><span>5</span>
            </button>
            <button
              onClick={props.onTogglePlay}
              className="w-[50px] h-[50px] rounded-full bg-pill-play-bg flex items-center justify-center cursor-pointer border-none hover:opacity-85 text-pill-play-icon"
            >
              {props.isPlaying ? (
                <div className="flex gap-1">
                  <div className="w-[4.5px] h-4 bg-pill-play-icon rounded-[1.5px]" />
                  <div className="w-[4.5px] h-4 bg-pill-play-icon rounded-[1.5px]" />
                </div>
              ) : <PlayIcon />}
            </button>
            <button onClick={props.onSkipForward} className="flex items-center gap-[2px] font-semibold text-[9.5px] text-pill-text bg-transparent border-none cursor-pointer hover:opacity-70">
              <span>5</span><SkipForwardIcon />
            </button>
          </div>
          <VoiceSelector voices={props.voices} selectedVoice={props.selectedVoice} onChange={props.onVoiceChange} />
        </div>
      </div>
    </>
  );
}
