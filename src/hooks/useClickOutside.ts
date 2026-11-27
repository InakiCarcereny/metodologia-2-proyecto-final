import { type RefObject, useEffect } from 'react';

export function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  callBack: () => void,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent): void => {
      const el = ref?.current;

      if (el && !el.contains(event.target as Node)) {
        callBack();
      }
    };

    addEventListener('mousedown', handleClickOutside);

    return (): void => {
      removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callBack, enabled]);
}
