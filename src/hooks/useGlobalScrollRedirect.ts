import { type RefObject, useEffect } from 'react';

export function useGlobalScrollRedirect(
  scrollTargetRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    const handleWheel = (event: WheelEvent): void => {
      const scrollTarget = scrollTargetRef.current;
      if (!scrollTarget) return;

      const isInsideScrollTarget =
        event.target instanceof Node && scrollTarget.contains(event.target);
      if (isInsideScrollTarget) return;

      event.preventDefault();
      scrollTarget.scrollBy({ behavior: 'auto', top: event.deltaY });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [scrollTargetRef]);
}
