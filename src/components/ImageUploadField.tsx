import Image from 'next/image';
import type { ChangeEvent, JSX, ReactNode } from 'react';
import { useRef } from 'react';
import { Button } from '@/components/ui/Button';

interface ImageUploadFieldProps {
  alt: string;
  fallback?: ReactNode;
  height: number;
  label: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  previewClassName: string;
  uploading: boolean;
  url: string | null;
  width: number;
}

export function ImageUploadField({
  alt,
  fallback,
  height,
  label,
  onChange,
  previewClassName,
  uploading,
  url,
  width,
}: ImageUploadFieldProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={previewClassName}>
        {url ? (
          <Image
            alt={alt}
            className="h-full w-full object-cover"
            height={height}
            src={url}
            width={width}
          />
        ) : (
          fallback
        )}
      </div>

      <input
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={onChange}
        ref={inputRef}
        type="file"
      />

      <Button
        className="w-60"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        type="button"
        variant="tertiary"
      >
        {uploading ? 'subiendo...' : label}
      </Button>
    </div>
  );
}
