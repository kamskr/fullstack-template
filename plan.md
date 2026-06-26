# Full-stack Template (2026)

## Cel

Minimalny, skalowalny template pod aplikacje mobilne i webowe. Jeden backend, jeden kontrakt API, minimum współdzielenia kodu.

---

# Stack

## Monorepo

- pnpm Workspaces
- Turborepo

## Backend

- NestJS
- Drizzle ORM
- PostgreSQL
- Better Auth
- OpenAPI (source of truth)

## Mobile

- Expo
- React Native
- TanStack Query
- Zustand (UI state)

## Web

- TanStack Start _(preferowane)_
  - lub Next.js, jeśli projekt jest mocno nastawiony na SEO/content

## API

- OpenAPI Generator
- Wygenerowany TypeScript client współdzielony pomiędzy web i mobile

## Monitoring

- Sentry

## Analytics

- PostHog

## CI/CD

- GitHub Actions

---

# Struktura repo

```text
apps/
  api/
  mobile/
  web/

packages/
  api-client/
  config/

package.json
pnpm-workspace.yaml
turbo.json
tsconfig.base.json
```

---

# Co współdzielić

## ✅ `packages/api-client`

Jedyny obowiązkowy współdzielony pakiet.

```
NestJS
   ↓
OpenAPI
   ↓
Generated TS Client
   ↓
Mobile + Web
```

Zawiera:

- wygenerowane modele
- wygenerowanych klientów API
- cienką warstwę helperów (opcjonalnie)

Dzięki temu oba frontendy korzystają z identycznego API.

---

## ✅ `packages/config`

Wspólna konfiguracja:

- tsconfig
- Biome _(lub ESLint + Prettier)_
- Husky
- lint-staged

---

## ❌ Nie współdzielić na starcie

Nie tworzyć od razu:

- `shared`
- `common`
- `core`
- `utils`
- `ui`

Jeżeli po kilku miesiącach okaże się, że coś naprawdę jest współdzielone — wtedy wydzielić osobny package.

---

# Organizacja feature'ów

Każda aplikacja ma identyczny układ katalogów.

```
features/
  babies/
    api.ts
    queries.ts
    mutations.ts
    hooks.ts
    components/
    screens/
```

Implementacja może być inna na mobile i web, ale struktura pozostaje taka sama.

---

# Przepływ danych

```
NestJS
    ↓
OpenAPI
    ↓
Generated Client
    ↓
TanStack Query
    ↓
React Native / Web
```

Backend jest jedynym źródłem prawdy.

---

# State Management

## Server state

- TanStack Query

## UI state

- Zustand

Nie kopiować danych z API do Zustand.

---

# Routing

## Mobile

- Expo Router

## Web

- TanStack Router (TanStack Start)

Nie współdzielić routingu pomiędzy platformami.

---

# Dlaczego TanStack Start?

Dla tego stacku:

- osobny backend
- OpenAPI
- React Native
- TanStack Query

TanStack Start jest bardziej naturalny niż Next.js, ponieważ nie narzuca własnego backendu ani Server Actions.

Next.js wybrałbym tylko wtedy, gdy:

- web jest głównym produktem,
- SEO i content są kluczowe,
- chcę maksymalnie wykorzystać ekosystem Next.js.

---

# Monorepo Philosophy

## Współdzielamy

- kontrakty API
- konfigurację
- konwencje
- generated client

## Nie współdzielamy

- UI
- store'ów
- hooków
- routingu
- logiki platformowej

---

# Zasady

> **Share contracts, not implementation.**

> **Backend is the source of truth.**

> **Keep shared packages small and intentional.**

> **Duplicate small things before abstracting them.**

> **Optimize for developer experience, not maximum code reuse.**

---

# Długoterminowy cel

Każdy nowy projekt powinien dać się uruchomić w kilka minut:

- `pnpm create my-stack`
- uruchomienie NestJS
- wygenerowanie klienta OpenAPI
- start aplikacji mobilnej
- start aplikacji webowej

Bez dodatkowej konfiguracji i bez zastanawiania się, gdzie umieścić nowy kod.
