export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string | null
          avatar_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
        }
        Relationships: []
      }
      businesses: {
        Row: {
          id: string
          created_at: string
          name: string
          owner_id: string
          description: string | null
          logo_url: string | null
          address: string | null
          phone: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          owner_id: string
          description?: string | null
          logo_url?: string | null
          address?: string | null
          phone?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          owner_id?: string
          description?: string | null
          logo_url?: string | null
          address?: string | null
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ingredients: {
        Row: {
          id: string
          created_at: string
          name: string
          business_id: string
          cost_per_unit: number
          unit: string
          stock_quantity: number | null
          min_stock_level: number | null
          supplier_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          business_id: string
          cost_per_unit: number
          unit: string
          stock_quantity?: number | null
          min_stock_level?: number | null
          supplier_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          business_id?: string
          cost_per_unit?: number
          unit?: string
          stock_quantity?: number | null
          min_stock_level?: number | null
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingredients_business_id_fkey"
            columns: ["business_id"]
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ingredients_supplier_id_fkey"
            columns: ["supplier_id"]
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          }
        ]
      }
      suppliers: {
        Row: {
          id: string
          created_at: string
          name: string
          business_id: string
          contact_person: string | null
          email: string | null
          phone: string | null
          address: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          business_id: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          business_id?: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_business_id_fkey"
            columns: ["business_id"]
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          }
        ]
      }
      recipes: {
        Row: {
          id: string
          created_at: string
          name: string
          business_id: string
          description: string | null
          category: string | null
          portion_size: number
          portion_unit: string
          cost: number | null
          image_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          business_id: string
          description?: string | null
          category?: string | null
          portion_size: number
          portion_unit: string
          cost?: number | null
          image_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          business_id?: string
          description?: string | null
          category?: string | null
          portion_size?: number
          portion_unit?: string
          cost?: number | null
          image_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_business_id_fkey"
            columns: ["business_id"]
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          }
        ]
      }
      recipe_ingredients: {
        Row: {
          id: string
          created_at: string
          recipe_id: string
          ingredient_id: string
          quantity: number
          unit: string
          cost: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          recipe_id: string
          ingredient_id: string
          quantity: number
          unit: string
          cost?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          recipe_id?: string
          ingredient_id?: string
          quantity?: number
          unit?: string
          cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
