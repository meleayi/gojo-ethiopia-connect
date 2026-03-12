import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Heart, ShoppingCart, Truck, Shield, MapPin, Minus, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ReviewCard from "@/components/ReviewCard";
import { products, reviews } from "@/data/mock-data";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id) || products[0];
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const images = [product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6">
        <div className="text-xs text-muted-foreground font-body mb-6">
          <Link to="/" className="hover:text-primary">Home</Link> / <Link to="/products" className="hover:text-primary">Products</Link> / <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-card rounded-2xl overflow-hidden shadow-card mb-4">
              <img src={images[selectedImage]} alt={product.name} className="w-full aspect-square object-cover" />
            </div>
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === i ? "border-primary" : "border-transparent"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div>
              <p className="text-xs text-muted-foreground font-body mb-1">{product.category} • {product.seller}</p>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">{product.name}</h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-secondary text-secondary" />
                  <span className="text-sm font-semibold font-body">{product.rating}</span>
                  <span className="text-sm text-muted-foreground font-body">({product.reviews} reviews)</span>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1 font-body"><MapPin className="w-3 h-3" />{product.location}</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-primary">{product.price.toLocaleString()} ETB</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through font-body">{product.originalPrice.toLocaleString()} ETB</span>
                  <span className="text-sm font-semibold text-destructive font-body">-{discount}%</span>
                </>
              )}
            </div>

            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              Experience the finest quality {product.category.toLowerCase()} from Ethiopia. Carefully sourced from local artisans and producers, this product represents the best of Ethiopian craftsmanship and tradition.
            </p>

            <div className="space-y-3 py-4 border-t border-b border-border">
              <div className="flex items-center gap-3 text-sm font-body">
                <Truck className="w-4 h-4 text-primary" />
                <span>Free delivery to {product.location} • Est. 2-4 days</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-body">
                <Shield className="w-4 h-4 text-primary" />
                <span>Buyer protection • Easy returns</span>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-body font-medium text-foreground">Quantity:</span>
              <div className="flex items-center rounded-lg border border-input">
                <Button variant="ghost" size="icon" className="w-9 h-9" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-10 text-center text-sm font-body font-semibold">{quantity}</span>
                <Button variant="ghost" size="icon" className="w-9 h-9" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="gold" size="xl" className="flex-1">
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </Button>
              <Button variant="hero" size="xl" className="flex-1">
                Buy Now
              </Button>
              <Button variant="outline" size="icon" className="w-14 h-14 flex-shrink-0">
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* Seller Info */}
            <div className="bg-muted rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-teal flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm font-body">{product.seller.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-body font-semibold text-sm">{product.seller}</p>
                  <p className="text-xs text-muted-foreground font-body">{product.location}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Visit Store <ChevronRight className="w-3 h-3" /></Button>
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        <section className="mb-12">
          <h2 className="font-display text-xl font-bold text-foreground mb-6">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.slice(0, 2).map((review, i) => (
              <ReviewCard key={review.id} review={review} index={i} />
            ))}
          </div>
        </section>

        {/* Related */}
        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
