import { Heart, ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/data/mock-data";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

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
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {product.badge && (
              <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground font-semibold text-xs">
                {product.badge}
              </Badge>
            )}
            {discount > 0 && (
              <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground font-semibold text-xs">
                -{discount}%
              </Badge>
            )}
            <button
              className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-secondary"
              onClick={(e) => { e.preventDefault(); }}
            >
              <Heart className="w-4 h-4 text-foreground" />
            </button>
          </div>

          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">{product.category} • {product.location}</p>
            <h3 className="font-body font-semibold text-sm text-card-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
              <span className="text-xs font-medium text-card-foreground">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.reviews})</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg text-primary">
                  {product.price.toLocaleString()} ETB
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <Button
                size="icon"
                variant="default"
                className="w-8 h-8 rounded-full"
                onClick={(e) => { e.preventDefault(); }}
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
