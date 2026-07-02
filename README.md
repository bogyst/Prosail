# ⚓ ProSail — interaktywna platforma do nauki żeglarstwa

Nowoczesna, w pełni interaktywna aplikacja webowa do nauki żeglarstwa,
w motywie żeglarskim. Pięć modułów, między którymi przełączasz się w menu:

| Moduł | Co zawiera |
|-------|------------|
| **Teoria żeglowania** | Symulator trymu żagli — zmieniasz kierunek wiatru i kurs jachtu, żagle same ustawiają się optymalnie, a strzałki pokazują siły (ciąg, przechył, opór kilu, wiatr pozorny). Klikalne objaśnienia teorii. |
| **Locja** | Interaktywna galeria oznakowania IALA (region A): znaki boczne, kardynalne, izolowanego niebezpieczeństwa, bezpiecznej wody i specjalne — z opisem, sposobem mijania i charakterystyką światła. |
| **Meteorologia** | Interaktywna skala Beauforta (0–12) z animacją fal i flagi oraz przewodnik po rodzajach chmur i ich znaczeniu dla pogody. |
| **Budowa jachtu** | Klikalny przekrój slupa — nazwy części kadłuba, takielunku, żagli i osprzętu. |
| **Przepisy** | Prawo drogi z interaktywnymi scenariuszami (kto ustępuje, kto utrzymuje kurs), kierunkiem wiatru i światłami nawigacyjnymi. |
| **Węzły** | Sześć podstawowych węzłów żeglarskich — ilustracje, zastosowanie i wiązanie krok po kroku. |
| **Quiz** | Interaktywny sprawdzian ze wszystkich działów, z natychmiastowym wyjaśnieniem i wynikiem. |

## 🧱 Stack technologiczny

- **React 18 + TypeScript + Vite** — szybki, nowoczesny frontend.
- **Tailwind CSS** — spójny motyw żeglarski (głęboki granat, morska zieleń, lina).
- **Framer Motion** — płynne animacje.
- **SVG** — cała interaktywna grafika (jacht, żagle, pławy, siły) rysowana wektorowo, więc jest ostra na każdym ekranie.
- **Brak backendu** — treść jest statyczna, więc hosting jest tani, szybki i odporny.

Efekt buildu to zwykłe pliki statyczne (`dist/`), które serwuje lekki **nginx**
w kontenerze. Przed nim opcjonalnie stoi **Caddy**, który sam wystawia i odnawia
certyfikat **HTTPS (Let's Encrypt)**.

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

### 3a. Szybki start — tylko HTTP (test, port 8080)

```bash
docker compose up -d --build web
```

Strona będzie dostępna pod `http://ADRES_IP_SERWERA:8080`.

### 3b. Produkcja — z automatycznym HTTPS i własną domeną

Warunek: rekord **A** (i ewentualnie **AAAA**) Twojej domeny musi wskazywać na
publiczne IP VPS-a, a porty **80** i **443** muszą być otwarte.

```bash
cp .env.example .env
nano .env          # wpisz swoją DOMENĘ i EMAIL
```

```env
DOMAIN=twojadomena.pl
EMAIL=twoj-email@example.com
```

Uruchom aplikację razem z reverse proxy Caddy (profil `tls`):

```bash
docker compose --profile tls up -d --build
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
docker compose down -v            # zatrzymanie + usunięcie wolumenów (certyfikaty!)
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
│   │   └── sail/SailSimulator.tsx   # symulator trymu żagli
│   ├── lib/sailing.ts      # model fizyki żeglowania (kursy, trym, siły)
│   └── pages/              # Teoria, Locja, Meteorologia, Budowa, Przepisy
└── ...
```

---

## 📚 Uwaga merytoryczna

Model fizyki w symulatorze jest **uproszczony i poglądowy** — służy do
zrozumienia zależności między wiatrem, kursem i trymem, a nie do dokładnych
obliczeń. Treści przepisowe mają charakter edukacyjny; przed rejsem korzystaj
z aktualnych przepisów (COLREG oraz lokalnych zarządzeń dla akwenu).
