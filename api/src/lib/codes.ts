import { randomInt } from 'node:crypto'

// Alfabet bez znaków łatwych do pomylenia (0/O, 1/I/L) — kody dyktuje się na pomoście.
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'

function group(len: number): string {
  let out = ''
  for (let i = 0; i < len; i++) out += ALPHABET[randomInt(ALPHABET.length)]
  return out
}

/** Kod dostępu kursanta, np. „SAIL-7K4M-QP2X”. */
export function generateAccessCode(): string {
  return `SAIL-${group(4)}-${group(4)}`
}

/** Normalizacja kodu wpisanego przez kursanta (małe litery, brak myślników, spacje). */
export function normalizeCode(input: string): string {
  const raw = input.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
  if (!raw.startsWith('SAIL')) return raw
  const rest = raw.slice(4)
  return `SAIL-${rest.slice(0, 4)}-${rest.slice(4, 8)}`
}
