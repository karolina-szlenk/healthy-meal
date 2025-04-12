# REST API Plan

## 1. Resources

- **Users**: Represents the application's user accounts. Corresponds to the `users` table in the database.
- **Preferences**: Represents dietary preferences associated with each user. Corresponds to the `preferences` table.
- **Recipes**: Represents original recipes submitted by users. Corresponds to the `recipes` table.
- **Modified Recipes**: Represents AI-modified versions of recipes. Corresponds to the `modified_recipes` table.
- **Ratings**: Represents user ratings for recipes. Corresponds to the `ratings` table.

## 2. Endpoints

### 2.1. User Authentication & Management

- **POST /api/users/register**
  - Description: Register a new user account.
  - Request JSON:
    ```json
    {
      "email": "string",
      "username": "string",
      "password": "string",
      "confirmPassword": "string"
    }
    ```
  - Response JSON:
    ```json
    {
      "id": "UUID",
      "email": "string",
      "username": "string",
      "created_at": "timestamp"
    }
    ```
  - Success: 201 Created; Errors: 400 Bad Request, 409 Conflict.

- **POST /api/auth/login**
  - Description: Authenticate a user and return a JWT token.
  - Request JSON:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  - Response JSON:
    ```json
    {
      "token": "JWT",
      "user": {
        "id": "UUID",
        "email": "string",
        "username": "string"
      }
    }
    ```
  - Success: 200 OK; Errors: 401 Unauthorized.

- **POST /api/auth/logout**
  - Description: Invalidate the current user session.
  - Response: 200 OK; Errors: 400 Bad Request.

- **PUT /api/users/{userId}**
  - Description: Update user profile information.
  - Request JSON (any fields that need updating):
    ```json
    {
      "email": "string",
      "username": "string",
      "password": "string"
    }
    ```
  - Response JSON:
    ```json
    {
      "id": "UUID",
      "email": "string",
      "username": "string",
      "updated_at": "timestamp"
    }
    ```
  - Success: 200 OK; Errors: 400 Bad Request, 403 Forbidden.

### 2.2. Preferences

- **GET /api/preferences**
  - Description: Retrieve the authenticated user's dietary preferences.
  - Response JSON:
    ```json
    {
      "user_id": "UUID",
      "diet_type": "VEGETARIAN | KETOGENIC | PESCATARIAN",
      "allergies": { ... },
      "excluded_ingredients": { ... },
      "calorie_target": number
    }
    ```
  - Success: 200 OK; Errors: 401 Unauthorized.

- **POST /api/preferences**
  - Description: Create dietary preferences for a user (e.g., after completing a survey).
  - Request JSON:
    ```json
    {
      "diet_type": "VEGETARIAN | KETOGENIC | PESCATARIAN",
      "allergies": { ... },
      "excluded_ingredients": { ... },
      "calorie_target": number
    }
    ```
  - Response JSON: Same as GET.
  - Success: 201 Created; Errors: 400 Bad Request.

- **PUT /api/preferences**
  - Description: Update existing dietary preferences.
  - Request JSON (fields to update):
    ```json
    {
      "diet_type": "VEGETARIAN | KETOGENIC | PESCATARIAN",
      "allergies": { ... },
      "excluded_ingredients": { ... },
      "calorie_target": number
    }
    ```
  - Response JSON: Updated preference object.
  - Success: 200 OK; Errors: 400 Bad Request.

### 2.3. Recipes

- **GET /api/recipes**
  - Description: Retrieve a paginated list of recipes created by the authenticated user.
  - Query Parameters: `page`, `limit`, `sort` (e.g., sort by `created_at`)
  - Response JSON:
    ```json
    {
      "recipes": [
        {
          "id": "UUID",
          "title": "string",
          "preparation_time": number,
          "created_at": "timestamp",
          ...
        }
      ],
      "pagination": {
        "page": number,
        "limit": number,
        "total": number
      }
    }
    ```
  - Success: 200 OK.

- **POST /api/recipes**
  - Description: Create a new recipe.
  - Request JSON:
    ```json
    {
      "title": "string",
      "ingredients": { ... },
      "steps": { ... },
      "macros": { ... },
      "preparation_time": number
    }
    ```
  - Response JSON: Newly created recipe object.
  - Success: 201 Created; Errors: 400 Bad Request, 409 Conflict.

- **GET /api/recipes/{recipeId}**
  - Description: Retrieve detailed information about a specific recipe.
  - Response JSON:
    ```json
    {
      "id": "UUID",
      "user_id": "UUID",
      "title": "string",
      "ingredients": { ... },
      "steps": { ... },
      "macros": { ... },
      "preparation_time": number,
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
    ```
  - Success: 200 OK; Errors: 404 Not Found.

- **PUT /api/recipes/{recipeId}**
  - Description: Update an existing recipe.
  - Request JSON (fields to update):
    ```json
    {
      "title": "string",
      "ingredients": { ... },
      "steps": { ... },
      "macros": { ... },
      "preparation_time": number
    }
    ```
  - Response JSON: Updated recipe object.
  - Success: 200 OK; Errors: 400 Bad Request, 403 Forbidden.

- **DELETE /api/recipes/{recipeId}**
  - Description: Delete a recipe.
  - Response: Confirmation message.
  - Success: 200 OK; Errors: 403 Forbidden, 404 Not Found.

### 2.4. Modified Recipes (AI-driven modifications)

- **GET /api/recipes/{recipeId}/modifications**
  - Description: List all AI-modified versions of a given recipe.
  - Response JSON:
    ```json
    {
      "modifications": [
        {
          "id": "UUID",
          "modification_type": "INGREDIENT_SWAP | REDUCE_TIME | DIET_ADAPTATION | FLAVOR_TWEAK | PORTION_CHANGE",
          "modification_comment": "string",
          "status": "DRAFT | PUBLISHED | ARCHIVED",
          "is_verified": boolean,
          "created_at": "timestamp"
        }
      ]
    }
    ```
  - Success: 200 OK.

- **POST /api/recipes/{recipeId}/modifications**
  - Description: Request an AI modification of an existing recipe. This endpoint will call an external AI service to generate a modified recipe based on user preferences.
  - Request JSON:
    ```json
    {
      "modification_type": "INGREDIENT_SWAP | REDUCE_TIME | DIET_ADAPTATION | FLAVOR_TWEAK | PORTION_CHANGE",
      "modification_comment": "string (optional)"
    }
    ```
  - Response JSON:
    ```json
    {
      "id": "UUID",
      "parent_recipe_id": "UUID",
      "modification_type": "...",
      "status": "DRAFT",
      "is_verified": false,
      "created_at": "timestamp"
    }
    ```
  - Success: 201 Created; Errors: 400 Bad Request, 404 Not Found.

- **GET /api/modifications/{modificationId}**
  - Description: Retrieve details of a specific modified recipe.
  - Response JSON: Detailed modified recipe object.
  - Success: 200 OK; Errors: 404 Not Found.

- **PUT /api/modifications/{modificationId}**
  - Description: Update or verify a modified recipe (e.g., after user review).
  - Request JSON:
    ```json
    {
      "modification_comment": "string (optional)",
      "is_verified": boolean,
      "status": "DRAFT | PUBLISHED | ARCHIVED"
    }
    ```
  - Response JSON: Updated modified recipe object.
  - Success: 200 OK; Errors: 400 Bad Request.

- **DELETE /api/modifications/{modificationId}**
  - Description: Delete a modified recipe version (if applicable).
  - Response: Confirmation message.
  - Success: 200 OK; Errors: 403 Forbidden, 404 Not Found.

### 2.5. Ratings

- **POST /api/ratings**
  - Description: Create a rating for a recipe.
  - Request JSON:
    ```json
    {
      "recipe_id": "UUID",
      "rating": number,
      "comment": "string (optional)"
    }
    ```
  - Response JSON: Newly created rating object.
  - Success: 201 Created; Errors: 400 Bad Request.

- **GET /api/recipes/{recipeId}/ratings**
  - Description: Retrieve all ratings for a specific recipe.
  - Response JSON:
    ```json
    {
      "ratings": [
        {
          "id": "UUID",
          "user_id": "UUID",
          "rating": number,
          "comment": "string",
          "created_at": "timestamp"
        }
      ]
    }
    ```
  - Success: 200 OK.

- **PUT /api/ratings/{ratingId}**
  - Description: Update an existing rating.
  - Request JSON:
    ```json
    {
      "rating": number,
      "comment": "string (optional)"
    }
    ```
  - Response JSON: Updated rating object.
  - Success: 200 OK; Errors: 400 Bad Request, 403 Forbidden.

- **DELETE /api/ratings/{ratingId}**
  - Description: Delete an existing rating.
  - Response: Confirmation message.
  - Success: 200 OK; Errors: 403 Forbidden, 404 Not Found.

### 2.6. Dashboard

- **GET /api/dashboard**
  - Description: Retrieve user-specific dashboard data, including recent recipes and usage statistics.
  - Response JSON:
    ```json
    {
      "recent_recipes": [
        {
          "id": "UUID",
          "title": "string",
          "created_at": "timestamp"
        }
      ],
      "stats": {
        "total_recipes": number,
        "average_rating": number
      }
    }
    ```
  - Success: 200 OK; Errors: 401 Unauthorized.

## 3. Authentication and Authorization

- The API will use JWT-based authentication. Endpoints requiring authentication must include a valid JWT in the `Authorization` header using the `Bearer` scheme.
- Database Row Level Security (RLS) policies ensure that users can only access and modify their own data.
- Elevated permissions (e.g., admin or moderator actions) require additional checks and roles.

## 4. Validation and Business Logic

- **User Registration & Profile**:
  - Validate email format.
  - Enforce a minimum password length of 8 characters.
  - Ensure the username is between 3 and 30 characters and matches the required regex.

- **Preferences**:
  - Validate that `diet_type` is one of the allowed ENUM values: `VEGETARIAN`, `KETOGENIC`, or `PESCATARIAN`.

- **Recipes**:
  - Enforce title length (maximum 100 characters).
  - Validate the structure of JSON fields for ingredients, steps, and macros.
  - Ensure `preparation_time` is a positive integer.

- **Modified Recipes**:
  - Validate the `modification_type` against allowed ENUM values such as `INGREDIENT_SWAP`, `REDUCE_TIME`, `DIET_ADAPTATION`, `FLAVOR_TWEAK`, or `PORTION_CHANGE`.
  - Link each modification to its original recipe via `parent_recipe_id`.
  - Provide a preview step for AI modifications before final confirmation.

- **Ratings**:
  - Validate that rating values are between 1 and 5.
  - Ensure a user can only rate a recipe once.

- **Business Logic**:
  - For AI-driven recipe modifications, the API will retrieve the original recipe, call an external AI service to generate modifications, and then allow the user to review and confirm the changes.
  - Pagination, filtering, and sorting are applied to endpoints returning lists to enhance performance and usability.
  - Rate limiting and proper input sanitization are enforced to safeguard against abuse.

## 5. Security and Performance

- All endpoints must be accessed over HTTPS to secure data in transit.
- Input validation and sanitization mitigate risks from malformed or malicious input.
- Server-side pagination, filtering, and sorting mechanisms ensure efficient data retrieval and performance.
- Rate limiting is implemented to protect against brute-force and denial-of-service attacks.
- Database indices and constraints (as defined in the schema) guarantee data integrity and efficient query performance.
- Detailed logging and structured error responses facilitate monitoring and troubleshooting.

## Assumptions

- The API is implemented using TypeScript within an Astro + React project, in line with the tech stack provided.
- Supabase is used for database management and authentication.
- Integration with external AI services is handled by dedicated service modules.
- Modern development practices are applied to ensure security, performance, and a clean separation of concerns. 