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
