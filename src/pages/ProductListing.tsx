import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Grid3X3, List, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products, categories, ethiopianCities } from "@/data/mock-data";
import { motion, AnimatePresence } from "framer-motion";

const ProductListing = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory) result = result.filter(p => p.category === selectedCategory);
    if (selectedCity) result = result.filter(p => p.location === selectedCity);
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (minRating) result = result.filter(p => p.rating >= minRating);
    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "newest": result.reverse(); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      default: result.sort((a, b) => b.reviews - a.reviews);
    }
    return result;
  }, [selectedCategory, selectedCity, priceRange, minRating, sortBy]);

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
            <div className="hidden md:flex items-center gap-1">
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" className="w-8 h-8" onClick={() => setViewMode("grid")}>
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "ghost"} size="icon" className="w-8 h-8" onClick={() => setViewMode("list")}>
                <List className="w-4 h-4" />
              </Button>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 px-3 rounded-lg border border-input bg-background text-xs font-body focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-60 flex-shrink-0`}>
            <div className="bg-card rounded-xl p-5 shadow-card sticky top-36">
              <FilterSection title="Categories">
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`block text-sm font-body transition-colors ${!selectedCategory ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    All Categories
                  </button>
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.name)}
                      className={`block text-sm font-body transition-colors ${selectedCategory === c.name ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {c.name} ({c.productCount})
                    </button>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Location">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-input bg-background text-xs font-body focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">All Locations</option>
                  {ethiopianCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </FilterSection>

              <FilterSection title="Price Range (ETB)">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0] || ""}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full h-9 px-2 rounded-lg border border-input bg-background text-xs font-body focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1] || ""}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full h-9 px-2 rounded-lg border border-input bg-background text-xs font-body focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </FilterSection>

              <FilterSection title="Rating">
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(r => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`block text-sm font-body ${minRating === r ? "text-primary font-semibold" : "text-muted-foreground"}`}
                    >
                      {"★".repeat(r)}{"☆".repeat(5 - r)} & up
                    </button>
                  ))}
                </div>
              </FilterSection>

              <Button variant="outline" size="sm" className="w-full" onClick={() => { setSelectedCategory(""); setSelectedCity(""); setPriceRange([0, 20000]); setMinRating(0); }}>
                Clear Filters
              </Button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <p className="text-sm text-muted-foreground font-body mb-4">{filtered.length} products found</p>
            <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground font-body">No products found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductListing;
