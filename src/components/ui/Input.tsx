import { cva, type VariantProps } from 'class-variance-authority';
import type { InputHTMLAttributes, JSX } from 'react';
import {
  type Control,
  Controller,
  type ControllerRenderProps,
  type FieldError,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'bg-white border border-[#d6d7db] placeholder:text-[#95989f] p-3 font-light rounded-lg focus:outline-none',
  {
    variants: {
      variant: {},
    },
  },
);

interface InputProps<T extends FieldValues>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'>,
    VariantProps<typeof inputVariants> {
  control: Control<T>;
  error?: FieldError;
  name: Path<T>;
}

export function Input<T extends FieldValues>({
  className,
  variant,
  control,
  name,
  error,
  ...props
}: InputProps<T>): JSX.Element {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }: { field: ControllerRenderProps<T, Path<T>> }) => (
        <>
          <input
            {...props}
            {...field}
            className={cn(inputVariants({ variant }), className)}
          />

          {error && (
            <span className="font-medium text-red-400 text-sm">
              {error.message}
            </span>
          )}
        </>
      )}
    />
  );
}
