import type { JSX } from 'react';
import { Button } from '@/components/ui/Button';
import type { PostType } from '@/types/post';
import { POST_TYPE_LABELS } from '@/utils/post-type';

interface ComposerTypeSelectorProps {
  error?: string;
  onChange: (type: PostType) => void;
  value?: PostType;
}

export function ComposerTypeSelector({
  error,
  onChange,
  value,
}: ComposerTypeSelectorProps): JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(POST_TYPE_LABELS) as PostType[]).map((postType) => (
          <Button
            className="px-3"
            key={postType}
            onClick={() => onChange(postType)}
            type="button"
            variant={value === postType ? 'primary' : 'tertiary'}
          >
            {POST_TYPE_LABELS[postType]}
          </Button>
        ))}
      </div>

      {error && (
        <span className="font-medium text-red-400 text-sm">{error}</span>
      )}
    </div>
  );
}
