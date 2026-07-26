import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/ui'
import { Search, ArrowDownAZ, LayoutList } from 'lucide-react'

interface Entry {
  term: string
  cat: string
  def: string
}

// Żeglarska „Wikipedia” — baza terminów (rozbudowywana)
const ENTRIES: Entry[] = [
  // Kursy i teoria
  { term: 'Bajdewind', cat: 'Teoria', def: 'Kurs ostry — wiatr wieje z przodu, z boku dziobu (ok. 35–60° od osi jachtu). Żagle wybrane blisko osi.' },
  { term: 'Półwiatr', cat: 'Teoria', def: 'Kurs, na którym wiatr wieje prostopadle do osi jachtu (z trawersu). Zwykle najszybszy.' },
  { term: 'Baksztag', cat: 'Teoria', def: 'Kurs pełny — wiatr wieje zza trawersu (ok. 100–160°). Żagle mocno wypuszczone.' },
  { term: 'Fordewind', cat: 'Teoria', def: 'Kurs z wiatrem wiejącym prosto w rufę. Możliwy „motylek”; uwaga na niekontrolowany zwrot przez rufę.' },
  { term: 'Hals', cat: 'Teoria', def: 'Strona, z której wieje wiatr: hals prawy = wiatr z prawej burty. Na halsie prawym masz pierwszeństwo przed jachtem na lewym.' },
  { term: 'Zwrot przez sztag', cat: 'Teoria', def: 'Zmiana halsu dziobem przez linię wiatru (z bajdewindu na bajdewind).' },
  { term: 'Zwrot przez rufę', cat: 'Teoria', def: 'Zmiana halsu rufą przez linię wiatru. Bom gwałtownie przechodzi na drugą burtę — kontroluj go szotem.' },
  { term: 'Martwy kąt', cat: 'Teoria', def: 'Sektor ok. ±35–45° wokół linii wiatru, w którym jacht nie może płynąć — żagle łopoczą.' },
  { term: 'Halsowanie', cat: 'Teoria', def: 'Płynięcie zygzakiem (bajdewindami na przemiennych halsach), aby osiągnąć cel leżący pod wiatr.' },
  { term: 'Wiatr pozorny', cat: 'Teoria', def: 'Wiatr odczuwany na płynącym jachcie — suma wiatru rzeczywistego i wiatru wywołanego ruchem jachtu. Do niego trymuje się żagle.' },
  { term: 'Dryf', cat: 'Teoria', def: 'Boczne znoszenie jachtu przez wiatr (leeway). Ogranicza go miecz lub kil.' },
  { term: 'Refowanie', cat: 'Teoria', def: 'Zmniejszanie powierzchni żagla przy silnym wietrze (refy na grocie, rolowanie foka).' },
  { term: 'Łopot', cat: 'Teoria', def: 'Trzepotanie żagla, który nie pracuje (za luźny lub jacht w martwym kącie).' },
  { term: 'Praca na żaglach', cat: 'Teoria', def: 'Trymowanie: wybieraj żagiel, aż przestanie łopotać; luzuj, aż zacznie — i lekko dobierz.' },

  // Budowa
  { term: 'Bakburta', cat: 'Budowa', def: 'LEWA burta jachtu (patrząc od rufy w stronę dziobu). Nocą oznaczona światłem czerwonym. „Lewa – krewa”.' },
  { term: 'Sterburta', cat: 'Budowa', def: 'PRAWA burta jachtu. Nocą oznaczona światłem zielonym. „Prawa – trawa”.' },
  { term: 'Dziób', cat: 'Budowa', def: 'Przednia część kadłuba.' },
  { term: 'Rufa', cat: 'Budowa', def: 'Tylna część kadłuba; płaskie zakończenie to pawęż.' },
  { term: 'Kadłub', cat: 'Budowa', def: 'Korpus jachtu zapewniający pływalność.' },
  { term: 'Maszt', cat: 'Budowa', def: 'Pionowe drzewce dźwigające żagle, podparte olinowaniem stałym.' },
  { term: 'Bom', cat: 'Budowa', def: 'Poziome drzewce u dolnego liku grota, obracające się wokół masztu.' },
  { term: 'Grot', cat: 'Budowa', def: 'Główny żagiel stawiany za masztem.' },
  { term: 'Fok', cat: 'Budowa', def: 'Przedni żagiel na sztagu. Większa wersja to genua.' },
  { term: 'Miecz', cat: 'Budowa', def: 'Opuszczana płetwa przeciwdziałająca dryfowi; na płyciznach się ją podnosi. Typowa dla jachtów mazurskich.' },
  { term: 'Ster', cat: 'Budowa', def: 'Płetwa przy pawęży zmieniająca kurs; obsługiwana rumplem lub kołem.' },
  { term: 'Rumpel', cat: 'Budowa', def: 'Dźwignia połączona z płetwą sterową, którą steruje sternik.' },
  { term: 'Kokpit', cat: 'Budowa', def: 'Zagłębienie w pokładzie dla załogi i sternika.' },
  { term: 'Sztag', cat: 'Budowa', def: 'Stalowa lina od topu masztu do dziobu (olinowanie stałe); niesie foka.' },
  { term: 'Achtersztag', cat: 'Budowa', def: 'Lina od topu masztu do rufy, podpiera maszt od tyłu.' },
  { term: 'Wanty', cat: 'Budowa', def: 'Boczne liny olinowania stałego, podpierają maszt na burty (przez salingi).' },
  { term: 'Saling', cat: 'Budowa', def: 'Poprzeczka na maszcie rozpierająca wanty.' },
  { term: 'Fał', cat: 'Budowa', def: 'Lina do wciągania (stawiania) żagla: fał grota, fał foka.' },
  { term: 'Kontrafał', cat: 'Budowa', def: 'Lina do ściągania żagla w dół (pomocna przy zrzucaniu i refowaniu).' },
  { term: 'Szot', cat: 'Budowa', def: 'Lina trymowa żagla: grotszot i szoty foka. Reguluje kąt żagla do wiatru.' },
  { term: 'Topenanta', cat: 'Budowa', def: 'Lina z topu masztu podtrzymująca nok bomu, gdy grot jest zrzucony.' },
  { term: 'Lazy jack', cat: 'Budowa', def: 'Linki tworzące „koszyk” między masztem a bomem, łapiące zrzucany grot.' },
  { term: 'Obciągacz bomu', cat: 'Budowa', def: 'Talia ściągająca bom w dół (vang); kontroluje twist grota.' },
  { term: 'Kabestan', cat: 'Budowa', def: 'Bęben z korbą zwielokratniający siłę przy wybieraniu szotów i fałów (winch).' },
  { term: 'Knaga', cat: 'Budowa', def: 'Okucie do szybkiego zamocowania liny (np. knaga rogowa, szczękowa).' },
  { term: 'Pawęż', cat: 'Budowa', def: 'Płaskie zakończenie rufy; na niej wisi silnik przyczepny i często ster.' },
  { term: 'Skrzynia mieczowa', cat: 'Budowa', def: 'Obudowa w dnie kadłuba, w której chowa się miecz.' },

  // Locja
  { term: 'Pława', cat: 'Locja', def: 'Pływający znak nawigacyjny zakotwiczony do dna.' },
  { term: 'Stawa', cat: 'Locja', def: 'Znak nawigacyjny stały (na palach/konstrukcji), niepływający.' },
  { term: 'Znak kardynalny', cat: 'Locja', def: 'Czarno-żółty znak wskazujący, po której stronie świata (N/E/S/W) jest bezpieczna woda.' },
  { term: 'Izolowane niebezpieczeństwo', cat: 'Locja', def: 'Czarno-czerwony znak z dwiema kulami stawiany NA przeszkodzie; omijaj z każdej strony.' },
  { term: 'Bezpieczna woda', cat: 'Locja', def: 'Czerwono-biały znak (kula na topie) — dookoła głęboko; często oś toru.' },
  { term: 'Szlak żeglowny', cat: 'Locja', def: 'Oznakowany pas wody o gwarantowanej głębokości. Na śródlądziu: prawa strona czerwona, lewa zielona (patrząc w dół rzeki).' },
  { term: 'Mielizna', cat: 'Locja', def: 'Płycizna grożąca wejściem na dno; na mapach jaśniejsza, otoczona izobatą.' },
  { term: 'Izobata', cat: 'Locja', def: 'Linia łącząca punkty o tej samej głębokości.' },
  { term: 'Przęsło żeglowne', cat: 'Locja', def: 'Przęsło mostu przeznaczone do przepływania, oznaczone żółtym rombem.' },
  { term: 'Skrajnia', cat: 'Locja', def: 'Dozwolony obszar przejścia (szerokość/wysokość) pod mostem lub przy budowli, oznaczony tablicami.' },

  // Meteorologia
  { term: 'Skala Beauforta', cat: 'Meteorologia', def: '12-stopniowa skala siły wiatru oceniana po skutkach (stan morza, zachowanie lądu).' },
  { term: 'Szkwał', cat: 'Meteorologia', def: 'Nagły, silny poryw wiatru, często pod chmurą burzową. Groźny dla małych jachtów — refuj zawczasu.' },
  { term: 'Cumulonimbus', cat: 'Meteorologia', def: 'Chmura burzowa o wielkiej rozbudowie pionowej z „kowadłem”; niesie burze i szkwały.' },
  { term: 'Front atmosferyczny', cat: 'Meteorologia', def: 'Granica mas powietrza; przejściu frontu towarzyszy zmiana wiatru, ciśnienia i pogody.' },
  { term: 'Bryza', cat: 'Meteorologia', def: 'Lokalny wiatr dobowy: w dzień znad wody na ląd, nocą odwrotnie.' },
  { term: 'Wieża sygnalizacyjna', cat: 'Meteorologia', def: 'Mazurski system ostrzegania: 40 błysków/min = ostrzeżenie, 90 = alarm przed burzą.' },

  // Przepisy
  { term: 'COLREG / MPZZM', cat: 'Przepisy', def: 'Międzynarodowe przepisy o zapobieganiu zderzeniom na morzu; na śródlądziu — przepisy żeglugowe krajowe.' },
  { term: 'Jednostka uprzywilejowana', cat: 'Przepisy', def: 'Ta, która utrzymuje kurs i prędkość (stand-on); druga ma obowiązek ustąpić (give-way).' },
  { term: 'Patent żeglarza jachtowego', cat: 'Przepisy', def: 'Pierwszy polski patent żeglarski (od 14 lat, po egzaminie). Śródlądzie bez limitu, morze do 12 m / 2 Mm w dzień.' },
  { term: 'Sternik motorowodny', cat: 'Przepisy', def: 'Patent na jachty motorowe (od 14 lat). Wymagany powyżej 10 kW mocy silnika.' },
  { term: 'Kill switch', cat: 'Przepisy', def: 'Zrywka bezpieczeństwa silnika — linka zapinana do sternika, wyłącza silnik po wypadnięciu za burtę.' },

  // Manewry i ratownictwo
  { term: 'Człowiek za burtą (MOB)', cat: 'Ratownictwo', def: 'Alarm i manewr ratowania osoby w wodzie. Zasada ASO: Alarm, Środki ratunkowe, Obserwator.' },
  { term: 'Pętla rufowa', cat: 'Ratownictwo', def: 'Manewr MOB: odejście, odpadnięcie, zwrot przez rufę i powrót ostrym bajdewindem „na człowieka”.' },
  { term: 'Cuma', cat: 'Manewry', def: 'Lina do przywiązania jachtu: dziobowa i rufowa trzymają wzdłuż, szpringi po skosie, bresty prostopadle.' },
  { term: 'Szpring', cat: 'Manewry', def: 'Cuma prowadzona ukośnie (dziobowa do tyłu, rufowa do przodu) — blokuje ruch wzdłuż pomostu.' },
  { term: 'Brest', cat: 'Manewry', def: 'Krótka cuma prostopadła do pomostu, dociąga burtę.' },
  { term: 'Kotwiczenie', cat: 'Manewry', def: 'Postój na kotwicy: łańcuch/lina min. 3–5× głębokość; w dzień czarna kula, nocą białe światło 360°.' },
  { term: 'Alarmowanie', cat: 'Ratownictwo', def: 'Numer ratunkowy nad wodą: 601 100 100 (lub 112). Podaj miejsce, co się stało, liczbę osób, stan.' },
]

const CATS = [...new Set(ENTRIES.map((e) => e.cat))].sort((a, b) => a.localeCompare(b, 'pl'))

export default function Glosariusz() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<string | null>(null)
  const [sort, setSort] = useState<'alpha' | 'cat'>('alpha')

  const list = useMemo(() => {
    const norm = q.trim().toLowerCase()
    let out = ENTRIES.filter(
      (e) =>
        (!cat || e.cat === cat) &&
        (!norm || e.term.toLowerCase().includes(norm) || e.def.toLowerCase().includes(norm)),
    )
    out = [...out].sort((a, b) => a.term.localeCompare(b.term, 'pl'))
    return out
  }, [q, cat])

  // grupowanie do widoku
  const groups = useMemo(() => {
    const m = new Map<string, Entry[]>()
    for (const e of list) {
      const key = sort === 'alpha' ? e.term[0].toUpperCase() : e.cat
      const arr = m.get(key) ?? []
      arr.push(e)
      m.set(key, arr)
    }
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0], 'pl'))
  }, [list, sort])

  return (
    <div>
      <PageHeader eyebrow="Glosariusz" title="Słownik żeglarski">
        Encyklopedia pojęć używanych na kursie — {ENTRIES.length} haseł. Szukaj, filtruj po
        działach lub przeglądaj alfabetycznie.
      </PageHeader>

      {/* pasek narzędzi */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="relative min-w-64 flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brine-100/50" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Szukaj hasła lub definicji…"
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-navy placeholder:text-brine-100/40 focus:outline-none focus:ring-2 focus:ring-brine-400/60"
          />
        </label>
        <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
          <button onClick={() => setSort('alpha')} className={`btn px-3 py-1.5 text-xs ${sort === 'alpha' ? 'bg-brine-500 text-white' : 'text-brine-100'}`}>
            <ArrowDownAZ className="h-4 w-4" /> Alfabetycznie
          </button>
          <button onClick={() => setSort('cat')} className={`btn px-3 py-1.5 text-xs ${sort === 'cat' ? 'bg-brine-500 text-white' : 'text-brine-100'}`}>
            <LayoutList className="h-4 w-4" /> Wg działów
          </button>
        </div>
      </div>

      {/* filtr działów */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button onClick={() => setCat(null)} className={`rounded-xl px-3 py-1.5 text-sm ${!cat ? 'bg-brine-500 text-white' : 'bg-white/5 text-brine-100 hover:bg-white/10'}`}>
          Wszystkie
        </button>
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(cat === c ? null : c)} className={`rounded-xl px-3 py-1.5 text-sm ${cat === c ? 'bg-brine-500 text-white' : 'bg-white/5 text-brine-100 hover:bg-white/10'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* hasła */}
      {list.length === 0 ? (
        <div className="card p-8 text-center text-brine-100/70">Brak haseł dla podanych kryteriów.</div>
      ) : (
        <div className="space-y-8">
          {groups.map(([g, entries]) => (
            <section key={g}>
              <h2 className="mb-3 border-b border-white/10 pb-1 font-display text-xl font-700 text-brine-300">{g}</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {entries.map((e) => (
                  <motion.div key={e.term} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-base font-700 text-navy">{e.term}</h3>
                      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-brine-100/40">{e.cat}</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-brine-100/85">{e.def}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
