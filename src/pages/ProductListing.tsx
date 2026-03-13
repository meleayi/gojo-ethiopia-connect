import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Grid3X3, List, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProductsFlat, useProducts } from "@/hooks/useProducts";
import { categories, ethiopianCities } from "@/data/mock-data";
import { motion, AnimatePresence } from "framer-motion";

const ProductListing = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const cat = searchParams.get("category") || "";
    setSelectedCategory(cat);
  }, [searchParams]);

  const { data: products = [], isLoading } = useProducts({
    category: selectedCategory || undefined,
    city: selectedCity || undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 500000 ? priceRange[1] : undefined,
    minRating: minRating > 0 ? minRating : undefined,
    sortBy: sortBy as "popular" | "price-low" | "price-high" | "newest" | "rating",
  });

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <h3 className="font-body font-semibold text-sm text-foreground mb-3">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6">
        {/* Breadcrumb */}
        <div className="text-xs text-muted-foreground font-body mb-4">
          Home / Products {selectedCategory && `/ ${selectedCategory}`}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">
            {selectedCategory || "All Products"}
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="md:hidden" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="w-4 h-4 mr-1" /> Filters
            </Button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm font-body border border-input rounded-lg px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
            </select>
            <div className="hidden md:flex border border-input rounded-lg overflow-hidden">
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" className="rounded-none" onClick={() => setViewMode("grid")}>
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" className="rounded-none" onClick={() => setViewMode("list")}>
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 768) && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="flex-shrink-0 hidden md:block"
              >
                <div className="bg-card border border-border rounded-xl p-4 sticky top-24">
                  <FilterSection title="Category">
                    <div className="space-y-1">
                      <button
                        onClick={() => setSelectedCategory("")}
                        className={`w-full text-left px-2 py-1.5 rounded text-sm font-body transition-colors ${!selectedCategory ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        All Categories
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.name}
                          onClick={() => setSelectedCategory(cat.name)}
                          className={`w-full text-left px-2 py-1.5 rounded text-sm font-body transition-colors ${selectedCategory === cat.name ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </FilterSection>

                  <FilterSection title="City">
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full text-sm font-body border border-input rounded-lg px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="">All Cities</option>
                      {ethiopianCities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </FilterSection>

                  <FilterSection title="Min Rating">
                    <div className="flex gap-1">
                      {[0, 3, 4, 4.5].map((r) => (
                        <button
                          key={r}
                          onClick={() => setMinRating(r)}
                          className={`flex-1 py-1 rounded text-xs font-body border transition-colors ${minRating === r ? "border-primary text-primary bg-primary/5" : "border-input text-muted-foreground hover:border-primary/50"}`}
                        >
                          {r === 0 ? "Any" : `${r}+`}
                        </button>
                      ))}
                    </div>
                  </FilterSection>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Product grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-muted-foreground font-body">No products found. Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground font-body mb-4">
                  Showing {products.length} product{products.length !== 1 ? "s" : ""}
                </p>
                <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
                  {products.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductListing;
