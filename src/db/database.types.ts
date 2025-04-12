export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  graphql_public: {
    Tables: Record<never, never>;
    Views: Record<never, never>;
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
  public: {
    Tables: {
      modified_recipes: {
        Row: {
          created_at: string;
          id: string;
          is_verified: boolean;
          modification_comment: string | null;
          modification_type: Database["public"]["Enums"]["modification_type_enum"];
          parent_recipe_id: string;
          status: Database["public"]["Enums"]["recipe_status_enum"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_verified?: boolean;
          modification_comment?: string | null;
          modification_type: Database["public"]["Enums"]["modification_type_enum"];
          parent_recipe_id: string;
          status: Database["public"]["Enums"]["recipe_status_enum"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_verified?: boolean;
          modification_comment?: string | null;
          modification_type?: Database["public"]["Enums"]["modification_type_enum"];
          parent_recipe_id?: string;
          status?: Database["public"]["Enums"]["recipe_status_enum"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "modified_recipes_parent_recipe_id_fkey";
            columns: ["parent_recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "modified_recipes_parent_recipe_id_fkey";
            columns: ["parent_recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes_public_view";
            referencedColumns: ["id"];
          },
        ];
      };
      preferences: {
        Row: {
          allergies: Json | null;
          calorie_target: number | null;
          created_at: string;
          diet_type: Database["public"]["Enums"]["diet_type_enum"];
          excluded_ingredients: Json | null;
          id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          allergies?: Json | null;
          calorie_target?: number | null;
          created_at?: string;
          diet_type: Database["public"]["Enums"]["diet_type_enum"];
          excluded_ingredients?: Json | null;
          id?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          allergies?: Json | null;
          calorie_target?: number | null;
          created_at?: string;
          diet_type?: Database["public"]["Enums"]["diet_type_enum"];
          excluded_ingredients?: Json | null;
          id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "preferences_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      ratings: {
        Row: {
          comment: string | null;
          created_at: string;
          id: string;
          is_active: boolean;
          is_edited: boolean;
          rating: number;
          recipe_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          comment?: string | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          is_edited?: boolean;
          rating: number;
          recipe_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          comment?: string | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          is_edited?: boolean;
          rating?: number;
          recipe_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ratings_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ratings_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes_public_view";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ratings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      recipes: {
        Row: {
          created_at: string;
          id: string;
          ingredients: Json;
          macros: Json;
          preparation_time: number;
          steps: Json;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          ingredients: Json;
          macros: Json;
          preparation_time: number;
          steps: Json;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          ingredients?: Json;
          macros?: Json;
          preparation_time?: number;
          steps?: Json;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recipes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          deleted_at: string | null;
          email: string;
          hashed_password: string;
          id: string;
          is_active: boolean;
          updated_at: string;
          username: string;
        };
        Insert: {
          created_at?: string;
          deleted_at?: string | null;
          email: string;
          hashed_password: string;
          id?: string;
          is_active?: boolean;
          updated_at?: string;
          username: string;
        };
        Update: {
          created_at?: string;
          deleted_at?: string | null;
          email?: string;
          hashed_password?: string;
          id?: string;
          is_active?: boolean;
          updated_at?: string;
          username?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      recipes_public_view: {
        Row: {
          author: string | null;
          average_rating: number | null;
          created_at: string | null;
          id: string | null;
          macros: Json | null;
          preparation_time: number | null;
          rating_count: number | null;
          title: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      add_recipe_rating: {
        Args: { p_recipe_id: string; p_rating: number; p_comment?: string };
        Returns: string;
      };
      get_recipe_details: {
        Args: { recipe_id: string };
        Returns: Json;
      };
      search_recipes: {
        Args: {
          search_term?: string;
          diet_type?: Database["public"]["Enums"]["diet_type_enum"];
          excluded_ingredients?: Json;
          min_rating?: number;
        };
        Returns: {
          author: string | null;
          average_rating: number | null;
          created_at: string | null;
          id: string | null;
          macros: Json | null;
          preparation_time: number | null;
          rating_count: number | null;
          title: string | null;
        }[];
      };
    };
    Enums: {
      diet_type_enum: "VEGETARIAN" | "KETOGENIC" | "PESCATARIAN";
      modification_type_enum: "INGREDIENT_SWAP" | "REDUCE_TIME" | "DIET_ADAPTATION" | "FLAVOR_TWEAK" | "PORTION_CHANGE";
      recipe_status_enum: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    };
    CompositeTypes: Record<never, never>;
  };
}

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      diet_type_enum: ["VEGETARIAN", "KETOGENIC", "PESCATARIAN"],
      modification_type_enum: ["INGREDIENT_SWAP", "REDUCE_TIME", "DIET_ADAPTATION", "FLAVOR_TWEAK", "PORTION_CHANGE"],
      recipe_status_enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
    },
  },
} as const;
