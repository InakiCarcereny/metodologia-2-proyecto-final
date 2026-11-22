import type { JSX } from 'react';

interface PostCodeBlockProps {
  filename: string | null;
  language: string | null;
  snippet: string;
}

export function PostCardCodeBlock({
  filename,
  language,
  snippet,
}: PostCodeBlockProps): JSX.Element {
  return (
    <div className="overflow-hidden rounded-lg border border-[#dfe1e5]">
      <div className="flex items-center justify-between bg-[#f6f7f9] px-3 py-1.5 text-[#7e8288] text-[12px]">
        <span>{filename}</span>

        <span>{language}</span>
      </div>

      <pre className="overflow-x-auto bg-[#0c0f17] p-3 font-mono text-[#e4e6eb] text-[12px] leading-relaxed">
        <code>{snippet}</code>
      </pre>
    </div>
  );
}
