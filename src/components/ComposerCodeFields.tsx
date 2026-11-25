import type { JSX } from 'react';
import type { FieldError, UseFormRegister } from 'react-hook-form';
import type { CreatePostInput } from '@/schemas/post';

interface ComposerCodeFieldsProps {
  codeSnippetError?: FieldError;
  register: UseFormRegister<CreatePostInput>;
}

export function ComposerCodeFields({
  codeSnippetError,
  register,
}: ComposerCodeFieldsProps): JSX.Element {
  return (
    <div className="overflow-hidden rounded-lg bg-[#1b1e26]">
      <div className="grid grid-cols-2 gap-3 border-white/10 border-b p-3">
        <input
          {...register('codeFilename')}
          className="min-w-0 bg-transparent font-mono text-[#c3c9d4] text-xs placeholder:text-[#878992] focus:outline-none"
          placeholder="ruta/archivo.ts"
        />

        <input
          {...register('codeLanguage')}
          className="min-w-0 bg-transparent text-right font-mono text-[#c3c9d4] text-xs placeholder:text-[#878992] focus:outline-none"
          placeholder="lenguaje: rust"
        />
      </div>

      <textarea
        {...register('codeSnippet')}
        className="min-h-48 w-full resize-y bg-transparent p-4 font-mono text-[#e4e6eb] text-xs placeholder:text-[#878992] focus:outline-none"
        placeholder="// pega tu código acá"
      />

      {codeSnippetError && (
        <span className="block px-4 pb-3 font-medium text-red-400 text-sm">
          {codeSnippetError.message}
        </span>
      )}
    </div>
  );
}
