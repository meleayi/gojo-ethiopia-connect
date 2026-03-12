import { Star } from "lucide-react";
import { motion } from "framer-motion";
import type { Review } from "@/data/mock-data";

interface ReviewCardProps {
  review: Review;
  index?: number;
}

const ReviewCard = ({ review, index = 0 }: ReviewCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-card rounded-xl p-6 shadow-card"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
          <span className="font-body font-semibold text-sm text-secondary-foreground">{review.avatar}</span>
        </div>
        <div>
          <h4 className="font-body font-semibold text-sm text-card-foreground">{review.userName}</h4>
          <p className="text-xs text-muted-foreground">{review.location}</p>
        </div>
      </div>
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < review.rating ? "fill-secondary text-secondary" : "text-muted"}`}
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
    </motion.div>
  );
};

export default ReviewCard;
