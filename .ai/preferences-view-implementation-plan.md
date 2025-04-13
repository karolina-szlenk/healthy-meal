# Plan implementacji widoku Preferencji

## 1. Przegląd
Widok Preferencji (Ankieta preferencji żywieniowych) ma na celu umożliwienie użytkownikowi wprowadzenia lub aktualizacji własnych preferencji dietetycznych. Użytkownik będzie mógł wybrać typ diety, wprowadzić cel kaloryczny oraz opcjonalnie określić alergie i składniki do wykluczenia. Widok ten powinien być responsywny i zgodny ze stylem Astro, React, Tailwind i Shadcn/ui.

## 2. Routing widoku
Widok powinien być dostępny pod ścieżką: `/preferences`.

## 3. Struktura komponentów
Hierarchia komponentów:
- **PreferencesView** (główny komponent strony)
  - **PreferencesForm** (formularz wprowadzania/edycji danych)
  - **LoadingSpinner** (komponent wyświetlający stan ładowania)
  - **ErrorDisplay** (komponent wyświetlający komunikaty błędów)

## 4. Szczegóły komponentów
### 4.1. PreferencesView
- **Opis:**
  Kontener widoku, odpowiedzialny za pobieranie danych użytkownika (GET /api/preferences), zarządzanie stanem (loading, error) oraz przekazywanie danych do formularza.
- **Główne elementy:**
  - Inicjalne pobieranie danych za pomocą custom hooka (np. `usePreferences`)
  - Wyświetlanie komponentu LoadingSpinner podczas pobierania
  - Renderowanie PreferencesForm z predefiniowanymi danymi, jeśli pobieranie zakończy się sukcesem
  - Obsługa błędów i wyświetlanie ErrorDisplay
- **Obsługiwane interakcje:**
  - Pobranie danych (GET /api/preferences)
  - Przekazanie funkcji submit do formularza (wywołanie PUT lub POST w zależności od istnienia danych)
- **Walidacja:**
  - Przekazane dane powinny być zgodne z modelami CreatePreferencesCommand/UpdatePreferencesCommand
- **Typy:**
  - Używane typy: `PreferencesDTO`, `CreatePreferencesCommand`, `UpdatePreferencesCommand`
  - ViewModel: `PreferencesFormValues`
- **Propsy:**
  - Brak, jest stroną

### 4.2. PreferencesForm
- **Opis:**
  Formularz umożliwiający wprowadzenie lub aktualizację danych preferencji.
- **Główne elementy:**
  - Pole wyboru (Select) dla `diet_type` z opcjami: "VEGETARIAN", "KETOGENIC", "PESCATARIAN"
  - Input dla `calorie_target` (wartość liczbowa)
  - Input/textarea dla `allergies` (opcjonalne)
  - Input/textarea dla `excluded_ingredients` (opcjonalne)
  - Przycisk submit
- **Obsługiwane interakcje:**
  - Obsługa zdarzeń `onChange` dla wszystkich pól
  - Obsługa zdarzenia `onSubmit` formularza
- **Warunki walidacji:**
  - `diet_type` – wartość wymagana, musi być jedną z określonych opcji
  - `calorie_target` – wartość liczbową, wymagana, większa od zera
  - `allergies` i `excluded_ingredients` – pola opcjonalne
- **Typy:**
  - Nowy typ ViewModel: `PreferencesFormValues`:
    - `diet_type: "VEGETARIAN" | "KETOGENIC" | "PESCATARIAN"`
    - `calorie_target: number`
    - `allergies?: string`
    - `excluded_ingredients?: string`
  - Propsy komponentu: 
    - `initialValues: PreferencesFormValues`
    - `onSubmit: (values: PreferencesFormValues) => void`

### 4.3. LoadingSpinner i ErrorDisplay
- **Opis:**
  Komponenty pomocnicze do wyświetlania stanu ładowania i komunikatów o błędach.
- **Główne elementy:**
  - Graficzny spinner (LoadingSpinner) zgodny z wytycznymi Shadcn/ui
  - Komunikat błędu (ErrorDisplay), np. w formie alertu
- **Obsługiwane interakcje:**
  - Brak interakcji – wyłącznie informacyjne

## 5. Typy
- **PreferencesDTO:** (zdefiniowany w `src/types.ts`)
- **CreatePreferencesCommand** oraz **UpdatePreferencesCommand:** (zdefiniowane w `src/types.ts`)
- **PreferencesFormValues (ViewModel):**
  ```typescript
  interface PreferencesFormValues {
    diet_type: 'VEGETARIAN' | 'KETOGENIC' | 'PESCATARIAN';
    calorie_target: number;
    allergies?: string;
    excluded_ingredients?: string;
  }
  ```
- **PreferencesFormProps:**
  ```typescript
  interface PreferencesFormProps {
    initialValues: PreferencesFormValues;
    onSubmit: (values: PreferencesFormValues) => void;
  }
  ```

## 6. Zarządzanie stanem
- Użycie hooka `useState` do zarządzania stanem formularza w `PreferencesForm`.
- Implementacja custom hooka `usePreferences`:
  - Odpowiedzialny za pobieranie danych preferencji (GET /api/preferences)
  - Zarządzanie stanem: `loading`, `error`, `currentPreferences`
  - Funkcje do wysyłania danych (PUT lub POST) przy aktualizacji lub tworzeniu preferencji

## 7. Integracja API
- **GET /api/preferences:**
  - Pobranie aktualnych preferencji użytkownika
  - Oczekiwany response: `PreferencesDTO`
- **POST /api/preferences:**
  - Tworzenie nowych preferencji, gdy nie istnieją
  - Payload: `CreatePreferencesCommand`
  - Oczekiwany response: nowo utworzone `PreferencesDTO` (status 201)
- **PUT /api/preferences:**
  - Aktualizacja istniejących preferencji
  - Payload: `UpdatePreferencesCommand`
  - Oczekiwany response: zaktualizowane `PreferencesDTO` (status 200)
- Integracja API z wykorzystaniem funkcji `fetch` lub podobnej biblioteki (np. SWR) z odpowiednimi typami.

## 8. Interakcje użytkownika
- Po wejściu na stronę `/preferences` użytkownik widzi spinner do momentu pobrania danych.
- Jeśli dane zostaną pobrane, formularz jest prewypełniony istniejącymi wartościami.
- Użytkownik modyfikuje pola formularza (diet_type, calorie_target, allergies, excluded_ingredients).
- Po kliknięciu przycisku submit:
  - Dane są walidowane po stronie klienta.
  - W zależności od tego, czy preferencje już istnieją, wysyłane jest żądanie PUT (aktualizacja) lub POST (tworzenie).
  - Po pomyślnym przesłaniu, użytkownik otrzymuje komunikat o sukcesie.
  - W przypadku błędu – wyświetlany jest komunikat błędu.

## 9. Warunki i walidacja
- **Wymagane pola:**
  - `diet_type`: musi być wybrane i odpowiadać jednej z opcji.
  - `calorie_target`: wymagana liczba większa od 0.
- **Opcjonalne pola:**
  - `allergies` i `excluded_ingredients`.
- Klient wykonuje walidację przed wysłaniem żądania do API.
- W przypadku błędnego formatu danych, API zwróci status 400, a UI wyświetli odpowiedni komunikat.

## 10. Obsługa błędów
- Wyświetlanie komunikatu o błędzie, gdy żądanie GET nie powiedzie się (np. sieciowy błąd lub 404).
- Obsługa błędów podczas wysyłania formularza (PUT/POST): wyświetlenie błędów walidacji lub komunikatu o niepowodzeniu.
- Stosowanie mechanizmu try/catch oraz sprawdzanie statusu response w funkcjach API.

## 11. Kroki implementacji
1. Utworzyć komponent strony `PreferencesView` w odpowiednim katalogu (np. `src/pages/preferences.astro`).
2. Zaimplementować custom hook `usePreferences` do zarządzania pobieraniem i wysyłaniem danych.
3. Utworzyć komponent `PreferencesForm` w katalogu `src/components` z użyciem Shadcn/ui i Tailwind.
4. Dodać pola formularza: Select dla `diet_type`, Input dla `calorie_target`, a także pola opcjonalne dla `allergies` oraz `excluded_ingredients`.
5. Zaimplementować obsługę zdarzeń `onChange` i `onSubmit` wraz z walidacją pól formularza.
6. Podpiąć akcję wysłania formularza do API (wywołanie PUT lub POST w zależności od istnienia preferencji).
7. Dodać komponenty pomocnicze (LoadingSpinner, ErrorDisplay) w celu informowania użytkownika o stanie ładowania oraz błędach.
8. Stylizować widok zgodnie z wytycznymi Astro/Tailwind/Shadcn/ui.
9. Przeprowadzić testy integracyjne, weryfikując poprawność przetwarzania danych oraz obsługę błędów.
10. Dokonać code review i wdrożyć ewentualne poprawki. 