import type { JSX } from 'react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  className?: string;
  code: string;
  filename?: string | null;
  language?: string | null;
}

export function CodeBlock({
  className,
  code,
  filename,
  language,
}: CodeBlockProps): JSX.Element {
  return (
    <div className={cn('overflow-hidden rounded-lg bg-[#141821]', className)}>
      <div className="flex items-center justify-between border-white/10 border-b px-4 py-2">
        <span className="font-mono text-[#878992] text-[11px]">
          {filename ?? 'untitled'}
        </span>
        {language && (
          <span className="font-mono text-[#878992] text-[11px]">
            {language}
          </span>
        )}
      </div>
      <div className="overflow-x-auto p-4">
        <pre className="whitespace-pre font-mono text-[#c3c9d4] text-xs leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
