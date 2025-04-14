# OpenRouter Service Implementation Plan

## 1. Opis usługi

OpenRouter to usługa integrująca się z API OpenRouter w celu uzupełniania czatów opartych na modelach LLM. Usługa umożliwia:

1. Budowanie dynamicznych zapytań, łączących komunikaty systemowe oraz użytkownika.
2. Wysyłanie żądań do OpenRouter API z predefiniowanymi ustawieniami modelu i parametrami.
3. Parowanie oraz walidację odpowiedzi zgodnie z ściśle określonym formatem (response_format) opartym na schemacie JSON.

## 2. Opis konstruktora

Konstruktor usługi powinien:

1. Inicjalizować konfigurację, łącznie z punktami końcowymi API, kluczem API (przechowywanym bezpiecznie), domyślnymi komunikatami oraz parametrami modelu.
2. Ustalać wartości domyślne, takie jak system message, user message, nazwa modelu i parametry (np. temperature, top_p, max_tokens) oraz response_format.
3. Umożliwiać późniejszą modyfikację ustawień poprzez metody publiczne.

## 3. Publiczne metody i pola

**Publiczne metody:**

1. `sendChatMessage(message: string, context?: object): Promise<object>`
   - Odpowiedzialna za łączenie komunikatu użytkownika z domyślnym komunikatem systemowym, budowanie ładunku żądania oraz wysłanie go do OpenRouter API.

2. `configureRouter(options: object): void`
   - Pozwala na aktualizację konfiguracji usługi (np. zmiana nazwy modelu, parametrów, response_format) bez konieczności restartu usługi.

3. `parseLLMResponse(response: any): object`
   - Przetwarza i waliduje odpowiedź API, sprawdzając jej zgodność z predefiniowanym schematem.

**Publiczne pola:**

- `apiEndpoint: string` – adres endpointa OpenRouter API.
- `defaultModelName: string` – domyślna nazwa modelu (np. `openrouter-llm-v1`).
- `defaultParameters: object` – domyślne parametry modelu (np. `{ temperature: 0.7, top_p: 1, max_tokens: 150 }`).
- `responseFormat: object` – stała definicja schematu odpowiedzi, np.:

  ```json
  { type: 'json_schema', json_schema: { name: 'ChatResponse', strict: true, schema: { message: 'string', metadata: 'object' } } }
  ```

## 4. Prywatne metody i pola

**Prywatne metody:**

1. `_buildRequestPayload(systemMessage: string, userMessage: string, extraContext?: object): object`
   - Łączy komunikat systemowy i użytkownika w jeden ładunek, uwzględniając dodatkowy kontekst, oraz dołącza konfigurację modelu.

2. `_handleResponse(rawResponse: any): object`
   - Parsuje odpowiedź, waliduje ją względem `responseFormat` i przygotowuje wynik do dalszego przetwarzania.

3. `_logError(error: Error, context?: object): void`
   - Loguje błędy wraz z kontekstem, zapewniając narzędzie do debugowania oraz monitorowania problemów.

**Prywatne pola:**

- `_apiKey: string` – przechowywany bezpiecznie klucz API OpenRouter.
- `_retryCount: number` – liczba prób ponowienia danego żądania w przypadku błędów.
- `_configurationCache: object` – bufor przechowujący bieżące ustawienia usługi.

## 5. Obsługa błędów

Przykładowe scenariusze błędów oraz proponowane rozwiązania:

1. **Błąd połączenia z API**
   - Wyzwanie: Niestabilność sieci lub niedostępność serwera OpenRouter.
   - Rozwiązanie 1: Implementacja mechanizmu ponawiania żądania z wykorzystaniem wykładniczego backoff.
   - Rozwiązanie 2: Zgłaszanie błędu i zwracanie przyjaznego komunikatu użytkownikowi.

2. **Nieprawidłowy format odpowiedzi**
   - Wyzwanie: API zwraca odpowiedź, która nie spełnia wymagań `responseFormat`.
   - Rozwiązanie 1: Walidacja odpowiedzi przy użyciu precyzyjnego schematu JSON.
   - Rozwiązanie 2: Wywołanie procedury fallback, która informuje użytkownika o problemie.

3. **Przekroczenie limitu czasowego (timeout)**
   - Wyzwanie: Odpowiedź z API opóźnia się, co skutkuje timeoutem.
   - Rozwiązanie 1: Ustawienie rozsądnych limitów czasowych na połączenia.
   - Rozwiązanie 2: Informowanie użytkownika o opóźnieniach i opcjonalne ponowienie próby.

4. **Błąd autoryzacji lub limitów (rate limit exceeded)**
   - Wyzwanie: Nadmierna liczba żądań powodująca odrzuty na poziomie API.
   - Rozwiązanie 1: Wprowadzenie mechanizmu kontrolowania liczby żądań (rate limiting).
   - Rozwiązanie 2: Wyświetlanie jasnego komunikatu o przekroczeniu limitu oraz instrukcji, kiedy spróbować ponownie.

## 6. Kwestie bezpieczeństwa

1. **Bezpieczne przechowywanie klucza API**
   - Należy wykorzystywać zmienne środowiskowe lub dedykowane magazyny sekretów.

2. **Walidacja wejścia**
   - Wszystkie dane wejściowe (wiadomości, kontekst) muszą być walidowane w celu uniknięcia ataków typu injection.

3. **Szyfrowana komunikacja**
   - Upewnij się, że wszystkie połączenia z OpenRouter API odbywają się przez HTTPS.

4. **Monitoring i logowanie**
   - Implementacja mechanizmów monitorowania i audytu w celu szybkiej identyfikacji potencjalnych zagrożeń.

## 7. Plan wdrożenia krok po kroku

1. **Inicjalizacja projektu i konfiguracja środowiska**
   - Zaimplementuj konfigurację usługi, korzystając ze zmiennych środowiskowych do przechowywania kluczy API.
   - Utwórz plik konfiguracyjny z domyślnymi ustawieniami, takimi jak:
     - System message: "System: Inicjuję komunikację z OpenRouter API w celu uzupełnienia konwersacji."
     - User message (przykładowy): "User: Proszę o pomoc w redagowaniu tekstu."
     - response_format: 
       ```json
       { type: 'json_schema', json_schema: { name: 'ChatResponse', strict: true, schema: { message: 'string', metadata: 'object' } } }
       ```
     - Model name: "openrouter-llm-v1"
     - Model parameters: `{ temperature: 0.7, top_p: 1, max_tokens: 150 }`

2. **Implementacja konstruktora i warstwy konfiguracji**
   - Zaimplementuj konstruktor, który inicjalizuje wszystkie publiczne pola oraz prywatne zmienne konfiguracyjne.

3. **Rozwój publicznych metod**
   - Stwórz metodę `sendChatMessage` do wysyłania żądań.
   - Dodaj metodę `configureRouter` umożliwiającą modyfikację ustawień.
   - Zaimplementuj `parseLLMResponse` do walidacji i parsowania odpowiedzi zgodnie ze schematem.

4. **Implementacja metod prywatnych**
   - Zaimplementuj `_buildRequestPayload` do łączenia komunikatów oraz konfiguracji modelu.
   - Dodaj `_handleResponse` jako pomocniczą metodę do przetwarzania odpowiedzi.
   - Dodaj `_logError` do centralnego logowania błędów.

5. **Testowanie i walidacja**
   - Utwórz testy jednostkowe i integracyjne, symulujące różne scenariusze (błędy połączenia, nieprawidłowy format odpowiedzi, przekroczenie czasu oczekiwania, itp.).
   - Zweryfikuj poprawność walidacji response_format zgodnie z wcześniej zdefiniowanym schematem.

6. **Zabezpieczenia i monitoring**
   - Upewnij się, że klucz API jest przechowywany w zmiennych środowiskowych i nie trafia do publicznych repozytoriów.
   - Wdróż mechanizmy rate limiting i monitorowania logów, aby szybko wykrywać anomalie.

7. **Wdrożenie i dokumentacja**
   - Po zakończeniu testów, wdroż usługę na wybraną infrastrukturę (np. jako endpoint w Astro w \`/src/pages/api\`).
   - Zapewnij dokumentację dla developerów, opisującą konfigurację, użycie publicznych metod oraz procedury obsługi błędów. 