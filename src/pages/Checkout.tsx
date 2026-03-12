import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, MapPin, Truck, CreditCard, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const steps = ["Shipping", "Delivery", "Payment", "Review"];

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("telebirr");

  const paymentMethods = [
    { id: "telebirr", name: "Telebirr", desc: "Pay with Telebirr mobile money" },
    { id: "cbe", name: "CBE Birr", desc: "Commercial Bank of Ethiopia" },
    { id: "amole", name: "Amole", desc: "Dashen Bank digital wallet" },
    { id: "chapa", name: "Chapa", desc: "Pay with Chapa gateway" },
    { id: "cod", name: "Cash on Delivery", desc: "Pay when your order arrives" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6 max-w-3xl">
        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-body font-bold transition-colors ${
                i <= currentStep ? "gradient-teal text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-body hidden sm:block ${i <= currentStep ? "text-foreground font-semibold" : "text-muted-foreground"}`}>{step}</span>
              {i < steps.length - 1 && <div className={`w-8 h-px ${i < currentStep ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-xl p-6 shadow-card">
          {currentStep === 0 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Full Name", placeholder: "Abebe Kebede" },
                  { label: "Phone Number", placeholder: "+251 9XX XXX XXXX" },
                  { label: "City", placeholder: "Addis Ababa" },
                  { label: "Sub City / Zone", placeholder: "Bole" },
                  { label: "Woreda", placeholder: "Woreda 03" },
                  { label: "House Number", placeholder: "123" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="text-xs font-body font-medium text-foreground mb-1 block">{field.label}</label>
                    <input placeholder={field.placeholder} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                ))}
              </div>
              <textarea placeholder="Additional delivery instructions..." className="w-full h-20 px-3 py-2 rounded-lg border border-input bg-background text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold flex items-center gap-2"><Truck className="w-5 h-5 text-primary" /> Delivery Options</h2>
              {[
                { name: "Standard Delivery", time: "3-5 business days", price: "150 ETB" },
                { name: "Express Delivery", time: "1-2 business days", price: "350 ETB" },
                { name: "Same Day Delivery", time: "Within 24 hours (Addis Ababa)", price: "500 ETB" },
              ].map((option, i) => (
                <label key={i} className="flex items-center gap-4 p-4 rounded-xl border border-input hover:border-primary cursor-pointer transition-colors">
                  <input type="radio" name="delivery" defaultChecked={i === 0} className="accent-[hsl(186,47%,25%)]" />
                  <div className="flex-1">
                    <p className="font-body font-semibold text-sm">{option.name}</p>
                    <p className="text-xs text-muted-foreground font-body">{option.time}</p>
                  </div>
                  <span className="font-body font-semibold text-sm text-primary">{option.price}</span>
                </label>
              ))}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /> Payment Method</h2>
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === method.id ? "border-primary bg-primary/5" : "border-input hover:border-primary"
                  }`}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <input type="radio" name="payment" checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="accent-[hsl(186,47%,25%)]" />
                  <div>
                    <p className="font-body font-semibold text-sm">{method.name}</p>
                    <p className="text-xs text-muted-foreground font-body">{method.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4 text-center py-8">
              <div className="w-16 h-16 rounded-full gradient-gold mx-auto flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h2 className="font-display text-xl font-bold">Review Your Order</h2>
              <p className="text-sm text-muted-foreground font-body">Total: <span className="font-bold text-primary text-lg">5,950 ETB</span></p>
              <p className="text-xs text-muted-foreground font-body">Payment: {paymentMethods.find(m => m.id === paymentMethod)?.name}</p>
            </div>
          )}

          <div className="flex justify-between mt-6 pt-4 border-t border-border">
            <Button variant="outline" disabled={currentStep === 0} onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}>
              Back
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button variant="gold" onClick={() => setCurrentStep(currentStep + 1)}>
                Continue <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="gold" size="lg">
                Place Order
              </Button>
            )}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
