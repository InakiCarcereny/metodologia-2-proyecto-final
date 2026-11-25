import Image from 'next/image';
import type { JSX } from 'react';
import { Button } from '@/components/ui/Button';

interface ComposerImagePreviewProps {
  onRemove: () => void;
  url: string;
}

export function ComposerImagePreview({
  onRemove,
  url,
}: ComposerImagePreviewProps): JSX.Element {
  return (
    <div className="relative overflow-hidden rounded-lg border border-[#dfe1e5]">
      <Image
        alt="captura adjunta"
        className="h-auto max-h-64 w-full object-contain"
        height={338}
        src={url}
        width={600}
      />

      <Button
        className="absolute top-2 right-2 px-2"
        onClick={onRemove}
        type="button"
        variant="secondary"
      >
        Quitar
      </Button>
    </div>
  );
}
