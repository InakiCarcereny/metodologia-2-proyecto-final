import { Check } from 'lucide-react';
import type { JSX } from 'react';

export function AcceptedAnswerPreview(): JSX.Element {
  return (
    <article className="flex max-w-113.75 flex-col gap-3 rounded-lg border border-[#2e333d] bg-[#0c0f17] p-4">
      <header className="flex items-center gap-2">
        <span className="font-medium text-[#888c94] text-[13px]">@nico.go</span>

        <span className="rounded-full bg-[#1a2e4a] px-2 py-0.5 font-medium text-[#5b9bd5] text-[11px]">
          pregunta
        </span>

        <span className="font-light text-[#7e8288] text-xs">hace 2 h</span>
      </header>

      <p className="font-light text-[14px] text-white">
        ¿Por qué mi goroutine sigue viva después de cancelar el contexto?
      </p>

      <div className="flex flex-col gap-2 border-[#2e333d] border-t pt-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-[#888c94] text-[13px]">
            @sofi.k
          </span>

          <span className="flex items-center gap-1 rounded-full bg-[#1a3a24] px-2 py-0.5 font-medium text-[#67bb7c] text-[11px]">
            <Check size={10} />
            aceptada
          </span>
        </div>

        <pre className="overflow-x-auto rounded-lg bg-[#141821] p-3 font-mono text-[#9da1a8] text-[12px] leading-relaxed">
          <code>
            <span className="text-[#c586c0]">select</span> {'{'}
            {'\n  '}case <span className="text-[#4ec9b0]">&lt;-ctx.Done()</span>
            :{'\n    '}
            <span className="text-[#c586c0]">return</span>{' '}
            <span className="text-[#6a9955]">{`// faltaba esto`}</span>
            {'\n  '}case job :={' '}
            <span className="text-[#4ec9b0]">&lt;-jobs</span>:
          </code>
        </pre>
      </div>
    </article>
  );
}
