import { useState, useCallback } from 'react';
import type { Chapter, FileType } from '../types';
import parsePdf from '../lib/parsePdf';
import parseEpub from '../lib/parseEpub';

interface ParseResult {
  chapters: Chapter[];
  fileType: FileType;
}

export default function useFileParser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState('');

  const parseFile = useCallback(async (file: File): Promise<ParseResult | null> => {
    setError(null);
    setIsLoading(true);
    setProgress('Reading file…');

    try {
      const buffer = await file.arrayBuffer();
      const ext = file.name.split('.').pop()?.toLowerCase();

      if (ext === 'pdf') {
        const chapters = await parsePdf(buffer, (page, total) => {
          setProgress(`Extracting page ${page} of ${total}…`);
        });
        if (chapters.length === 0) throw new Error('No readable text found in this PDF.');
        return { chapters, fileType: 'pdf' };
      }

      if (ext === 'epub') {
        setProgress('Parsing EPUB structure…');
        const chapters = await parseEpub(buffer);
        if (chapters.length === 0) throw new Error('No readable chapters found in this EPUB.');
        return { chapters, fileType: 'epub' };
      }

      throw new Error('Unsupported file type. Please upload a PDF or EPUB file.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to parse file.');
      return null;
    } finally {
      setIsLoading(false);
      setProgress('');
    }
  }, []);

  return { parseFile, isLoading, error, progress };
}
