import { RefObject, useEffect, useState } from "react";

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

type PinnedSectionState = {
  activeIndex: number;
  progress: number;
  stepProgress: number;
};

export function usePinnedSectionProgress(
  ref: RefObject<HTMLElement>,
  steps: number,
): PinnedSectionState {
  const [state, setState] = useState<PinnedSectionState>({
    activeIndex: 0,
    progress: 0,
    stepProgress: 0,
  });

  useEffect(() => {
    if (steps <= 0) return;

    let frame = 0;

    const measure = () => {
      const element = ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const travel = Math.max(element.offsetHeight - window.innerHeight, 1);
      const progress = clamp01(-rect.top / travel);
      const rawIndex = Math.floor(progress * steps);
      const activeIndex = Math.min(steps - 1, Math.max(0, rawIndex));
      const stepSize = 1 / steps;
      const stepStart = activeIndex * stepSize;
      const stepProgress = clamp01((progress - stepStart) / stepSize);

      setState((current) => {
        if (
          current.activeIndex === activeIndex &&
          Math.abs(current.progress - progress) < 0.001 &&
          Math.abs(current.stepProgress - stepProgress) < 0.001
        ) {
          return current;
        }

        return { activeIndex, progress, stepProgress };
      });
    };

    const onChange = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, [ref, steps]);

  return state;
}