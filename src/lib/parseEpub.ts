import JSZip from 'jszip';
import type { Chapter } from '../types';

export default async function parseEpub(buffer: ArrayBuffer): Promise<Chapter[]> {
  const zip = await JSZip.loadAsync(buffer);

  const containerXml = await zip.file('META-INF/container.xml')?.async('text');
  if (!containerXml) throw new Error('Invalid EPUB: missing container.xml');

  const parser = new DOMParser();
  const containerDoc = parser.parseFromString(containerXml, 'application/xml');
  const opfPath = containerDoc.querySelector('rootfile')?.getAttribute('full-path');
  if (!opfPath) throw new Error('Invalid EPUB: missing OPF path');

  const opfText = await zip.file(opfPath)?.async('text');
  if (!opfText) throw new Error('Invalid EPUB: missing OPF file');

  const opfDoc = parser.parseFromString(opfText, 'application/xml');
  const opfDir = opfPath.includes('/') ? opfPath.substring(0, opfPath.lastIndexOf('/') + 1) : '';

  const manifest = new Map<string, string>();
  opfDoc.querySelectorAll('manifest > item').forEach((item) => {
    const id = item.getAttribute('id');
    const href = item.getAttribute('href');
    if (id && href) manifest.set(id, href);
  });

  const spineRefs: string[] = [];
  opfDoc.querySelectorAll('spine > itemref').forEach((ref) => {
    const idref = ref.getAttribute('idref');
    if (idref) spineRefs.push(idref);
  });

  const chapters: Chapter[] = [];
  let num = 1;

  for (const idref of spineRefs) {
    const href = manifest.get(idref);
    if (!href) continue;

    const filePath = opfDir + href;
    const html = await zip.file(filePath)?.async('text');
    if (!html) continue;

    const doc = parser.parseFromString(html, 'text/html');
    const text = (doc.body?.textContent ?? '').trim();
    if (text.length < 20) continue;

    const heading = doc.querySelector('h1, h2, h3, title');
    const title = heading?.textContent?.trim() || `Chapter ${num}`;

    chapters.push({ title, text, number: num });
    num++;
  }

  return chapters;
}
