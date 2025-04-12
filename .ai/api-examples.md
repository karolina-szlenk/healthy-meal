# API Endpoint Examples

This document provides concrete examples of JSON request and response payloads for each endpoint in the REST API.

## 1. User Authentication & Management

### POST /api/users/register
**Request Example:**
```json
{
  "email": "john.doe@example.com",
  "username": "johndoe",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response Example (Success, 201 Created):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "john.doe@example.com",
  "username": "johndoe",
  "created_at": "2023-10-01T12:00:00Z"
}
```

**Response Example (Error, 409 Conflict):**
```json
{
  "error": "User with this email or username already exists."
}
```

### POST /api/auth/login
**Request Example:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response Example (Success, 200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@example.com",
    "username": "johndoe"
  }
}
```

**Response Example (Error, 401 Unauthorized):**
```json
{
  "error": "Invalid email or password."
}
```

### POST /api/auth/logout
**Request Example:**
_No body required._

**Response Example (Success, 200 OK):**
```json
{
  "message": "Successfully logged out."
}
```

### PUT /api/users/{userId}
**Request Example:**
```json
{
  "email": "john.new@example.com",
  "username": "johnnew",
  "password": "newpassword123"
}
```

**Response Example (Success, 200 OK):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "john.new@example.com",
  "username": "johnnew",
  "updated_at": "2023-10-01T13:00:00Z"
}
```

**Response Example (Error, 400 Bad Request):**
```json
{
  "error": "Invalid data provided."
}
```

## 2. Preferences

### GET /api/preferences
**Request Example:**
_No body required. JWT token must be provided in the header._

**Response Example (Success, 200 OK):**
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "diet_type": "PESCATARIAN",
  "allergies": { "peanuts": false, "shellfish": true },
  "excluded_ingredients": { "broccoli": false },
  "calorie_target": 2000
}
```

**Response Example (Error, 401 Unauthorized):**
```json
{
  "error": "Unauthorized access."
}
```

### POST /api/preferences
**Request Example:**
```json
{
  "diet_type": "PESCATARIAN",
  "allergies": { "peanuts": true },
  "excluded_ingredients": { "gluten": true },
  "calorie_target": 2200
}
```

**Response Example (Success, 201 Created):**
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "diet_type": "PESCATARIAN",
  "allergies": { "peanuts": true },
  "excluded_ingredients": { "gluten": true },
  "calorie_target": 2200
}
```

**Response Example (Error, 400 Bad Request):**
```json
{
  "error": "Invalid dietary preferences data."
}
```

### PUT /api/preferences
**Request Example:**
```json
{
  "diet_type": "PESCATARIAN",
  "allergies": { "peanuts": false, "shellfish": true },
  "excluded_ingredients": { "broccoli": true },
  "calorie_target": 2100
}
```

**Response Example (Success, 200 OK):**
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "diet_type": "PESCATARIAN",
  "allergies": { "peanuts": false, "shellfish": true },
  "excluded_ingredients": { "broccoli": true },
  "calorie_target": 2100
}
```

**Response Example (Error, 400 Bad Request):**
```json
{
  "error": "Invalid update data for preferences."
}
```

## 3. Recipes

### GET /api/recipes
**Request Example:**
_Query parameters: `?page=1&limit=10&sort=created_at` (JWT token required in header)_

**Response Example (Success, 200 OK):**
```json
{
  "recipes": [
    {
      "id": "recipe1-uuid",
      "title": "Grilled Salmon",
      "preparation_time": 30,
      "created_at": "2023-10-01T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1
  }
}
```

### POST /api/recipes
**Request Example:**
```json
{
  "title": "Grilled Salmon",
  "ingredients": { "salmon": "200g", "lemon": "1" },
  "steps": ["Season salmon", "Preheat grill", "Grill for 10 min each side"],
  "macros": { "protein": "25g", "fat": "15g", "carbs": "0g" },
  "preparation_time": 30
}
```

**Response Example (Success, 201 Created):**
```json
{
  "id": "recipe1-uuid",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Grilled Salmon",
  "ingredients": { "salmon": "200g", "lemon": "1" },
  "steps": ["Season salmon", "Preheat grill", "Grill for 10 min each side"],
  "macros": { "protein": "25g", "fat": "15g", "carbs": "0g" },
  "preparation_time": 30,
  "created_at": "2023-10-01T12:00:00Z"
}
```

**Response Example (Error, 409 Conflict):**
```json
{
  "error": "A recipe with the same title already exists."
}
```

### GET /api/recipes/{recipeId}
**Request Example:**
_(JWT token required in header)_

**Response Example (Success, 200 OK):**
```json
{
  "id": "recipe1-uuid",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Grilled Salmon",
  "ingredients": { "salmon": "200g", "lemon": "1" },
  "steps": ["Season salmon", "Preheat grill", "Grill for 10 min each side"],
  "macros": { "protein": "25g", "fat": "15g", "carbs": "0g" },
  "preparation_time": 30,
  "created_at": "2023-10-01T12:00:00Z",
  "updated_at": "2023-10-01T12:00:00Z"
}
```

**Response Example (Error, 404 Not Found):**
```json
{
  "error": "Recipe not found."
}
```

### PUT /api/recipes/{recipeId}
**Request Example:**
```json
{
  "title": "Spicy Grilled Salmon",
  "ingredients": { "salmon": "200g", "chili": "1 tsp", "lemon": "1" },
  "steps": ["Season salmon with chili and salt", "Preheat grill", "Grill for 10 min each side"],
  "macros": { "protein": "25g", "fat": "15g", "carbs": "2g" },
  "preparation_time": 35
}
```

**Response Example (Success, 200 OK):**
```json
{
  "id": "recipe1-uuid",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Spicy Grilled Salmon",
  "ingredients": { "salmon": "200g", "chili": "1 tsp", "lemon": "1" },
  "steps": ["Season salmon with chili and salt", "Preheat grill", "Grill for 10 min each side"],
  "macros": { "protein": "25g", "fat": "15g", "carbs": "2g" },
  "preparation_time": 35,
  "created_at": "2023-10-01T12:00:00Z",
  "updated_at": "2023-10-01T13:00:00Z"
}
```

**Response Example (Error, 403 Forbidden):**
```json
{
  "error": "You are not authorized to update this recipe."
}
```

### DELETE /api/recipes/{recipeId}
**Request Example:**
_(JWT token required in header)_

**Response Example (Success, 200 OK):**
```json
{
  "message": "Recipe deleted successfully."
}
```

**Response Example (Error, 404 Not Found):**
```json
{
  "error": "Recipe not found."
}
```

## 4. Modified Recipes (AI-driven modifications)

### GET /api/recipes/{recipeId}/modifications
**Request Example:**
_(JWT token required in header)_

**Response Example (Success, 200 OK):**
```json
{
  "modifications": [
    {
      "id": "mod-uuid-1",
      "modification_type": "INGREDIENT_SWAP",
      "modification_comment": "Swap salmon with tilapia",
      "status": "DRAFT",
      "is_verified": false,
      "created_at": "2023-10-01T13:00:00Z"
    }
  ]
}
```

### POST /api/recipes/{recipeId}/modifications
**Request Example:**
```json
{
  "modification_type": "REDUCE_TIME",
  "modification_comment": "Reduce cooking time by pre-heating the grill."
}
```

**Response Example (Success, 201 Created):**
```json
{
  "id": "mod-uuid-2",
  "parent_recipe_id": "recipe1-uuid",
  "modification_type": "REDUCE_TIME",
  "status": "DRAFT",
  "is_verified": false,
  "created_at": "2023-10-01T14:00:00Z"
}
```

**Response Example (Error, 404 Not Found):**
```json
{
  "error": "Recipe not found for modification."
}
```

### GET /api/modifications/{modificationId}
**Request Example:**
_(JWT token required in header)_

**Response Example (Success, 200 OK):**
```json
{
  "id": "mod-uuid-2",
  "parent_recipe_id": "recipe1-uuid",
  "modification_type": "REDUCE_TIME",
  "modification_comment": "Reduce cooking time by pre-heating the grill.",
  "status": "DRAFT",
  "is_verified": false,
  "created_at": "2023-10-01T14:00:00Z"
}
```

**Response Example (Error, 404 Not Found):**
```json
{
  "error": "Modified recipe not found."
}
```

### PUT /api/modifications/{modificationId}
**Request Example:**
```json
{
  "modification_comment": "Adjusted timing, now 20 minutes total.",
  "is_verified": true,
  "status": "PUBLISHED"
}
```

**Response Example (Success, 200 OK):**
```json
{
  "id": "mod-uuid-2",
  "parent_recipe_id": "recipe1-uuid",
  "modification_type": "REDUCE_TIME",
  "modification_comment": "Adjusted timing, now 20 minutes total.",
  "status": "PUBLISHED",
  "is_verified": true,
  "created_at": "2023-10-01T14:00:00Z",
  "updated_at": "2023-10-01T15:00:00Z"
}
```

**Response Example (Error, 400 Bad Request):**
```json
{
  "error": "Invalid update data for modified recipe."
}
```

### DELETE /api/modifications/{modificationId}
**Request Example:**
_(JWT token required in header)_

**Response Example (Success, 200 OK):**
```json
{
  "message": "Modified recipe deleted successfully."
}
```

**Response Example (Error, 403 Forbidden):**
```json
{
  "error": "You are not authorized to delete this modified recipe."
}
```

## 5. Ratings

### POST /api/ratings
**Request Example:**
```json
{
  "recipe_id": "recipe1-uuid",
  "rating": 5,
  "comment": "Delicious and healthy!"
}
```

**Response Example (Success, 201 Created):**
```json
{
  "id": "rating-uuid-1",
  "recipe_id": "recipe1-uuid",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "rating": 5,
  "comment": "Delicious and healthy!",
  "created_at": "2023-10-01T16:00:00Z"
}
```

**Response Example (Error, 400 Bad Request):**
```json
{
  "error": "Invalid rating data."
}
```

### GET /api/recipes/{recipeId}/ratings
**Request Example:**
_(JWT token required in header)_

**Response Example (Success, 200 OK):**
```json
{
  "ratings": [
    {
      "id": "rating-uuid-1",
      "user_id": "123e4567-e89b-12d3-a456-426614174000",
      "rating": 5,
      "comment": "Delicious and healthy!",
      "created_at": "2023-10-01T16:00:00Z"
    }
  ]
}
```

### PUT /api/ratings/{ratingId}
**Request Example:**
```json
{
  "rating": 4,
  "comment": "Still good, but I prefer less salt."
}
```

**Response Example (Success, 200 OK):**
```json
{
  "id": "rating-uuid-1",
  "recipe_id": "recipe1-uuid",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "rating": 4,
  "comment": "Still good, but I prefer less salt.",
  "updated_at": "2023-10-01T17:00:00Z"
}
```

**Response Example (Error, 403 Forbidden):**
```json
{
  "error": "You are not allowed to update this rating."
}
```

### DELETE /api/ratings/{ratingId}
**Request Example:**
_(JWT token required in header)_

**Response Example (Success, 200 OK):**
```json
{
  "message": "Rating deleted successfully."
}
```

**Response Example (Error, 404 Not Found):**
```json
{
  "error": "Rating not found."
}
```

## 6. Dashboard

### GET /api/dashboard
**Request Example:**
_No body required. JWT token must be provided in the header._

**Response Example (Success, 200 OK):**
```json
{
  "recent_recipes": [
    {
      "id": "recipe1-uuid",
      "title": "Grilled Salmon",
      "created_at": "2023-10-01T12:00:00Z"
    }
  ],
  "stats": {
    "total_recipes": 10,
    "average_rating": 4.5
  }
}
```

**Response Example (Error, 401 Unauthorized):**
```json
{
  "error": "Unauthorized access."
}
``` 