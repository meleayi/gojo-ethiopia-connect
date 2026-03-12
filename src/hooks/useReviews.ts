import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/lib/database.types";

type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];

export const useReviews = (productId: string) => useProductReviews(productId);

export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`*, profiles(full_name, avatar_url, city)`)
        .eq("product_id", productId)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    enabled: !!productId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (review: Omit<ReviewInsert, "user_id">) => {
      if (!user) throw new Error("Must be logged in");
      const { data, error } = await supabase
        .from("reviews")
        .insert({ ...review, user_id: user.id })
        .select()
        .single();

      if (error) throw error;

      // Notify the seller
      await supabase.from("notifications").insert({
        user_id: review.seller_id,
        type: "review",
        title: "New product review",
        body: `A customer left a ${review.rating}-star review on your product.`,
        data: { product_id: review.product_id },
        action_url: "/seller-dashboard",
      });

      return data;
    },
    onSuccess: (_, review) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", review.product_id] });
      queryClient.invalidateQueries({ queryKey: ["product", review.product_id] });
    },
  });
};

export const useSellerReplyToReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, reply }: { reviewId: string; reply: string }) => {
      const { data, error } = await supabase
        .from("reviews")
        .update({ reply, reply_at: new Date().toISOString() })
        .eq("id", reviewId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", data.product_id] });
    },
  });
};

export const useMarkReviewHelpful = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, productId }: { reviewId: string; productId: string }) => {
      const { error } = await supabase
        .from("reviews")
        .update({ helpful_count: supabase.rpc("increment_helpful" as never, { review_id: reviewId } as never) as unknown as number })
        .eq("id", reviewId);

      if (error) throw error;
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    },
  });
};
