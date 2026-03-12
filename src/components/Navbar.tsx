import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, Menu, X, MapPin, Globe, Sun, Moon, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import SearchModal from "./SearchModal";
import { useTheme } from "./ThemeProvider";
import NotificationPanel from "./NotificationPanel";
import { MOCK_NOTIFICATIONS } from "./NotificationPanel";

const CATEGORY_NAV = [
  { label: "Electronics", path: "/products?category=Electronics" },
  { label: "Cars", path: "/products?category=Cars" },
  { label: "Fashion", path: "/products?category=Fashion" },
  { label: "Home Rent", path: "/products?category=Home Rent" },
  { label: "Home Sale", path: "/products?category=Home Sale" },
  { label: "Shoes", path: "/products?category=Shoes" },
  { label: "Bags", path: "/products?category=Bags" },
  { label: "Gifts", path: "/products?category=Gifts" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/products", label: "All Products" },
    { path: "/flash-deals", label: "Flash Deals" },
    { path: "/sellers", label: "Sellers" },
  ];

  return (
    <>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        {/* Top Bar */}
        <div className="gradient-teal">
          <div className="container flex items-center justify-between py-1.5 text-xs text-primary-foreground/80">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>Delivering across Ethiopia</span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link to="/seller-dashboard" className="hover:text-primary-foreground transition-colors">Sell on Gojo</Link>
              <span>Help Center</span>
              <div className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span>English</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <div className="container flex items-center gap-3 py-3">
          <Link to="/" className="flex-shrink-0" data-testid="nav-logo">
            <h1 className="font-display text-2xl font-bold text-primary">
              Gojo<span className="text-gradient-gold">.</span>
            </h1>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="relative w-full h-10 pl-10 pr-24 rounded-lg border border-input bg-background text-sm font-body text-muted-foreground text-left hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              data-testid="search-trigger"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <span>Search for products, brands...</span>
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 bg-muted rounded text-[10px] text-muted-foreground">
                <span>⌘</span><span>K</span>
              </kbd>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="hidden md:flex" data-testid="theme-toggle">
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSearchOpen(true)} data-testid="mobile-search-btn">
              <Search className="w-5 h-5" />
            </Button>
            <Link to="/wishlist" data-testid="nav-wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold flex items-center justify-center">3</span>
              </Button>
            </Link>
            <Link to="/cart" data-testid="nav-cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold flex items-center justify-center">2</span>
              </Button>
            </Link>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setNotifOpen(prev => !prev)}
                data-testid="notification-bell"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
              <div className="absolute right-0 top-full">
                <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
              </div>
            </div>

            <Link to="/dashboard" data-testid="nav-account">
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)} data-testid="mobile-menu-btn">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Category Nav */}
        <nav className="hidden md:block border-t border-border">
          <div className="container flex items-center gap-1 py-1.5 overflow-x-auto">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-body font-medium transition-colors hover:bg-muted ${
                  location.pathname === link.path ? "text-primary bg-primary/5" : "text-muted-foreground"
                }`}
                data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="w-px h-5 bg-border mx-1 flex-shrink-0" />
            {CATEGORY_NAV.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-body text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                data-testid={`nav-category-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {item.label}
              </Link>
            ))}
            <div className="w-px h-5 bg-border mx-1 flex-shrink-0" />
            <Link to="/admin" className="flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-body text-muted-foreground hover:text-primary hover:bg-muted transition-colors" data-testid="nav-admin">
              Admin
            </Link>
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
              <div className="p-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-body font-medium transition-colors ${
                      location.pathname === link.path ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-border pt-2 mt-2">
                  <p className="text-xs text-muted-foreground font-body font-semibold uppercase tracking-wide px-3 mb-1">Categories</p>
                  {CATEGORY_NAV.map((item) => (
                    <Link key={item.path} to={item.path} className="block px-3 py-2 rounded-lg text-sm font-body text-muted-foreground hover:text-primary hover:bg-muted transition-colors">
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-border pt-2 mt-2 flex items-center justify-between px-3">
                  <span className="text-sm font-body text-foreground">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
                  <Button variant="ghost" size="icon" onClick={toggleTheme} data-testid="mobile-theme-toggle">
                    {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Navbar;
