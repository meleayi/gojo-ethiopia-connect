import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star, Heart, ShoppingCart, Truck, Shield, MapPin, Minus, Plus,
  ChevronRight, ChevronLeft, Share2, ZoomIn, Award, MessageCircle,
  Eye, ChevronDown, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ReviewCard from "@/components/ReviewCard";
import ChatModal from "@/components/ChatModal";
import { motion, AnimatePresence } from "framer-motion";
import { useProduct, useProductsFlat } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { useToggleWishlist, useWishlistIds } from "@/hooks/useWishlist";
import { useReviews } from "@/hooks/useReviews";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: product, isLoading, isError } = useProduct(id!);
  const addToCart = useAddToCart();
  const wishlistIds = useWishlistIds();
  const toggleWishlist = useToggleWishlist();
  const { data: productReviews = [] } = useReviews(id!);
  const categoryName = (product as any)?.categories?.name ?? undefined;
  const { data: relatedProducts = [] } = useProductsFlat({
    category: categoryName,
    limit: 8,
  });

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "reviews" | "shipping">("specs");
  const [chatOpen, setChatOpen] = useState(false);
  const recRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isWishlisted = wishlistIds.has(id ?? "");

  const images: string[] = product?.product_images
    ? [...product.product_images]
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((img) => img.url)
    : ["https://images.unsplash.com/photo-1560472355-536de3962603?w=600&q=80"];

  const originalPrice = product?.original_price;
  const discount = originalPrice && originalPrice > (product?.price ?? 0)
    ? Math.round(((originalPrice - product!.price) / originalPrice) * 100)
    : 0;

  const sellerProfile = product?.seller_profiles as any;
  const sellerName = sellerProfile?.company_name ?? "Gojo Seller";

  useEffect(() => {
    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        if (recRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = recRef.current;
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            recRef.current.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            recRef.current.scrollBy({ left: 280, behavior: "smooth" });
          }
        }
      }, 3500);
    };
    startAutoScroll();
    return () => { if (autoScrollRef.current) clearInterval(autoScrollRef.current); };
  }, []);

  const pauseAutoScroll = () => { if (autoScrollRef.current) clearInterval(autoScrollRef.current); };
  const resumeAutoScroll = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    autoScrollRef.current = setInterval(() => {
      if (recRef.current) recRef.current.scrollBy({ left: 280, behavior: "smooth" });
    }, 3500);
  };
  const scrollRec = (dir: "left" | "right") => {
    recRef.current?.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleAddToCart = () => {
    if (!user) { toast.error("Please sign in to add to cart"); navigate("/login"); return; }
    addToCart.mutate({ productId: id!, quantity }, {
      onSuccess: () => toast.success("Added to cart"),
    });
  };

  const handleWishlist = () => {
    if (!user) { toast.error("Please sign in to save items"); navigate("/login"); return; }
    toggleWishlist.mutate({ productId: id!, isWishlisted });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Product not found</h2>
          <Link to="/products"><Button variant="gold" className="mt-4">Browse Products</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const description = product.description ?? `Experience this ${categoryName ?? "product"} from Ethiopia.`;
  const specAttributes = product.product_attributes as any[] | undefined;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted-foreground font-body mb-6 flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          <ChevronRight className="w-3 h-3" />
          {categoryName && (
            <>
              <Link to={`/products?category=${categoryName}`} className="hover:text-primary transition-colors">{categoryName}</Link>
              <ChevronRight className="w-3 h-3" />
            </>
          )}
          <span className="text-foreground truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 mb-12">
          {/* Left: Image Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div
              className="relative bg-card rounded-2xl overflow-hidden shadow-card mb-3 cursor-zoom-in"
              style={{ aspectRatio: "1/1" }}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              data-testid="product-main-image"
            >
              <img
                src={images[selectedImage]}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-300 ${isZoomed ? "scale-[2]" : "scale-100"}`}
                style={isZoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
              />
              {product.is_flash_deal && (
                <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground font-semibold">
                  Flash Deal
                </Badge>
              )}
              {discount > 0 && (
                <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground font-semibold">
                  -{discount}%
                </Badge>
              )}
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-card/80 backdrop-blur-sm rounded-full px-3 py-1.5">
                <ZoomIn className="w-3.5 h-3.5 text-foreground" />
                <span className="text-xs font-body text-foreground">Hover to zoom</span>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ${selectedImage === i ? "border-primary shadow-md scale-105" : "border-transparent hover:border-border"}`}
                  data-testid={`thumbnail-${i}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div className="flex items-center gap-2 flex-wrap">
              {categoryName && (
                <Link to={`/products?category=${categoryName}`}>
                  <Badge variant="outline" className="text-xs font-body hover:bg-muted transition-colors cursor-pointer">{categoryName}</Badge>
                </Link>
              )}
              {product.listing_type === "rent" && (
                <Badge className="bg-info/10 text-info border-info/20 text-xs font-body" variant="outline">For Rent</Badge>
              )}
            </div>

            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight" data-testid="product-title">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating ?? 0) ? "fill-secondary text-secondary" : "text-muted-foreground"}`} />
                ))}
                <span className="text-sm font-semibold font-body ml-1">{(product.rating ?? 0).toFixed(1)}</span>
              </div>
              <span className="text-sm text-muted-foreground font-body cursor-pointer hover:text-primary transition-colors">
                ({(product.review_count ?? 0).toLocaleString()} reviews)
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1 font-body">
                <Eye className="w-3.5 h-3.5" /> {(product.view_count ?? 0).toLocaleString()} views
              </span>
              {product.city && (
                <span className="flex items-center gap-1 text-xs font-body text-muted-foreground">
                  <MapPin className="w-3 h-3" /> {product.city}
                </span>
              )}
            </div>

            <div className="py-4 border-t border-b border-border">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-display text-3xl md:text-4xl font-bold text-primary" data-testid="product-price">
                  {product.price.toLocaleString()} ETB
                  {product.rent_period && <span className="text-base font-body font-normal text-muted-foreground"> / {product.rent_period}</span>}
                </span>
                {originalPrice && originalPrice > product.price && (
                  <>
                    <span className="text-lg text-muted-foreground line-through font-body">{originalPrice.toLocaleString()} ETB</span>
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20 font-semibold" variant="outline">Save {discount}%</Badge>
                  </>
                )}
              </div>
              {originalPrice && originalPrice > product.price && (
                <p className="text-xs text-success font-body mt-1 font-medium">
                  You save {(originalPrice - product.price).toLocaleString()} ETB
                </p>
              )}
            </div>

            <div>
              <p className={`text-sm text-muted-foreground font-body leading-relaxed ${!showFullDesc ? "line-clamp-3" : ""}`}>
                {description}
              </p>
              {description.length > 150 && (
                <button onClick={() => setShowFullDesc(!showFullDesc)} className="text-xs text-primary font-body font-medium mt-1 flex items-center gap-1 hover:text-primary/80 transition-colors">
                  {showFullDesc ? "Show less" : "Read more"} <ChevronDown className={`w-3 h-3 transition-transform ${showFullDesc ? "rotate-180" : ""}`} />
                </button>
              )}
            </div>

            <div className="space-y-2.5 py-3 bg-muted/50 rounded-xl px-4">
              <div className="flex items-center gap-3 text-sm font-body">
                <Truck className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-foreground">Free delivery to <strong>{product.city ?? "your area"}</strong> • Est. 2-4 days</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-body">
                <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-foreground">Buyer protection • Easy returns within 14 days</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-body">
                <Award className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-foreground">Authentic product • Seller verified</span>
              </div>
            </div>

            {product.listing_type !== "rent" && !["Home Rent", "Home Sale", "Cars"].includes(categoryName ?? "") && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-body font-medium text-foreground">Quantity:</span>
                <div className="flex items-center rounded-lg border border-input overflow-hidden">
                  <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none" onClick={() => setQuantity(Math.max(1, quantity - 1))} data-testid="quantity-decrease">
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center text-sm font-body font-semibold border-x border-input py-2" data-testid="quantity-value">{quantity}</span>
                  <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none" onClick={() => setQuantity(q => q + 1)} data-testid="quantity-increase">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-xs text-muted-foreground font-body">
                  {product.in_stock ? `${product.stock_quantity ?? "In"} stock` : "Out of stock"}
                </span>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <Button
                variant="gold"
                size="xl"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={addToCart.isPending || !product.in_stock}
                data-testid="add-to-cart-btn"
              >
                <ShoppingCart className="w-5 h-5" />
                {["Home Rent", "Home Sale", "Cars"].includes(categoryName ?? "") ? "Schedule Viewing" : "Add to Cart"}
              </Button>
              <Button variant="hero" size="xl" className="flex-1" data-testid="buy-now-btn">
                {["Home Rent", "Home Sale", "Cars"].includes(categoryName ?? "") ? "Contact Seller" : "Buy Now"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`w-14 h-14 flex-shrink-0 ${isWishlisted ? "border-destructive text-destructive" : ""}`}
                onClick={handleWishlist}
                data-testid="wishlist-btn"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-destructive" : ""}`} />
              </Button>
              <Button variant="outline" size="icon" className="w-14 h-14 flex-shrink-0" data-testid="share-btn"
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}>
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            <div className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full gradient-teal flex items-center justify-center overflow-hidden">
                  {sellerProfile?.logo_url ? (
                    <img src={sellerProfile.logo_url} alt={sellerName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-primary-foreground font-bold font-body">{sellerName.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <p className="font-body font-semibold text-sm text-foreground">{sellerName}</p>
                  <p className="text-xs text-muted-foreground font-body flex items-center gap-1">
                    <Shield className="w-3 h-3 text-info" />
                    {sellerProfile?.is_verified ? "Verified Seller" : "Seller"} • {product.city ?? "Ethiopia"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" data-testid="message-seller-btn" onClick={() => setChatOpen(true)}>
                  <MessageCircle className="w-3.5 h-3.5 mr-1" /> Chat
                </Button>
                <Button variant="outline" size="sm" data-testid="visit-store-btn">
                  Visit Store <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs: Specs / Reviews / Shipping */}
        <div className="mb-12">
          <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
            {(["specs", "reviews", "shipping"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-body font-medium capitalize whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`tab-${tab}`}
              >
                {tab === "specs" ? "Specifications" : tab === "reviews" ? `Reviews (${product.review_count ?? 0})` : "Shipping & Returns"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "specs" && (
              <motion.div key="specs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {specAttributes && specAttributes.length > 0 ? (
                  <div className="bg-card rounded-xl shadow-card overflow-hidden max-w-2xl">
                    {specAttributes.map((attr: any, i: number) => (
                      <div key={attr.id ?? i} className={`flex items-center gap-4 px-5 py-3.5 ${i % 2 === 0 ? "bg-muted/30" : ""}`}>
                        <span className="text-sm font-body font-semibold text-foreground w-40 flex-shrink-0">{attr.attribute_name}</span>
                        <span className="text-sm font-body text-muted-foreground">{attr.attribute_value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground font-body text-sm">No specifications available for this product.</p>
                )}
              </motion.div>
            )}

            {activeTab === "reviews" && (
              <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center gap-6 mb-6 p-5 bg-card rounded-xl shadow-card">
                  <div className="text-center">
                    <p className="font-display text-5xl font-bold text-foreground">{(product.rating ?? 0).toFixed(1)}</p>
                    <div className="flex items-center gap-0.5 justify-center my-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating ?? 0) ? "fill-secondary text-secondary" : "text-muted-foreground"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground font-body">{product.review_count ?? 0} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5,4,3,2,1].map(star => (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs font-body text-muted-foreground w-4">{star}</span>
                        <Star className="w-3 h-3 fill-secondary text-secondary" />
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-secondary rounded-full" style={{ width: star === 5 ? "70%" : star === 4 ? "18%" : star === 3 ? "8%" : "3%" }} />
                        </div>
                        <span className="text-xs text-muted-foreground font-body w-8">{star === 5 ? "70%" : star === 4 ? "18%" : star === 3 ? "8%" : star === 2 ? "3%" : "1%"}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {productReviews.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {productReviews.map((review: any, i: number) => (
                      <ReviewCard key={review.id} review={review} index={i} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground font-body text-sm">No reviews yet. Be the first to review!</p>
                )}
              </motion.div>
            )}

            {activeTab === "shipping" && (
              <motion.div key="shipping" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="max-w-2xl space-y-4">
                  {[
                    { title: "Standard Delivery", detail: "Delivery in 3-5 business days. Free for orders over 1,000 ETB.", icon: Truck, color: "bg-success/10 text-success" },
                    { title: "Express Delivery", detail: "Delivery in 1-2 business days. 250 ETB flat fee.", icon: Truck, color: "bg-info/10 text-info" },
                    { title: "Returns Policy", detail: "14-day return policy. Item must be unused and in original packaging.", icon: Shield, color: "bg-warning/10 text-warning" },
                    { title: "Buyer Protection", detail: "Full refund if item doesn't arrive or doesn't match description.", icon: Shield, color: "bg-primary/10 text-primary" },
                  ].map(item => (
                    <div key={item.title} className="flex items-start gap-4 p-4 bg-card rounded-xl shadow-card">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-body font-semibold text-sm text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground font-body mt-0.5">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Recommendations */}
        {relatedProducts.filter(p => p.id !== id).length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">You May Also Like</h2>
                <p className="text-xs text-muted-foreground font-body mt-0.5">More from {categoryName}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => scrollRec("left")} data-testid="rec-scroll-left">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => scrollRec("right")} data-testid="rec-scroll-right">
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Link to={`/products?category=${product.category}`}>
                  <Button variant="outline" size="sm" className="text-xs">View all</Button>
                </Link>
              </div>
            </div>
            <div
              ref={recRef}
              className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              onMouseEnter={pauseAutoScroll}
              onMouseLeave={resumeAutoScroll}
              data-testid="recommendations-scroll"
            >
              {relatedProducts.filter(p => p.id !== id).map((p, i) => (
                <div key={p.id} className="flex-shrink-0 w-52">
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      <Footer />

      <ChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        sellerName={sellerName}
        productName={product.name}
        sellerInitial={sellerName.charAt(0).toUpperCase() + (sellerName.split(" ")[1]?.charAt(0).toUpperCase() ?? "")}
      />
    </div>
  );
};

export default ProductDetail;
