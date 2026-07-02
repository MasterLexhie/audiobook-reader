import { useNavigate } from 'react-router-dom';
import { useReader } from '../context/ReaderContext';
import useFileParser from '../hooks/useFileParser';
import DropZone from '../components/DropZone';

export default function UploadScreen() {
  const navigate = useNavigate();
  const { dispatch } = useReader();
  const { parseFile, isLoading, error, progress } = useFileParser();

  async function handleFile(file: File) {
    const result = await parseFile(file);
    if (result) {
      dispatch({
        type: 'LOAD_BOOK',
        chapters: result.chapters,
        fileName: file.name,
        fileType: result.fileType,
      });
      navigate('/contents');
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 bg-bg">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <div className="text-text-secondary text-sm">{progress}</div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col bg-bg">
      <div className="flex-1 flex max-sm:flex-col max-sm:px-[30px] max-sm:py-10 max-sm:gap-7">
        {/* Hero */}
        <div className="flex-[1.1] px-14 py-14 flex flex-col justify-center gap-[18px] border-r border-border
          max-sm:flex-none max-sm:px-0 max-sm:pt-6 max-sm:pb-0 max-sm:border-r-0 max-sm:gap-3.5">
          <div className="font-mono text-xs text-accent tracking-[.14em]">AUDIOBOOK READER</div>
          <h1 className="font-serif font-semibold text-[40px] leading-[1.12] text-text text-balance max-sm:text-[32px] max-sm:leading-[1.15]">
            Every book you own, read aloud.
          </h1>
          <p className="text-[15px] leading-relaxed text-text-secondary max-w-[340px] max-sm:text-sm">
            Drop in any PDF or EPUB and listen with sentence-by-sentence narration. Free, instant, and entirely in your browser.
          </p>
          <div className="flex gap-4 text-xs text-text-muted mt-1.5 max-sm:hidden">
            <span>No account</span><span className="text-text-muted">·</span>
            <span>No upload to servers</span><span className="text-text-muted">·</span>
            <span>No setup</span>
          </div>
        </div>

        {/* Drop zone */}
        <div className="flex-1 flex items-center justify-center p-10 max-sm:flex-none max-sm:p-0">
          <DropZone onFileSelect={handleFile} />
        </div>
      </div>

      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-900/90 text-red-100 text-sm px-5 py-3 rounded-lg shadow-lg z-50">
          {error}
        </div>
      )}

      {/* Mobile bottom features */}
      <div className="hidden max-sm:flex justify-center gap-3.5 text-[11.5px] text-text-muted px-[30px] pb-10">
        <span>No account</span><span>·</span>
        <span>No servers</span><span>·</span>
        <span>No setup</span>
      </div>
    </div>
  );
}
