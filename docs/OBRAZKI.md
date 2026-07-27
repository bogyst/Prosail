# Podmiana rysunków SVG na obrazki (WEBP)

Wszystkie ilustracje w serwisie są rysowane wektorowo (SVG), ale **każdą można
zastąpić własnym plikiem graficznym** bez ruszania kodu rysunku — wystarczy
dopisać jedno pole `img` w danych. Rysunek SVG zostaje w kodzie jako zapas i
wraca automatycznie, gdy usuniesz `img`.

## Krok po kroku

1. **Wrzuć plik** do katalogu `public/` — najlepiej w podkatalog tematyczny:

   ```
   public/znaki/zakaz-cumowania.webp
   public/znaki/plawa-kardynalna-n.webp
   public/wezly/bowline-krok-1.webp
   ```

2. **Podaj ścieżkę licząc od `public/`** (czyli zaczynając od `/`):

   ```ts
   img: '/znaki/zakaz-cumowania.webp'
   ```

3. Gotowe. Nic więcej nie trzeba — obrazek ładuje się leniwie (`loading="lazy"`).

> Format: **WEBP** (mały rozmiar, dobra jakość). Znaki najlepiej jako **kwadrat**
> ok. 300×300 px, pławy jako **pion** ok. 200×340 px. Pliki z `public/` trafiają
> do builda bez zmian — nie wymagają importu w kodzie.

### Konwersja do WEBP

```bash
# z PNG/JPG (pakiet webp)
cwebp -q 92 znak.png -o public/znaki/znak.webp

# albo Pythonem (Pillow)
python3 -c "from PIL import Image; Image.open('znak.png').convert('RGB').save('public/znaki/znak.webp','WEBP',quality=92,method=6)"
```

## Gdzie dokładnie wpisać `img`

| Co chcesz podmienić | Plik | Struktura danych |
|---|---|---|
| Znaki ruchu wodnego (zakazy, nakazy, informacyjne) | `src/pages/Przepisy.tsx` | tablica `SIGNS` |
| Znaki dzienne (kule, stożki) | `src/pages/Przepisy.tsx` | tablica `SHAPES` |
| Pławy w galerii Locji | `src/pages/Locja.tsx` | tablica `MARKS` |
| Pławy na mapie akwenu | `src/components/LocjaMap.tsx` | tablica `MARKS` |
| Znaki przy przejściu pod mostem | `src/components/BridgePassage.tsx` | tablica `SIGNS` |
| Kroki wiązania węzłów | `src/pages/Wezly.tsx` | `KNOTS[].steps[]` |
| Obrazek do pytania w quizie | `src/pages/Quiz.tsx` | tablica `QUESTIONS` |
| Okucia pokładowe (knagi, kluzy, półkluzy) | `src/components/Fittings.tsx` | tablica `FITTINGS` |
| Zdjęcia chmur (galeria w oknie szczegółów) | `src/data/clouds.ts` | `CLOUDS[].photos[]` |

## Przykład 1 — znak żeglugowy (działa w projekcie)

`src/pages/Przepisy.tsx`, tablica `SIGNS`:

```ts
{
  name: 'Zakaz cumowania (A.7)',
  desc: 'Nie wolno przybijać ani mocować jednostki do brzegu na tym odcinku…',
  img: '/znaki/zakaz-cumowania.webp',   // ← obrazek zamiast rysunku
  svg: (                                 // ← zapas, użyty gdy usuniesz `img`
    <Sign bg={WH} border={RD} slash native>
      <path d={MOORING_PICTOGRAM} fill={BK} fillRule="evenodd" />
    </Sign>
  ),
},
```

## Przykład 2 — pytanie w quizie z obrazkiem (działa w projekcie)

`src/pages/Quiz.tsx`, tablica `QUESTIONS`:

```ts
{
  topic: 'Przepisy',
  q: 'Jaki to znak żeglugowy?',
  img: '/znaki/zakaz-cumowania.webp',
  imgAlt: 'Biała tablica z czerwoną ramką i pasem przekreślenia, w środku pachołek z liną',
  options: ['Zakaz kotwiczenia', 'Zakaz cumowania', 'Zakaz wyprzedzania', 'Miejsce postoju'],
  correct: 1,          // numeracja od 0 → poprawna jest druga odpowiedź
  explain: 'To znak A.7 — zakaz cumowania…',
},
```

Pole `img` jest opcjonalne — pytania bez obrazka wyglądają dokładnie jak wcześniej.

## Przykład 3 — pława w Locji

`src/pages/Locja.tsx`, tablica `MARKS`:

```ts
{
  id: 'north',
  name: 'Znak kardynalny N (północny)',
  group: 'Znaki kardynalne',
  img: '/znaki/kardynalny-n.webp',   // ← dopisz tę linię
  shape: 'pillar',                    // pola rysunku mogą zostać (zapas)
  bands: [ /* … */ ],
  topmark: 'cones-up',
  light: 'Białe, błyskowe szybkie (VQ lub Q) — ciągłe',
  meaning: '…',
  pass: '…',
},
```

## Jak to działa pod spodem

Za wybór odpowiada komponent `src/components/Illustration.tsx`:

```tsx
<Illustration img={s.img} alt={s.name} className="h-[92px] w-[92px] object-contain">
  {s.svg}   {/* rysunek zapasowy */}
</Illustration>
```

Jeśli `img` jest ustawione → renderuje `<img>`; jeśli nie → pokazuje rysunek SVG.
Dzięki temu podmiana grafiki to zawsze **jedna linia w danych**, a stare rysunki
nie są tracone.

## Przykład 4 — zdjęcia chmury (działa w projekcie)

Chmury mają nie jeden obrazek, tylko **galerię** — po kliknięciu kafelka otwiera
się okno ze szczegółowym opisem i przewijanymi zdjęciami (strzałki ← →,
przyciski, kropki). Wszystko dopisujesz w `src/data/clouds.ts`:

```ts
{
  id: 'cumulonimbus',
  name: 'Cumulonimbus (Cb)',
  // … opisy …
  photos: [
    {
      src: '/chmury/cumulonimbus-1.webp',   // plik z public/chmury/
      alt: 'Chmura burzowa z rozlanym kowadłem nad taflą jeziora',  // obowiązkowe
      caption: 'Dojrzały cumulonimbus: ciemna podstawa i kowadło u szczytu.', // opcjonalne
      credit: 'fot. Jan Kowalski',           // opcjonalne
    },
    { src: '/chmury/cumulonimbus-2.webp', alt: 'Ta sama chmura o zachodzie słońca' },
  ],
}
```

Chmura z pustą tablicą `photos: []` też działa — galeria pokazuje wtedy
komunikat zastępczy. Zdjęcia najlepiej poziome, ok. **1200×800 px**.

> Dwa zdjęcia dołączone do projektu (`public/chmury/…`) to **grafiki poglądowe**
> wygenerowane na potrzeby demonstracji, a nie prawdziwe fotografie —
> podmień je na własne.

## Przykład 5 — nowy znak żeglugowy w odpowiedniej kategorii

Znaki w dziale „Przepisy → Znaki ruchu wodnego" są podzielone na grupy
**A–E** oraz tabliczki uzupełniające (zgodnie z załącznikiem nr 7 do przepisów
żeglugowych). Wystarczy dopisać obiekt do tablicy `SIGNS` w
`src/pages/Przepisy.tsx` — znak sam trafi do właściwej sekcji i do filtrów:

```ts
{
  group: 'A',            // 'A' zakazu · 'B' nakazu · 'C' ograniczenia
                         // 'D' zalecenia · 'E' informacyjne · 'U' uzupełniające
  code: 'A.12',          // oznaczenie z rozporządzenia (opcjonalne)
  name: 'Zakaz ruchu jednostek motorowych',
  desc: 'Krótki opis znaczenia znaku…',
  img: '/znaki/a12.webp',                          // ← obrazek
  svg: <Sign bg={WH} border={RD} slash>…</Sign>,   // ← rysunek zapasowy
}
```

Gotowe „szkielety” tablic, których możesz użyć w polu `svg`:

| Grupa | Kod |
|---|---|
| A (zakaz) | `<Sign bg={WH} border={RD} slash>…</Sign>` |
| B (nakaz) | `<Sign bg={WH} border={RD}>…</Sign>` |
| C (ograniczenie) | `<Sign bg={WH} border={RD}>…</Sign>` + wartość liczbowa |
| D (zalecenie) | `<Sign bg={YE} diamond>…</Sign>` — tablica na wierzchołku |
| E (informacyjny) | `<Sign bg={BL}>…</Sign>` — biały piktogram |
| Uzupełniająca | `<Plate>…</Plate>` — biała tabliczka z czarną obwódką |
