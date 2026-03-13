// Re-export auto-generated types from Lovable Cloud
export type { Database } from "@/integrations/supabase/types";

// Re-export convenience type aliases
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
