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
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      businesses: {
        Row: {
          id: string
          profile_id: string
          business_name: string
          business_type: string | null
          address: string | null
          phone: string | null
          tax_id: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          profile_id: string
          business_name: string
          business_type?: string | null
          address?: string | null
          phone?: string | null
          tax_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          profile_id?: string
          business_name?: string
          business_type?: string | null
          address?: string | null
          phone?: string | null
          tax_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      ingredients: {
        Row: {
          id: string
          business_id: string
          name: string
          category: string | null
          unit: string
          cost_per_unit: number
          supplier_id: string | null
          min_stock_level: number | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          category?: string | null
          unit: string
          cost_per_unit: number
          supplier_id?: string | null
          min_stock_level?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          category?: string | null
          unit?: string
          cost_per_unit?: number
          supplier_id?: string | null
          min_stock_level?: number | null
          created_at?: string
          updated_at?: string | null
        }
      }
      inventory: {
        Row: {
          id: string
          ingredient_id: string
          quantity: number
          expiry_date: string | null
          location: string | null
          batch_number: string | null
          last_updated: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          ingredient_id: string
          quantity: number
          expiry_date?: string | null
          location?: string | null
          batch_number?: string | null
          last_updated?: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          ingredient_id?: string
          quantity?: number
          expiry_date?: string | null
          location?: string | null
          batch_number?: string | null
          last_updated?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      suppliers: {
        Row: {
          id: string
          business_id: string
          name: string
          contact_person: string | null
          phone: string | null
          email: string | null
          address: string | null
          payment_terms: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          contact_person?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          payment_terms?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          contact_person?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          payment_terms?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      recipes: {
        Row: {
          id: string
          business_id: string
          name: string
          description: string | null
          portion_size: number
          portion_unit: string
          instructions: string | null
          image_url: string | null
          cost_per_serving: number | null
          waste_factor: number | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          description?: string | null
          portion_size: number
          portion_unit: string
          instructions?: string | null
          image_url?: string | null
          cost_per_serving?: number | null
          waste_factor?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          description?: string | null
          portion_size?: number
          portion_unit?: string
          instructions?: string | null
          image_url?: string | null
          cost_per_serving?: number | null
          waste_factor?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          }
        ]
      }
      recipe_ingredients: {
        Row: {
          id: string
          recipe_id: string
          ingredient_id: string
          quantity: number
          unit: string
          preparation_method: string | null
          notes: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          recipe_id: string
          ingredient_id: string
          quantity: number
          unit: string
          preparation_method?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          recipe_id?: string
          ingredient_id?: string
          quantity?: number
          unit?: string
          preparation_method?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      menu_items: {
        Row: {
          id: string
          business_id: string
          recipe_id: string | null
          name: string
          description: string | null
          category: string | null
          selling_price: number
          cost_price: number
          profit_margin: number
          is_active: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          business_id: string
          recipe_id?: string | null
          name: string
          description?: string | null
          category?: string | null
          selling_price: number
          cost_price: number
          profit_margin: number
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          business_id?: string
          recipe_id?: string | null
          name?: string
          description?: string | null
          category?: string | null
          selling_price?: number
          cost_price?: number
          profit_margin?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      promotions: {
        Row: {
          id: string
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
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
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
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
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
          created_at?: string
          updated_at?: string | null
        }
      }
      sales: {
        Row: {
          id: string
          business_id: string
          date: string
          total_amount: number
          discount_amount: number | null
          tax_amount: number | null
          payment_method: string | null
          customer_id: string | null
          notes: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          business_id: string
          date: string
          total_amount: number
          discount_amount?: number | null
          tax_amount?: number | null
          payment_method?: string | null
          customer_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          business_id?: string
          date?: string
          total_amount?: number
          discount_amount?: number | null
          tax_amount?: number | null
          payment_method?: string | null
          customer_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      sale_items: {
        Row: {
          id: string
          sale_id: string
          menu_item_id: string
          quantity: number
          unit_price: number
          discount: number | null
          subtotal: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          sale_id: string
          menu_item_id: string
          quantity: number
          unit_price: number
          discount?: number | null
          subtotal: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          sale_id?: string
          menu_item_id?: string
          quantity?: number
          unit_price?: number
          discount?: number | null
          subtotal?: number
          created_at?: string
          updated_at?: string | null
        }
      }
      purchases: {
        Row: {
          id: string
          business_id: string
          supplier_id: string
          date: string
          total_amount: number
          payment_status: string
          delivery_status: string
          notes: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          business_id: string
          supplier_id: string
          date: string
          total_amount: number
          payment_status: string
          delivery_status: string
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          business_id?: string
          supplier_id?: string
          date?: string
          total_amount?: number
          payment_status?: string
          delivery_status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      purchase_items: {
        Row: {
          id: string
          purchase_id: string
          ingredient_id: string
          quantity: number
          unit_price: number
          subtotal: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          purchase_id: string
          ingredient_id: string
          quantity: number
          unit_price: number
          subtotal: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          purchase_id?: string
          ingredient_id?: string
          quantity?: number
          unit_price?: number
          subtotal?: number
          created_at?: string
          updated_at?: string | null
        }
      }
      customers: {
        Row: {
          id: string
          business_id: string
          name: string
          phone: string | null
          email: string | null
          address: string | null
          loyalty_points: number | null
          membership_level: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          phone?: string | null
          email?: string | null
          address?: string | null
          loyalty_points?: number | null
          membership_level?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          phone?: string | null
          email?: string | null
          address?: string | null
          loyalty_points?: number | null
          membership_level?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      business_plans: {
        Row: {
          id: string
          business_id: string
          name: string
          type: string
          start_date: string
          end_date: string
          target_revenue: number | null
          target_profit: number | null
          budget: number | null
          status: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          type: string
          start_date: string
          end_date: string
          target_revenue?: number | null
          target_profit?: number | null
          budget?: number | null
          status: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          type?: string
          start_date?: string
          end_date?: string
          target_revenue?: number | null
          target_profit?: number | null
          budget?: number | null
          status?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      recipe_additional_costs: {
        Row: {
          id: string
          recipe_id: string
          name: string
          amount: number
          notes: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          recipe_id: string
          name: string
          amount: number
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          recipe_id?: string
          name?: string
          amount?: number
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_recipe_additional_costs_recipe"
            columns: ["recipe_id"]
            isOneToOne: false
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
      calculate_recipe_cost: {
        Args: {
          recipe_id: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
