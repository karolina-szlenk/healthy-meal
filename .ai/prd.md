# Dokument wymagań produktu (PRD) - HealthyMeal

## 1. Przegląd produktu

HealthyMeal to aplikacja webowa wykorzystująca sztuczną inteligencję do dostosowywania przepisów kulinarnych do preferencji żywieniowych użytkowników. W wersji MVP aplikacja skupia się na obsłudze osób na diecie pescatariańskiej (wegetarianie jedzący ryby) bez alergii, które mają ograniczony czas na przygotowanie posiłków.

Aplikacja pozwala użytkownikom na:
- Tworzenie i zarządzanie kontami użytkowników
- Zapisywanie własnych preferencji żywieniowych poprzez ankietę
- Dodawanie, przeglądanie, edytowanie i usuwanie przepisów
- Modyfikowanie przepisów za pomocą AI według zapisanych preferencji
- Ocenianie zmodyfikowanych przepisów

Aplikacja będzie wykorzystywać modele LLM (poprzez API) do modyfikacji przepisów.

## 2. Problem użytkownika

Użytkownicy wyznający dietę pescatariańską (wegetarianie jedzący ryby) często napotykają następujące problemy:

1. Trudności w dostosowaniu standardowych przepisów do swoich preferencji żywieniowych
2. Ograniczony czas na przygotowanie posiłków, co utrudnia planowanie diety
3. Konieczność ręcznego modyfikowania przepisów, co bywa czasochłonne i nie zawsze daje satysfakcjonujące wyniki
4. Brak scentralizowanego miejsca do przechowywania i zarządzania przepisami dostosowanymi do ich diety

HealthyMeal rozwiązuje te problemy, oferując narzędzie do automatycznego dostosowywania przepisów do diety pescatariańskiej przy wykorzystaniu sztucznej inteligencji, co oszczędza czas i zwiększa zadowolenie użytkowników.

## 3. Wymagania funkcjonalne

### 3.1. System kont użytkowników
- Rejestracja konta
- Logowanie do systemu
- Zarządzanie profilem użytkownika
- Przechowywanie preferencji żywieniowych

### 3.2. Zarządzanie przepisami
- Dodawanie nowych przepisów
- Przeglądanie zapisanych przepisów
- Edycja istniejących przepisów
- Usuwanie przepisów
- Przechowywanie przepisów w ustrukturyzowanym formacie (składniki, miary, kroki, czas przygotowania, makroskładniki)

### 3.3. Preferencje żywieniowe
- Ankieta do zbierania preferencji
- Zapisywanie preferencji w profilu użytkownika
- Możliwość aktualizacji preferencji

### 3.4. Modyfikacja przepisów przez AI
- Integracja z API
- Automatyczne dostosowywanie przepisów do preferencji użytkownika
- Weryfikacja wykonalności zmodyfikowanych przepisów
- Zapisywanie zarówno oryginalnych, jak i zmodyfikowanych wersji przepisów

### 3.5. System ocen
- Ocenianie zmodyfikowanych przepisów w skali gwiazdkowej
- Przechowywanie historii ocen

## 4. Granice produktu

Następujące funkcjonalności NIE są częścią MVP:

1. Import przepisów z adresu URL
2. Bogata obsługa multimediów (np. zdjęć przepisów)
3. Udostępnianie przepisów dla innych użytkowników
4. Funkcje społecznościowe
5. Obsługa innych diet niż pescatariańska
6. Obsługa alergii i nietolerancji pokarmowych
7. Zaawansowane filtrowanie i wyszukiwanie przepisów
8. Mobilna wersja aplikacji

## 5. Historyjki użytkowników

### Rejestracja i zarządzanie kontem

#### US-001
- Tytuł: Rejestracja nowego konta
- Opis: Jako nowy użytkownik, chcę utworzyć konto w aplikacji, aby móc korzystać z jej funkcjonalności.
- Kryteria akceptacji:
  - Na stronie glównej znajduje się Button, który umoliwia przejście nad stronę z formularzem
  - Formularz rejestracji zawiera pola: email, hasło, potwierdzenie hasła
  - System waliduje poprawność adresu email
  - System wymaga hasła o długości minimum 8 znaków
  - Po udanej rejestracji użytkownik jest przekierowywany do strony logowania
  - System wyświetla komunikat o pomyślnej rejestracji

#### US-002
- Tytuł: Logowanie do aplikacji
- Opis: Jako zarejestrowany użytkownik, chcę zalogować się do aplikacji, aby uzyskać dostęp do moich przepisów i preferencji.
- Kryteria akceptacji:
  - Formularz logowania zawiera pola: email i hasło
  - System waliduje poprawność wprowadzonych danych
  - Po udanym logowaniu użytkownik jest przekierowywany do strony dashboard
  - W przypadku błędnych danych system wyświetla odpowiedni komunikat

#### US-003
- Tytuł: Wylogowanie z aplikacji
- Opis: Jako zalogowany użytkownik, chcę wylogować się z aplikacji, aby zabezpieczyć swoje konto przed nieautoryzowanym dostępem.
- Kryteria akceptacji:
  - Opcja wylogowania jest dostępna w menu użytkownika
  - Po wylogowaniu użytkownik jest przekierowywany do strony logowania
  - Sesja użytkownika jest niszczona po wylogowaniu

#### US-004
- Tytuł: Edycja profilu użytkownika
- Opis: Jako zalogowany użytkownik, chcę edytować informacje w moim profilu, aby zaktualizować moje dane.
- Kryteria akceptacji:
  - Strona profilu zawiera formularz z możliwością edycji podstawowych danych
  - Po zapisaniu zmian system wyświetla komunikat o pomyślnej aktualizacji
  - Zmiany są widoczne po ponownym wejściu na stronę profilu

### Zarządzanie preferencjami żywieniowymi

#### US-005
- Tytuł: Wypełnienie ankiety preferencji żywieniowych
- Opis: Jako nowy użytkownik, chcę wypełnić ankietę preferencji żywieniowych, aby system mógł dostosować przepisy do moich potrzeb.
- Kryteria akceptacji:
  - Ankieta zawiera pytania o podstawowe preferencje dietetyczne
  - Ankieta pozwala na określenie preferencji dotyczących diety pescatariańskiej
  - System zapisuje odpowiedzi w profilu użytkownika
  - Po wypełnieniu ankiety użytkownik jest przekierowywany do dashboardu

#### US-006
- Tytuł: Aktualizacja preferencji żywieniowych
- Opis: Jako zalogowany użytkownik, chcę zaktualizować moje preferencje żywieniowe, aby dostosować je do zmieniających się potrzeb.
- Kryteria akceptacji:
  - Strona preferencji wyświetla aktualnie zapisane preferencje
  - Użytkownik może edytować swoje preferencje
  - System zapisuje zaktualizowane preferencje
  - Po zapisaniu zmian system wyświetla komunikat o pomyślnej aktualizacji

### Zarządzanie przepisami

#### US-007
- Tytuł: Dodawanie nowego przepisu
- Opis: Jako zalogowany użytkownik, chcę dodać nowy przepis, aby móc go przechowywać i modyfikować później.
- Kryteria akceptacji:
  - Formularz dodawania przepisu zawiera pola: tytuł, składniki, miary, kroki przygotowania, czas przygotowania, makroskładniki
  - System waliduje poprawność wprowadzonych danych
  - Po dodaniu przepisu jest on widoczny na liście przepisów użytkownika
  - System wyświetla komunikat o pomyślnym dodaniu przepisu

#### US-008
- Tytuł: Przeglądanie listy przepisów
- Opis: Jako zalogowany użytkownik, chcę przeglądać listę moich przepisów, aby łatwo znaleźć interesujący mnie przepis.
- Kryteria akceptacji:
  - Lista przepisów wyświetla podstawowe informacje: tytuł, czas przygotowania
  - Lista jest posortowana od najnowszych przepisów
  - Po kliknięciu w przepis użytkownik jest przekierowywany do jego szczegółów

#### US-009
- Tytuł: Przeglądanie szczegółów przepisu
- Opis: Jako zalogowany użytkownik, chcę zobaczyć szczegółowe informacje o przepisie, aby móc go przygotować.
- Kryteria akceptacji:
  - Strona szczegółów wyświetla wszystkie informacje o przepisie: tytuł, składniki, miary, kroki, czas przygotowania, makroskładniki
  - Na stronie dostępne są opcje edycji i usunięcia przepisu
  - Na stronie dostępna jest opcja modyfikacji przepisu przez AI

#### US-010
- Tytuł: Edycja istniejącego przepisu
- Opis: Jako zalogowany użytkownik, chcę edytować istniejący przepis, aby zaktualizować jego treść.
- Kryteria akceptacji:
  - Formularz edycji przepisu zawiera pola z aktualnymi danymi przepisu
  - System waliduje poprawność wprowadzonych danych
  - Po zapisaniu zmian system wyświetla komunikat o pomyślnej aktualizacji
  - Zaktualizowane dane są widoczne na stronie szczegółów przepisu

#### US-011
- Tytuł: Usuwanie przepisu
- Opis: Jako zalogowany użytkownik, chcę usunąć przepis, którego już nie potrzebuję.
- Kryteria akceptacji:
  - Opcja usunięcia jest dostępna na stronie szczegółów przepisu
  - System wymaga potwierdzenia przed usunięciem
  - Po usunięciu przepisu system wyświetla komunikat o pomyślnym usunięciu
  - Usunięty przepis nie jest już widoczny na liście przepisów

### Modyfikacja przepisów przez AI

#### US-012
- Tytuł: Modyfikacja przepisu przez AI
- Opis: Jako zalogowany użytkownik, chcę zmodyfikować przepis za pomocą AI zgodnie z moimi preferencjami, aby dostosować go do moich potrzeb dietetycznych.
- Kryteria akceptacji:
  - Opcja modyfikacji jest dostępna na stronie szczegółów przepisu
  - System używa API OpenAI do modyfikacji przepisu według preferencji użytkownika
  - Zmodyfikowany przepis jest wyświetlany użytkownikowi przed zapisaniem
  - Użytkownik może zapisać zmodyfikowany przepis lub odrzucić zmiany
  - Zapisany zmodyfikowany przepis jest dostępny obok oryginalnego

#### US-013
- Tytuł: Porównanie oryginalnego i zmodyfikowanego przepisu
- Opis: Jako zalogowany użytkownik, chcę porównać oryginalny przepis z jego zmodyfikowaną wersją, aby zobaczyć wprowadzone zmiany.
- Kryteria akceptacji:
  - System wyświetla oryginalny i zmodyfikowany przepis obok siebie
  - Różnice między wersjami są wyraźnie oznaczone
  - Użytkownik może przełączać się między wersjami

#### US-014
- Tytuł: Ocenianie zmodyfikowanego przepisu
- Opis: Jako zalogowany użytkownik, chcę ocenić zmodyfikowany przepis, aby przekazać informację zwrotną o jego jakości.
- Kryteria akceptacji:
  - System umożliwia ocenę w skali gwiazdkowej (1-5)
  - Ocena jest zapisywana i widoczna przy przeglądaniu przepisu
  - Użytkownik może zmienić swoją ocenę

### Dashboard użytkownika

#### US-015
- Tytuł: Przeglądanie dashboardu użytkownika
- Opis: Jako zalogowany użytkownik, chcę zobaczyć mój dashboard, aby szybko uzyskać dostęp do moich przepisów i statystyk.
- Kryteria akceptacji:
  - Dashboard wyświetla ostatnio dodane przepisy
  - Dashboard wyświetla statystyki korzystania z aplikacji
  - Dashboard zawiera szybkie linki do najczęściej używanych funkcji

## 6. Metryki sukcesu

### Wskaźniki zaangażowania użytkowników
- 90% użytkowników posiada wypełnioną sekcję preferencji żywieniowych w swoim profilu
- 75% użytkowników generuje co najmniej jeden przepis tygodniowo
- 50% użytkowników ocenia zmodyfikowane przepisy