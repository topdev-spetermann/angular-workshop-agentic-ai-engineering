## Tech-Stack, Abhängigkeiten und Architektur

Diese Datei fasst den technischen Stack, die wichtigsten Abhängigkeiten und die Architektur des Projekts zusammen.

### Tech-Stack
- **Framework**: Angular 20 (Standalone-Komponenten, `bootstrapApplication`, `provideRouter`)
- **Programmiersprache**: TypeScript 5.9 (strict mode)
- **Build- & CLI**: `@angular/cli` und `@angular/build` (Application Builder)
- **Styling**: Tailwind CSS 4 (globale Einbindung über `src/styles.css`), Angular Material (Theming via `src/material-theme.scss`)
- **HTTP**: `HttpClient` (bereitgestellt via `provideHttpClient`)
- **Routing**: Angular Router (Standalone-Routen in `src/app/app.routes.ts`)
- **SSR**: `@angular/ssr` ist vorhanden, aber nicht konfiguriert/verwendet
- **Testing**: Playwright ist eingerichtet (`@playwright/test`), Karma/Jasmine-Konfiguration ist in `angular.json` referenziert
- **Tooling**: Prettier Format-Task vorhanden

### Wichtige Abhängigkeiten (Auszug)
- `@angular/*` 20.2.x (Core, Common, Router, Animations, Forms, CDK, Material, Platform-Browser/-Server)
- `@angular-architects/ngrx-toolkit` 20.x (vorhanden, im Code aktuell nicht genutzt)
- `@ngrx/signals` 20.x (vorhanden, im Code aktuell nicht genutzt)
- `@tanstack/angular-query-experimental` 5.x (vorhanden, im Code aktuell nicht genutzt)
- `rxjs` 7.8, `zone.js` 0.15, `tslib` 2.3
- Dev: `@angular/cli`, `@angular/build`, `@angular/compiler-cli`, `typescript`, `prettier`, `tailwindcss`, `@tailwindcss/postcss`, `@playwright/test`

### Projektstruktur (Auszug)
- `src/main.ts`: Bootstrap mit `bootstrapApplication(App, appConfig)`
- `src/app/app.ts`: Root-Komponente (Standalone) inkl. `RouterOutlet`
- `src/app/app.config.ts`: `provideRouter`, `provideHttpClient`, `provideAnimations`, Zone-Optimierungen, Error Listener
- `src/app/app.routes.ts`: Routen-Definition (Startseite → `BookListComponent`)
- `src/app/books/*`: Feature „Books“ (Liste, Item, API-Client, Typen)
- `src/app/shared/toast.service.ts`: Wrapper um `MatSnackBar`
- `src/styles.css`: Tailwind 4 via `@import 'tailwindcss'`
- `src/material-theme.scss`: Angular Material Theme Overrides

### Architektur
- **Standalone-Architektur**: Komponenten und Routen sind Standalone, kein klassisches NgModule benötigt.
- **Konfiguration über Provider**: App-weite Services werden in `app.config.ts` bereitgestellt (Router, HttpClient, Animations, Error Listener, Zone-Optimierungen).
- **Routing**: Einfache Routenstruktur – die leere Route zeigt auf die Buchliste, Fallback (`**`) leitet auf die Startseite um.
- **Datenfluss**: `BookListComponent` lädt Daten via `BookApiClient` (HTTP GET auf `http://localhost:4730/books`) mit optionalem Suchbegriff und Limit.
- **Präsentation**: `BookItemComponent` rendert einzelne Bücher. UI-Styling über Tailwind; Angular Material wird für Snackbars vorbereitet.
- **State-Management**: Kein globales State-Management im Einsatz. Abhängigkeiten für NgRx Signals und Angular Query sind vorbereitet, aber noch ungenutzt.
- **Fehler-Handling**: Globaler Error Listener aktiviert; API-Fehler werden aktuell lokal in der Komponente geloggt.

### Entwicklung & Build
- **Start**: `npm start` → Dev-Server über Angular CLI
- **Build**: `npm run build` → Production-Build (Budgets in `angular.json` definiert)
- **Formatierung**: `npm run format.write` → Prettier auf `src/**/*.{ts,html,md,css,json}`

### API
- **Lokale API**: Bookmonkey API (`http://localhost:4730`)
- **Start**: `npx bookmonkey-api`
- **Nutzung**: `BookApiClient` ruft `GET /books` mit Parametern `_limit` und optional `q` (Suche in Titel/Autor) auf.

### Hinweise / Ausbau-Ideen
- Aktivierung von SSR (`@angular/ssr`) für serverseitiges Rendering
- Einsatz von Angular Query oder NgRx Signals für Caching/State
- Zentrales Error- und Toast-Handling via Interceptor
- E2E-Tests mit Playwright aufsetzen/erweitern



