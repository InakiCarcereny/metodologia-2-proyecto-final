import { CircleX } from 'lucide-react';
import type { JSX } from 'react';

interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps): JSX.Element | null {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-500 text-sm">
      <CircleX size={20} />

      <p>{message}</p>
    </div>
  );
}
