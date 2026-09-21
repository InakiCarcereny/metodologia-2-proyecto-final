import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes, JSX } from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  ' rounded-lg py-2.5 font-semibold text-[14px] cursor-pointer',
  {
    defaultVariants: {
      variant: 'primary',
    },
    variants: {
      variant: {
        primary: 'bg-[#171b22] text-white hover:bg-[#303540]',
        secondary: 'bg-none text-[#676b72] hover:bg-white hover:text-black',
        tertiary:
          'bg-none border border-[#dfe1e5] hover:border-[#9b9ea5] text-[#171b22]',
      },
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  children,
  ...props
}: ButtonProps): JSX.Element {
  return (
    <button {...props} className={cn(buttonVariants({ variant }), className)}>
      {children}
    </button>
  );
}
