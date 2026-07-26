import type { ReactNode } from 'react'

/**
 * Ilustracja: obrazek ALBO rysunek SVG.
 *
 * Wzorzec używany w całym serwisie (znaki, pławy, silnik, pytania quizu):
 * jeśli w danych ustawisz pole `img`, zostanie wyświetlony plik graficzny;
 * jeśli nie — rysunek wektorowy podany jako `children`.
 *
 * ——— JAK PODMIENIĆ RYSUNEK NA WŁASNY OBRAZEK ———
 *  1. Wrzuć plik do katalogu `public/` (np. `public/znaki/zakaz-kotwiczenia.webp`).
 *     Zalecany format: WEBP (mały rozmiar), kwadrat ok. 300×300 px dla znaków.
 *  2. W danych dopisz pole `img` ze ścieżką OD KATALOGU PUBLIC, np.:
 *       img: '/znaki/zakaz-kotwiczenia.webp'
 *  3. To wszystko — rysunek SVG zostaje w kodzie jako zapas i wróci,
 *     gdy usuniesz pole `img`.
 */
export default function Illustration({
  img,
  alt,
  className = 'h-full w-full object-contain',
  children,
}: {
  /** Ścieżka do obrazka względem katalogu `public` (np. „/znaki/nazwa.webp”). */
  img?: string
  alt: string
  className?: string
  /** Rysunek SVG używany, gdy nie podano `img`. */
  children: ReactNode
}) {
  if (img) {
    return <img src={img} alt={alt} loading="lazy" decoding="async" className={className} />
  }
  return <>{children}</>
}
