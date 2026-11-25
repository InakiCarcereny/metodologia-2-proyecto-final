'use client';

import { X } from 'lucide-react';
import type { JSX, KeyboardEvent } from 'react';
import { useState } from 'react';

const MAX_TAGS = 5;

interface TagInputProps {
  onChange: (tags: string[]) => void;
  values: string[];
}

function normalizeTag(raw: string): string | null {
  const normalized = raw.trim().toLowerCase().replace(/^#/, '');
  return normalized.length > 0 ? normalized.slice(0, 30) : null;
}

export function TagInput({ onChange, values }: TagInputProps): JSX.Element {
  const [draft, setDraft] = useState('');

  const commitDraft = (): void => {
    const tag = normalizeTag(draft);
    setDraft('');

    if (!tag) return;
    if (values.length >= MAX_TAGS) return;
    if (values.includes(tag)) return;

    onChange([...values, tag]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      commitDraft();
    }

    if (event.key === 'Backspace' && draft === '' && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[#d6d7db] bg-white p-2">
        {values.map((tag) => (
          <span
            className="flex items-center gap-1 rounded-full bg-[#f6f7f9] px-2 py-1 font-mono text-[#494d56] text-xs"
            key={tag}
          >
            #{tag}
            <button
              className="cursor-pointer text-[#7e8288]"
              onClick={() => onChange(values.filter((value) => value !== tag))}
              type="button"
            >
              <X size={12} />
            </button>
          </span>
        ))}

        <input
          className="min-w-24 flex-1 bg-transparent font-mono text-[#494d56] text-sm placeholder:text-[#95989f] focus:outline-none"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={values.length === 0 ? 'javascript, postgres...' : ''}
          value={draft}
        />
      </div>

      <small className="font-mono text-[#878992] text-xs">
        Enter para agregar · máximo {MAX_TAGS} · se crean si no existen
      </small>
    </div>
  );
}
