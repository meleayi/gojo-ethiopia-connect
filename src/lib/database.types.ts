export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "buyer" | "seller" | "admin" | "moderator";
export type UserStatus = "active" | "pending" | "suspended" | "banned";
export type SellerStatus = "pending" | "active" | "suspended" | "rejected";
export type ProductStatus = "draft" | "pending" | "approved" | "rejected" | "archived";
export type ListingType = "sale" | "rent";
export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
export type PaymentMethod = "telebirr" | "cbe_birr" | "amole" | "chapa" | "cash_on_delivery";
export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded";
export type NotificationType = "message" | "order" | "approval" | "rejection" | "review" | "seller_verification" | "system";
export type DeliveryMethod = "standard" | "express" | "same_day";
export type MessageStatus = "sent" | "delivered" | "read";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: UserRole;
          status: UserStatus;
          city: string | null;
          sub_city: string | null;
          woreda: string | null;
          house_number: string | null;
          preferred_language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };

      seller_profiles: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          contact_person: string;
          business_email: string;
          phone: string;
          business_license: string | null;
          company_address: string;
          city: string;
          years_in_business: number | null;
          description: string | null;
          logo_url: string | null;
          banner_url: string | null;
          website: string | null;
          social_links: Json;
          certifications: Json;
          status: SellerStatus;
          is_verified: boolean;
          verification_note: string | null;
          rating: number;
          total_reviews: number;
          total_sales: number;
          total_products: number;
          response_time_hours: number;
          joined_date: string;
          approved_at: string | null;
          approved_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["seller_profiles"]["Row"], "id" | "created_at" | "updated_at" | "rating" | "total_reviews" | "total_sales" | "total_products" | "response_time_hours"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          rating?: number;
          total_reviews?: number;
          total_sales?: number;
          total_products?: number;
          response_time_hours?: number;
        };
        Update: Partial<Database["public"]["Tables"]["seller_profiles"]["Insert"]>;
      };

      categories: {
        Row: {
          id: string;
          name: string;
          name_amharic: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          icon: string | null;
          parent_id: string | null;
          sort_order: number;
          is_active: boolean;
          product_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["categories"]["Row"], "id" | "created_at" | "updated_at" | "product_count"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          product_count?: number;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
      };

      products: {
        Row: {
          id: string;
          seller_id: string;
          category_id: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          original_price: number | null;
          currency: string;
          listing_type: ListingType;
          rent_period: string | null;
          status: ProductStatus;
          rejection_note: string | null;
          badge: string | null;
          in_stock: boolean;
          stock_quantity: number;
          min_order_quantity: number;
          max_order_quantity: number | null;
          weight_kg: number | null;
          dimensions: Json;
          condition: string;
          brand: string | null;
          model: string | null;
          location: string;
          city: string;
          specs: Json;
          tags: string[];
          view_count: number;
          wishlist_count: number;
          order_count: number;
          rating: number;
          review_count: number;
          is_featured: boolean;
          is_flash_deal: boolean;
          flash_deal_ends_at: string | null;
          approved_at: string | null;
          approved_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at" | "updated_at" | "view_count" | "wishlist_count" | "order_count" | "rating" | "review_count"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          view_count?: number;
          wishlist_count?: number;
          order_count?: number;
          rating?: number;
          review_count?: number;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };

      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          storage_path: string | null;
          alt_text: string | null;
          sort_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["product_images"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["product_images"]["Insert"]>;
      };

      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          sku: string | null;
          price_adjustment: number;
          stock_quantity: number;
          attributes: Json;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["product_variants"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["product_variants"]["Insert"]>;
      };

      product_attributes: {
        Row: {
          id: string;
          product_id: string;
          attribute_name: string;
          attribute_value: string;
          sort_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["product_attributes"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["product_attributes"]["Insert"]>;
      };

      reviews: {
        Row: {
          id: string;
          product_id: string;
          order_id: string | null;
          user_id: string;
          seller_id: string;
          rating: number;
          title: string | null;
          comment: string | null;
          images: string[];
          is_verified_purchase: boolean;
          helpful_count: number;
          is_approved: boolean;
          reply: string | null;
          reply_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at" | "updated_at" | "helpful_count"> & { id?: string; created_at?: string; updated_at?: string; helpful_count?: number };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };

      wishlists: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["wishlists"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["wishlists"]["Insert"]>;
      };

      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          full_name: string;
          phone: string;
          city: string;
          sub_city: string;
          woreda: string;
          house_number: string | null;
          additional_info: string | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["addresses"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["addresses"]["Insert"]>;
      };

      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          variant_id: string | null;
          quantity: number;
          saved_for_later: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["cart_items"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["cart_items"]["Insert"]>;
      };

      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string;
          seller_id: string;
          status: OrderStatus;
          subtotal: number;
          delivery_fee: number;
          discount: number;
          total: number;
          currency: string;
          address_id: string | null;
          shipping_full_name: string;
          shipping_phone: string;
          shipping_city: string;
          shipping_sub_city: string;
          shipping_woreda: string;
          shipping_house_number: string | null;
          shipping_additional_info: string | null;
          delivery_method: DeliveryMethod;
          estimated_delivery_at: string | null;
          delivered_at: string | null;
          cancelled_at: string | null;
          cancel_reason: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };

      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          variant_id: string | null;
          seller_id: string;
          product_name: string;
          product_image: string;
          variant_name: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["order_items"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
      };

      payments: {
        Row: {
          id: string;
          order_id: string;
          user_id: string;
          method: PaymentMethod;
          status: PaymentStatus;
          amount: number;
          currency: string;
          transaction_id: string | null;
          provider_reference: string | null;
          provider_response: Json;
          paid_at: string | null;
          failed_at: string | null;
          failure_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["payments"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
      };

      conversations: {
        Row: {
          id: string;
          buyer_id: string;
          seller_id: string;
          product_id: string | null;
          order_id: string | null;
          last_message_at: string;
          buyer_unread_count: number;
          seller_unread_count: number;
          is_archived: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["conversations"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["conversations"]["Insert"]>;
      };

      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string | null;
          image_url: string | null;
          attachment_url: string | null;
          attachment_name: string | null;
          message_type: "text" | "image" | "attachment";
          status: MessageStatus;
          is_deleted: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["messages"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };

      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: NotificationType;
          title: string;
          body: string;
          data: Json;
          is_read: boolean;
          read_at: string | null;
          action_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["notifications"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };

      product_views: {
        Row: {
          id: string;
          product_id: string;
          user_id: string | null;
          session_id: string | null;
          ip_hash: string | null;
          referrer: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["product_views"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["product_views"]["Insert"]>;
      };

      search_queries: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string | null;
          query: string;
          results_count: number;
          category_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["search_queries"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["search_queries"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      user_status: UserStatus;
      seller_status: SellerStatus;
      product_status: ProductStatus;
      listing_type: ListingType;
      order_status: OrderStatus;
      payment_method: PaymentMethod;
      payment_status: PaymentStatus;
      notification_type: NotificationType;
      delivery_method: DeliveryMethod;
      message_status: MessageStatus;
    };
  };
}
