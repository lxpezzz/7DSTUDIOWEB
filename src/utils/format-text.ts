export interface TextSegment {
  text: string;
  tag: 'strong' | 'em' | 'span';
}

export function formatEmphasizedText(
  text: string,
  strong: readonly string[] = [],
  italic: readonly string[] = [],
): TextSegment[] {
  const phrases = [...strong, ...italic].filter(Boolean);
  if (phrases.length === 0) return [{ text, tag: 'span' }];
  const pattern = phrases
    .map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  return text
    .split(new RegExp(`(${pattern})`, 'g'))
    .filter(Boolean)
    .map((part) => ({
      text: part,
      tag: strong.includes(part)
        ? 'strong'
        : italic.includes(part)
          ? 'em'
          : 'span',
    }));
}
