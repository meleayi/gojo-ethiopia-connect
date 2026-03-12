import { Star, MapPin, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import type { Seller } from "@/data/mock-data";

interface SellerCardProps {
  seller: Seller;
  index?: number;
}

const SellerCard = ({ seller, index = 0 }: SellerCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 text-center"
    >
      <div className="w-16 h-16 rounded-full gradient-teal flex items-center justify-center mx-auto mb-3">
        <span className="font-display font-bold text-lg text-primary-foreground">{seller.avatar}</span>
      </div>
      <div className="flex items-center justify-center gap-1 mb-1">
        <h3 className="font-body font-semibold text-sm text-card-foreground">{seller.name}</h3>
        {seller.verified && <BadgeCheck className="w-4 h-4 text-secondary" />}
      </div>
      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-2">
        <MapPin className="w-3 h-3" />
        {seller.location}
      </div>
      <div className="flex items-center justify-center gap-2 text-xs">
        <span className="flex items-center gap-0.5">
          <Star className="w-3 h-3 fill-secondary text-secondary" />
          {seller.rating}
        </span>
        <span className="text-muted-foreground">{seller.productCount} products</span>
      </div>
    </motion.div>
  );
};

export default SellerCard;
