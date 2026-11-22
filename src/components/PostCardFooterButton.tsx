import type { LucideIcon } from 'lucide-react';
import type { JSX, MouseEvent } from 'react';
import { cn } from '@/lib/utils';

interface PostCardFooterButtonProps {
  activeClassName: string;
  count: number;
  fillIconWhenActive?: boolean;
  hoverClassName: string;
  icon: LucideIcon;
  isActive?: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

export function PostCardFooterButton({
  activeClassName,
  count,
  fillIconWhenActive = false,
  hoverClassName,
  icon: Icon,
  isActive = false,
  onClick,
}: PostCardFooterButtonProps): JSX.Element {
  return (
    <button
      className={cn(
        'flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 font-medium text-[#7e8288] transition-colors',
        isActive ? activeClassName : hoverClassName,
      )}
      onClick={onClick}
      type="button"
    >
      <Icon
        fill={isActive && fillIconWhenActive ? 'currentColor' : 'none'}
        size={14}
      />
      {count}
    </button>
  );
}
