import type { ReactNode } from "react";
import { useIntersectionObserver } from "usekit";

export interface RevealProps {
  children: ReactNode;
  /** Stagger delay in milliseconds. */
  delay?: number;
}

/**
 * Reveal-on-scroll wrapper, powered by the library's own
 * `useIntersectionObserver` hook (dogfooding!).
 */
export function Reveal({ children, delay = 0 }: RevealProps) {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.15,
    freezeOnceVisible: true,
  });

  return (
    <div
      ref={ref}
      className={`reveal${isIntersecting ? " visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
