import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, Menu, X, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Products" },
    { path: "/flash-deals", label: "Flash Deals" },
    { path: "/sellers", label: "Sellers" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      {/* Top Bar */}
      <div className="gradient-teal">
        <div className="container flex items-center justify-between py-1.5 text-xs text-primary-foreground/80">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>Delivering across Ethiopia</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span>Sell on Gojo</span>
            <span>Help Center</span>
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              <span>English</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="container flex items-center gap-4 py-3">
        <Link to="/" className="flex-shrink-0">
          <h1 className="font-display text-2xl font-bold text-primary">
            Gojo<span className="text-gradient-gold">.</span>
          </h1>
        </Link>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for products, brands, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold flex items-center justify-center">3</span>
            </Button>
          </Link>
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold flex items-center justify-center">2</span>
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Category Nav */}
      <nav className="hidden md:block border-t border-border">
        <div className="container flex items-center gap-6 py-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-body font-medium transition-colors hover:text-primary ${
                location.pathname === link.path ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/products?category=Coffee" className="text-sm font-body text-muted-foreground hover:text-primary">Coffee</Link>
          <Link to="/products?category=Fashion" className="text-sm font-body text-muted-foreground hover:text-primary">Fashion</Link>
          <Link to="/products?category=Spices" className="text-sm font-body text-muted-foreground hover:text-primary">Spices</Link>
          <Link to="/products?category=Jewelry" className="text-sm font-body text-muted-foreground hover:text-primary">Jewelry</Link>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border bg-card"
          >
            <div className="p-4 space-y-2">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block py-2 text-sm font-body font-medium text-foreground hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
