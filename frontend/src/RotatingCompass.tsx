import React, { useEffect, useRef, useState, useCallback } from 'react';

type RotationOptions = {
  bigTurnProbability?: number;           // 0..1
  smallDeltaRange?: [number, number];    // degrees
  bigDeltaRange?: [number, number];      // degrees
  smallDurationRange?: [number, number]; // seconds
  bigDurationRange?: [number, number];   // seconds
  pauseRangeMs?: [number, number];       // milliseconds
  easing?: string;
  startDelayMs?: number;                 // milliseconds
};

const defaults: Required<RotationOptions> = {
  bigTurnProbability: 0.18,
  smallDeltaRange: [-20, 20],
  bigDeltaRange: [-120, 120],
  smallDurationRange: [3, 6.5],
  bigDurationRange: [5.5, 9],
  pauseRangeMs: [200, 900],
  easing: 'cubic-bezier(.22,.61,.36,1)',
  startDelayMs: 300,
};

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

type Props = {
  icon: React.ReactNode;
  className?: string;
  iconClassName?: string;
  /** Base (normal) options */
  options?: RotationOptions;
  /** Replacements to apply while hovered */
  hoverOptions?: RotationOptions;
};

export const RotatingCompass: React.FC<Props> = ({
  icon,
  className,
  iconClassName = 'brand__icon',
  options,
  hoverOptions,
}) => {
  const base = { ...defaults, ...(options ?? {}) };
  const hoverBoost = {
    bigTurnProbability: 0.40,          // more frequent big turns
    smallDeltaRange: [-35, 35],        // bigger small drifts
    bigDeltaRange: [-240, 240],        // bigger big swings
    smallDurationRange: [1.6, 2.8],    // faster small drifts
    bigDurationRange: [2.8, 4.6],      // faster big swings
    pauseRangeMs: [100, 300],          // shorter pauses
    easing: 'ease-in-out',             // slightly snappier feel
    startDelayMs: 150,
    ...(hoverOptions ?? {}),           // allow caller to override these
  };

  const iconRef = useRef<HTMLDivElement | null>(null);
  const currentDegRef = useRef<number>(0);
  const runningRef = useRef<boolean>(false);
  const timeoutRef = useRef<number | null>(null);
  const reduceMotionRef = useRef<boolean>(false);

  /** Whether we are in hover mode (use boosted options) */
  const [hovered, setHovered] = useState(false);

  /** Compute the effective options based on hover state */
  const effective = hovered ? hoverBoost : base;

  const startNextLeg = useCallback(() => {
    const el = iconRef.current;
    if (!el) return;

    runningRef.current = true;

    const isBig = Math.random() < (effective.bigTurnProbability ?? base.bigTurnProbability);
    const deltaRange = isBig ? (effective.bigDeltaRange ?? base.bigDeltaRange)
                             : (effective.smallDeltaRange ?? base.smallDeltaRange);
    const durationRange = isBig ? (effective.bigDurationRange ?? base.bigDurationRange)
                                : (effective.smallDurationRange ?? base.smallDurationRange);

    const delta = rand(deltaRange[0], deltaRange[1]);
    const duration = rand(durationRange[0], durationRange[1]);
    const target = currentDegRef.current + delta;

    el.style.transition = `transform ${duration.toFixed(2)}s ${effective.easing ?? base.easing}`;
    el.style.transform = `rotate(${target}deg)`;
  }, [effective, base]);

  const onTransitionEnd = useCallback((e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== 'transform' || !runningRef.current) return;
    const m = e.currentTarget.style.transform.match(/rotate\(([-\d.]+)deg\)/);
    if (m) currentDegRef.current = parseFloat(m[1]);

    // schedule next leg using current (effective) pause range
    const pr = effective.pauseRangeMs ?? base.pauseRangeMs;
    const pause = rand(pr[0], pr[1]);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(startNextLeg, pause);
  }, [effective.pauseRangeMs, base.pauseRangeMs, startNextLeg]);


// Hover handlers: do NOT pause the loop
const onEnter = () => {
  setHovered(true);
  // If no leg is currently scheduled, kick one immediately
  if (!runningRef.current) {
    startNextLeg();
  }
};
const onLeave = () => setHovered(false);

  return (
    <div className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
      <div
        ref={iconRef}
        className={iconClassName}
        onTransitionEnd={onTransitionEnd}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={onEnter}
        onBlur={onLeave}
        aria-hidden
      >
        {icon}
      </div>
    </div>
  );
};
