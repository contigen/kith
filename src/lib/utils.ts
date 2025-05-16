import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toBase64(input: unknown): string {
  const json = typeof input === 'string' ? input : JSON.stringify(input)
  return Buffer.from(json, 'utf-8').toString('base64')
}

export async function withTryCatch<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn()
  } catch (err) {
    console.error(err)
    return null
  }
}
