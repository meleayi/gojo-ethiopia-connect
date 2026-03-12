import { useState } from "react";
import {
  Users, ShieldCheck, Package, BarChart3, AlertTriangle, Eye, Check, X,
  Settings, TrendingUp, Bell, MessageSquare, Activity, Search, Filter,
  ChevronUp, ChevronDown, UserCheck, Ban, Star, DollarSign, Clock,
  Tag, Edit, Trash2, Plus, RefreshCw, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { products, sellers, adminUsers, categories } from "@/data/mock-data";

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "products", label: "Products", icon: Package },
  { id: "users", label: "Users", icon: Users },
  { id: "sellers", label: "Sellers", icon: ShieldCheck },
  { id: "categories", label: "Categories", icon: Tag },
  { id: "reports", label: "Reports", icon: AlertTriangle },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
  { id: "settings", label: "Settings", icon: Settings },
];

const StatCard = ({ label, value, change, icon: Icon, color }: { label: string; value: string; change: string; icon: React.ElementType; color: string }) => (
  <div className="bg-card rounded-xl p-5 shadow-card">
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs text-muted-foreground font-body font-medium">{label}</p>
      <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
    </div>
    <p className="font-display text-2xl font-bold text-foreground">{value}</p>
    <p className="text-xs text-success font-body mt-1">{change}</p>
  </div>
);

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [productSearch, setProductSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [productStatuses, setProductStatuses] = useState<Record<string, string>>({});
  const [sellerStatuses, setSellerStatuses] = useState<Record<string, string>>({});

  const pendingProducts = products.filter(p => (productStatuses[p.id] || p.status) === "pending");
  const approvedProducts = products.filter(p => (productStatuses[p.id] || p.status) === "approved");

  const handleProductAction = (id: string, action: "approved" | "rejected") => {
    setProductStatuses(prev => ({ ...prev, [id]: action }));
  };

  const handleSellerAction = (id: string, action: string) => {
    setSellerStatuses(prev => ({ ...prev, [id]: action }));
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredUsers = adminUsers.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground font-body">Manage your marketplace</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export
            </Button>
            <Button variant="default" size="sm" className="gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <nav className="bg-card rounded-xl shadow-card overflow-hidden">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-body transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  data-testid={`admin-tab-${tab.id}`}
                >
                  <tab.icon className="w-4 h-4 flex-shrink-0" />
                  {tab.label}
                  {tab.id === "products" && pendingProducts.length > 0 && (
                    <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === "products" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-warning text-white"}`}>
                      {pendingProducts.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">

              {/* OVERVIEW */}
              {activeTab === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total Users" value="12,450" change="↑ 234 this week" icon={Users} color="bg-blue-500" />
                    <StatCard label="Active Sellers" value="1,230" change="↑ 18 pending" icon={ShieldCheck} color="bg-teal-DEFAULT" />
                    <StatCard label="Total Orders" value="45,670" change="↑ 1,200 today" icon={Package} color="bg-success" />
                    <StatCard label="Revenue" value="2.3M ETB" change="↑ 15% this month" icon={DollarSign} color="bg-warning" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pending Products */}
                    <div className="bg-card rounded-xl p-5 shadow-card">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display font-bold text-base text-foreground">Pending Approvals</h3>
                        <Badge className="bg-warning/10 text-warning font-body text-xs">{pendingProducts.length} pending</Badge>
                      </div>
                      {pendingProducts.length === 0 ? (
                        <p className="text-sm text-muted-foreground font-body text-center py-4">All products reviewed ✓</p>
                      ) : (
                        <div className="space-y-3">
                          {pendingProducts.slice(0, 4).map(p => (
                            <div key={p.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                              <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-body font-semibold text-sm text-foreground truncate">{p.name}</p>
                                <p className="text-xs text-muted-foreground font-body">{p.category} • {p.seller}</p>
                              </div>
                              <div className="flex gap-1.5">
                                <Button size="sm" variant="default" className="h-7 text-xs gap-1" onClick={() => handleProductAction(p.id, "approved")} data-testid={`approve-product-${p.id}`}>
                                  <Check className="w-3 h-3" /> Approve
                                </Button>
                                <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => handleProductAction(p.id, "rejected")} data-testid={`reject-product-${p.id}`}>
                                  <X className="w-3 h-3" /> Reject
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pending Sellers */}
                    <div className="bg-card rounded-xl p-5 shadow-card">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display font-bold text-base text-foreground">Pending Sellers</h3>
                        <Badge className="bg-info/10 text-info font-body text-xs">2 pending</Badge>
                      </div>
                      <div className="space-y-3">
                        {sellers.filter(s => (sellerStatuses[s.id] || s.status) === "pending").map(seller => (
                          <div key={seller.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full gradient-teal flex items-center justify-center text-primary-foreground font-bold text-sm font-body">
                                {seller.avatar}
                              </div>
                              <div>
                                <p className="font-body font-semibold text-sm text-foreground">{seller.name}</p>
                                <p className="text-xs text-muted-foreground font-body">{seller.location} • Applied {seller.joinedDate}</p>
                              </div>
                            </div>
                            <div className="flex gap-1.5">
                              <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => handleSellerAction(seller.id, "active")} data-testid={`approve-seller-${seller.id}`}>
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleSellerAction(seller.id, "blocked")} data-testid={`reject-seller-${seller.id}`}>
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {sellers.filter(s => (sellerStatuses[s.id] || s.status) === "pending").length === 0 && (
                          <p className="text-sm text-muted-foreground font-body text-center py-4">All sellers reviewed ✓</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Products Live", value: approvedProducts.length, icon: Package, color: "text-success" },
                      { label: "Categories", value: categories.length, icon: Tag, color: "text-info" },
                      { label: "Total Reviews", value: "4,521", icon: Star, color: "text-secondary" },
                      { label: "Avg Response", value: "2.4h", icon: Clock, color: "text-warning" },
                    ].map((item, i) => (
                      <div key={i} className="bg-card rounded-xl p-4 shadow-card flex items-center gap-3">
                        <item.icon className={`w-8 h-8 ${item.color}`} />
                        <div>
                          <p className="font-display font-bold text-xl text-foreground">{item.value}</p>
                          <p className="text-xs text-muted-foreground font-body">{item.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* PRODUCTS */}
              {activeTab === "products" && (
                <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="bg-card rounded-xl p-5 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display font-bold text-lg text-foreground">Product Management</h3>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Search products..."
                            value={productSearch}
                            onChange={e => setProductSearch(e.target.value)}
                            className="h-9 pl-9 pr-3 rounded-lg border border-input bg-background text-xs font-body focus:outline-none focus:ring-2 focus:ring-ring w-48"
                            data-testid="product-search-input"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tabs within products */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {["all", "pending", "approved", "rejected"].map(status => {
                        const count = status === "all" ? products.length : products.filter(p => (productStatuses[p.id] || p.status) === status).length;
                        return (
                          <Badge
                            key={status}
                            variant="outline"
                            className={`cursor-pointer capitalize font-body ${status === "pending" ? "border-warning text-warning" : status === "approved" ? "border-success text-success" : status === "rejected" ? "border-destructive text-destructive" : ""}`}
                          >
                            {status} ({count})
                          </Badge>
                        );
                      })}
                    </div>

                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                      {filteredProducts.map(p => {
                        const currentStatus = productStatuses[p.id] || p.status || "approved";
                        return (
                          <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors" data-testid={`product-row-${p.id}`}>
                            <img src={p.image} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-body font-semibold text-sm text-foreground truncate">{p.name}</p>
                              <p className="text-xs text-muted-foreground font-body">{p.category} • {p.seller} • {p.location}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="font-display font-bold text-sm text-primary">{p.price.toLocaleString()} ETB</span>
                              <Badge
                                className={`text-xs font-body capitalize ${
                                  currentStatus === "approved" ? "bg-success/10 text-success border-success/20" :
                                  currentStatus === "pending" ? "bg-warning/10 text-warning border-warning/20" :
                                  "bg-destructive/10 text-destructive border-destructive/20"
                                }`}
                                variant="outline"
                              >
                                {currentStatus}
                              </Badge>
                              {currentStatus === "pending" && (
                                <div className="flex gap-1">
                                  <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => handleProductAction(p.id, "approved")} data-testid={`approve-${p.id}`}>
                                    <Check className="w-3 h-3" />
                                  </Button>
                                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleProductAction(p.id, "rejected")} data-testid={`reject-${p.id}`}>
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                <Eye className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* USERS */}
              {activeTab === "users" && (
                <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="bg-card rounded-xl p-5 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display font-bold text-lg text-foreground">User Management</h3>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={userSearch}
                          onChange={e => setUserSearch(e.target.value)}
                          className="h-9 pl-9 pr-3 rounded-lg border border-input bg-background text-xs font-body focus:outline-none focus:ring-2 focus:ring-ring w-48"
                          data-testid="user-search-input"
                        />
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            {["User", "Email", "Role", "Orders", "Status", "Actions"].map(h => (
                              <th key={h} className="text-left text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide pb-3 pr-4">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map(user => (
                            <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors" data-testid={`user-row-${user.id}`}>
                              <td className="py-3 pr-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full gradient-teal flex items-center justify-center text-primary-foreground text-xs font-bold font-body">
                                    {user.name.charAt(0)}
                                  </div>
                                  <span className="font-body text-sm font-medium text-foreground">{user.name}</span>
                                </div>
                              </td>
                              <td className="py-3 pr-4 text-sm text-muted-foreground font-body">{user.email}</td>
                              <td className="py-3 pr-4">
                                <Badge variant="outline" className={`capitalize font-body text-xs ${user.role === "admin" ? "border-warning text-warning" : user.role === "seller" ? "border-info text-info" : "border-border"}`}>
                                  {user.role}
                                </Badge>
                              </td>
                              <td className="py-3 pr-4 text-sm text-foreground font-body">{user.totalOrders ?? "-"}</td>
                              <td className="py-3 pr-4">
                                <Badge variant="outline" className={`capitalize font-body text-xs ${user.status === "active" ? "border-success text-success" : user.status === "blocked" ? "border-destructive text-destructive" : "border-warning text-warning"}`}>
                                  {user.status}
                                </Badge>
                              </td>
                              <td className="py-3">
                                <div className="flex gap-1">
                                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="View" data-testid={`view-user-${user.id}`}>
                                    <Eye className="w-3.5 h-3.5" />
                                  </Button>
                                  {user.status === "active" ? (
                                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:text-destructive" title="Block" data-testid={`block-user-${user.id}`}>
                                      <Ban className="w-3.5 h-3.5" />
                                    </Button>
                                  ) : (
                                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:text-success" title="Unblock" data-testid={`unblock-user-${user.id}`}>
                                      <UserCheck className="w-3.5 h-3.5" />
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SELLERS */}
              {activeTab === "sellers" && (
                <motion.div key="sellers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="bg-card rounded-xl p-5 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display font-bold text-lg text-foreground">Seller Management</h3>
                    </div>
                    <div className="space-y-3">
                      {sellers.map(seller => {
                        const currentStatus = sellerStatuses[seller.id] || seller.status || "active";
                        return (
                          <div key={seller.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors" data-testid={`seller-row-${seller.id}`}>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full gradient-teal flex items-center justify-center text-primary-foreground font-bold font-body">
                                {seller.avatar}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-body font-semibold text-sm text-foreground">{seller.name}</p>
                                  {seller.verified && <ShieldCheck className="w-3.5 h-3.5 text-info" />}
                                </div>
                                <p className="text-xs text-muted-foreground font-body">{seller.location} • {seller.productCount} products • {seller.totalSales?.toLocaleString()} sales</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {seller.rating > 0 && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
                                  <span className="text-xs font-body">{seller.rating}</span>
                                </div>
                              )}
                              <Badge
                                variant="outline"
                                className={`capitalize font-body text-xs ${
                                  currentStatus === "active" ? "border-success text-success" :
                                  currentStatus === "pending" ? "border-warning text-warning" :
                                  "border-destructive text-destructive"
                                }`}
                              >
                                {currentStatus}
                              </Badge>
                              {currentStatus === "pending" && (
                                <div className="flex gap-1">
                                  <Button size="sm" variant="default" className="h-7 text-xs gap-1" onClick={() => handleSellerAction(seller.id, "active")} data-testid={`approve-seller-main-${seller.id}`}>
                                    <Check className="w-3 h-3" /> Verify
                                  </Button>
                                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleSellerAction(seller.id, "blocked")} data-testid={`reject-seller-main-${seller.id}`}>
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                              {currentStatus === "active" && (
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:text-destructive" onClick={() => handleSellerAction(seller.id, "blocked")} data-testid={`block-seller-${seller.id}`}>
                                  <Ban className="w-3.5 h-3.5" />
                                </Button>
                              )}
                              {currentStatus === "blocked" && (
                                <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 hover:text-success" onClick={() => handleSellerAction(seller.id, "active")} data-testid={`unblock-seller-${seller.id}`}>
                                  <UserCheck className="w-3.5 h-3.5" /> Unblock
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CATEGORIES */}
              {activeTab === "categories" && (
                <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="bg-card rounded-xl p-5 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display font-bold text-lg text-foreground">Category Management</h3>
                      <Button size="sm" variant="default" className="gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> Add Category
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categories.map(cat => (
                        <div key={cat.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors" data-testid={`category-row-${cat.id}`}>
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={cat.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-body font-semibold text-sm text-foreground">{cat.name}</p>
                            <p className="text-xs text-muted-foreground font-body">{cat.nameAmharic} • {cat.productCount} products</p>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" data-testid={`edit-category-${cat.id}`}>
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:text-destructive" data-testid={`delete-category-${cat.id}`}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* REPORTS */}
              {activeTab === "reports" && (
                <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="bg-card rounded-xl p-5 shadow-card">
                    <h3 className="font-display font-bold text-lg text-foreground mb-4">Reported Content</h3>
                    {[
                      { type: "Product", name: "Suspicious Electronics Listing", reporter: "Dawit M.", date: "Mar 11, 2026", severity: "High" },
                      { type: "Seller", name: "Fake Jewelry Seller", reporter: "Sara A.", date: "Mar 10, 2026", severity: "High" },
                      { type: "Review", name: "Spam review on Coffee listing", reporter: "Hanna T.", date: "Mar 9, 2026", severity: "Low" },
                      { type: "Product", name: "Counterfeit branded shoes", reporter: "Yonas K.", date: "Mar 8, 2026", severity: "Medium" },
                    ].map((report, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0" data-testid={`report-row-${i}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${report.severity === "High" ? "bg-destructive" : report.severity === "Medium" ? "bg-warning" : "bg-muted-foreground"}`} />
                          <div>
                            <p className="font-body font-semibold text-sm text-foreground">{report.name}</p>
                            <p className="text-xs text-muted-foreground font-body">{report.type} • Reported by {report.reporter} on {report.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-xs font-body ${report.severity === "High" ? "border-destructive text-destructive" : report.severity === "Medium" ? "border-warning text-warning" : "border-muted-foreground text-muted-foreground"}`}>
                            {report.severity}
                          </Badge>
                          <Button size="sm" variant="default" className="h-7 text-xs">Review</Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs">Dismiss</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ANALYTICS */}
              {activeTab === "analytics" && (
                <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Monthly Revenue" value="892K ETB" change="↑ 23% vs last month" icon={TrendingUp} color="bg-success" />
                    <StatCard label="New Users" value="1,234" change="↑ 8% this week" icon={Users} color="bg-blue-500" />
                    <StatCard label="Conversion Rate" value="3.8%" change="↑ 0.4% this month" icon={Activity} color="bg-warning" />
                    <StatCard label="Avg Order Value" value="2,450 ETB" change="↑ 12% this month" icon={DollarSign} color="bg-teal-DEFAULT" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-card rounded-xl p-5 shadow-card">
                      <h3 className="font-display font-bold text-base text-foreground mb-4">Top Categories by Revenue</h3>
                      <div className="space-y-3">
                        {[
                          { name: "Electronics", revenue: 342000, pct: 85 },
                          { name: "Cars", revenue: 285000, pct: 71 },
                          { name: "Fashion", revenue: 198000, pct: 49 },
                          { name: "Coffee", revenue: 145000, pct: 36 },
                          { name: "Jewelry", revenue: 112000, pct: 28 },
                        ].map(cat => (
                          <div key={cat.name}>
                            <div className="flex items-center justify-between text-xs font-body mb-1">
                              <span className="text-foreground font-medium">{cat.name}</span>
                              <span className="text-muted-foreground">{cat.revenue.toLocaleString()} ETB</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full gradient-teal rounded-full transition-all" style={{ width: `${cat.pct}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-card rounded-xl p-5 shadow-card">
                      <h3 className="font-display font-bold text-base text-foreground mb-4">System Activity Log</h3>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {[
                          { action: "New seller registered", detail: "Ethiopian Crafts Co.", time: "2 min ago", icon: Users },
                          { action: "Product approved", detail: "Samsung Galaxy A54 5G", time: "8 min ago", icon: Check },
                          { action: "Order placed", detail: "Order #45,671 - 3,500 ETB", time: "12 min ago", icon: Package },
                          { action: "User blocked", detail: "meron.a@gmail.com", time: "25 min ago", icon: Ban },
                          { action: "Product rejected", detail: "Suspicious accessory listing", time: "34 min ago", icon: X },
                          { action: "Category added", detail: "Gifts subcategory: Occasions", time: "1 hour ago", icon: Tag },
                        ].map((log, i) => (
                          <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                            <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                              <log.icon className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-body font-medium text-foreground">{log.action}</p>
                              <p className="text-xs text-muted-foreground font-body">{log.detail} • {log.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SETTINGS */}
              {activeTab === "settings" && (
                <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="space-y-4">
                    {[
                      { title: "General Settings", items: [
                        { label: "Site Name", value: "Gojo", type: "text" },
                        { label: "Support Email", value: "support@gojo.et", type: "text" },
                        { label: "Maintenance Mode", value: "Off", type: "toggle" },
                      ]},
                      { title: "Seller Settings", items: [
                        { label: "Auto-approve sellers", value: "Off", type: "toggle" },
                        { label: "Commission Rate", value: "5%", type: "text" },
                        { label: "Minimum seller rating", value: "4.0", type: "text" },
                      ]},
                      { title: "Product Settings", items: [
                        { label: "Auto-approve products", value: "Off", type: "toggle" },
                        { label: "Max images per product", value: "10", type: "text" },
                        { label: "Review required before publish", value: "On", type: "toggle" },
                      ]},
                    ].map(section => (
                      <div key={section.title} className="bg-card rounded-xl p-5 shadow-card">
                        <h3 className="font-display font-bold text-base text-foreground mb-4">{section.title}</h3>
                        <div className="space-y-4">
                          {section.items.map(item => (
                            <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                              <label className="text-sm font-body font-medium text-foreground">{item.label}</label>
                              {item.type === "toggle" ? (
                                <div className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${item.value === "On" ? "bg-success" : "bg-muted"}`}>
                                  <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${item.value === "On" ? "translate-x-6" : "translate-x-0"}`} />
                                </div>
                              ) : (
                                <input defaultValue={item.value} className="h-9 px-3 rounded-lg border border-input bg-background text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring w-40 text-right" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end">
                      <Button variant="gold" size="lg">Save Settings</Button>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPanel;
