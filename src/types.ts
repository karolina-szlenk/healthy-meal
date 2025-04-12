import type { Database, Json } from "./db/database.types";

// ===============================
// User DTOs and Command Models
// ===============================

// Command for registering a new user
export interface RegisterUserCommand {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

// DTO returned after successful user registration
export type RegisteredUserDTO = Pick<
  Database["public"]["Tables"]["users"]["Row"],
  "id" | "email" | "username" | "created_at"
>;

// Command for user login
export interface LoginCommand {
  email: string;
  password: string;
}

// Basic user DTO used in authentication responses
export type UserDTO = Pick<Database["public"]["Tables"]["users"]["Row"], "id" | "email" | "username">;

// DTO returned after successful login, including JWT token
export interface LoginResponseDTO {
  token: string;
  user: UserDTO;
}

// Command for updating user profile information
export type UpdateUserCommand = Partial<{
  email: string;
  username: string;
  password: string;
}>;

// DTO returned after updating user profile
export type UpdatedUserDTO = Pick<
  Database["public"]["Tables"]["users"]["Row"],
  "id" | "email" | "username" | "updated_at"
>;

// ===============================
// Preferences DTOs and Command Models
// ===============================

// Diet type enum from the database
export type DietType = Database["public"]["Enums"]["diet_type_enum"];

// Command for creating dietary preferences
export interface CreatePreferencesCommand {
  diet_type: DietType;
  allergies?: Json;
  excluded_ingredients?: Json;
  calorie_target: number;
}

// DTO representing a user's dietary preferences
export type PreferencesDTO = Pick<
  Database["public"]["Tables"]["preferences"]["Row"],
  "user_id" | "diet_type" | "allergies" | "excluded_ingredients" | "calorie_target"
>;

// Command for updating dietary preferences
export type UpdatePreferencesCommand = Partial<CreatePreferencesCommand>;

// ===============================
// Recipes DTOs and Command Models
// ===============================

// Command for creating a new recipe
export interface CreateRecipeCommand {
  title: string;
  ingredients: Json;
  steps: Json;
  macros: Json;
  preparation_time: number;
}

// Command for updating an existing recipe
export type UpdateRecipeCommand = Partial<CreateRecipeCommand>;

// Detailed DTO for a recipe
export type RecipeDetailsDTO = Pick<
  Database["public"]["Tables"]["recipes"]["Row"],
  "id" | "user_id" | "title" | "ingredients" | "steps" | "macros" | "preparation_time" | "created_at" | "updated_at"
>;

// List item DTO for recipes (e.g., in a paginated list)
export type RecipeListItemDTO = Pick<
  Database["public"]["Tables"]["recipes"]["Row"],
  "id" | "title" | "preparation_time" | "created_at"
>;

// DTO for pagination information
export interface PaginationDTO {
  page: number;
  limit: number;
  total: number;
}

// ===============================
// Modified Recipes (AI-driven) DTOs and Command Models
// ===============================

// Modification type and recipe status enums from the database
export type ModificationType = Database["public"]["Enums"]["modification_type_enum"];
export type RecipeStatus = Database["public"]["Enums"]["recipe_status_enum"];

// Command for creating a modified recipe (AI-driven modification)
export interface CreateModificationCommand {
  modification_type: ModificationType;
  modification_comment?: string;
}

// DTO for listing modified recipes
export type ModificationListItemDTO = Pick<
  Database["public"]["Tables"]["modified_recipes"]["Row"],
  "id" | "modification_type" | "modification_comment" | "status" | "is_verified" | "created_at"
>;

// Detailed DTO for a modified recipe
export type ModificationDetailsDTO = Pick<
  Database["public"]["Tables"]["modified_recipes"]["Row"],
  | "id"
  | "parent_recipe_id"
  | "modification_type"
  | "modification_comment"
  | "status"
  | "is_verified"
  | "created_at"
  | "updated_at"
>;

// Command for updating a modified recipe
export interface UpdateModificationCommand {
  modification_comment?: string;
  is_verified: boolean;
  status: RecipeStatus;
}

// ===============================
// Ratings DTOs and Command Models
// ===============================

// Command for creating a rating for a recipe
export interface CreateRatingCommand {
  recipe_id: string;
  rating: number;
  comment?: string;
}

// DTO representing a rating
export type RatingDTO = Pick<
  Database["public"]["Tables"]["ratings"]["Row"],
  "id" | "user_id" | "rating" | "comment" | "created_at"
>;

// Command for updating an existing rating
export interface UpdateRatingCommand {
  rating: number;
  comment?: string;
}

// ===============================
// Dashboard DTO
// ===============================

// DTO for a recent recipe on the dashboard
export type RecentRecipeDTO = Pick<Database["public"]["Tables"]["recipes"]["Row"], "id" | "title" | "created_at">;

// DTO for dashboard statistics
export interface DashboardStatsDTO {
  total_recipes: number;
  average_rating: number;
}

// DTO representing user-specific dashboard data
export interface DashboardDTO {
  recent_recipes: RecentRecipeDTO[];
  stats: DashboardStatsDTO;
}
