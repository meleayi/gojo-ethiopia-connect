import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"];
type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  listingType?: "sale" | "rent";
  sortBy?: "created_at" | "price" | "rating" | "view_count" | "wishlist_count";
  sortOrder?: "asc" | "desc";
  status?: string;
  sellerId?: string;
  isFeatured?: boolean;
  isFlashDeal?: boolean;
  pageSize?: number;
}

const PAGE_SIZE = 24;

export const useProducts = (filters: ProductFilters = {}) => {
  return useInfiniteQuery({
    queryKey: ["products", filters],
    queryFn: async ({ pageParam = 0 }) => {
      const pageSize = filters.pageSize ?? PAGE_SIZE;
      let query = supabase
        .from("products")
        .select(`
          *,
          product_images(url, is_primary, sort_order),
          seller_profiles(company_name, city, is_verified, rating),
          categories(name, slug)
        `)
        .range(pageParam * pageSize, (pageParam + 1) * pageSize - 1);

      if (filters.status) query = query.eq("status", filters.status);
      else query = query.eq("status", "approved");

      if (filters.category) query = query.eq("category_id", filters.category);
      if (filters.city) query = query.eq("city", filters.city);
      if (filters.listingType) query = query.eq("listing_type", filters.listingType);
      if (filters.sellerId) query = query.eq("seller_id", filters.sellerId);
      if (filters.minPrice !== undefined) query = query.gte("price", filters.minPrice);
      if (filters.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);
      if (filters.isFeatured) query = query.eq("is_featured", true);
      if (filters.isFlashDeal) query = query.eq("is_flash_deal", true).gt("flash_deal_ends_at", new Date().toISOString());

      if (filters.search) {
        query = query.textSearch("search_vector", filters.search, { type: "websearch" });
      }

      const sortBy = filters.sortBy ?? "created_at";
      const sortOrder = filters.sortOrder ?? "desc";
      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      const { data, error } = await query;
      if (error) throw error;
      return { data: data ?? [], nextPage: (data?.length ?? 0) === pageSize ? pageParam + 1 : undefined };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};

/**
 * Flat (non-infinite) version for simple filtered product lists.
 * Maps sortBy to Supabase column names.
 */
export const useProductsFlat = (filters: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  minRating?: number;
  sortBy?: "popular" | "price-low" | "price-high" | "newest" | "rating";
  isFeatured?: boolean;
  isFlashDeal?: boolean;
  sellerId?: string;
  limit?: number;
  status?: string;
} = {}) => {
  return useQuery({
    queryKey: ["products-flat", filters],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select(`
          *,
          product_images(url, is_primary, sort_order),
          seller_profiles(company_name, city, is_verified, rating),
          categories(name, slug)
        `);

      const status = filters.status ?? "approved";
      query = query.eq("status", status);

      if (filters.category) query = query.ilike("category", `%${filters.category}%`);
      if (filters.city) query = query.eq("city", filters.city);
      if (filters.sellerId) query = query.eq("seller_id", filters.sellerId);
      if (filters.minPrice !== undefined) query = query.gte("price", filters.minPrice);
      if (filters.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);
      if (filters.minRating !== undefined) query = query.gte("rating", filters.minRating);
      if (filters.isFeatured) query = query.eq("is_featured", true);
      if (filters.isFlashDeal) query = query.eq("is_flash_deal", true).gt("flash_deal_ends_at", new Date().toISOString());
      if (filters.search) query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);

      switch (filters.sortBy) {
        case "price-low": query = query.order("price", { ascending: true }); break;
        case "price-high": query = query.order("price", { ascending: false }); break;
        case "newest": query = query.order("created_at", { ascending: false }); break;
        case "rating": query = query.order("rating", { ascending: false }); break;
        case "popular": default: query = query.order("view_count", { ascending: false }); break;
      }

      if (filters.limit) query = query.limit(filters.limit);

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_images(*, sort_order),
          product_variants(*),
          product_attributes(*),
          seller_profiles(
            *, profiles(full_name, avatar_url)
          ),
          categories(name, name_amharic, slug)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      // Track view
      await supabase.from("product_views").insert({
        product_id: id,
        user_id: (await supabase.auth.getUser()).data.user?.id ?? null,
      });

      // Increment view count
      await supabase.rpc("increment_view_count" as never, { product_id: id } as never);

      return data;
    },
    enabled: !!id,
  });
};

export const useSellerProducts = (sellerId: string) => {
  return useQuery({
    queryKey: ["seller-products", sellerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`*, product_images(url, is_primary)`)
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    enabled: !!sellerId,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      product,
      images,
    }: {
      product: ProductInsert;
      images?: { url: string; storagePath?: string; isPrimary?: boolean }[];
    }) => {
      const { data, error } = await supabase
        .from("products")
        .insert(product)
        .select()
        .single();

      if (error) throw error;

      if (images && images.length > 0) {
        await supabase.from("product_images").insert(
          images.map((img, i) => ({
            product_id: data.id,
            url: img.url,
            storage_path: img.storagePath ?? null,
            is_primary: img.isPrimary ?? i === 0,
            sort_order: i,
          }))
        );
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ProductUpdate }) => {
      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
    },
  });
};

export const useAdminApproveProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      action,
      rejectionNote,
      adminId,
    }: {
      productId: string;
      action: "approved" | "rejected";
      rejectionNote?: string;
      adminId: string;
    }) => {
      const { data, error } = await supabase
        .from("products")
        .update({
          status: action,
          rejection_note: rejectionNote ?? null,
          approved_at: action === "approved" ? new Date().toISOString() : null,
          approved_by: action === "approved" ? adminId : null,
        })
        .eq("id", productId)
        .select("*, seller_profiles(user_id)")
        .single();

      if (error) throw error;

      // Send notification to seller
      const sellerId = (data as any).seller_profiles?.user_id;
      if (sellerId) {
        await supabase.from("notifications").insert({
          user_id: sellerId,
          type: action === "approved" ? "approval" : "rejection",
          title: action === "approved" ? "Product approved!" : "Product needs revision",
          body: action === "approved"
            ? `Your product "${data.name}" is now live on Gojo.`
            : rejectionNote ?? "Your product requires changes before it can be listed.",
          data: { product_id: productId },
          action_url: `/seller-dashboard`,
        });
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
};

export const useAdminProducts = (filters: { status?: string; search?: string } = {}) => {
  return useQuery({
    queryKey: ["admin-products", filters],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select(`*, seller_profiles(company_name), categories(name)`)
        .order("created_at", { ascending: false });

      if (filters.status && filters.status !== "all") query = query.eq("status", filters.status);
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,categories.name.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
};
