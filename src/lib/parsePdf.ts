import * as pdfjsLib from 'pdfjs-dist';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import type { Chapter } from '../types';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default async function parsePdf(
  buffer: ArrayBuffer,
  onProgress?: (page: number, total: number) => void,
): Promise<Chapter[]> {
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const chapters: Chapter[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress?.(i, pdf.numPages);
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .filter((item): item is TextItem => 'str' in item)
      .map((item) => item.str)
      .join(' ');

    if (text.trim().length >= 5) {
      chapters.push({ title: `Page ${i}`, text: text.trim(), number: i });
    }
  }

  return chapters;
}
