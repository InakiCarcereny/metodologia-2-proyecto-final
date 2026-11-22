'use client';

import { X } from 'lucide-react';
import type { JSX, ReactNode } from 'react';
import { useRef } from 'react';
import { Separator } from '@/components/Separator';
import { useOutsideClick } from '@/hooks/useClickOutside';
import { useCloseOnEscape } from '@/hooks/useCloseOnEscape';
import { useModalStore } from '@/store/modal-store';

interface ModalProps {
  children: ReactNode;
  title: string;
}

export function Modal({ children, title }: ModalProps): JSX.Element {
  const closeModal = useModalStore((s) => s.closeModal);
  const contentRef = useRef<HTMLDivElement>(null);

  useCloseOnEscape(closeModal);
  useOutsideClick(contentRef, closeModal);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="flex max-h-150 w-full max-w-162.5 flex-col gap-4 overflow-y-auto rounded-lg bg-white p-6"
        ref={contentRef}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[16px]">{title}</h2>

          <button
            className="cursor-pointer rounded-lg p-0.5 duration-150 hover:bg-[#e9ebef]"
            onClick={closeModal}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <Separator />

        {children}
      </div>
    </div>
  );
}
