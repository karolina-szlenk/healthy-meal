## Schemat bazy danych PostgreSQL

### 1. Tabele i kolumny

#### 1.1. Tabela: users
- **id**: UUID, PRIMARY KEY, NOT NULL, DEFAULT uuid_generate_v4()
- **email**: TEXT, NOT NULL, UNIQUE
- **hashed_password**: TEXT, NOT NULL
- **username**: TEXT, NOT NULL, UNIQUE, CHECK (char_length(username) BETWEEN 3 AND 30 AND username ~ '^[a-z0-9_]+$')
- **created_at**: TIMESTAMPTZ, NOT NULL, DEFAULT now()
- **updated_at**: TIMESTAMPTZ, NOT NULL, DEFAULT now()
- **is_active**: BOOLEAN, NOT NULL, DEFAULT true
- **deleted_at**: TIMESTAMPTZ

#### 1.2. Tabela: preferences
- **id**: UUID, PRIMARY KEY, NOT NULL, DEFAULT uuid_generate_v4()
- **user_id**: UUID, NOT NULL, UNIQUE, REFERENCES users(id) ON DELETE CASCADE
- **diet_type**: diet_type_enum, NOT NULL
- **allergies**: JSONB
- **excluded_ingredients**: JSONB
- **calorie_target**: INTEGER
- **created_at**: TIMESTAMPTZ, NOT NULL, DEFAULT now()
- **updated_at**: TIMESTAMPTZ, NOT NULL, DEFAULT now()

#### 1.3. Tabela: recipes
- **id**: UUID, PRIMARY KEY, NOT NULL, DEFAULT uuid_generate_v4()
- **user_id**: UUID, NOT NULL, REFERENCES users(id) ON DELETE CASCADE
- **title**: TEXT, NOT NULL, CHECK (char_length(title) <= 100)
- **ingredients**: JSONB, NOT NULL
- **steps**: JSONB, NOT NULL
- **macros**: JSONB, NOT NULL
- **preparation_time**: INTEGER, NOT NULL
- **created_at**: TIMESTAMPTZ, NOT NULL, DEFAULT now()
- **updated_at**: TIMESTAMPTZ, NOT NULL, DEFAULT now()

*Unique Constraint*: UNIQUE (user_id, title)

#### 1.4. Tabela: modified_recipes
- **id**: UUID, PRIMARY KEY, NOT NULL, DEFAULT uuid_generate_v4()
- **parent_recipe_id**: UUID, NOT NULL, REFERENCES recipes(id) ON DELETE CASCADE
- **modification_type**: modification_type_enum, NOT NULL
- **modification_comment**: TEXT, CHECK (char_length(modification_comment) <= 500)
- **status**: recipe_status_enum, NOT NULL
- **is_verified**: BOOLEAN, NOT NULL, DEFAULT false
- **created_at**: TIMESTAMPTZ, NOT NULL, DEFAULT now()
- **updated_at**: TIMESTAMPTZ, NOT NULL, DEFAULT now()

#### 1.5. Tabela: ratings
- **id**: UUID, PRIMARY KEY, NOT NULL, DEFAULT uuid_generate_v4()
- **user_id**: UUID, NOT NULL, REFERENCES users(id) ON DELETE CASCADE
- **recipe_id**: UUID, NOT NULL, REFERENCES recipes(id) ON DELETE CASCADE
- **rating**: INTEGER, NOT NULL, CHECK (rating BETWEEN 1 AND 5)
- **comment**: TEXT
- **is_edited**: BOOLEAN, NOT NULL, DEFAULT false
- **is_active**: BOOLEAN, NOT NULL, DEFAULT true
- **created_at**: TIMESTAMPTZ, NOT NULL, DEFAULT now()
- **updated_at**: TIMESTAMPTZ, NOT NULL, DEFAULT now()

### 2. Relacje między tabelami

- **users** 1:1 **preferences**: Każdy użytkownik ma jedną konfigurację preferencji żywieniowych.
- **users** 1:N **recipes**: Jeden użytkownik może tworzyć wiele przepisów.
- **recipes** 1:N **modified_recipes**: Jeden przepis może mieć wiele zmodyfikowanych wersji.
- **users** 1:N **ratings**: Jeden użytkownik może wystawiać wiele ocen.
- **recipes** 1:N **ratings**: Jeden przepis może otrzymać wiele ocen.

### 3. Indeksy

- Unikalny indeks na `users(email)`
- Unikalny indeks na `users(username)`
- Unikalny indeks złożony na `(user_id, title)` w tabeli `recipes`
- Indeksy na kolumnach kluczy obcych: `recipes(user_id)`, `preferences(user_id)`, `modified_recipes(parent_recipe_id)`, `ratings(user_id)`, `ratings(recipe_id)`
- Indeksy na `created_at` dla optymalizacji sortowania
- Opcjonalnie: Pełnotekstowy indeks na `recipes(title)` dla zaawansowanego wyszukiwania

### 4. Zasady PostgreSQL (RLS)

- Włączyć RLS dla tabel: `preferences`, `recipes`, `modified_recipes` oraz `ratings`.
- Polityka RLS dla tabel:
  ```sql
  CREATE POLICY user_policy ON <table_name>
    USING (user_id = auth.uid());
  ```
- Rozszerzenie polityk dla ról `admin` i `moderator`, umożliwiające dodatkowe operacje UPDATE/DELETE.
- Dla tabeli `users`, RLS dodatkowo sprawdza, czy `is_active = true`.
- Utworzyć widok `recipes_public_view` z ograniczonym dostępem dla niezalogowanych użytkowników.

### 5. Typy ENUM

```sql
CREATE TYPE diet_type_enum AS ENUM ('VEGETARIAN', 'KETOGENIC', 'PESCATARIAN');

CREATE TYPE modification_type_enum AS ENUM ('INGREDIENT_SWAP', 'REDUCE_TIME', 'DIET_ADAPTATION', 'FLAVOR_TWEAK', 'PORTION_CHANGE');

CREATE TYPE recipe_status_enum AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
```

### 6. Dodatkowe uwagi

- Wszystkie identyfikatory są typu UUID dla lepszej skalowalności i wsparcia środowisk rozproszonych.
- Mechanizm soft delete w tabeli `users` (oraz opcjonalnie w `ratings`) pozwala na zachowanie historii danych.
- Wykorzystanie JSONB umożliwia elastyczne przechowywanie dynamicznych struktur danych (składniki, kroki, makroskładniki).
- Schemat spełnia zasady normalizacji (do 3NF) i jest zoptymalizowany pod kątem wydajności poprzez odpowiednie indeksowanie i constrainty. 