export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  seller: string;
  location: string;
  badge?: string;
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameAmharic: string;
  image: string;
  productCount: number;
}

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  location: string;
  rating: number;
  productCount: number;
  verified: boolean;
}

export interface Review {
  id: string;
  userName: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  location: string;
}

export const categories: Category[] = [
  { id: "1", name: "Coffee", nameAmharic: "ቡና", image: "/category-coffee.jpg", productCount: 245 },
  { id: "2", name: "Textiles", nameAmharic: "ጨርቃ ጨርቅ", image: "/category-textiles.jpg", productCount: 189 },
  { id: "3", name: "Spices", nameAmharic: "ቅመማ ቅመም", image: "/category-spices.jpg", productCount: 312 },
  { id: "4", name: "Fashion", nameAmharic: "ፋሽን", image: "/category-fashion.jpg", productCount: 478 },
  { id: "5", name: "Jewelry", nameAmharic: "ጌጣጌጥ", image: "/category-jewelry.jpg", productCount: 156 },
  { id: "6", name: "Home & Living", nameAmharic: "ቤት እና ኑሮ", image: "/category-coffee.jpg", productCount: 234 },
];

export const products: Product[] = [
  { id: "1", name: "Premium Yirgacheffe Coffee Beans", price: 850, originalPrice: 1200, image: "/category-coffee.jpg", category: "Coffee", rating: 4.8, reviews: 234, seller: "Abyssinia Coffee", location: "Addis Ababa", badge: "Best Seller", inStock: true },
  { id: "2", name: "Handwoven Habesha Kemis", price: 3500, originalPrice: 4200, image: "/category-fashion.jpg", category: "Fashion", rating: 4.9, reviews: 189, seller: "Ethio Fashion", location: "Addis Ababa", badge: "Trending", inStock: true },
  { id: "3", name: "Authentic Berbere Spice Mix", price: 320, image: "/category-spices.jpg", category: "Spices", rating: 4.7, reviews: 456, seller: "Spice Kingdom", location: "Hawassa", inStock: true },
  { id: "4", name: "Ethiopian Gold Necklace Set", price: 12500, originalPrice: 15000, image: "/category-jewelry.jpg", category: "Jewelry", rating: 4.6, reviews: 78, seller: "Axum Jewelers", location: "Axum", badge: "Flash Deal", inStock: true },
  { id: "5", name: "Traditional Mesob Basket", price: 2800, image: "/category-textiles.jpg", category: "Home & Living", rating: 4.5, reviews: 123, seller: "Ethio Crafts", location: "Bahir Dar", inStock: true },
  { id: "6", name: "Sidamo Coffee Bundle", price: 1450, originalPrice: 1800, image: "/category-coffee.jpg", category: "Coffee", rating: 4.9, reviews: 567, seller: "Green Gold Ethiopia", location: "Sidamo", badge: "Top Rated", inStock: true },
  { id: "7", name: "Hand-Embroidered Scarf", price: 1200, image: "/category-textiles.jpg", category: "Textiles", rating: 4.4, reviews: 89, seller: "Habesha Threads", location: "Gondar", inStock: true },
  { id: "8", name: "Organic Turmeric Powder", price: 180, originalPrice: 250, image: "/category-spices.jpg", category: "Spices", rating: 4.3, reviews: 201, seller: "Natural Ethiopia", location: "Jimma", badge: "20% Off", inStock: true },
  { id: "9", name: "Leather Messenger Bag", price: 4500, image: "/category-fashion.jpg", category: "Fashion", rating: 4.7, reviews: 145, seller: "Addis Leather", location: "Addis Ababa", inStock: true },
  { id: "10", name: "Silver Engagement Ring", price: 8900, originalPrice: 11000, image: "/category-jewelry.jpg", category: "Jewelry", rating: 4.8, reviews: 67, seller: "Lalibela Gems", location: "Lalibela", badge: "Premium", inStock: true },
  { id: "11", name: "Wildflower Honey (1kg)", price: 650, image: "/category-spices.jpg", category: "Spices", rating: 4.9, reviews: 890, seller: "Tigray Honey", location: "Mekelle", badge: "Best Seller", inStock: true },
  { id: "12", name: "Modern Ethiopian Dress", price: 2800, originalPrice: 3500, image: "/category-fashion.jpg", category: "Fashion", rating: 4.6, reviews: 234, seller: "Selam Designs", location: "Addis Ababa", inStock: true },
];

export const sellers: Seller[] = [
  { id: "1", name: "Abyssinia Coffee", avatar: "AC", location: "Addis Ababa", rating: 4.8, productCount: 45, verified: true },
  { id: "2", name: "Ethio Fashion House", avatar: "EF", location: "Addis Ababa", rating: 4.9, productCount: 120, verified: true },
  { id: "3", name: "Spice Kingdom", avatar: "SK", location: "Hawassa", rating: 4.7, productCount: 67, verified: true },
  { id: "4", name: "Axum Jewelers", avatar: "AJ", location: "Axum", rating: 4.6, productCount: 34, verified: true },
  { id: "5", name: "Green Gold Ethiopia", avatar: "GG", location: "Sidamo", rating: 4.9, productCount: 28, verified: true },
  { id: "6", name: "Habesha Threads", avatar: "HT", location: "Gondar", rating: 4.5, productCount: 89, verified: false },
];

export const reviews: Review[] = [
  { id: "1", userName: "Hanna T.", avatar: "HT", rating: 5, comment: "Amazing quality coffee! The aroma is incredible and it arrived so quickly. Gojo makes shopping local so easy.", date: "2026-03-01", location: "Addis Ababa" },
  { id: "2", userName: "Dawit M.", avatar: "DM", rating: 5, comment: "The habesha kemis I ordered is absolutely beautiful. The craftsmanship is outstanding. My wife loved it!", date: "2026-02-28", location: "Hawassa" },
  { id: "3", userName: "Sara A.", avatar: "SA", rating: 4, comment: "Great selection of spices. Delivery was fast and everything was well-packaged. Will definitely order again.", date: "2026-02-25", location: "Bahir Dar" },
  { id: "4", userName: "Yonas K.", avatar: "YK", rating: 5, comment: "Found unique handmade jewelry that I couldn't find anywhere else. Gojo is changing Ethiopian e-commerce!", date: "2026-02-20", location: "Mekelle" },
];

export const flashDeals = products.filter(p => p.originalPrice).slice(0, 4);
export const bestSellers = products.filter(p => p.badge === "Best Seller" || p.badge === "Top Rated");
export const trendingProducts = products.filter(p => p.badge === "Trending" || p.rating >= 4.7).slice(0, 6);

export const ethiopianCities = [
  "Addis Ababa", "Hawassa", "Bahir Dar", "Mekelle", "Gondar",
  "Dire Dawa", "Jimma", "Axum", "Lalibela", "Harar", "Sidamo",
];
