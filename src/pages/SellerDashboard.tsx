import { useState } from "react";
import { Package, ShoppingCart, BarChart3, Boxes, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/mock-data";
import { motion } from "framer-motion";

const sellerTabs = [
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "inventory", label: "Inventory", icon: Boxes },
];

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");

  const stats = [
    { label: "Total Sales", value: "45,230 ETB", change: "+12%" },
    { label: "Orders", value: "156", change: "+8%" },
    { label: "Products", value: "45", change: "+3" },
    { label: "Rating", value: "4.8", change: "★" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Seller Dashboard</h1>
            <p className="text-sm text-muted-foreground font-body">Abyssinia Coffee • Addis Ababa</p>
          </div>
          <Button variant="gold"><Plus className="w-4 h-4 mr-1" /> Add Product</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl p-4 shadow-card"
            >
              <p className="text-xs text-muted-foreground font-body">{stat.label}</p>
              <p className="font-display text-xl font-bold text-foreground mt-1">{stat.value}</p>
              <p className="text-xs text-success font-body font-semibold">{stat.change}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {sellerTabs.map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="w-4 h-4 mr-1" /> {tab.label}
            </Button>
          ))}
        </div>

        {activeTab === "products" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <table className="w-full text-sm font-body">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Product</th>
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Category</th>
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Price</th>
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Stock</th>
                    <th className="text-right p-3 text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 6).map(product => (
                    <tr key={product.id} className="border-t border-border">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <span className="font-medium text-card-foreground line-clamp-1">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell">{product.category}</td>
                      <td className="p-3 font-semibold text-primary">{product.price.toLocaleString()} ETB</td>
                      <td className="p-3 hidden md:table-cell">
                        <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success font-medium">In Stock</span>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="w-7 h-7"><Eye className="w-3 h-3" /></Button>
                          <Button variant="ghost" size="icon" className="w-7 h-7"><Edit className="w-3 h-3" /></Button>
                          <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive"><Trash2 className="w-3 h-3" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "orders" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl p-6 shadow-card">
            <p className="text-muted-foreground font-body text-sm">Order management view coming soon.</p>
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl p-6 shadow-card">
            <h3 className="font-display font-bold text-lg mb-4">Sales Analytics</h3>
            <div className="h-48 flex items-center justify-center text-muted-foreground font-body text-sm">
              Charts and analytics will be displayed here.
            </div>
          </motion.div>
        )}

        {activeTab === "inventory" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl p-6 shadow-card">
            <p className="text-muted-foreground font-body text-sm">Inventory management view coming soon.</p>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SellerDashboard;
