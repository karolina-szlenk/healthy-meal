# API Endpoint Implementation Plan: Preferences Endpoint

## 1. Przegląd punktu końcowego
Endpoint API odpowiedzialny za zarządzanie preferencjami żywieniowymi użytkownika. Umożliwia pobieranie (GET), tworzenie (POST) oraz aktualizację (PUT) konfiguracji preferencji użytkownika. Punkt końcowy korzysta z polityk RLS w Supabase oraz mechanizmów autoryzacji, aby zapewnić, że użytkownik operuje tylko na swoich danych.

## 2. Szczegóły żądania

### 2.1. GET /api/preferences
- **Metoda HTTP**: GET
- **Struktura URL**: /api/preferences
- **Parametry**: Brak parametrów w URL lub ciele żądania
- **Nagłówki**: Wymagany nagłówek Authorization (Bearer token)

### 2.2. POST /api/preferences
- **Metoda HTTP**: POST
- **Struktura URL**: /api/preferences
- **Parametry**:
  - **Wymagane**:
    - `diet_type`: Enum ('VEGETARIAN', 'KETOGENIC', 'PESCATARIAN')
    - `calorie_target`: number
  - **Opcjonalne**:
    - `allergies`: JSON (dowolna struktura)
    - `excluded_ingredients`: JSON (dowolna struktura)
- **Body**: JSON zawierający powyższe pola
- **Nagłówki**: Wymagany nagłówek Authorization

### 2.3. PUT /api/preferences
- **Metoda HTTP**: PUT
- **Struktura URL**: /api/preferences
- **Parametry**: Body JSON zawierający dowolne z pól:
  - `diet_type`
  - `calorie_target`
  - `allergies`
  - `excluded_ingredients`
- **Nagłówki**: Wymagany nagłówek Authorization

## 3. Wykorzystywane typy
- **DTO**: `PreferencesDTO` – reprezentuje preferencje użytkownika (user_id, diet_type, allergies, excluded_ingredients, calorie_target).
- **Command Models**:
  - `CreatePreferencesCommand` – do tworzenia preferencji, wymaga `diet_type` i `calorie_target`, opcjonalnie `allergies` oraz `excluded_ingredients`.
  - `UpdatePreferencesCommand` – umożliwia częściową aktualizację preferencji, bazuje na `CreatePreferencesCommand`.

## 4. Szczegóły odpowiedzi
- **GET /api/preferences**:
  - Sukces: 200 OK, zwraca obiekt zgodny z `PreferencesDTO`.
  - Błędy: 401 Unauthorized (brak/wadliwy token), 404 Not Found (preferencje nie istnieją, opcjonalnie).

- **POST /api/preferences**:
  - Sukces: 201 Created, zwraca utworzony obiekt `PreferencesDTO`.
  - Błędy: 400 Bad Request (niepoprawne dane wejściowe), 401 Unauthorized.

- **PUT /api/preferences**:
  - Sukces: 200 OK, zwraca zaktualizowany obiekt `PreferencesDTO`.
  - Błędy: 400 Bad Request (niepoprawne dane wejściowe), 401 Unauthorized.

## 5. Przepływ danych
1. Klient wysyła żądanie do endpointu /api/preferences przy użyciu odpowiedniej metody (GET, POST lub PUT) wraz z nagłówkiem Authorization.
2. Middleware (np. Supabase autoryzacja) weryfikuje token i wstrzykuje obiekt SupabaseClient do `context.locals`.
3. Handler endpointu:
   - Dla GET: wywołuje funkcję serwisową, która pobiera z bazy rekord preferencji dla danego użytkownika.
   - Dla POST: walidacja danych wejściowych przy użyciu Zod schema na podstawie `CreatePreferencesCommand`, a następnie funkcja serwisowa tworzy rekord w tabeli `preferences`.
   - Dla PUT: walidacja danych wejściowych przy użyciu Zod schema na podstawie `UpdatePreferencesCommand`, a następnie funkcja serwisowa aktualizuje istniejący rekord.
4. Wynik operacji jest zwracany jako odpowiedź JSON zgodna z modelem `PreferencesDTO`.

## 6. Względy bezpieczeństwa
- **Uwierzytelnianie**: Wymagany token JWT w nagłówku Authorization; weryfikacja przez middleware.
- **Autoryzacja**: Zastosowanie polityk RLS w Supabase, które gwarantują, że użytkownik operuje tylko na swoich danych.
- **Walidacja danych**: Użycie Zod do walidacji danych wejściowych, aby zapobiec atakom typu injection czy wysłaniu nieprawidłowych danych.
- **Bezpieczeństwo danych**: Wszystkie operacje na bazie danych odbywają się poprzez bezpieczne metody SupabaseClient, a wrażliwe dane są chronione.

## 7. Obsługa błędów
- **400 Bad Request**: Zwrot informacji o błędach walidacji danych wejściowych.
- **401 Unauthorized**: Zwrot komunikatu o braku lub wadliwym tokenie autoryzacyjnym.
- **404 Not Found**: Opcjonalnie dla GET, gdy preferencje nie zostaną znalezione.
- **500 Internal Server Error**: Obsługa nieprzewidzianych wyjątków, logowanie błędów oraz zwrot standardowej odpowiedzi serwera.

## 8. Rozważania dotyczące wydajności
- Operacje dotyczą jednego rekordu preferencji na użytkownika, co minimalizuje obciążenie bazy danych.
- Użycie indeksów na kolumnach kluczy obcych (np. user_id) zapewnia optymalizację zapytań.
- Dla MVP nie jest konieczne stosowanie mechanizmów cache'owania, chyba że obciążenie systemu wzrośnie.

## 9. Etapy wdrożenia
1. **Walidacja danych**: Utworzenie lub aktualizacja Zod schema w module walidacji (np. `src/lib/validators/preferencesValidator.ts`) dla `CreatePreferencesCommand` i `UpdatePreferencesCommand`.
2. **Logika biznesowa**: Implementacja funkcji serwisowych w `src/lib/services/preferences.ts`:
   - `getPreferences(userId: string): Promise<PreferencesDTO>`
   - `createPreferences(userId: string, command: CreatePreferencesCommand): Promise<PreferencesDTO>`
   - `updatePreferences(userId: string, command: UpdatePreferencesCommand): Promise<PreferencesDTO>`
3. **Endpoint API**: Utworzenie pliku API w Astro (np. `src/pages/api/preferences.ts`) z obsługą metod GET, POST i PUT.
4. **Integracja autoryzacji**: Wykorzystanie `context.locals` do uzyskania SupabaseClient i weryfikacji tokenu JWT.
5. **Obsługa błędów**: Dodanie mechanizmu logowania błędów oraz zwrotu odpowiednich kodów HTTP.