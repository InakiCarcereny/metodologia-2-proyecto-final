import type { JSX } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface FollowButtonProps {
  className?: string;
}

export function FollowButton({ className }: FollowButtonProps): JSX.Element {
  return (
    <Button
      className={cn('font-light', className)}
      type="button"
      variant="tertiary"
    >
      seguir
    </Button>
  );
}
