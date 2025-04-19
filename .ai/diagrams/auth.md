/* <authentication_analysis>
1. Przepływy autentykacji: Rejestracja, Logowanie, Wylogowanie, (opcjonalnie: Odzyskiwanie hasła).
2. Główni aktorzy: Przeglądarka (użytkownik korzysta z interfejsu), Middleware (weryfikje sesje),
   AstroAPI (obsługuje żądania) oraz SupabaseAuth (zarządza autoryzacją i sesjami).
3. Proces weryfikacji tokenu: Po logowaniu, API otrzymuje token JWT, który jest przechowywany w ciasteczkach.
   Middleware sprawdza token przy każdym żądaniu do zasobów chronionych. W przypadku wygasnięcia tokenu,
   może być uruchomiony proces odświeżania tokenu.
4. Proces rejestracji: Przeglądarka wysyła dane do rejestracji, AstroAPI wywołuje supabase.auth.signUp,
   a następnie informuje użytkownika o pomyślnej rejestracji.
5. Proces logowania: Przeglądarka wysyła dane do logowania, AstroAPI używa supabase.auth.signIn,
   która zwraca token, a użytkownik rozpoczyna sesję.
6. Proces wylogowania: Przeglądarka żąda wylogowania, AstroAPI wywołuje supabase.auth.signOut,
   co skutkuje usunięciem sesji i przekierowaniem użytkownika do strony logowania.
<authentication_analysis>

<mermaid_diagram>
```mermaid
sequenceDiagram
autonumber
participant Przeglądarka
participant Middleware
participant AstroAPI
participant SupabaseAuth

%% Proces rejestracji
Przeglądarka->>AstroAPI: Żądanie rejestracji (POST /api/users/register)
activate AstroAPI
AstroAPI->>SupabaseAuth: supabase.auth.signUp() dane rejestracji
activate SupabaseAuth
SupabaseAuth-->>AstroAPI: Potwierdzenie utworzenia konta
deactivate SupabaseAuth
AstroAPI-->>Przeglądarka: Potwierdzenie rejestracji

deactivate AstroAPI

%% Proces logowania
Przeglądarka->>AstroAPI: Żądanie logowania (POST /api/auth/login)
activate AstroAPI
AstroAPI->>SupabaseAuth: supabase.auth.signIn\ndane logowania
activate SupabaseAuth
SupabaseAuth-->>AstroAPI: Token JWT oraz dane użytkownika
deactivate SupabaseAuth
AstroAPI-->>Przeglądarka: Sukces logowania, token i rozpoczęcie sesji
deactivate AstroAPI

%% Walidacja tokenu przez Middleware
Przeglądarka->>Middleware: Żądanie zasobu chronionego
activate Middleware
Middleware->>SupabaseAuth: Weryfikacja tokenu JWT
SupabaseAuth-->>Middleware: Token ważny / wygasły
deactivate Middleware

%% Alternatywny scenariusz: Token wygasł
alt Token wygasł
  Middleware-->>Przeglądarka: Błąd autoryzacji (Token wygasł)
  Przeglądarka->>AstroAPI: Żądanie odświeżenia tokenu
  activate AstroAPI
  AstroAPI->>SupabaseAuth: Proces odświeżania tokenu
  activate SupabaseAuth
  SupabaseAuth-->>AstroAPI: Nowy token JWT
  deactivate SupabaseAuth
  AstroAPI-->>Przeglądarka: Nowy token ustawiony
  deactivate AstroAPI
end

%% Proces wylogowania
Przeglądarka->>AstroAPI: Żądanie wylogowania (POST /api/auth/logout)
activate AstroAPI
AstroAPI->>SupabaseAuth: supabase.auth.signOut
activate SupabaseAuth
SupabaseAuth-->>AstroAPI: Potwierdzenie wylogowania
deactivate SupabaseAuth
AstroAPI-->>Przeglądarka: Przekierowanie do strony logowania
deactivate AstroAPI
```
</mermaid_diagram> 