import { Star, MapPin, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";

export interface SellerCardData {
  id: string;
  company_name?: string;
  name?: string;
  avatar?: string;
  logo_url?: string | null;
  rating?: number | null;
  city?: string | null;
  location?: string;
  is_verified?: boolean | null;
  verified?: boolean;
  product_count?: number | null;
  productCount?: number;
  [key: string]: unknown;
}

interface SellerCardProps {
  seller: SellerCardData;
  index?: number;
}

const SellerCard = ({ seller, index = 0 }: SellerCardProps) => {
  const name = seller.company_name ?? seller.name ?? "Seller";
  const location = seller.city ?? seller.location ?? "";
  const rating = seller.rating ?? 0;
  const productCount = seller.product_count ?? seller.productCount ?? 0;
  const isVerified = seller.is_verified ?? seller.verified ?? false;
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 text-center"
    >
      <div className="w-16 h-16 rounded-full gradient-teal flex items-center justify-center mx-auto mb-3 overflow-hidden">
        {seller.logo_url ? (
          <img src={seller.logo_url} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-display font-bold text-lg text-primary-foreground">{initials}</span>
        )}
      </div>
      <div className="flex items-center justify-center gap-1 mb-1">
        <h3 className="font-body font-semibold text-sm text-card-foreground">{name}</h3>
        {isVerified && <BadgeCheck className="w-4 h-4 text-secondary" />}
      </div>
      {location && (
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-2">
          <MapPin className="w-3 h-3" />
          {location}
        </div>
      )}
      <div className="flex items-center justify-center gap-2 text-xs">
        {rating > 0 && (
          <span className="flex items-center gap-0.5">
            <Star className="w-3 h-3 fill-secondary text-secondary" />
            {rating.toFixed(1)}
          </span>
        )}
        {productCount > 0 && (
          <span className="text-muted-foreground">{productCount} products</span>
        )}
      </div>
    </motion.div>
  );
};

export default SellerCard;
