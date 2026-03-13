import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Clock, TrendingUp, ChevronRight, Mic, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { categories, popularSearches } from "@/data/mock-data";
import { useProductsFlat } from "@/hooks/useProducts";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_RECENT = 5;

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("gojo-recent-searches") || "[]"); } catch { return []; }
  });
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, 150);

  const { data: supabaseProducts = [] } = useProductsFlat(
    debouncedQuery.length >= 2 ? { search: debouncedQuery, limit: 6 } : {}
  );

  const suggestions = debouncedQuery.length >= 2 ? supabaseProducts : [];

  const categoryMatches = debouncedQuery.length >= 2
    ? categories.filter(c => c.name.toLowerCase().includes(debouncedQuery.toLowerCase())).slice(0, 3)
    : [];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setFocusedIndex(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose(); else onClose();
      }
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const allItems = [
    ...suggestions.map(p => ({
      type: "product" as const,
      id: p.id,
      label: p.name,
      sub: (p as any).categories?.name ?? "",
      image: (p.product_images as any)?.[0]?.url ?? "",
      price: p.price,
    })),
    ...categoryMatches.map(c => ({ type: "category" as const, id: c.id, label: c.name, sub: `${c.productCount} products`, image: c.image, price: null })),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setFocusedIndex(prev => Math.min(prev + 1, allItems.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setFocusedIndex(prev => Math.max(prev - 1, -1)); }
    if (e.key === "Enter") {
      if (focusedIndex >= 0 && allItems[focusedIndex]) {
        handleSelect(allItems[focusedIndex]);
      } else if (query.trim()) {
        handleSearch(query.trim());
      }
    }
  };

  const saveRecent = (term: string) => {
    const updated = [term, ...recentSearches.filter(r => r !== term)].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    localStorage.setItem("gojo-recent-searches", JSON.stringify(updated));
  };

  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    saveRecent(term);
    navigate(`/products?search=${encodeURIComponent(term)}`);
    onClose();
  };

  const handleSelect = (item: typeof allItems[0]) => {
    saveRecent(item.label);
    if (item.type === "product") navigate(`/product/${item.id}`);
    else navigate(`/products?category=${item.label}`);
    onClose();
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("gojo-recent-searches");
  };

  const highlight = (text: string, term: string) => {
    if (!term) return text;
    const idx = text.toLowerCase().indexOf(term.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-secondary/30 text-foreground rounded">{text.slice(idx, idx + term.length)}</mark>
        {text.slice(idx + term.length)}
      </>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-16 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl overflow-hidden"
            data-testid="search-modal"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setFocusedIndex(-1); }}
                onKeyDown={handleKeyDown}
                placeholder="Search products, categories, brands..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-base font-body focus:outline-none"
                data-testid="search-input"
              />
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Voice search" data-testid="voice-search-btn">
                  <Mic className="w-4 h-4 text-muted-foreground" />
                </button>
                {query && (
                  <button onClick={() => setQuery("")} className="p-1.5 rounded-lg hover:bg-muted transition-colors" data-testid="clear-search-btn">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
                <kbd className="hidden md:flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs text-muted-foreground font-body">
                  Esc
                </kbd>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {/* Live suggestions */}
              {query.length >= 2 && allItems.length > 0 && (
                <div className="p-2">
                  {suggestions.length > 0 && (
                    <>
                      <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide px-3 py-2">Products</p>
                      {suggestions.map((item, i) => (
                        <button
                          key={item.id}
                          onClick={() => handleSelect({ type: "product", id: item.id, label: item.name, sub: item.category, image: item.image, price: item.price })}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-left ${focusedIndex === i ? "bg-muted" : ""}`}
                          data-testid={`search-suggestion-${item.id}`}
                        >
                          <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-body font-medium text-foreground truncate">{highlight(item.name, debouncedQuery)}</p>
                            <p className="text-xs text-muted-foreground">{item.category}</p>
                          </div>
                          <span className="text-sm font-display font-bold text-primary flex-shrink-0">{item.price.toLocaleString()} ETB</span>
                        </button>
                      ))}
                    </>
                  )}
                  {categoryMatches.length > 0 && (
                    <>
                      <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide px-3 py-2 mt-1">Categories</p>
                      {categoryMatches.map((cat, i) => (
                        <button
                          key={cat.id}
                          onClick={() => handleSelect({ type: "category", id: cat.id, label: cat.name, sub: `${cat.productCount} products`, image: cat.image, price: null })}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-left ${focusedIndex === suggestions.length + i ? "bg-muted" : ""}`}
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={cat.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-body font-medium text-foreground">{highlight(cat.name, debouncedQuery)}</p>
                            <p className="text-xs text-muted-foreground">{cat.productCount} products</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                      ))}
                    </>
                  )}
                  <button
                    onClick={() => handleSearch(query)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/5 transition-colors text-left mt-1 border border-dashed border-border"
                    data-testid="search-all-btn"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Search className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-body text-foreground">Search for "<strong>{query}</strong>"</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                  </button>
                </div>
              )}

              {/* No results */}
              {query.length >= 2 && allItems.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground font-body text-sm">No results for "<strong className="text-foreground">{query}</strong>"</p>
                  <p className="text-muted-foreground font-body text-xs mt-1">Try different keywords or browse categories</p>
                </div>
              )}

              {/* Default state: recent + popular */}
              {query.length < 2 && (
                <div className="p-4 space-y-5">
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> Recent Searches
                        </p>
                        <button onClick={clearRecent} className="text-xs text-muted-foreground hover:text-destructive transition-colors font-body" data-testid="clear-recent-btn">
                          Clear all
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map(term => (
                          <button
                            key={term}
                            onClick={() => handleSearch(term)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/70 rounded-full text-xs font-body text-foreground transition-colors"
                            data-testid={`recent-search-${term}`}
                          >
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5 mb-2">
                      <TrendingUp className="w-3.5 h-3.5" /> Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map(term => (
                        <button
                          key={term}
                          onClick={() => handleSearch(term)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/10 hover:bg-secondary/20 rounded-full text-xs font-body text-foreground transition-colors"
                          data-testid={`popular-search-${term}`}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide mb-2">Browse Categories</p>
                    <div className="grid grid-cols-3 gap-2">
                      {categories.slice(0, 6).map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => { navigate(`/products?category=${cat.name}`); onClose(); }}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted hover:bg-muted/70 transition-colors"
                          data-testid={`browse-category-${cat.id}`}
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden">
                            <img src={cat.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs font-body text-foreground font-medium truncate w-full text-center">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default SearchModal;
