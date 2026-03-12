import { motion } from "framer-motion";
import {
  ArrowRight, Zap, TrendingUp, Truck, Shield, ChevronRight,
  Laptop, Car, Home, Gift, Smartphone, ShoppingBag, Footprints, Gem
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import SellerCard from "@/components/SellerCard";
import ReviewCard from "@/components/ReviewCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroBanner from "@/assets/hero-banner.jpg";
import { categories, products, flashDeals, bestSellers, trendingProducts, sellers, reviews } from "@/data/mock-data";
import { useState } from "react";

const SectionHeader = ({ title, subtitle, link }: { title: string; subtitle?: string; link?: string }) => (
  <div className="flex items-end justify-between mb-6">
    <div>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground font-body mt-1">{subtitle}</p>}
    </div>
    {link && (
      <Link to={link} className="text-sm font-body font-medium text-primary flex items-center gap-1 hover:text-teal-light transition-colors">
        View All <ChevronRight className="w-4 h-4" />
      </Link>
    )}
  </div>
);

const QUICK_CATS = [
  { name: "Electronics", icon: Laptop, path: "/products?category=Electronics", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { name: "Cars", icon: Car, path: "/products?category=Cars", color: "bg-red-500/10 text-red-600 dark:text-red-400" },
  { name: "Home Rent", icon: Home, path: "/products?category=Home Rent", color: "bg-green-500/10 text-green-600 dark:text-green-400" },
  { name: "Gifts", icon: Gift, path: "/products?category=Gifts", color: "bg-pink-500/10 text-pink-600 dark:text-pink-400" },
  { name: "Phones", icon: Smartphone, path: "/products?category=Electronics", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  { name: "Bags", icon: ShoppingBag, path: "/products?category=Bags", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { name: "Shoes", icon: Footprints, path: "/products?category=Shoes", color: "bg-teal-500/10 text-teal-600 dark:text-teal-400" },
  { name: "Jewelry", icon: Gem, path: "/products?category=Jewelry", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
];

const Index = () => {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBanner} alt="Ethiopian marketplace" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-transparent" />
        </div>
        <div className="relative container py-16 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-body font-semibold mb-4">
              🇪🇹 Ethiopia's #1 Marketplace
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-4">
              Discover the Best of{" "}
              <span className="text-gradient-gold">Ethiopia</span>
            </h1>
            <p className="text-primary-foreground/80 text-base md:text-lg font-body mb-8 leading-relaxed">
              From handwoven textiles to premium coffee beans, electronics to real estate — shop and list anything from trusted local sellers.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products">
                <Button variant="gold" size="xl" data-testid="hero-shop-btn">
                  Start Shopping <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/seller-dashboard">
                <Button variant="hero-outline" size="xl" data-testid="hero-sell-btn">
                  Become a Seller
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-card border-b border-border">
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, label: "Nationwide Delivery", value: "100+ Cities" },
              { icon: Shield, label: "Buyer Protection", value: "100% Secure" },
              { icon: Zap, label: "Flash Deals", value: "Up to 70% Off" },
              { icon: TrendingUp, label: "Active Sellers", value: "5,000+" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-body font-semibold text-sm text-card-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-body">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Category Icons */}
      <section className="container py-8">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {QUICK_CATS.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={cat.path} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted transition-colors group" data-testid={`quick-cat-${cat.name.toLowerCase()}`}>
                <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-body font-medium text-foreground text-center">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* All Categories */}
      <section className="container py-8">
        <SectionHeader title="Shop by Category" subtitle="Explore Ethiopia's finest collections across 14 categories" link="/products" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.slice(0, 14).map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </section>

      {/* Flash Deals */}
      <section className="bg-card py-12">
        <div className="container">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-secondary" />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Flash Deals</h2>
            <div className="ml-auto flex items-center gap-2">
              <div className="flex gap-1">
                {["08", "42", "15"].map((t, i) => (
                  <span key={i} className="bg-primary text-primary-foreground text-xs font-body font-bold px-2 py-1 rounded">
                    {t}
                  </span>
                ))}
              </div>
              <Link to="/flash-deals" className="text-sm font-body font-medium text-primary flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {flashDeals.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Electronics Feature */}
      <section className="container py-12">
        <SectionHeader title="Electronics & Tech" subtitle="Latest gadgets and devices" link="/products?category=Electronics" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.filter(p => p.category === "Electronics").slice(0, 5).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-card py-12">
        <div className="container">
          <SectionHeader title="Best Sellers" subtitle="Most loved products by Ethiopian shoppers" link="/products" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bestSellers.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Real Estate Banner */}
      <section className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/products?category=Home Rent">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative rounded-2xl overflow-hidden h-48 cursor-pointer"
            >
              <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80" alt="Home Rent" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-primary-foreground/80 text-xs font-body mb-1">Rent a Home</p>
                <p className="font-display text-2xl font-bold text-primary-foreground">Find Your Perfect Rental</p>
                <p className="text-primary-foreground/70 text-sm font-body mt-1">Apartments, Villas & More</p>
              </div>
            </motion.div>
          </Link>
          <Link to="/products?category=Cars">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative rounded-2xl overflow-hidden h-48 cursor-pointer"
            >
              <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80" alt="Cars" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-primary-foreground/80 text-xs font-body mb-1">Buy a Car</p>
                <p className="font-display text-2xl font-bold text-primary-foreground">New & Used Vehicles</p>
                <p className="text-primary-foreground/70 text-sm font-body mt-1">Luxury, SUVs & Economy</p>
              </div>
            </motion.div>
          </Link>
        </div>
      </section>

      {/* Trending */}
      <section className="bg-card py-12">
        <div className="container">
          <SectionHeader title="Trending Now" subtitle="What's popular across Ethiopia" link="/products" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trendingProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Gifts Section */}
      <section className="container py-12">
        <SectionHeader title="Gift Ideas" subtitle="Perfect for every occasion" link="/products?category=Gifts" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.filter(p => p.category === "Gifts").slice(0, 4).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {/* Featured Sellers */}
      <section className="bg-card py-12">
        <div className="container">
          <SectionHeader title="Featured Sellers" subtitle="Trusted Ethiopian businesses" link="/sellers" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sellers.slice(0, 6).map((seller, i) => (
              <SellerCard key={seller.id} seller={seller} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted py-12 ethiopian-pattern">
        <div className="container">
          <SectionHeader title="What Our Customers Say" subtitle="Real stories from real shoppers" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reviews.map((review, i) => (
              <ReviewCard key={review.id} review={review} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container py-12">
        <div className="gradient-teal rounded-2xl p-8 md:p-12 text-center ethiopian-pattern">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
            Stay Updated with <span className="text-gradient-gold">Gojo</span>
          </h2>
          <p className="text-primary-foreground/70 text-sm font-body mb-6 max-w-md mx-auto">
            Get the latest deals, new arrivals, and exclusive offers delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 px-4 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-secondary"
              data-testid="newsletter-email-input"
            />
            <Button variant="gold" size="lg" data-testid="newsletter-subscribe-btn">Subscribe</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
