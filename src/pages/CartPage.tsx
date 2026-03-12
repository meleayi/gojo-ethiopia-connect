import { Link } from "react-router-dom";
import { Minus, Plus, X, Truck, ArrowRight, ShoppingCart as CartIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
  useCart,
  useUpdateCartQuantity,
  useRemoveFromCart,
} from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const CartPage = () => {
  const { user } = useAuth();
  const { data: cartItems = [], isLoading } = useCart();
  const updateQty = useUpdateCartQuantity();
  const removeItem = useRemoveFromCart();

  const DELIVERY_FEE = 150;
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.products as any)?.price * item.quantity,
    0
  );
  const total = subtotal + DELIVERY_FEE;

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <CartIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Sign in to view your cart</h2>
          <p className="text-muted-foreground font-body mb-6">Your cart items will be saved when you sign in.</p>
          <Link to="/login"><Button variant="gold">Sign In</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6">
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">
          Shopping Cart ({isLoading ? "..." : cartItems.length})
        </h1>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20">
            <CartIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-body mb-4">Your cart is empty</p>
            <Link to="/products"><Button variant="gold">Continue Shopping</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, i) => {
                const product = item.products as any;
                const image = product?.product_images?.find((img: any) => img.is_primary)?.url
                  ?? product?.product_images?.[0]?.url
                  ?? "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&q=80";

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card rounded-xl p-4 shadow-card flex gap-4"
                  >
                    <Link to={`/product/${item.product_id}`} className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={image} alt={product?.name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product_id}`}>
                        <h3 className="font-body font-semibold text-sm text-card-foreground line-clamp-2 mb-1 hover:text-primary transition-colors">
                          {product?.name}
                        </h3>
                      </Link>
                      {product?.seller_profiles?.company_name && (
                        <p className="text-xs text-muted-foreground font-body mb-2">{product.seller_profiles.company_name}</p>
                      )}
                      {item.variant_id && (
                        <p className="text-xs text-muted-foreground font-body mb-2">{(item.product_variants as any)?.name}</p>
                      )}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 border border-border rounded-lg overflow-hidden">
                          <button
                            className="p-2 hover:bg-muted transition-colors"
                            onClick={() => updateQty.mutate({ itemId: item.id, quantity: item.quantity - 1 })}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-body font-semibold">{item.quantity}</span>
                          <button
                            className="p-2 hover:bg-muted transition-colors"
                            onClick={() => updateQty.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-display font-bold text-lg text-primary">
                          {((product?.price ?? 0) * item.quantity).toLocaleString()} ETB
                        </span>
                      </div>
                    </div>
                    <button
                      className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 self-start"
                      onClick={() => {
                        removeItem.mutate(item.id);
                        toast.success("Item removed");
                      }}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-5 sticky top-24 space-y-4">
                <h2 className="font-display font-bold text-lg text-card-foreground">Order Summary</h2>
                <div className="space-y-2 text-sm font-body">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>{subtotal.toLocaleString()} ETB</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery Fee</span>
                    <span>{DELIVERY_FEE.toLocaleString()} ETB</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-bold text-card-foreground">
                    <span>Total</span>
                    <span className="text-primary text-lg">{total.toLocaleString()} ETB</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-muted rounded-lg p-3">
                  <Truck className="w-4 h-4 text-primary flex-shrink-0" />
                  <p className="text-xs text-muted-foreground font-body">Free delivery on orders over 1,000 ETB</p>
                </div>
                <Link to="/checkout" className="block">
                  <Button variant="gold" size="lg" className="w-full gap-2">
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/products" className="block">
                  <Button variant="outline" size="sm" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
