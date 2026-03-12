import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useSellers = (options?: {
  status?: "active" | "pending" | "suspended" | "rejected";
  verified?: boolean;
  limit?: number;
} | "active" | "pending" | "suspended" | "rejected") => {
  const opts = typeof options === "string" ? { status: options } : (options ?? {});

  return useQuery({
    queryKey: ["sellers", opts],
    queryFn: async () => {
      let query = supabase
        .from("seller_profiles")
        .select(`*, profiles(full_name, email, avatar_url, phone)`)
        .order("rating", { ascending: false });

      if (opts.status) query = query.eq("status", opts.status);
      else query = query.eq("status", "active");

      if (opts.verified) query = query.eq("is_verified", true);
      if (opts.limit) query = query.limit(opts.limit);

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useSeller = (sellerId: string) => {
  return useQuery({
    queryKey: ["seller", sellerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seller_profiles")
        .select(`*, profiles(full_name, email, avatar_url, phone)`)
        .eq("id", sellerId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!sellerId,
  });
};

export const useAdminApproveSeller = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sellerId,
      action,
      note,
      adminId,
    }: {
      sellerId: string;
      action: "active" | "rejected" | "suspended";
      note?: string;
      adminId: string;
    }) => {
      const { data, error } = await supabase
        .from("seller_profiles")
        .update({
          status: action,
          is_verified: action === "active",
          verification_note: note ?? null,
          approved_at: action === "active" ? new Date().toISOString() : null,
          approved_by: action === "active" ? adminId : null,
        })
        .eq("id", sellerId)
        .select("*, user_id")
        .single();

      if (error) throw error;

      // Update profile role status
      if (action === "active") {
        await supabase.from("profiles").update({ role: "seller" }).eq("id", data.user_id);
      }

      // Send notification
      await supabase.from("notifications").insert({
        user_id: data.user_id,
        type: "seller_verification",
        title: action === "active" ? "Your seller account is approved!" : "Seller application update",
        body: action === "active"
          ? "Congratulations! You are now a verified seller on Gojo. Start listing your products!"
          : note ?? "Your seller application was not approved at this time.",
        data: { seller_id: sellerId },
        action_url: action === "active" ? "/seller-dashboard" : "/login",
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
      queryClient.invalidateQueries({ queryKey: ["seller"] });
    },
  });
};

export const useSellerStats = (sellerId: string) => {
  return useQuery({
    queryKey: ["seller-stats", sellerId],
    queryFn: async () => {
      const [ordersRes, productsRes, reviewsRes] = await Promise.all([
        supabase
          .from("orders")
          .select("status, total, created_at")
          .eq("seller_id", sellerId),
        supabase
          .from("products")
          .select("status, view_count, wishlist_count, order_count")
          .eq("seller_id", sellerId),
        supabase
          .from("reviews")
          .select("rating")
          .eq("seller_id", sellerId),
      ]);

      const orders = ordersRes.data ?? [];
      const products = productsRes.data ?? [];
      const reviews = reviewsRes.data ?? [];

      const totalRevenue = orders
        .filter((o) => o.status === "delivered")
        .reduce((sum, o) => sum + o.total, 0);

      const avgRating = reviews.length
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      return {
        totalOrders: orders.length,
        totalRevenue,
        totalProducts: products.length,
        approvedProducts: products.filter((p) => p.status === "approved").length,
        pendingProducts: products.filter((p) => p.status === "pending").length,
        rejectedProducts: products.filter((p) => p.status === "rejected").length,
        totalViews: products.reduce((sum, p) => sum + (p.view_count ?? 0), 0),
        avgRating: parseFloat(avgRating.toFixed(2)),
        totalReviews: reviews.length,
      };
    },
    enabled: !!sellerId,
  });
};
