import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Profile photos are black and white. On blueprint, screen-blending them over
// the blue page turns their darks blue and keeps their lights white.
export const pfpTint =
  "grayscale blueprint:mix-blend-screen blueprint:contrast-125"
