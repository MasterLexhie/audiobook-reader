export default function splitSentences(text: string): string[] {
  return text
    .replace(/\n{2,}/g, '\n')
    .split(/(?<=[.!?…])\s+|\n/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 3);
}
