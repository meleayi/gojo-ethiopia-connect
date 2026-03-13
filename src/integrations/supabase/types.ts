export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          additional_info: string | null
          city: string
          created_at: string
          full_name: string
          house_number: string | null
          id: string
          is_default: boolean
          label: string
          phone: string
          sub_city: string
          updated_at: string
          user_id: string
          woreda: string
        }
        Insert: {
          additional_info?: string | null
          city: string
          created_at?: string
          full_name: string
          house_number?: string | null
          id?: string
          is_default?: boolean
          label?: string
          phone: string
          sub_city: string
          updated_at?: string
          user_id: string
          woreda: string
        }
        Update: {
          additional_info?: string | null
          city?: string
          created_at?: string
          full_name?: string
          house_number?: string | null
          id?: string
          is_default?: boolean
          label?: string
          phone?: string
          sub_city?: string
          updated_at?: string
          user_id?: string
          woreda?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          saved_for_later: boolean
          updated_at: string
          user_id: string
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          saved_for_later?: boolean
          updated_at?: string
          user_id: string
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          saved_for_later?: boolean
          updated_at?: string
          user_id?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          name_amharic: string
          parent_id: string | null
          product_count: number
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          name_amharic?: string
          parent_id?: string | null
          product_count?: number
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          name_amharic?: string
          parent_id?: string | null
          product_count?: number
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          buyer_id: string
          buyer_unread_count: number
          created_at: string
          id: string
          is_archived: boolean
          last_message_at: string
          order_id: string | null
          product_id: string | null
          seller_id: string
          seller_unread_count: number
        }
        Insert: {
          buyer_id: string
          buyer_unread_count?: number
          created_at?: string
          id?: string
          is_archived?: boolean
          last_message_at?: string
          order_id?: string | null
          product_id?: string | null
          seller_id: string
          seller_unread_count?: number
        }
        Update: {
          buyer_id?: string
          buyer_unread_count?: number
          created_at?: string
          id?: string
          is_archived?: boolean
          last_message_at?: string
          order_id?: string | null
          product_id?: string | null
          seller_id?: string
          seller_unread_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "conversations_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachment_name: string | null
          attachment_url: string | null
          content: string | null
          conversation_id: string
          created_at: string
          id: string
          image_url: string | null
          is_deleted: boolean
          message_type: string
          sender_id: string
          status: Database["public"]["Enums"]["message_status"]
          updated_at: string
        }
        Insert: {
          attachment_name?: string | null
          attachment_url?: string | null
          content?: string | null
          conversation_id: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_deleted?: boolean
          message_type?: string
          sender_id: string
          status?: Database["public"]["Enums"]["message_status"]
          updated_at?: string
        }
        Update: {
          attachment_name?: string | null
          attachment_url?: string | null
          content?: string | null
          conversation_id?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_deleted?: boolean
          message_type?: string
          sender_id?: string
          status?: Database["public"]["Enums"]["message_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          body: string
          created_at: string
          data: Json | null
          id: string
          is_read: boolean
          read_at: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          action_url?: string | null
          body: string
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          read_at?: string | null
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          action_url?: string | null
          body?: string
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          read_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          product_image: string
          product_name: string
          quantity: number
          seller_id: string
          total_price: number
          unit_price: number
          variant_id: string | null
          variant_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          product_image?: string
          product_name: string
          quantity: number
          seller_id: string
          total_price: number
          unit_price: number
          variant_id?: string | null
          variant_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          product_image?: string
          product_name?: string
          quantity?: number
          seller_id?: string
          total_price?: number
          unit_price?: number
          variant_id?: string | null
          variant_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_id: string | null
          cancel_reason: string | null
          cancelled_at: string | null
          created_at: string
          currency: string
          delivered_at: string | null
          delivery_fee: number
          delivery_method: Database["public"]["Enums"]["delivery_method"]
          discount: number
          estimated_delivery_at: string | null
          id: string
          notes: string | null
          order_number: string
          seller_id: string
          shipping_additional_info: string | null
          shipping_city: string
          shipping_full_name: string
          shipping_house_number: string | null
          shipping_phone: string
          shipping_sub_city: string
          shipping_woreda: string
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          address_id?: string | null
          cancel_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          delivered_at?: string | null
          delivery_fee?: number
          delivery_method?: Database["public"]["Enums"]["delivery_method"]
          discount?: number
          estimated_delivery_at?: string | null
          id?: string
          notes?: string | null
          order_number: string
          seller_id: string
          shipping_additional_info?: string | null
          shipping_city: string
          shipping_full_name: string
          shipping_house_number?: string | null
          shipping_phone: string
          shipping_sub_city: string
          shipping_woreda: string
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          updated_at?: string
          user_id: string
        }
        Update: {
          address_id?: string | null
          cancel_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          delivered_at?: string | null
          delivery_fee?: number
          delivery_method?: Database["public"]["Enums"]["delivery_method"]
          discount?: number
          estimated_delivery_at?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          seller_id?: string
          shipping_additional_info?: string | null
          shipping_city?: string
          shipping_full_name?: string
          shipping_house_number?: string | null
          shipping_phone?: string
          shipping_sub_city?: string
          shipping_woreda?: string
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          failed_at: string | null
          failure_reason: string | null
          id: string
          method: Database["public"]["Enums"]["payment_method"]
          order_id: string
          paid_at: string | null
          provider_reference: string | null
          provider_response: Json | null
          status: Database["public"]["Enums"]["payment_status"]
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          failed_at?: string | null
          failure_reason?: string | null
          id?: string
          method: Database["public"]["Enums"]["payment_method"]
          order_id: string
          paid_at?: string | null
          provider_reference?: string | null
          provider_response?: Json | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          failed_at?: string | null
          failure_reason?: string | null
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          order_id?: string
          paid_at?: string | null
          provider_reference?: string | null
          provider_response?: Json | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      product_attributes: {
        Row: {
          attribute_name: string
          attribute_value: string
          id: string
          product_id: string
          sort_order: number
        }
        Insert: {
          attribute_name: string
          attribute_value: string
          id?: string
          product_id: string
          sort_order?: number
        }
        Update: {
          attribute_name?: string
          attribute_value?: string
          id?: string
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_attributes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          is_primary: boolean
          product_id: string
          sort_order: number
          storage_path: string | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          product_id: string
          sort_order?: number
          storage_path?: string | null
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          product_id?: string
          sort_order?: number
          storage_path?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          attributes: Json | null
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          price_adjustment: number
          product_id: string
          sku: string | null
          stock_quantity: number
          updated_at: string
        }
        Insert: {
          attributes?: Json | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          price_adjustment?: number
          product_id: string
          sku?: string | null
          stock_quantity?: number
          updated_at?: string
        }
        Update: {
          attributes?: Json | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          price_adjustment?: number
          product_id?: string
          sku?: string | null
          stock_quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_views: {
        Row: {
          created_at: string
          id: string
          ip_hash: string | null
          product_id: string
          referrer: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          product_id: string
          referrer?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          product_id?: string
          referrer?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_views_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          badge: string | null
          brand: string | null
          category_id: string
          city: string
          condition: string
          created_at: string
          currency: string
          description: string | null
          dimensions: Json | null
          flash_deal_ends_at: string | null
          id: string
          in_stock: boolean
          is_featured: boolean
          is_flash_deal: boolean
          listing_type: Database["public"]["Enums"]["listing_type"]
          location: string
          max_order_quantity: number | null
          min_order_quantity: number
          model: string | null
          name: string
          order_count: number
          original_price: number | null
          price: number
          rating: number
          rejection_note: string | null
          rent_period: string | null
          review_count: number
          seller_id: string
          slug: string
          specs: Json | null
          status: Database["public"]["Enums"]["product_status"]
          stock_quantity: number
          tags: string[] | null
          updated_at: string
          view_count: number
          weight_kg: number | null
          wishlist_count: number
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          badge?: string | null
          brand?: string | null
          category_id: string
          city?: string
          condition?: string
          created_at?: string
          currency?: string
          description?: string | null
          dimensions?: Json | null
          flash_deal_ends_at?: string | null
          id?: string
          in_stock?: boolean
          is_featured?: boolean
          is_flash_deal?: boolean
          listing_type?: Database["public"]["Enums"]["listing_type"]
          location?: string
          max_order_quantity?: number | null
          min_order_quantity?: number
          model?: string | null
          name: string
          order_count?: number
          original_price?: number | null
          price: number
          rating?: number
          rejection_note?: string | null
          rent_period?: string | null
          review_count?: number
          seller_id: string
          slug: string
          specs?: Json | null
          status?: Database["public"]["Enums"]["product_status"]
          stock_quantity?: number
          tags?: string[] | null
          updated_at?: string
          view_count?: number
          weight_kg?: number | null
          wishlist_count?: number
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          badge?: string | null
          brand?: string | null
          category_id?: string
          city?: string
          condition?: string
          created_at?: string
          currency?: string
          description?: string | null
          dimensions?: Json | null
          flash_deal_ends_at?: string | null
          id?: string
          in_stock?: boolean
          is_featured?: boolean
          is_flash_deal?: boolean
          listing_type?: Database["public"]["Enums"]["listing_type"]
          location?: string
          max_order_quantity?: number | null
          min_order_quantity?: number
          model?: string | null
          name?: string
          order_count?: number
          original_price?: number | null
          price?: number
          rating?: number
          rejection_note?: string | null
          rent_period?: string | null
          review_count?: number
          seller_id?: string
          slug?: string
          specs?: Json | null
          status?: Database["public"]["Enums"]["product_status"]
          stock_quantity?: number
          tags?: string[] | null
          updated_at?: string
          view_count?: number
          weight_kg?: number | null
          wishlist_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "seller_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          email: string
          full_name: string | null
          house_number: string | null
          id: string
          phone: string | null
          preferred_language: string
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
          sub_city: string | null
          updated_at: string
          woreda: string | null
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          house_number?: string | null
          id: string
          phone?: string | null
          preferred_language?: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          sub_city?: string | null
          updated_at?: string
          woreda?: string | null
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          house_number?: string | null
          id?: string
          phone?: string | null
          preferred_language?: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          sub_city?: string | null
          updated_at?: string
          woreda?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          helpful_count: number
          id: string
          images: string[] | null
          is_approved: boolean
          is_verified_purchase: boolean
          order_id: string | null
          product_id: string
          rating: number
          reply: string | null
          reply_at: string | null
          seller_id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          helpful_count?: number
          id?: string
          images?: string[] | null
          is_approved?: boolean
          is_verified_purchase?: boolean
          order_id?: string | null
          product_id: string
          rating: number
          reply?: string | null
          reply_at?: string | null
          seller_id: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          helpful_count?: number
          id?: string
          images?: string[] | null
          is_approved?: boolean
          is_verified_purchase?: boolean
          order_id?: string | null
          product_id?: string
          rating?: number
          reply?: string | null
          reply_at?: string | null
          seller_id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      search_queries: {
        Row: {
          category_id: string | null
          created_at: string
          id: string
          query: string
          results_count: number
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          id?: string
          query: string
          results_count?: number
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          id?: string
          query?: string
          results_count?: number
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_queries_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_profiles: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          banner_url: string | null
          business_email: string
          business_license: string | null
          certifications: Json | null
          city: string
          company_address: string
          company_name: string
          contact_person: string
          created_at: string
          description: string | null
          id: string
          is_verified: boolean
          joined_date: string
          logo_url: string | null
          phone: string
          rating: number
          response_time_hours: number
          social_links: Json | null
          status: Database["public"]["Enums"]["seller_status"]
          total_products: number
          total_reviews: number
          total_sales: number
          updated_at: string
          user_id: string
          verification_note: string | null
          website: string | null
          years_in_business: number | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          banner_url?: string | null
          business_email: string
          business_license?: string | null
          certifications?: Json | null
          city: string
          company_address: string
          company_name: string
          contact_person: string
          created_at?: string
          description?: string | null
          id?: string
          is_verified?: boolean
          joined_date?: string
          logo_url?: string | null
          phone: string
          rating?: number
          response_time_hours?: number
          social_links?: Json | null
          status?: Database["public"]["Enums"]["seller_status"]
          total_products?: number
          total_reviews?: number
          total_sales?: number
          updated_at?: string
          user_id: string
          verification_note?: string | null
          website?: string | null
          years_in_business?: number | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          banner_url?: string | null
          business_email?: string
          business_license?: string | null
          certifications?: Json | null
          city?: string
          company_address?: string
          company_name?: string
          contact_person?: string
          created_at?: string
          description?: string | null
          id?: string
          is_verified?: boolean
          joined_date?: string
          logo_url?: string | null
          phone?: string
          rating?: number
          response_time_hours?: number
          social_links?: Json | null
          status?: Database["public"]["Enums"]["seller_status"]
          total_products?: number
          total_reviews?: number
          total_sales?: number
          updated_at?: string
          user_id?: string
          verification_note?: string | null
          website?: string | null
          years_in_business?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_view_count: { Args: { product_id: string }; Returns: undefined }
    }
    Enums: {
      delivery_method: "standard" | "express" | "same_day"
      listing_type: "sale" | "rent"
      message_status: "sent" | "delivered" | "read"
      notification_type:
        | "message"
        | "order"
        | "approval"
        | "rejection"
        | "review"
        | "seller_verification"
        | "system"
      order_status:
        | "pending"
        | "paid"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "refunded"
      payment_method:
        | "telebirr"
        | "cbe_birr"
        | "amole"
        | "chapa"
        | "cash_on_delivery"
      payment_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "refunded"
      product_status: "draft" | "pending" | "approved" | "rejected" | "archived"
      seller_status: "pending" | "active" | "suspended" | "rejected"
      user_role: "buyer" | "seller" | "admin" | "moderator"
      user_status: "active" | "pending" | "suspended" | "banned"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      delivery_method: ["standard", "express", "same_day"],
      listing_type: ["sale", "rent"],
      message_status: ["sent", "delivered", "read"],
      notification_type: [
        "message",
        "order",
        "approval",
        "rejection",
        "review",
        "seller_verification",
        "system",
      ],
      order_status: [
        "pending",
        "paid",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      payment_method: [
        "telebirr",
        "cbe_birr",
        "amole",
        "chapa",
        "cash_on_delivery",
      ],
      payment_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded",
      ],
      product_status: ["draft", "pending", "approved", "rejected", "archived"],
      seller_status: ["pending", "active", "suspended", "rejected"],
      user_role: ["buyer", "seller", "admin", "moderator"],
      user_status: ["active", "pending", "suspended", "banned"],
    },
  },
} as const
