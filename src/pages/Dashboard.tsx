import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, Heart, MapPin, CreditCard, Settings, LogOut, ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const tabs = [
  { id: "orders", label: "My Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
];

const mockOrders = [
  { id: "GJ-2026-001", date: "Mar 10, 2026", status: "Delivered", total: "1,700 ETB", items: 2 },
  { id: "GJ-2026-002", date: "Mar 8, 2026", status: "In Transit", total: "3,500 ETB", items: 1 },
  { id: "GJ-2026-003", date: "Mar 2, 2026", status: "Processing", total: "12,500 ETB", items: 1 },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("orders");

  const statusColors: Record<string, string> = {
    Delivered: "bg-success/10 text-success",
    "In Transit": "bg-info/10 text-info",
    Processing: "bg-warning/10 text-warning",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6">
        {/* Profile Header */}
        <div className="bg-card rounded-xl p-6 shadow-card mb-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full gradient-teal flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-xl">AK</span>
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">Abebe Kebede</h1>
            <p className="text-sm text-muted-foreground font-body">abebe@example.com • Addis Ababa</p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto hidden md:flex">
            <LogOut className="w-4 h-4 mr-1" /> Sign Out
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="md:w-56 flex-shrink-0">
            <nav className="bg-card rounded-xl shadow-card overflow-hidden">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-body transition-colors ${
                    activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1">
            {activeTab === "orders" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h2 className="font-display text-lg font-bold">Order History</h2>
                {mockOrders.map(order => (
                  <div key={order.id} className="bg-card rounded-xl p-4 shadow-card flex items-center justify-between">
                    <div>
                      <p className="font-body font-semibold text-sm">{order.id}</p>
                      <p className="text-xs text-muted-foreground font-body">{order.date} • {order.items} item(s)</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-body font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                      <span className="font-body font-semibold text-sm">{order.total}</span>
                      <Button variant="ghost" size="icon" className="w-8 h-8"><Eye className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "wishlist" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-display text-lg font-bold mb-4">My Wishlist</h2>
                <p className="text-sm text-muted-foreground font-body">Your wishlist items will appear here.</p>
              </motion.div>
            )}

            {activeTab === "addresses" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-display text-lg font-bold mb-4">Saved Addresses</h2>
                <div className="bg-card rounded-xl p-4 shadow-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-body font-semibold text-sm">Home Address</p>
                      <p className="text-xs text-muted-foreground font-body mt-1">Bole Road, Woreda 03, House 123, Addis Ababa</p>
                      <p className="text-xs text-muted-foreground font-body">+251 911 234 567</p>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
                <Button variant="outline" className="mt-3"><MapPin className="w-4 h-4 mr-1" /> Add New Address</Button>
              </motion.div>
            )}

            {activeTab === "payments" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-display text-lg font-bold mb-4">Payment Methods</h2>
                <div className="bg-card rounded-xl p-4 shadow-card mb-3">
                  <p className="font-body font-semibold text-sm">Telebirr</p>
                  <p className="text-xs text-muted-foreground font-body">+251 9XX XXX XXXX</p>
                </div>
                <Button variant="outline"><CreditCard className="w-4 h-4 mr-1" /> Add Payment Method</Button>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-display text-lg font-bold mb-4">Account Settings</h2>
                <div className="bg-card rounded-xl p-6 shadow-card space-y-4">
                  {[
                    { label: "Full Name", value: "Abebe Kebede" },
                    { label: "Email", value: "abebe@example.com" },
                    { label: "Phone", value: "+251 911 234 567" },
                    { label: "Language", value: "English" },
                  ].map(field => (
                    <div key={field.label}>
                      <label className="text-xs font-body font-medium text-muted-foreground">{field.label}</label>
                      <input defaultValue={field.value} className="w-full h-10 px-3 mt-1 rounded-lg border border-input bg-background text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                  ))}
                  <Button variant="gold">Save Changes</Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
