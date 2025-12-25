// src/components/hero3d/motion.ts

/**
 * Linear interpolation
 * Smooths movement between current and target
 */
export function lerp(
  current: number,
  target: number,
  ease = 0.08
) {
  return current + (target - current) * ease;
}

/**
 * Clamp a value between min and max
 */
export function clamp(
  value: number,
  min: number,
  max: number
) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Normalize mouse position from screen space
 * Returns range [-1, 1]
 */
export function normalizeMouse(
  x: number,
  y: number,
  width: number,
  height: number
) {
  return {
    nx: (x / width) * 2 - 1,
    ny: -(y / height) * 2 + 1,
  };
}

/**
 * Apply smooth parallax motion
 */
export function parallax(
  value: number,
  strength = 1
) {
  return clamp(value * strength, -1, 1);
}

/**
 * Floating motion for subtle breathing animation
 */
export function float(
  time: number,
  speed = 0.5,
  amplitude = 0.15
) {
  return Math.sin(time * speed) * amplitude;
}
