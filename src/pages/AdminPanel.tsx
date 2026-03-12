import { useState } from "react";
import { Users, ShieldCheck, Package, BarChart3, AlertTriangle, Eye, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const adminTabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "sellers", label: "Sellers", icon: ShieldCheck },
    { id: "products", label: "Products", icon: Package },
    { id: "reports", label: "Reports", icon: AlertTriangle },
  ];

  const overviewStats = [
    { label: "Total Users", value: "12,450", change: "+234 this week" },
    { label: "Active Sellers", value: "1,230", change: "+18 pending" },
    { label: "Total Orders", value: "45,670", change: "+1,200 today" },
    { label: "Revenue", value: "2.3M ETB", change: "+15% this month" },
  ];

  const pendingSellers = [
    { name: "Ethiopian Crafts Co.", location: "Dire Dawa", date: "Mar 11, 2026" },
    { name: "Awash Textiles", location: "Awash", date: "Mar 10, 2026" },
    { name: "Harar Spice Market", location: "Harar", date: "Mar 9, 2026" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6">
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">Admin Panel</h1>

        <div className="flex flex-col md:flex-row gap-6">
          <aside className="md:w-52 flex-shrink-0">
            <nav className="bg-card rounded-xl shadow-card overflow-hidden">
              {adminTabs.map(tab => (
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

          <div className="flex-1">
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {overviewStats.map((stat, i) => (
                    <div key={i} className="bg-card rounded-xl p-4 shadow-card">
                      <p className="text-xs text-muted-foreground font-body">{stat.label}</p>
                      <p className="font-display text-xl font-bold text-foreground mt-1">{stat.value}</p>
                      <p className="text-xs text-success font-body">{stat.change}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-card rounded-xl p-6 shadow-card">
                  <h3 className="font-display font-bold text-lg mb-4">Pending Seller Approvals</h3>
                  <div className="space-y-3">
                    {pendingSellers.map((seller, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div>
                          <p className="font-body font-semibold text-sm">{seller.name}</p>
                          <p className="text-xs text-muted-foreground font-body">{seller.location} • Applied {seller.date}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="default" size="sm"><Check className="w-3 h-3 mr-1" /> Approve</Button>
                          <Button variant="outline" size="sm"><X className="w-3 h-3 mr-1" /> Reject</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab !== "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl p-8 shadow-card text-center">
                <p className="text-muted-foreground font-body">{adminTabs.find(t => t.id === activeTab)?.label} management panel coming soon.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPanel;
