# ⚓ ProSail — interaktywna platforma do nauki żeglarstwa

Nowoczesna, w pełni interaktywna aplikacja webowa do nauki żeglarstwa,
w motywie żeglarskim. Pięć modułów, między którymi przełączasz się w menu:

| Moduł | Co zawiera |
|-------|------------|
| **Teoria żeglowania** | Symulator trymu żagli — zmieniasz kierunek wiatru i kurs jachtu, żagle same ustawiają się optymalnie, a strzałki pokazują siły (ciąg, przechył, opór kilu, wiatr pozorny). Klikalne objaśnienia teorii. |
| **Locja** | Galeria oznakowania IALA (region A) oraz interaktywna mapa akwenu: szlak, mielizna otoczona znakami kardynalnymi (N/E/S/W), izolowane niebezpieczeństwo na skale, wejście do portu i wieża sygnalizacji sztormowej (Mazury: 0/40/90 błysków). |
| **Meteorologia** | Interaktywna skala Beauforta (0–12) z animacją fal i flagi oraz przewodnik po chmurach: kliknięcie kafelka otwiera okno ze szczegółami (wysokość, powstawanie, prognoza, rozpoznawanie, wskazówki dla żeglarza) i przewijaną galerią zdjęć. |
| **Budowa jachtu** | Schemat slupa z podzakładkami „Ożaglowanie", „Olinowanie ruchome", „Elementy stałe", „Silnik" (zaburtowy, w orientacji jak na jachcie), „Knagi i kluzy" (osprzęt pokładowy + knagowanie ósemką krok po kroku), „Światła" i „Widok z góry" (cumowanie burtą: cumy/szpringi/bresty z animacją „czemu zapobiega"). Przycisk **„Sprawdź wiedzę o budowie jachtu"** uruchamia sprawdzian, w którym trzeba kliknąć wskazaną część na rysunku. |
| **Przepisy** | Zakładki: „Prawo drogi" (interaktywne scenariusze), „Znaki ruchu wodnego" (podział na kategorie A–E i tabliczki uzupełniające, z filtrem i opisem wyglądu każdej grupy), „Sygnały" (dźwiękowe oraz znaki dzienne) i „Patenty". |
| **Węzły** | Sześć węzłów z wizualnym wiązaniem krok po kroku (nawigacja między krokami), opisem i zastosowaniem. |
| **Quiz** | Wybór działu lub tryb Mix (10/30/50/75 pytań); podsumowanie z wynikiem ogólnym i procentowym per dział. |
| **Ratownictwo** | Numery alarmowe (Mazury), pierwsza pomoc i interaktywny (krokowy) manewr „człowiek za burtą". |
| **Glosariusz** | Słownik żeglarski z wyszukiwarką, filtrem działów i sortowaniem. |
| **Poradnik** | Interaktywna checklista pakowania na rejs + dobre nawyki i etykieta. |

## 🧱 Stack technologiczny

- **React 18 + TypeScript + Vite** — szybki, nowoczesny frontend.
- **Tailwind CSS** — spójny motyw żeglarski (głęboki granat, morska zieleń, lina).
- **Framer Motion** — płynne animacje.
- **SVG** — cała interaktywna grafika (jacht, żagle, pławy, siły) rysowana wektorowo, więc jest ostra na każdym ekranie.
- **Backend (`api/`)** — **Fastify + PostgreSQL + Prisma**: konta szkół, kursantów
  i panel administratora. Sesje w ciasteczku `httpOnly` (JWT). Szczegóły i lista
  endpointów: [`api/README.md`](api/README.md).

Frontend to statyczne pliki (`dist/`) serwowane przez **nginx**, który dodatkowo
przekazuje `/api/...` do usługi API (ten sam origin, bez CORS). Przed wszystkim
opcjonalnie stoi **Caddy** z automatycznym **HTTPS (Let's Encrypt)**.

## 👥 Konta: szkoły, kursanci, administrator

| Rola | Logowanie | Uprawnienia |
|------|-----------|-------------|
| **Administrator** | e-mail + hasło | dodaje szkoły, ustawia im **miesięczny limit kont kursantów**, blokuje współpracę, widzi zużycie i audyt |
| **Szkoła** | e-mail + hasło | wydaje kursantom dostępy **w ramach limitu na dany miesiąc**, wycofuje i odnawia je, widzi stan puli |
| **Kursant** | **kod dostępu** (bez hasła) | korzysta z materiałów przez **14 dni** (długość ustala administrator) |

Limit rozliczany jest miesięcznie. Slot wraca do puli tylko wtedy, gdy szkoła
wycofa kod, którego kursant nigdy nie użył.

---

## 🚀 Uruchomienie lokalne (dev)

```bash
npm install
npm run dev        # http://localhost:5173
```

Build produkcyjny i podgląd:

```bash
npm run build      # tworzy katalog dist/
npm run preview    # podgląd builda na http://localhost:4173
```

---

## 🐳 Wdrożenie na VPS (Ubuntu) — krok po kroku

### 1. Zainstaluj Dockera na serwerze

```bash
sudo apt update
sudo apt install -y ca-certificates curl git
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER      # przeloguj się po tym poleceniu
```

Docker Compose jest już częścią Dockera (`docker compose ...`).

### 2. Pobierz kod na serwer

```bash
git clone <URL_TWOJEGO_REPO> prosail
cd prosail
```

### 3. Uzupełnij `.env` (hasła i sekrety)

```bash
cp .env.example .env
nano .env     # POSTGRES_PASSWORD, JWT_SECRET (min. 32 znaki), ADMIN_EMAIL/PASSWORD
```

### 3a. Szybki start — tylko HTTP (test, port 8080)

```bash
docker compose up -d --build          # baza + api + frontend
docker compose exec api npx tsx scripts/seed.ts   # pierwszy administrator
```

Strona będzie dostępna pod `http://ADRES_IP_SERWERA:8080`,
a API pod `http://ADRES_IP_SERWERA:8080/api/health`.

### 3b. Produkcja — z automatycznym HTTPS i własną domeną

Warunek: rekord **A** (i ewentualnie **AAAA**) Twojej domeny musi wskazywać na
publiczne IP VPS-a, a porty **80** i **443** muszą być otwarte.

W `.env` ustaw dodatkowo:

```env
DOMAIN=twojadomena.pl
EMAIL=twoj-email@example.com
COOKIE_SECURE=true      # sesja tylko po HTTPS
```

Uruchom wszystko razem z reverse proxy Caddy (profil `tls`):

```bash
docker compose --profile tls up -d --build
docker compose exec api npx tsx scripts/seed.ts   # pierwszy administrator
```

Caddy automatycznie pobierze certyfikat Let's Encrypt. Po chwili strona działa
pod `https://twojadomena.pl` (z automatycznym przekierowaniem z HTTP i odnawianiem
certyfikatu).

> **Uwaga:** przy profilu `tls` to Caddy zajmuje porty 80/443. Publiczne
> wystawianie portu 8080 przez usługę `web` nie jest wtedy potrzebne — możesz
> je zamknąć w firewallu (`ufw`).

### 4. Firewall (zalecane)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

---

## 🔄 Aktualizacja aplikacji

```bash
cd prosail
git pull
docker compose --profile tls up -d --build   # lub: up -d --build web (dla HTTP)
```

Stare obrazy można sprzątnąć: `docker image prune -f`.

## 🛠️ Przydatne komendy

```bash
docker compose ps                 # status kontenerów
docker compose logs -f web        # logi aplikacji
docker compose logs -f caddy      # logi TLS/proxy
docker compose down               # zatrzymanie
docker compose down -v            # zatrzymanie + usunięcie wolumenów (BAZA I CERTYFIKATY!)
docker compose logs -f api        # logi API
docker compose exec api npx tsx scripts/seed.ts        # utwórz/zmień hasło admina
docker compose exec db pg_dump -U prosail prosail > backup-$(date +%F).sql   # kopia bazy
```

### Kopie zapasowe bazy (zalecane)

```bash
# codziennie o 3:00 — dopisz do crontab -e
0 3 * * * cd /root/prosail && docker compose exec -T db pg_dump -U prosail prosail | gzip > /root/backups/prosail-$(date +\%F).sql.gz
```

---

## 📁 Struktura projektu

```
prosail/
├── Dockerfile              # build (Node) → serwowanie (nginx), multi-stage
├── docker-compose.yml      # usługi: web (nginx) + caddy (HTTPS, profil "tls")
├── nginx.conf              # SPA fallback, gzip, cache, nagłówki bezpieczeństwa
├── Caddyfile               # automatyczny Let's Encrypt
├── .env.example            # DOMAIN / EMAIL dla HTTPS
├── index.html
├── src/
│   ├── App.tsx             # routing między modułami
│   ├── components/
│   │   ├── Layout.tsx      # nawigacja / motyw
│   │   ├── ui.tsx          # klikalne pojęcia, akordeony, paski sił
│   │   ├── Buoy.tsx        # generator pław IALA w SVG
│   │   ├── YachtDiagram.tsx     # wspólny rysunek jachtu (schemat + sprawdzian)
│   │   ├── BudowaQuiz.tsx       # sprawdzian „kliknij część na rysunku"
│   │   ├── DeckTopView.tsx      # cumowanie burtą: cumy / szpringi / bresty
│   │   ├── EngineView.tsx       # silnik zaburtowy
│   │   ├── Fittings.tsx         # knagi, kluzy, półkluzy, pachołki
│   │   └── sail/SailSimulator.tsx   # symulator trymu żagli
│   ├── data/clouds.ts      # opisy i galerie zdjęć chmur (edytowane ręcznie)
│   ├── lib/sailing.ts      # model fizyki żeglowania (kursy, trym, siły)
│   └── pages/              # Teoria, Locja, Meteorologia, Budowa, Przepisy, …
├── api/                    # backend: konta szkół i kursantów
│   ├── prisma/schema.prisma    # model danych (User, School, Enrollment, AuditLog)
│   ├── src/routes/             # auth, admin, school
│   ├── src/lib/period.ts       # limity miesięczne i ważność dostępu
│   ├── scripts/seed.ts         # pierwszy administrator
│   ├── scripts/e2e.ts          # test całego przepływu (51 asercji)
│   └── README.md               # pełna dokumentacja API
└── ...
```

---

## 🖼️ Podmiana rysunków na własne obrazki

Każdą ilustrację (znaki żeglugowe, pławy, kroki węzłów, pytania quizu) można
zastąpić plikiem **WEBP** — wystarczy wrzucić go do `public/` i dopisać jedno
pole `img` w danych. Rysunek SVG zostaje jako zapas. Instrukcja z przykładami:
[`docs/OBRAZKI.md`](docs/OBRAZKI.md).

## 📚 Uwaga merytoryczna

Model fizyki w symulatorze jest **uproszczony i poglądowy** — służy do
zrozumienia zależności między wiatrem, kursem i trymem, a nie do dokładnych
obliczeń. Treści przepisowe mają charakter edukacyjny; przed rejsem korzystaj
z aktualnych przepisów (COLREG oraz lokalnych zarządzeń dla akwenu).
