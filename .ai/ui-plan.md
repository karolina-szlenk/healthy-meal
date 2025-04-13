# Architektura UI dla HealthyMeal

## 1. Przegląd struktury UI

System HealthyMeal został zaprojektowany w celu zapewnienia użytkownikom intuicyjnego i responsywnego interfejsu, który umożliwia rejestrację, wypełnienie ankiety preferencji, przeglądanie dashboardu, wyświetlanie szczegółów przepisu, edycję przepisu oraz modyfikację ustawień preferencji. Aplikacja korzysta z podejścia mobile-first, z responsywnym designem dostosowującym widok do wersji desktop i mobile (tablet traktowany jako mobile). Nawigacja opiera się na stałym menu bocznym, a kluczowe komponenty interfejsu (Button, Input, Card, Avatar, Table, Select) pochodzą z biblioteki Shadcn/ui.

## 2. Lista widoków

### 2.1. Rejestracja/Logowanie
- **Ścieżka widoku:** `/login`
- **Główny cel:** Umożliwienie użytkownikowi utworzenia konta lub zalogowania się do systemu.
- **Kluczowe informacje:** Formularz zawierający pola: email, hasło; wyświetlanie czytelnych komunikatów walidacyjnych (np. "Pole email jest wymagane", "Hasło musi mieć co najmniej 8 znaków").
- **Kluczowe komponenty:** Form, Input, Button.
- **Uwagi (UX, dostępność, bezpieczeństwo):** Formularz musi być intuicyjny, responsywny i zawierać jasne komunikaty błędów; zabezpieczenia takie jak ochrona tras i zarządzanie sesją powinny być wdrożone zgodnie z najlepszymi praktykami.

### 2.2. Ankieta preferencji
- **Ścieżka widoku:** `/preferences`
- **Główny cel:** Zebranie preferencji dietetycznych użytkownika, z możliwością późniejszej modyfikacji.
- **Kluczowe informacje:** Pytania dotyczące diety, alergii, wykluczonych składników, celów kalorycznych; podsumowanie wprowadzonych danych.
- **Kluczowe komponenty:** Form, Input, Select, Card.
- **Uwagi:** Interfejs powinien być przejrzysty, a walidacja musi informować o brakujących lub nieprawidłowych danych.

### 2.3. Dashboard
- **Ścieżka widoku:** `/dashboard`
- **Główny cel:** Prezentacja przeglądu aktywności użytkownika, listy ostatnich przepisów oraz statystyk.
- **Kluczowe informacje:** Lista ostatnich przepisów, skrócone statystyki, powiadomienia.
- **Kluczowe komponenty:** Card, Table, Avatar.
- **Uwagi:** Widok musi być responsywny, z czytelnym układem i łatwym dostępem do najważniejszych informacji.

### 2.4. Szczegóły przepisu
- **Ścieżka widoku:** `/recipes/:id`
- **Główny cel:** Wyświetlenie kompletnej informacji o wybranym przepisie, w tym składników, kroków przygotowania oraz zmodyfikowanej wersji przepisu przez AI (jeśli dostępna).
- **Kluczowe informacje:** Tytuł, składniki, miary, kroki, czas przygotowania, opcjonalnie wersja zmodyfikowana przez AI.
- **Kluczowe komponenty:** Card, Table.
- **Uwagi:** Zapewnienie fallback UI w przypadku błędów lub problemów z pobraniem danych.

### 2.5. Edycja przepisu
- **Ścieżka widoku:** `/recipes/:id/edit`
- **Główny cel:** Umożliwienie użytkownikowi edycji istniejącego przepisu.
- **Kluczowe informacje:** Formularz edycji z wstępnie wypełnionymi danymi przepisu, komunikaty walidacyjne.
- **Kluczowe komponenty:** Form, Input, Button, Card.
- **Uwagi:** Formularz powinien być intuicyjny, z wyraźnymi komunikatami o błędach oraz zabezpieczeniami chroniącymi przed nieautoryzowaną edycją.

### 2.6. Ustawienia preferencji
- **Ścieżka widoku:** `/profile/preferences`
- **Główny cel:** Przegląd i modyfikacja preferencji użytkownika, zachowanych z etapu ankiety.
- **Kluczowe informacje:** Wyświetlenie obecnych ustawień, opcja modyfikacji i zapisania zmian.
- **Kluczowe komponenty:** Form, Input, Select.
- **Uwagi:** Zapewnienie frontendowej walidacji danych oraz intuicyjnego interfejsu umożliwiającego łatwą edycję ustawień.

## 3. Mapa podróży użytkownika

1. **Rejestracja/Logowanie:** Użytkownik rozpoczyna przygodę z aplikacją poprzez logowanie lub rejestrację na stronie `/login`.
2. **Ankieta preferencji:** Po udanej rejestracji użytkownik wypełnia ankietę preferencji na stronie `/preferences`, gdzie może wprowadzić dane dotyczące diety, alergii i innych wymagań.
3. **Dashboard:** Po zakończeniu etapu preferencji, użytkownik trafia do dashboardu (`/dashboard`) gdzie widzi przegląd ostatnich przepisów i statystyk.
4. **Szczegóły przepisu:** Wybierając konkretny przepis, użytkownik przechodzi do widoku szczegółów (`/recipes/:id`), gdzie może zobaczyć pełną informację o przepisie.
5. **Edycja przepisu:** Z poziomu widoku szczegółów, użytkownik ma możliwość przejścia do edycji przepisu (`/recipes/:id/edit`), wprowadzania zmian oraz zapisania edycji.
6. **Ustawienia preferencji:** Użytkownik może również modyfikować swoje preferencje na stronie `/profile/preferences`, zawsze mając dostęp do opcji w menu bocznym.

## 4. Układ i struktura nawigacji

Nawigacja w aplikacji opiera się na stałym menu bocznym, które zawiera:
- Link do Dashboardu
- Link do Przepisów (z możliwością przeglądania listy przepisów i przechodzenia do ich szczegółów)
- Link do Ustawień preferencji
- Opcję wylogowania

Menu jest widoczne jako stały element na desktopie, natomiast na urządzeniach mobilnych prezentowane jest jako menu hamburger. Struktura ta umożliwia użytkownikowi szybkie i intuicyjne przechodzenie pomiędzy najważniejszymi widokami.

## 5. Kluczowe komponenty

- **Button:** Służy do akcji na stronach (przesyłanie formularzy, edycja, zapisywanie zmian). Powinien być responsywny i posiadać wyraźne stany aktywności.
- **Input:** Pola formularzy do wprowadzania danych (np. email, hasło, tekstowe dane przepisu) z wbudowaną walidacją i czytelnymi komunikatami błędów.
- **Card:** Komponent do prezentacji informacji w uporządkowany sposób (przepisy, statystyki, podsumowania).
- **Table:** Używany do wyświetlania listy przepisów i innych danych tabelarycznych.
- **Avatar:** Opcjonalnie do prezentacji zdjęcia lub inicjałów użytkownika, szczególnie w kontekście dashboardu.
- **Select:** Element umożliwiający wybór opcji (np. wybór diety w ankiecie preferencji).
- **Fallback UI:** Komponent do wyświetlania komunikatów błędów w przypadku problemów z API lub innych nieoczekiwanych zdarzeń. 