import { motion } from "framer-motion";
import type { Category } from "@/data/mock-data";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  category: Category;
  index?: number;
}

const CategoryCard = ({ category, index = 0 }: CategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Link to={`/products?category=${category.name}`} className="block group">
        <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-display font-bold text-lg text-primary-foreground">{category.name}</h3>
            <p className="text-primary-foreground/70 text-xs font-body">{category.nameAmharic}</p>
            <p className="text-primary-foreground/60 text-xs font-body mt-1">{category.productCount} products</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
