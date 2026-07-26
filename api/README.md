# ProSail API — konta szkół, kursantów i panel administratora

Backend do platformy ProSail: **Fastify + PostgreSQL + Prisma**, sesje w
ciasteczku `httpOnly` (JWT). Wszystko chodzi w tej samej sieci Dockera co
frontend, więc przeglądarka widzi jeden origin (`/api/...`) — bez CORS.

## Role i zasady

| Rola | Loguje się | Może |
|------|-----------|------|
| **ADMIN** (Ty) | e-mail + hasło | dodawać szkoły, zmieniać ich **miesięczny limit kont**, blokować współpracę, przeglądać zużycie i audyt |
| **SCHOOL** (szkoła) | e-mail + hasło | wydawać kursantom dostępy **w ramach swojego limitu na dany miesiąc**, wycofywać i odnawiać je, widzieć stan puli |
| **STUDENT** (kursant) | **kod dostępu** (bez hasła) | korzystać z materiałów przez **14 dni** (długość ustawia admin per szkoła) |

**Rozliczanie limitu.** Limit jest miesięczny (okres `YYYY-MM`). Każdy wydany
dostęp zajmuje jedno miejsce w puli tego miesiąca. Slot **wraca** do puli tylko
wtedy, gdy szkoła wycofa kod, którego kursant **nigdy nie użył** (literówka przy
wpisywaniu danych nie kosztuje szkoły miejsca). Kod raz aktywowany zużywa
miejsce na stałe.

## Endpointy

### Uwierzytelnianie — `/api/auth`
| Metoda | Ścieżka | Opis |
|---|---|---|
| POST | `/login` | admin/szkoła: `{email, password}` |
| POST | `/access` | kursant: `{code}` — akceptuje kod bez myślników i małymi literami |
| POST | `/logout` | czyści sesję |
| GET | `/me` | kim jestem + stan dostępu (kursant) lub puli (szkoła) |
| POST | `/password` | zmiana własnego hasła: `{current, next}` |

### Panel administratora — `/api/admin` (rola ADMIN)
| Metoda | Ścieżka | Opis |
|---|---|---|
| GET | `/schools?period=YYYY-MM` | szkoły + zużycie limitu i liczba aktywnych kursantów |
| POST | `/schools` | dodanie szkoły **razem z jej kontem logowania** |
| PATCH | `/schools/:id` | zmiana `monthlyQuota`, `accessDays`, `isActive`, danych kontaktowych |
| POST | `/schools/:id/password` | reset hasła konta szkoły |
| GET | `/schools/:id/students` | podgląd kursantów danej szkoły |
| DELETE | `/schools/:id?confirm=true` | trwałe usunięcie (zwykle wystarczy `isActive: false`) |
| GET | `/stats` | podsumowanie platformy |
| GET | `/usage?period=YYYY-MM` | zużycie limitów — do rozliczeń ze szkołami |
| GET | `/audit?limit=100` | historia zmian (kto co zmienił) |

### Panel szkoły — `/api/school` (rola SCHOOL)
| Metoda | Ścieżka | Opis |
|---|---|---|
| GET | `/me` | dane szkoły + `quota: {period, quota, used, remaining}` |
| GET | `/students?status=active\|unused\|expired\|revoked` | lista kursantów ze statusem i `daysLeft` |
| POST | `/students` | nowy dostęp: `{name, email?, days?}` → zwraca **kod dostępu** |
| POST | `/students/batch` | wiele kodów naraz: `{count, prefix?}` (np. dla grupy kursu) |
| PATCH | `/students/:id` | poprawa danych kursanta |
| POST | `/students/:id/revoke` | wycofanie dostępu (zwraca `slotReturned`) |
| POST | `/students/:id/renew` | ponowne wydanie dostępu — zużywa nowy slot |

Przekroczenie limitu zwraca **409** z komunikatem po polsku i aktualnym stanem puli.

## Uruchomienie lokalne (dev)

```bash
cd api
npm install
export DATABASE_URL="postgresql://user:pass@localhost:5432/prosail"
export JWT_SECRET="losowy-ciag-minimum-32-znaki......."
npx prisma db push          # utworzenie tabel
ADMIN_EMAIL=ty@example.com ADMIN_PASSWORD=haslo123 npm run seed
npm run dev                 # http://localhost:4000/api/health
```

## Testy

```bash
npm run test:e2e
```

Test przechodzi cały scenariusz na prawdziwej bazie: logowanie ról, ochronę
tras, wydawanie kodów **do wyczerpania limitu**, zwrot nieużytego slotu,
wygaśnięcie po 14 dniach, blokadę szkoły, wydawanie partiami, odnowienie oraz
**izolację danych między szkołami** (51 asercji).

## Bezpieczeństwo — co jest zrobione

- hasła: **bcrypt** (12 rund); ten sam komunikat dla złego e-maila i hasła,
- sesja: JWT w ciasteczku **httpOnly**, `sameSite=lax`, `secure` w produkcji,
- **rate limiting** na logowaniu (10 próbek / 5 min) i kodach (20 / 5 min),
- walidacja wejścia **zod** na każdym endpointcie,
- limity sprawdzane **w transakcji** (dwa równoległe żądania nie przekroczą puli),
- każda szkoła widzi **wyłącznie swoje** dane (sprawdzane po `schoolId` z sesji),
- **audyt** działań administratora.

## Czego jeszcze nie ma (świadome decyzje)

- **Wysyłka e-maili** — kody dostępu szkoła przekazuje kursantom sama (lista/wydruk).
  Dodanie SMTP to dołożenie jednego serwisu i szablonu.
- **Płatności/faktury** — rozliczenia są poza systemem; `/api/admin/usage` daje
  dane do faktury za dany miesiąc.
- **Twarda ochrona treści** — frontend to statyczna aplikacja: sesja chroni
  *widok*, ale plik JS z materiałami jest publiczny. Jeśli treść ma być
  naprawdę zamknięta, kolejnym krokiem jest przeniesienie materiałów do API
  (endpoint `/api/content/...` sprawdzający sesję) albo `auth_request` w nginx.
