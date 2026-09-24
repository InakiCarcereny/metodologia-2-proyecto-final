import type { ComponentPropsWithoutRef, ElementType, JSX } from 'react';
import { cn } from '@/lib/utils';

type CardProps<T extends ElementType> = {
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'>;

export function CardWrapper<T extends ElementType = 'div'>({
  as,
  className,
  children,
  ...props
}: CardProps<T>): JSX.Element {
  const Component = as ?? 'div';

  return (
    <Component
      className={cn(
        'rounded-lg border border-[#dfe1e5] bg-white p-4',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
