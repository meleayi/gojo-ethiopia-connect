import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { subDays, startOfMonth, startOfYear, startOfDay, subMonths } from "date-fns";

export type DateRangePreset =
  | "today"
  | "yesterday"
  | "last_7_days"
  | "last_30_days"
  | "this_month"
  | "this_year"
  | "custom";

export interface DateRange {
  from: Date;
  to: Date;
}

const getDateRange = (preset: DateRangePreset, custom?: DateRange): DateRange => {
  const now = new Date();
  switch (preset) {
    case "today":
      return { from: startOfDay(now), to: now };
    case "yesterday":
      return { from: startOfDay(subDays(now, 1)), to: startOfDay(now) };
    case "last_7_days":
      return { from: subDays(now, 7), to: now };
    case "last_30_days":
      return { from: subDays(now, 30), to: now };
    case "this_month":
      return { from: startOfMonth(now), to: now };
    case "this_year":
      return { from: startOfYear(now), to: now };
    case "custom":
      return custom ?? { from: subDays(now, 30), to: now };
    default:
      return { from: subDays(now, 30), to: now };
  }
};

export const useAdminAnalytics = (preset: DateRangePreset, custom?: DateRange) => {
  const range = getDateRange(preset, custom);
  return useQuery({
    queryKey: ["admin-analytics", preset, custom],
    queryFn: async () => {
      const from = range.from.toISOString();
      const to = range.to.toISOString();

      const [ordersRes, usersRes, productsRes, viewsRes] = await Promise.all([
        supabase
          .from("orders")
          .select("status, total, created_at, seller_id")
          .gte("created_at", from)
          .lte("created_at", to),
        supabase
          .from("profiles")
          .select("role, created_at")
          .gte("created_at", from)
          .lte("created_at", to),
        supabase
          .from("products")
          .select("status, category_id, view_count, created_at")
          .gte("created_at", from)
          .lte("created_at", to),
        supabase
          .from("product_views")
          .select("product_id, created_at")
          .gte("created_at", from)
          .lte("created_at", to),
      ]);

      const orders = ordersRes.data ?? [];
      const users = usersRes.data ?? [];
      const products = productsRes.data ?? [];
      const views = viewsRes.data ?? [];

      const totalRevenue = orders
        .filter((o) => o.status === "delivered" || o.status === "paid")
        .reduce((sum, o) => sum + o.total, 0);

      const totalOrders = orders.length;
      const newUsers = users.length;
      const totalViews = views.length;

      // Revenue by day for chart
      const revenueByDay: Record<string, number> = {};
      orders.forEach((o) => {
        const day = o.created_at.split("T")[0];
        revenueByDay[day] = (revenueByDay[day] ?? 0) + o.total;
      });

      const revenueChart = Object.entries(revenueByDay)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, revenue]) => ({ date, revenue }));

      // Orders by status
      const ordersByStatus: Record<string, number> = {};
      orders.forEach((o) => {
        ordersByStatus[o.status] = (ordersByStatus[o.status] ?? 0) + 1;
      });

      return {
        totalRevenue,
        totalOrders,
        newUsers,
        totalViews,
        revenueChart,
        ordersByStatus,
      };
    },
  });
};

export const useSellerAnalytics = (sellerId: string, preset: DateRangePreset, custom?: DateRange) => {
  const range = getDateRange(preset, custom);
  return useQuery({
    queryKey: ["seller-analytics", sellerId, preset, custom],
    queryFn: async () => {
      const from = range.from.toISOString();
      const to = range.to.toISOString();

      const [ordersRes, viewsRes, reviewsRes] = await Promise.all([
        supabase
          .from("orders")
          .select("status, total, created_at")
          .eq("seller_id", sellerId)
          .gte("created_at", from)
          .lte("created_at", to),
        supabase
          .from("product_views")
          .select("product_id, created_at")
          .in(
            "product_id",
            (await supabase.from("products").select("id").eq("seller_id", sellerId)).data?.map((p) => p.id) ?? []
          )
          .gte("created_at", from)
          .lte("created_at", to),
        supabase
          .from("reviews")
          .select("rating, created_at")
          .eq("seller_id", sellerId)
          .gte("created_at", from)
          .lte("created_at", to),
      ]);

      const orders = ordersRes.data ?? [];
      const views = viewsRes.data ?? [];
      const reviews = reviewsRes.data ?? [];

      const totalRevenue = orders
        .filter((o) => o.status === "delivered" || o.status === "paid")
        .reduce((sum, o) => sum + o.total, 0);

      const avgRating = reviews.length
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      // Revenue chart by month for last 7 months
      const months = Array.from({ length: 7 }, (_, i) => {
        const d = subMonths(new Date(), 6 - i);
        return { month: d.toLocaleString("default", { month: "short" }), value: d.toISOString().slice(0, 7) };
      });

      const revenueByMonth: Record<string, number> = {};
      const ordersByMonth: Record<string, number> = {};
      orders.forEach((o) => {
        const m = o.created_at.slice(0, 7);
        revenueByMonth[m] = (revenueByMonth[m] ?? 0) + o.total;
        ordersByMonth[m] = (ordersByMonth[m] ?? 0) + 1;
      });

      const revenueChart = months.map(({ month, value }) => ({
        month,
        revenue: revenueByMonth[value] ?? 0,
        orders: ordersByMonth[value] ?? 0,
      }));

      return {
        totalRevenue,
        totalOrders: orders.length,
        totalViews: views.length,
        avgRating: parseFloat(avgRating.toFixed(2)),
        totalReviews: reviews.length,
        revenueChart,
      };
    },
    enabled: !!sellerId,
  });
};
