import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function invariant(condition: unknown, description = "Invariant"): asserts condition {
  if (!condition) {
    throw new Error(description);
  }
}
