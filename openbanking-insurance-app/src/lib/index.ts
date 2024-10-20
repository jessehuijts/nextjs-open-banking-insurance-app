import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function mergeClassNames(...args: ClassValue[]) {
  return twMerge(clsx(args));
}
