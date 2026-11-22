import { cva, type VariantProps } from 'class-variance-authority';
import type { JSX, TextareaHTMLAttributes } from 'react';
import {
  type Control,
  Controller,
  type ControllerRenderProps,
  type FieldError,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { cn } from '@/lib/utils';

const textareaVariants = cva(
  'resize-none rounded-lg border border-[#d6d7db] bg-white p-3 font-light placeholder:text-[#95989f] focus:outline-none',
  {
    variants: {
      variant: {},
    },
  },
);

interface TextareaProps<T extends FieldValues>
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'>,
    VariantProps<typeof textareaVariants> {
  control: Control<T>;
  error?: FieldError;
  name: Path<T>;
}

export function Textarea<T extends FieldValues>({
  className,
  variant,
  control,
  name,
  error,
  ...props
}: TextareaProps<T>): JSX.Element {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }: { field: ControllerRenderProps<T, Path<T>> }) => (
        <>
          <textarea
            {...props}
            {...field}
            className={cn(textareaVariants({ variant }), className)}
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
