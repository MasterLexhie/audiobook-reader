import { describe, it, expect } from 'vitest';
import splitSentences from './splitSentences';

describe('splitSentences', () => {
  it('splits ordinary sentences by punctuation followed by whitespace', () => {
    const input = 'Hello world. How are you? I am fine!';
    const result = splitSentences(input);
    expect(result).toEqual(['Hello world.', 'How are you?', 'I am fine!']);
  });

  it('splits on newlines', () => {
    const input = 'First line.\nSecond line.\nThird line.';
    const result = splitSentences(input);
    expect(result).toEqual(['First line.', 'Second line.', 'Third line.']);
  });

  it('handles ellipsis as sentence terminator', () => {
    const input = 'Wait… What? Really!';
    const result = splitSentences(input);
    expect(result).toEqual(['Wait…', 'What?', 'Really!']);
  });

  it('collapses multiple consecutive newlines into one', () => {
    const input = 'Line 1.\n\n\nLine 2.\n\nLine 3.';
    const result = splitSentences(input);
    expect(result).toEqual(['Line 1.', 'Line 2.', 'Line 3.']);
  });

  it('trims whitespace from each segment', () => {
    const input = '  Hello world.   \n  How are you?  ';
    const result = splitSentences(input);
    expect(result).toEqual(['Hello world.', 'How are you?']);
  });

  it('filters out segments shorter than 3 characters', () => {
    const input = 'H. Hello world. O. Goodbye.';
    const result = splitSentences(input);
    expect(result).toEqual(['Hello world.', 'Goodbye.']);
  });

  it('returns empty array for empty input', () => {
    const result = splitSentences('');
    expect(result).toEqual([]);
  });

  it('returns empty array for whitespace-only input', () => {
    const result = splitSentences('   \n\n  ');
    expect(result).toEqual([]);
  });

  it('returns empty array when all segments are too short', () => {
    const result = splitSentences('H. O. N.');
    expect(result).toEqual([]);
  });

  it('handles mixed punctuation and newlines', () => {
    const input = 'First sentence.\nSecond sentence? Third sentence!';
    const result = splitSentences(input);
    expect(result).toEqual(['First sentence.', 'Second sentence?', 'Third sentence!']);
  });

  it('preserves punctuation at end of sentences', () => {
    const input = 'Hello! How are you? I am good.';
    const result = splitSentences(input);
    expect(result).toEqual(['Hello!', 'How are you?', 'I am good.']);
  });

  it('handles text without trailing whitespace after punctuation', () => {
    const input = 'Hello.World';
    const result = splitSentences(input);
    expect(result).toEqual(['Hello.World']);
  });

  it('handles single sentence without trailing punctuation', () => {
    const input = 'Hello world';
    const result = splitSentences(input);
    expect(result).toEqual(['Hello world']);
  });
});