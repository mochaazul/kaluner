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
      businesses: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          logo_url: string | null
          address: string | null
          phone: string | null
          email: string | null
          tax_id: string | null
          currency: string
          owner_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
          logo_url?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          tax_id?: string | null
          currency?: string
          owner_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
          logo_url?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          tax_id?: string | null
          currency?: string
          owner_id?: string
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
          updated_at: string
          business_id: string
          name: string
          description: string | null
          unit: string
          cost_per_unit: number
          stock_quantity: number | null
          min_stock_level: number | null
          supplier_id: string | null
          category: string | null
          expiry_date: string | null
          storage_location: string | null
          batch_number: string | null
          last_updated: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          business_id: string
          name: string
          description?: string | null
          unit: string
          cost_per_unit: number
          stock_quantity?: number | null
          min_stock_level?: number | null
          supplier_id?: string | null
          category?: string | null
          expiry_date?: string | null
          storage_location?: string | null
          batch_number?: string | null
          last_updated?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          business_id?: string
          name?: string
          description?: string | null
          unit?: string
          cost_per_unit?: number
          stock_quantity?: number | null
          min_stock_level?: number | null
          supplier_id?: string | null
          category?: string | null
          expiry_date?: string | null
          storage_location?: string | null
          batch_number?: string | null
          last_updated?: string | null
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
          updated_at: string
          business_id: string
          name: string
          contact_person: string | null
          phone: string | null
          email: string | null
          address: string | null
          payment_terms: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          business_id: string
          name: string
          contact_person?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          payment_terms?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          business_id?: string
          name?: string
          contact_person?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          payment_terms?: string | null
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
          updated_at: string
          business_id: string
          name: string
          description: string | null
          category: string | null
          portion_size: number
          portion_unit: string
          preparation_time: number | null
          cooking_time: number | null
          instructions: string | null
          notes: string | null
          cost: number | null
          image_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          business_id: string
          name: string
          description?: string | null
          category?: string | null
          portion_size: number
          portion_unit: string
          preparation_time?: number | null
          cooking_time?: number | null
          instructions?: string | null
          notes?: string | null
          cost?: number | null
          image_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          business_id?: string
          name?: string
          description?: string | null
          category?: string | null
          portion_size?: number
          portion_unit?: string
          preparation_time?: number | null
          cooking_time?: number | null
          instructions?: string | null
          notes?: string | null
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
          updated_at: string
          recipe_id: string
          ingredient_id: string
          quantity: number
          unit: string
          preparation_method: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          recipe_id: string
          ingredient_id: string
          quantity: number
          unit: string
          preparation_method?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          recipe_id?: string
          ingredient_id?: string
          quantity?: number
          unit?: string
          preparation_method?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          }
        ]
      }
      menu_items: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          business_id: string
          recipe_id: string | null
          name: string
          description: string | null
          category: string | null
          selling_price: number
          cost_price: number | null
          profit_margin: number | null
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          business_id: string
          recipe_id?: string | null
          name: string
          description?: string | null
          category?: string | null
          selling_price: number
          cost_price?: number | null
          profit_margin?: number | null
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          business_id?: string
          recipe_id?: string | null
          name?: string
          description?: string | null
          category?: string | null
          selling_price?: number
          cost_price?: number | null
          profit_margin?: number | null
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_business_id_fkey"
            columns: ["business_id"]
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_recipe_id_fkey"
            columns: ["recipe_id"]
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          }
        ]
      }
      promotions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          business_id: string
          name: string
          description: string | null
          start_date: string
          end_date: string
          discount_type: string
          discount_value: number
          min_purchase: number | null
          max_discount: number | null
          applicable_items: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          business_id: string
          name: string
          description?: string | null
          start_date: string
          end_date: string
          discount_type: string
          discount_value: number
          min_purchase?: number | null
          max_discount?: number | null
          applicable_items?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          business_id?: string
          name?: string
          description?: string | null
          start_date?: string
          end_date?: string
          discount_type?: string
          discount_value?: number
          min_purchase?: number | null
          max_discount?: number | null
          applicable_items?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "promotions_business_id_fkey"
            columns: ["business_id"]
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          }
        ]
      }
      customers: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          business_id: string
          name: string
          phone: string | null
          email: string | null
          address: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          business_id: string
          name: string
          phone?: string | null
          email?: string | null
          address?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          business_id?: string
          name?: string
          phone?: string | null
          email?: string | null
          address?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_business_id_fkey"
            columns: ["business_id"]
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          }
        ]
      }
      sales: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          business_id: string
          date: string
          total_amount: number
          discount_amount: number
          tax_amount: number
          payment_method: string | null
          customer_id: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          business_id: string
          date?: string
          total_amount: number
          discount_amount?: number
          tax_amount?: number
          payment_method?: string | null
          customer_id?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          business_id?: string
          date?: string
          total_amount?: number
          discount_amount?: number
          tax_amount?: number
          payment_method?: string | null
          customer_id?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_business_id_fkey"
            columns: ["business_id"]
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          }
        ]
      }
      sale_items: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          sale_id: string
          menu_item_id: string
          quantity: number
          unit_price: number
          discount: number
          subtotal: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          sale_id: string
          menu_item_id: string
          quantity: number
          unit_price: number
          discount?: number
          subtotal: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          sale_id?: string
          menu_item_id?: string
          quantity?: number
          unit_price?: number
          discount?: number
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          }
        ]
      }
      purchases: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          business_id: string
          supplier_id: string | null
          date: string
          total_amount: number
          payment_status: string
          payment_due: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          business_id: string
          supplier_id?: string | null
          date?: string
          total_amount: number
          payment_status?: string
          payment_due?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          business_id?: string
          supplier_id?: string | null
          date?: string
          total_amount?: number
          payment_status?: string
          payment_due?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchases_business_id_fkey"
            columns: ["business_id"]
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_supplier_id_fkey"
            columns: ["supplier_id"]
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          }
        ]
      }
      purchase_items: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          purchase_id: string
          ingredient_id: string
          quantity: number
          unit_price: number
          subtotal: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          purchase_id: string
          ingredient_id: string
          quantity: number
          unit_price: number
          subtotal: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          purchase_id?: string
          ingredient_id?: string
          quantity?: number
          unit_price?: number
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_items_purchase_id_fkey"
            columns: ["purchase_id"]
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_items_ingredient_id_fkey"
            columns: ["ingredient_id"]
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          }
        ]
      }
      business_settings: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          business_id: string
          setting_key: string
          setting_value: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          business_id: string
          setting_key: string
          setting_value?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          business_id?: string
          setting_key?: string
          setting_value?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "business_settings_business_id_fkey"
            columns: ["business_id"]
            referencedRelation: "businesses"
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
