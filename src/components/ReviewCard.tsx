import { Star } from "lucide-react";
import { motion } from "framer-motion";

export interface ReviewCardData {
  id: string;
  rating: number;
  comment?: string | null;
  body?: string | null;
  avatar?: string;
  userName?: string;
  user_name?: string;
  location?: string;
  city?: string | null;
  created_at?: string;
  profiles?: { full_name?: string | null; avatar_url?: string | null; city?: string | null } | null;
  [key: string]: unknown;
}

interface ReviewCardProps {
  review: ReviewCardData;
  index?: number;
}

const ReviewCard = ({ review, index = 0 }: ReviewCardProps) => {
  const name = review.profiles?.full_name ?? review.userName ?? review.user_name ?? "Customer";
  const location = review.profiles?.city ?? review.location ?? review.city ?? "";
  const text = review.comment ?? review.body ?? "";
  const initial = name.charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-card rounded-xl p-6 shadow-card"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center overflow-hidden">
          {review.profiles?.avatar_url ? (
            <img src={review.profiles.avatar_url} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="font-body font-semibold text-sm text-secondary-foreground">{review.avatar ?? initial}</span>
          )}
        </div>
        <div>
          <h4 className="font-body font-semibold text-sm text-card-foreground">{name}</h4>
          {location && <p className="text-xs text-muted-foreground">{location}</p>}
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
      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
    </motion.div>
  );
};

export default ReviewCard;
