/* ————————————————————————————————————————————————————————————————
   RODZAJE CHMUR — dane do modułu „Meteorologia”.

   Chcesz dodać własną chmurę albo zdjęcia? Wszystko robisz TUTAJ, nic
   więcej nie trzeba ruszać:

   1. Zdjęcia wrzuć do `public/chmury/` (format WEBP, poziome ~1200×800 px).
   2. W polu `photos` podaj ścieżkę licząc od `public/`, czyli od „/”:
        photos: [
          { src: '/chmury/cirrus-1.webp', alt: 'Cirrus nad jeziorem',
            caption: 'Włókniste pasma na dużej wysokości', credit: 'fot. Jan Kowalski' },
        ]
      `alt` jest obowiązkowe (czytniki ekranu), `caption` i `credit` — opcjonalne.
   3. Chmura bez zdjęć też działa — galeria pokaże wtedy komunikat zastępczy.
   4. Nowa chmura = jeden obiekt dopisany do tablicy CLOUDS. Kolejność na
      stronie = kolejność w tablicy.
   ———————————————————————————————————————————————————————————————— */

export interface CloudPhoto {
  /** ścieżka od katalogu `public/`, np. '/chmury/cumulonimbus-1.webp' */
  src: string
  /** opis dla czytników ekranu — obowiązkowy */
  alt: string
  /** podpis pod zdjęciem (jeśli brak, użyty zostanie `alt`) */
  caption?: string
  /** autor / źródło, np. 'fot. Jan Kowalski' */
  credit?: string
}

export interface Cloud {
  id: string
  /** nazwa wyświetlana, np. 'Cumulonimbus (Cb)' */
  name: string
  /** pełna nazwa łacińska / polska */
  latin: string
  /** piętro: 'Chmury wysokie' | 'Chmury średnie' | 'Chmury niskie' | 'Chmury o budowie pionowej' */
  family: string
  /** wysokość podstawy — krótko, na kafelek i „plakietkę” */
  altitude: string
  /** jednozdaniowy wygląd — pokazywany na kafelku */
  look: string
  /** jednozdaniowa prognoza — pokazywana na kafelku */
  weather: string
  emoji: string
  /* — pola widoczne dopiero po kliknięciu w kafelek — */
  forms: string
  brings: string
  recognise: string[]
  sailing: string
  photos: CloudPhoto[]
}

export const CLOUDS: Cloud[] = [
  {
    id: 'cirrus',
    name: 'Cirrus (Ci)',
    latin: 'Cirrus — pierzasta',
    family: 'Chmury wysokie',
    altitude: '6–13 km',
    look: 'Delikatne, włókniste „pióra” z kryształków lodu.',
    weather: 'Zwiastują ciepły front — pogoda może się psuć w ciągu 12–24 h.',
    emoji: '🪶',
    forms:
      'Powstają wysoko, gdzie temperatura spada poniżej −40 °C, więc od razu z kryształków lodu, a nie z kropelek wody. Najczęściej na czole nasuwającego się frontu ciepłego, gdzie ciepłe powietrze wspina się po klinie chłodnego, albo z rozwiewanego kowadła dawnej burzy.',
    brings:
      'Same w sobie nie dają opadu — są zapowiedzią. Jeśli po cirrusach niebo stopniowo mleczeje (przechodzą w cirrostratus, potem altostratus), w ciągu kilkunastu godzin przyjdzie front ciepły z długotrwałym deszczem i skręcającym wiatrem. Pojedyncze, nieruchome pasma przy stabilnej pogodzie nie oznaczają nic złego.',
    recognise: [
      'Białe, jedwabiste włókna i haczyki („ogony kobyle”) — nigdy nie mają szarej podstawy.',
      'Nie zasłaniają słońca: cienie na ziemi pozostają ostre.',
      'Przesuwają się szybko, często w innym kierunku niż wiatr przy ziemi.',
      'Jeżeli gęstnieją i zlewają się w mleczną powłokę z halo wokół słońca — front ciepły jest już blisko.',
    ],
    sailing:
      'Zobaczyłeś cirrusy z zachodu, a barometr powoli opada? Masz zwykle pół dnia zapasu — dobra chwila, żeby zaplanować krótszy etap, sprawdzić refy i wybrać port z osłoną od strony spodziewanego wiatru.',
    photos: [],
  },
  {
    id: 'cirrostratus',
    name: 'Cirrostratus (Cs)',
    latin: 'Cirrostratus — pierzasto‑warstwowa',
    family: 'Chmury wysokie',
    altitude: '6–13 km',
    look: 'Cienka, mleczna zasłona na całym niebie — z halo wokół słońca.',
    weather: 'Klasyczny drugi etap nadchodzącego frontu ciepłego.',
    emoji: '🌤️',
    forms:
      'Powstaje, gdy warstwa cirrusów rozlewa się i zlewa w jednolity welon z kryształków lodu, zwykle na kilkanaście godzin przed frontem ciepłym.',
    brings:
      'Nie daje opadu, ale prawie zawsze zapowiada pogorszenie. Po cirrostratusie niebo szarzeje (altostratus), a potem zaczyna padać — deszcz ciągły, trwający wiele godzin.',
    recognise: [
      'Halo — świetlisty pierścień o promieniu ok. 22° wokół słońca lub księżyca. To znak rozpoznawczy tej chmury.',
      'Niebo jest zamglone, ale wciąż widać tarczę słońca i słabe cienie.',
      'Warstwa jest jednolita, bez kłębów i bez wyraźnych krawędzi.',
    ],
    sailing:
      'Halo wokół słońca to jeden z najstarszych i wciąż trafnych znaków pogodowych: „koło wokół słońca — deszcz w drodze”. Traktuj je jako sygnał, żeby dokończyć etap i zacumować przed nocą.',
    photos: [],
  },
  {
    id: 'altocumulus',
    name: 'Altocumulus (Ac)',
    latin: 'Altocumulus — średnia kłębiasta',
    family: 'Chmury średnie',
    altitude: '2–6 km',
    look: 'Ławice białych „baranków” ułożonych w regularne rzędy.',
    weather: 'Rano w upalny dzień — zapowiedź popołudniowych burz.',
    emoji: '🐑',
    forms:
      'Tworzy się w średnim piętrze, gdy wilgotna warstwa powietrza faluje i lokalnie się unosi. Regularne rzędy biorą się z fal na granicy dwóch warstw o różnej gęstości.',
    brings:
      'Zwykle nie daje opadu. Ważny jest kontekst: altocumulus castellanus (z małymi wieżyczkami wyrastającymi z jednej podstawy) obserwowany rano w ciepły, parny dzień to bardzo dobry wskaźnik chwiejności — po południu z dużym prawdopodobieństwem urosną burze.',
    recognise: [
      'Płaty i wałki wyraźnie większe od „baranków” cirrocumulusa — pojedynczy płat jest szerszy niż trzy palce wyciągniętej ręki.',
      'Mają cieniowanie: jasną górę i szarawy spód (cirrusy są całe białe).',
      'Wersja „castellanus”: z jednej podstawy wyrastają w górę małe wieżyczki — sygnał ostrzegawczy.',
    ],
    sailing:
      'Ac castellanus przed południem = plan dnia z krótkim etapem i portem osiągalnym przed popołudniem. Na Mazurach burze najczęściej rozwijają się między 14:00 a 19:00.',
    photos: [],
  },
  {
    id: 'cumulus',
    name: 'Cumulus (Cu)',
    latin: 'Cumulus — kłębiasta',
    family: 'Chmury o budowie pionowej',
    altitude: 'podstawa 0,6–2 km',
    look: 'Białe, kłębiaste „kalafiory” o płaskiej podstawie.',
    weather: 'Ładna pogoda — dopóki nie zaczną się rozbudowywać w pionie.',
    emoji: '☁️',
    forms:
      'Rodzą się z termiki: nagrzany grunt wypuszcza w górę bąble ciepłego powietrza, które chłodzą się przy wznoszeniu. Na wysokości kondensacji para wodna skrapla się — i właśnie tam powstaje charakterystyczna płaska podstawa, jednakowa dla wszystkich chmur w okolicy.',
    brings:
      'Cumulus humilis („chmury pięknej pogody”, szersze niż wyższe) oznacza stabilny, słoneczny dzień. Gdy zaczynają rosnąć w górę i robią się wyższe niż szersze (cumulus congestus), powietrze jest chwiejne — mogą przejść w chmurę burzową.',
    recognise: [
      'Płaska, wyraźnie zaznaczona podstawa na jednym poziomie i kalafiorowate, ostro odcięte wierzchołki.',
      'Ładna pogoda: chmury są szersze niż wyższe, mają dużo błękitu między sobą.',
      'Ostrzegawczo: wieża rośnie szybko, wierzchołki twardnieją i ciemnieją, prześwity znikają.',
      'Nad lądem pojawiają się i znikają w rytmie nasłonecznienia; nad wodą jest ich znacznie mniej.',
    ],
    sailing:
      'Cumulusy zdradzają termikę: pod nimi bywa wzmożenie wiatru, a między nimi — dziury bezwietrzne. Nad lądem tworzą się chętniej niż nad jeziorem, więc rząd cumulusów nad brzegiem to często zapowiedź bryzy wciągającej powietrze znad wody.',
    photos: [],
  },
  {
    id: 'cumulonimbus',
    name: 'Cumulonimbus (Cb)',
    latin: 'Cumulonimbus — kłębiasta deszczowa (burzowa)',
    family: 'Chmury o budowie pionowej',
    altitude: 'podstawa 0,5–2 km, szczyt do 12–15 km',
    look: 'Potężna chmura burzowa z „kowadłem” na szczycie.',
    weather: 'Burze, ulewy, grad i gwałtowne szkwały — najgroźniejsza dla żeglarza.',
    emoji: '⛈️',
    forms:
      'To cumulus, który dostał paliwa: bardzo chwiejne, wilgotne powietrze pozwala prądowi wstępującemu wznosić się kilometrami, aż do tropopauzy. Tam wierzchołek nie może już rosnąć w górę, więc rozlewa się na boki w charakterystyczne kowadło (incus). Wewnątrz krążą prądy wstępujące i zstępujące — te drugie uderzają w wodę i rozchodzą się poziomo jako szkwał.',
    brings:
      'Ulewa, grad, wyładowania atmosferyczne, gwałtowny spadek temperatury i przede wszystkim szkwał: nagły wzrost siły wiatru nawet o 5–7 stopni Beauforta w kilkadziesiąt sekund, ze zmianą kierunku o 90–180°. Na Mazurach najczęściej między 14:00 a 19:00 w upalne, parne dni.',
    recognise: [
      'Ciemna, prawie czarna, ostro odcięta podstawa — dużo ciemniejsza niż u zwykłego cumulusa.',
      'Kowadło rozlane na boki u szczytu, często rozciągnięte w kierunku przemieszczania się chmury.',
      'Pod chmurą widać „zasłonę” opadu — smugę sięgającą do wody, czasem z jaśniejszym pasem u dołu.',
      'Wał szkwałowy: poziomy, kłębiący się wałek chmury na czole burzy — to on przynosi pierwsze uderzenie wiatru.',
      'Woda na horyzoncie robi się ciemna i „nastroszona” — wiatr już tam jest, u Ciebie będzie za chwilę.',
    ],
    sailing:
      'Nie licz, że zdążysz do portu — licz czas do uderzenia. Refuj albo zrzuć żagle ZANIM przyjdzie szkwał, zapnij kamizelki, odpal silnik, zejdź z drogi innym jednostkom i ustaw jacht dziobem lub rufą do wiatru. Odległość burzy: policz sekundy od błysku do grzmotu i podziel przez 3 — wynik w kilometrach.',
    /* ↓↓↓ PRZYKŁAD GALERII — tak dodajesz zdjęcia do pozostałych chmur ↓↓↓ */
    photos: [
      {
        src: '/chmury/cumulonimbus-1.webp',
        alt: 'Chmura burzowa Cumulonimbus z rozlanym kowadłem nad taflą jeziora',
        caption: 'Dojrzały cumulonimbus: ciemna podstawa i kowadło rozlane u szczytu.',
        credit: 'grafika poglądowa — podmień na własne zdjęcie',
      },
      {
        src: '/chmury/cumulonimbus-2.webp',
        alt: 'Ta sama chmura burzowa o zachodzie słońca — ciemna podstawa, kowadło oświetlone słońcem',
        caption: 'Pod wieczór kowadło jeszcze świeci, a podstawa jest już całkiem czarna.',
        credit: 'grafika poglądowa — podmień na własne zdjęcie',
      },
    ],
  },
  {
    id: 'stratocumulus',
    name: 'Stratocumulus (Sc)',
    latin: 'Stratocumulus — kłębiasto‑warstwowa',
    family: 'Chmury niskie',
    altitude: 'poniżej 2 km',
    look: 'Szaro‑białe „bałwanki” ułożone w płaty, wałki lub rzędy.',
    weather: 'Zmienne zachmurzenie, zwykle bez opadów lub słaba mżawka.',
    emoji: '🌥️',
    forms:
      'Powstaje, gdy warstwa chmur kłębiastych rozpłaszcza się pod inwersją — ciepła warstwa wyżej działa jak sufit i nie pozwala im rosnąć w górę, więc rozlewają się na boki i zlepiają w płaty.',
    brings:
      'Najczęściej po prostu pochmurno. Opad rzadki i słaby (mżawka). Często pojawia się po przejściu frontu chłodnego, gdy pogoda już się uspokaja, albo rano nad wodą i rozpływa się po nagrzaniu dnia.',
    recognise: [
      'Wyraźne, ciemniejsze i jaśniejsze płaty ułożone w regularne wałki lub szachownicę.',
      'Między płatami widać prześwity nieba — inaczej niż w jednolitym stratusie.',
      'Pojedynczy płat jest duży: szerszy niż dłoń wyciągniętej ręki.',
    ],
    sailing:
      'Sama w sobie niegroźna, ale zwiastuje inwersję — a pod inwersją wiatr bywa porywisty i „skaczący” kierunkowo. Miej to na uwadze przy trymie i przy podejściu do pomostu.',
    photos: [],
  },
  {
    id: 'stratus',
    name: 'Stratus (St)',
    latin: 'Stratus — warstwowa',
    family: 'Chmury niskie',
    altitude: '0–1 km (czasem dotyka wody)',
    look: 'Jednolita, szara warstwa jak mgła uniesiona nad ziemię.',
    weather: 'Zachmurzenie, mżawka, mocno ograniczona widzialność.',
    emoji: '🌫️',
    forms:
      'Powstaje, gdy wilgotne powietrze ochładza się nad chłodniejszym podłożem — np. ciepłe powietrze napływa nad zimną wodę wiosną. To w praktyce mgła, która nie leży na wodzie, tylko unosi się kilkadziesiąt–kilkaset metrów wyżej.',
    brings:
      'Mżawkę albo bardzo drobny opad, nigdy ulewę. Największym problemem nie jest opad, lecz widzialność: brzeg i znaki nawigacyjne potrafią zniknąć w kilkanaście minut.',
    recognise: [
      'Jednolita szara powłoka bez żadnej struktury — nie widać ani kłębów, ani krawędzi.',
      'Tarcza słońca bywa widoczna jako matowa plama, ale bez halo.',
      'Podstawa jest bardzo nisko — potrafi zasłaniać wierzchołki drzew i maszty na brzegu.',
    ],
    sailing:
      'Wiatr zwykle słaby, ale nawigacja robi się poważna: płyń wolno, prowadź zliczenie drogi (kurs + czas + prędkość), miej włączone światła, sygnał dźwiękowy pod ręką i trzymaj się z dala od toru wodnego. Na Mazurach mgła najczęściej wcześnie rano — poczekaj, aż się podniesie.',
    photos: [],
  },
  {
    id: 'nimbostratus',
    name: 'Nimbostratus (Ns)',
    latin: 'Nimbostratus — warstwowa deszczowa',
    family: 'Chmury średnie / niskie',
    altitude: 'podstawa 0,5–3 km, bardzo gruba',
    look: 'Gruba, ciemnoszara warstwa bez wyraźnej struktury.',
    weather: 'Ciągły, długotrwały deszcz — typowa dla frontu ciepłego.',
    emoji: '🌧️',
    forms:
      'To ostatni etap nasuwania się frontu ciepłego: warstwa altostratusa gęstnieje i obniża się, aż całkowicie zasłania słońce, a opad staje się ciągły. Chmura potrafi mieć kilka kilometrów grubości.',
    brings:
      'Deszcz lub śnieg padający równo przez wiele godzin, bez wyładowań i bez szkwałów. Wiatr umiarkowany, ale uporczywy; po przejściu frontu skręca (na półkuli północnej zwykle zgodnie z ruchem wskazówek zegara).',
    recognise: [
      'Całkowicie zasłania słońce — nie widać nawet jasnej plamy w miejscu tarczy.',
      'Jednolicie ciemnoszara i „rozmyta” u dołu przez padający deszcz.',
      'Pod nią często dryfują poszarpane strzępy chmur (pannus).',
      'Opad jest równy i ciągły — to odróżnia ją od burzowego cumulonimbusa, który leje krótko i gwałtownie.',
    ],
    sailing:
      'Nie jest groźna gwałtownością, tylko czasem trwania: kilka–kilkanaście godzin deszczu, zimna i słabej widzialności. Zaplanuj zmiany wachty, sztormiaki i ciepłe picie, a przy dłuższym rejsie rozważ przeczekanie w porcie.',
    photos: [],
  },
]
