# Specyfikacja Modułu Autentykacji w HealthyMeal

## 1. Wprowadzenie

Ten dokument przedstawia szczegółową architekturę modułu autentykacji aplikacji HealthyMeal, obejmującą rejestrację (US-001), logowanie (US-002) oraz wylogowywanie (US-003) użytkowników. Architektura została zaprojektowana z wykorzystaniem Astro, React, TypeScript, Tailwind, Shadcn/ui oraz integracji z Supabase Auth.

## 2. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### 2.1 Struktura stron i layoutów

- **Strony autoryzacyjne (Auth Pages):**
  - `/src/pages/auth/register.astro` – Strona rejestracji, zawierająca formularz rejestracji oparty na komponentach React (np. `RegisterForm`).
  - `/src/pages/auth/login.astro` – Strona logowania, integrująca komponent `LoginForm`.
  - `/src/pages/auth/recovery.astro` – Strona odzyskiwania hasła, zawierająca komponent `PasswordRecoveryForm` (planowana do wdrożenia na przyszłość).

- **Layout:**
  - `AuthLayout.astro` – Dedykowany layout dla stron autentykacyjnych, zawierający spójny design, nagłówek i stopkę oraz elementy umożliwiające łatwą nawigację między stronami rejestracji, logowania i ewentualnie odzyskiwania hasła.
  - Strony poza strefą autoryzacji (np. dashboard, profil) korzystają z odrębnych layoutów, które uwzględniają stan uwierzytelnienia użytkownika.
- **Strona główna (Landing Page):**
  - Powinna zawierać widoczny przycisk/link umożliwiający nawigację do stron logowania i rejestracji.

### 2.2 Komponenty Client-Side React

- **Formularze:**
  - `RegisterForm` – Komponent odpowiedzialny za zbieranie danych rejestracyjnych (username, email, hasło, potwierdzenie hasła). Realizuje walidację po stronie klienta (sprawdzenie formatu email, minimalnej długości hasła, zgodności hasła i potwierdzenia).
  - `LoginForm` – Komponent umożliwiający logowanie; waliduje wprowadzone dane (email i hasło) oraz obsługuje komunikaty błędów.
  - `PasswordRecoveryForm` – Komponent przeznaczony do obsługi procesu odzyskiwania hasła (np. wysyłka linku resetującego).

- **Elementy UI:**
  - Wspólne komponenty, takie jak `Input`, `Button` i `Alert`, oparte na bibliotece Shadcn/ui, służące do budowy formularzy i wyświetlania komunikatów błędów oraz powiadomień o powodzeniu akcji.

- **Integracja:**
  - Komponenty React są dynamicznie ładowane w stronach Astro, co umożliwia płynne przejście między interakcjami client-side a renderowaniem server-side.
  - Zdarzenia (np. przesłanie formularza) wiążą się bezpośrednio z wywołaniami API (np. Supabase) w celu autentykacji, rejestracji lub resetowania hasła.

### 2.3 Scenariusze użytkownika i walidacja

- **Rejestracja (US-001):**
  - Formularz rejestracyjny sprawdza poprawność formatu email oraz minimalną długość hasła (co najmniej 8 znaków).
  - Walidacja obejmuje także zgodność hasła z potwierdzeniem.
  - W przypadku błędów użytkownik otrzymuje czytelne komunikaty o błędach, a formularz zapobiega przesłaniu nieprawidłowych danych.
  - Po udanej rejestracji następuje przekierowanie do strony logowania z komunikatem o pomyślnej rejestracji.

- **Logowanie (US-002):**
  - Formularz logowania weryfikuje poprawność wprowadzonych danych.
  - W przypadku błędnych danych wyświetlany jest komunikat błędu, a użytkownik pozostaje na stronie logowania.
  - Po poprawnym logowaniu następuje przekierowanie do chronionego dashboardu.

- **Wylogowanie (US-003):**
  - Opcja wylogowania dostępna jest w menu użytkownika.
  - Po wylogowaniu następuje usunięcie sesji oraz przekierowanie do strony logowania, co zabezpiecza konto przed nieautoryzowanym dostępem.

## 3. LOGIKA BACKENDOWA

### 3.1 Struktura endpointów API

- **POST /api/users/register:**
  - Endpoint służący do rejestracji nowego użytkownika. Przyjmuje dane: email, username, hasło oraz potwierdzenie hasła.
  - Walidacja obejmuje sprawdzenie poprawności formatu email, zgodności hasła i potwierdzenia oraz unikalności emaila.

- **POST /api/auth/login:**
  - Endpoint odpowiedzialny za logowanie użytkownika. Przyjmuje dane: email i hasło.
  - W przypadku sukcesu, zwraca token JWT oraz dane użytkownika, umożliwiając rozpoczęcie sesji.

- **POST /api/auth/logout:**
  - Endpoint wylogowywania, który unieważnia bieżącą sesję użytkownika i usuwa token.

- **(W przyszłości) POST /api/auth/password-recovery:**
  - Endpoint inicjujący proces odzyskiwania hasła poprzez wysłanie linku resetującego na podany adres email.

### 3.2 Modele danych i walidacja

- **Model User:**
  - Zawiera pola takie jak: id, email, username, hashed_password, created_at, updated_at.

- **Walidacja:**
  - Dane wejściowe są walidowane na poziomie API przy użyciu bibliotek takich jak Zod lub Joi, co gwarantuje zgodność danych z przyjętymi kontraktami.

- **Obsługa wyjątków:**
  - Wykorzystywane są mechanizmy try-catch do przechwytywania błędów, które następnie zwracane są z odpowiednimi statusami HTTP i komunikatami, ułatwiającymi diagnostykę problemów.

### 3.3 Renderowanie stron server-side z Astro

- Astro wykorzystuje server-side rendering (SSR), co umożliwia bezpośrednią integrację z Supabase podczas renderowania stron.
- Middleware sprawdzające sesję użytkownika zabezpieczają strony chronione, zapewniając że tylko uwierzytelnieni użytkownicy mają do nich dostęp.
- Strony autoryzacyjne (np. logowania, rejestracji) są renderowane z odpowiednimi danymi i komunikatami zwrotnymi wynikającymi z działań użytkownika.

## 4. SYSTEM AUTENTYKACJI

### 4.1 Integracja z Supabase Auth

- **Rejestracja:**
  - Wykorzystanie metody `supabase.auth.signUp` do tworzenia nowych użytkowników.
  - Po rejestracji wysyłane jest potwierdzenie na adres email użytkownika, zgodnie z mechanizmem weryfikacji Supabase.

- **Logowanie:**
  - Użycie metody `supabase.auth.signIn` umożliwiającej uwierzytelnienie użytkownika na podstawie wprowadzonych danych (email i hasło).
  - W przypadku poprawnego logowania, token JWT jest zwracany i przechowywany (np. w httpOnly cookies), co umożliwia dostęp do chronionych zasobów.

- **Wylogowanie:**
  - Realizowane za pomocą `supabase.auth.signOut`, co skutkuje usunięciem tokenu sesji i dezautoryzacją użytkownika.

- **Odzyskiwanie hasła:**
  - Mechanizm wysyłki emaila resetującego hasło, gdzie użytkownik otrzymuje link przekierowujący do formularza zmiany hasła.
  - Proces ten może być obsłużony przez dedykowany endpoint (np. POST /api/auth/password-recovery) integrujący się z Supabase.

### 4.2 Bezpieczeństwo i zarządzanie sesją

- Cała komunikacja odbywa się przez HTTPS, co chroni dane przesyłane między klientem a serwerem.
- Tokeny JWT oraz sesje są zabezpieczone przed atakami CSRF oraz innymi typowymi zagrożeniami.
- Supabase Auth wraz z mechanizmami Row Level Security (RLS) zapewnia, że użytkownicy mają dostęp jedynie do swoich danych.

## 5. PODSUMOWANIE

- Nowa architektura modułu autentykacji rozdziela warstwę front-endową (Astro + React) od logiki backendowej, co umożliwia elastyczne i bezpieczne przetwarzanie danych.
- Komponenty interfejsu użytkownika, takie jak formularze rejestracji, logowania oraz odzyskiwania hasła, są w pełni modularne i łatwo rozbudowywalne.
- System opiera się na Supabase Auth, co gwarantuje szybkie wdrożenie funkcjonalności oraz wysoki poziom bezpieczeństwa.
- Mechanizmy walidacji i obsługi wyjątków, zarówno po stronie client-side jak i backendu, zapewniają niezawodność działania aplikacji HealthyMeal. 