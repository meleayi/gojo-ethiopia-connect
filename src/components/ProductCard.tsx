import { Heart, ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useToggleWishlist, useWishlistIds } from "@/hooks/useWishlist";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface ProductCardData {
  id: string;
  name: string;
  price: number;
  original_price?: number | null;
  originalPrice?: number | null;
  rating?: number | null;
  review_count?: number | null;
  reviews?: number;
  category?: string | null;
  city?: string | null;
  location?: string;
  image?: string;
  badge?: string;
  is_flash_deal?: boolean | null;
  in_stock?: boolean | null;
  product_images?: { url: string; is_primary: boolean | null }[];
  seller_profiles?: { company_name: string; city: string | null } | null;
  [key: string]: unknown;
}

interface ProductCardProps {
  product: ProductCardData;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { user } = useAuth();
  const wishlistIds = useWishlistIds();
  const toggleWishlist = useToggleWishlist();
  const addToCart = useAddToCart();

  const price = product.price;
  const originalPrice = product.original_price ?? product.originalPrice;
  const discount = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const primaryImage =
    product.product_images?.find((img) => img.is_primary)?.url ??
    product.product_images?.[0]?.url ??
    product.image ??
    "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&q=80";

  const rating = product.rating ?? 0;
  const reviewCount = product.review_count ?? product.reviews ?? 0;
  const isWishlisted = wishlistIds.has(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please sign in to save items"); return; }
    toggleWishlist.mutate({ productId: product.id, isWishlisted });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please sign in to add to cart"); return; }
    addToCart.mutate(
      { productId: product.id },
      { onSuccess: () => toast.success("Added to cart") }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={`/product/${product.id}`} className="block group">
        <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
          <div className="relative aspect-square overflow-hidden">
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {(product.badge || product.is_flash_deal) && (
              <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground font-semibold text-xs">
                {product.badge ?? "Flash Deal"}
              </Badge>
            )}
            {discount > 0 && (
              <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground font-semibold text-xs">
                -{discount}%
              </Badge>
            )}
            <button
              className={`absolute bottom-3 right-3 w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-secondary ${isWishlisted ? "opacity-100 text-destructive" : ""}`}
              onClick={handleWishlist}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-destructive text-destructive" : "text-foreground"}`} />
            </button>
          </div>

          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">
              {product.category ?? ""}
              {(product.city ?? product.location) ? ` • ${product.city ?? product.location}` : ""}
            </p>
            <h3 className="font-body font-semibold text-sm text-card-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            {rating > 0 && (
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
                <span className="text-xs font-medium text-card-foreground">{rating.toFixed(1)}</span>
                {reviewCount > 0 && <span className="text-xs text-muted-foreground">({reviewCount})</span>}
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg text-primary">
                  {price.toLocaleString()} ETB
                </span>
                {originalPrice && originalPrice > price && (
                  <span className="text-xs text-muted-foreground line-through">
                    {originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <Button
                size="icon"
                variant="default"
                className="w-8 h-8 rounded-full"
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
