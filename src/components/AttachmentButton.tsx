'use client';

import type { ChangeEvent, JSX } from 'react';
import { useRef } from 'react';
import { Button } from '@/components/ui/Button';

interface AttachmentButtonProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
}

export function AttachmentButton({
  onChange,
  uploading,
}: AttachmentButtonProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={onChange}
        ref={inputRef}
        type="file"
      />

      <Button
        className="px-3"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        type="button"
        variant="tertiary"
      >
        {uploading ? 'subiendo...' : 'adjuntar captura'}
      </Button>
    </>
  );
}
