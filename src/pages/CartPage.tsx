import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, X, Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/mock-data";
import { motion } from "framer-motion";

interface CartItem {
  product: typeof products[0];
  quantity: number;
}

const ShoppingCart = () => {
  const [items, setItems] = useState<CartItem[]>([
    { product: products[0], quantity: 2 },
    { product: products[1], quantity: 1 },
    { product: products[3], quantity: 1 },
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev => prev.map(item =>
      item.product.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.product.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = 150;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6">
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">Shopping Cart ({items.length})</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-body mb-4">Your cart is empty</p>
            <Link to="/products"><Button variant="gold">Continue Shopping</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, i) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-xl p-4 shadow-card flex gap-4"
                >
                  <Link to={`/product/${item.product.id}`} className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <div>
                        <Link to={`/product/${item.product.id}`} className="font-body font-semibold text-sm text-card-foreground hover:text-primary line-clamp-1">{item.product.name}</Link>
                        <p className="text-xs text-muted-foreground font-body">{item.product.seller} • {item.product.location}</p>
                      </div>
                      <button onClick={() => removeItem(item.product.id)} className="text-muted-foreground hover:text-destructive">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center rounded-lg border border-input">
                        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => updateQuantity(item.product.id, -1)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-body font-semibold">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => updateQuantity(item.product.id, 1)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <span className="font-display font-bold text-primary">{(item.product.price * item.quantity).toLocaleString()} ETB</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-card rounded-xl p-6 shadow-card h-fit sticky top-36">
              <h3 className="font-body font-semibold text-foreground mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm font-body">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{subtotal.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Delivery</span>
                  <span>{deliveryFee.toLocaleString()} ETB</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-semibold text-foreground">
                  <span>Total</span>
                  <span className="font-display text-lg text-primary">{total.toLocaleString()} ETB</span>
                </div>
              </div>
              <Link to="/checkout" className="block mt-4">
                <Button variant="gold" size="lg" className="w-full">
                  Checkout <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/products" className="block mt-2">
                <Button variant="ghost" size="sm" className="w-full text-muted-foreground">Continue Shopping</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ShoppingCart;
