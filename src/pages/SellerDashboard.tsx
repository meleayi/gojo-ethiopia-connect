import { useState } from "react";
import {
  Package, ShoppingCart, BarChart3, Boxes, Plus, Eye, Edit, Trash2,
  TrendingUp, Star, Heart, MessageCircle, ArrowUpRight, Bell,
  CheckCircle, Clock, XCircle, DollarSign, Users, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/mock-data";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const REVENUE_DATA = [
  { month: "Sep", revenue: 18400, orders: 42 },
  { month: "Oct", revenue: 22000, orders: 58 },
  { month: "Nov", revenue: 28500, orders: 67 },
  { month: "Dec", revenue: 35200, orders: 89 },
  { month: "Jan", revenue: 31000, orders: 74 },
  { month: "Feb", revenue: 38900, orders: 95 },
  { month: "Mar", revenue: 45230, orders: 112 },
];

const ORDER_STATUS_DATA = [
  { name: "Delivered", value: 78, color: "#22c55e" },
  { name: "In Transit", value: 14, color: "#3b82f6" },
  { name: "Processing", value: 8, color: "#f59e0b" },
];

const PRODUCT_PERFORMANCE = [
  { name: "Yirgacheffe Coffee", views: 1240, wishlist: 89, orders: 56, conversion: 4.5 },
  { name: "Sidamo Coffee Bundle", views: 980, wishlist: 67, orders: 43, conversion: 4.4 },
  { name: "Wildflower Honey", views: 2340, wishlist: 145, orders: 112, conversion: 4.8 },
  { name: "Hand-Embroidered Scarf", views: 456, wishlist: 34, orders: 18, conversion: 3.9 },
  { name: "Organic Turmeric", views: 678, wishlist: 45, orders: 29, conversion: 4.3 },
];

const SELLER_TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "notifications", label: "Alerts", icon: Bell },
];

const MOCK_ORDERS = [
  { id: "GJ-045", buyer: "Dawit M.", product: "Yirgacheffe Coffee", amount: 1700, status: "Delivered", date: "Mar 11" },
  { id: "GJ-044", buyer: "Sara A.", product: "Wildflower Honey", amount: 650, status: "In Transit", date: "Mar 10" },
  { id: "GJ-043", buyer: "Hanna T.", product: "Sidamo Bundle", amount: 2900, status: "Processing", date: "Mar 10" },
  { id: "GJ-042", buyer: "Yonas K.", product: "Turmeric Powder", amount: 360, status: "Delivered", date: "Mar 9" },
  { id: "GJ-041", buyer: "Meron A.", product: "Embroidered Scarf", amount: 1200, status: "Delivered", date: "Mar 8" },
];

const MOCK_MESSAGES = [
  { id: "1", buyer: "Dawit M.", avatar: "DM", message: "Is the coffee still available for bulk order?", time: "2m ago", unread: true },
  { id: "2", buyer: "Sara A.", avatar: "SA", message: "Can you ship to Dire Dawa? What's the delivery fee?", time: "25m ago", unread: true },
  { id: "3", buyer: "Hanna T.", avatar: "HT", message: "Thank you for the quick delivery! ★★★★★", time: "2h ago", unread: false },
  { id: "4", buyer: "Yonas K.", avatar: "YK", message: "Do you have larger packs of the honey?", time: "Yesterday", unread: false },
];

const statusColors: Record<string, string> = {
  Delivered: "bg-success/10 text-success border-success/20",
  "In Transit": "bg-info/10 text-info border-info/20",
  Processing: "bg-warning/10 text-warning border-warning/20",
};

const StatCard = ({ label, value, change, icon: Icon, color, sub }: { label: string; value: string; change?: string; icon: React.ElementType; color: string; sub?: string }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-5 shadow-card">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      {change && (
        <span className="flex items-center gap-0.5 text-xs font-body font-semibold text-success">
          <ArrowUpRight className="w-3 h-3" />{change}
        </span>
      )}
    </div>
    <p className="font-display text-2xl font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground font-body mt-0.5">{label}</p>
    {sub && <p className="text-xs text-primary font-body font-medium mt-1">{sub}</p>}
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-xs font-body font-semibold text-foreground mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-xs font-body" style={{ color: p.color }}>
            {p.name}: {typeof p.value === 'number' && p.name === 'revenue' ? `${p.value.toLocaleString()} ETB` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [productFilter, setProductFilter] = useState("all");
  const [replyMsg, setReplyMsg] = useState<Record<string, string>>({});

  const sellerProducts = products.filter(p => p.seller === "Abyssinia Coffee" || p.category === "Coffee" || p.category === "Spices");

  const filteredProducts = productFilter === "all"
    ? sellerProducts
    : sellerProducts.filter(p => (p.status || "approved") === productFilter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl gradient-teal flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-xl">AC</span>
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Abyssinia Coffee</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
                  <span className="text-xs font-body font-semibold">4.8</span>
                </div>
                <span className="text-muted-foreground text-xs">•</span>
                <Badge variant="outline" className="text-xs font-body border-success text-success">Verified Seller</Badge>
                <span className="text-muted-foreground text-xs">•</span>
                <span className="text-xs text-muted-foreground font-body">Addis Ababa</span>
              </div>
            </div>
          </div>
          <Button variant="gold" className="gap-1.5" data-testid="add-product-btn">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <StatCard label="Total Revenue" value="45.2K ETB" change="+18%" icon={DollarSign} color="bg-success" />
          <StatCard label="Total Orders" value="156" change="+8%" icon={ShoppingCart} color="bg-blue-500" />
          <StatCard label="Total Products" value="12" icon={Package} color="bg-purple-500" sub="All listings" />
          <StatCard label="Active" value="9" icon={CheckCircle} color="bg-success" sub="Live now" />
          <StatCard label="Pending" value="2" icon={Clock} color="bg-warning" sub="Awaiting review" />
          <StatCard label="Rejected" value="1" icon={XCircle} color="bg-destructive" sub="Needs revision" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
          {SELLER_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-body font-medium flex-shrink-0 transition-colors ${
                activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted border border-border"
              }`}
              data-testid={`seller-tab-${tab.id}`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
              {tab.id === "messages" && <span className="w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">2</span>}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-card rounded-xl p-5 shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-display font-bold text-base text-foreground">Revenue Trend</h3>
                      <p className="text-xs text-muted-foreground font-body">Last 7 months</p>
                    </div>
                    <Badge variant="outline" className="text-xs font-body text-success border-success">↑ 16.2% vs last month</Badge>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={REVENUE_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(186,47%,25%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(186,47%,25%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "DM Sans" }} />
                      <YAxis tick={{ fontSize: 11, fontFamily: "DM Sans" }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="revenue" name="revenue" stroke="hsl(186,47%,25%)" fill="url(#revGrad)" strokeWidth={2} dot={{ r: 3, fill: "hsl(186,47%,25%)" }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Order Status Donut */}
                <div className="bg-card rounded-xl p-5 shadow-card">
                  <h3 className="font-display font-bold text-base text-foreground mb-4">Order Status</h3>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={ORDER_STATUS_DATA} innerRadius={50} outerRadius={70} dataKey="value" paddingAngle={3}>
                        {ORDER_STATUS_DATA.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: any) => [`${v} orders`]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2">
                    {ORDER_STATUS_DATA.map(d => (
                      <div key={d.name} className="flex items-center justify-between text-xs font-body">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                          <span className="text-foreground">{d.name}</span>
                        </div>
                        <span className="font-semibold text-foreground">{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Orders chart + top products */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-xl p-5 shadow-card">
                  <h3 className="font-display font-bold text-base text-foreground mb-4">Monthly Orders</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={REVENUE_DATA} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "DM Sans" }} />
                      <YAxis tick={{ fontSize: 11, fontFamily: "DM Sans" }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="orders" name="orders" fill="hsl(43,56%,52%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-card rounded-xl p-5 shadow-card">
                  <h3 className="font-display font-bold text-base text-foreground mb-4">Recent Orders</h3>
                  <div className="space-y-2.5">
                    {MOCK_ORDERS.slice(0, 4).map(order => (
                      <div key={order.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                        <div>
                          <p className="text-sm font-body font-medium text-foreground">{order.buyer}</p>
                          <p className="text-xs text-muted-foreground font-body">{order.product} • {order.date}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-sm font-body font-semibold text-primary">{order.amount.toLocaleString()} ETB</span>
                          <Badge variant="outline" className={`text-xs font-body capitalize ${statusColors[order.status]}`}>{order.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* PRODUCTS */}
          {activeTab === "products" && (
            <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-card rounded-xl shadow-card">
                <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
                  <h3 className="font-display font-bold text-lg text-foreground">My Products</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {["all", "approved", "pending", "rejected"].map(f => (
                        <button
                          key={f}
                          onClick={() => setProductFilter(f)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium capitalize transition-colors ${
                            productFilter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"
                          }`}
                          data-testid={`product-filter-${f}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                    <Button variant="gold" size="sm" className="gap-1">
                      <Plus className="w-3.5 h-3.5" /> Add
                    </Button>
                  </div>
                </div>

                <div className="divide-y divide-border">
                  {filteredProducts.map(product => {
                    const status = product.status || "approved";
                    const perf = PRODUCT_PERFORMANCE.find(p => p.name.includes(product.name.split(" ")[0])) || PRODUCT_PERFORMANCE[0];
                    return (
                      <div key={product.id} className="flex items-center gap-3 p-4 hover:bg-muted/20 transition-colors" data-testid={`seller-product-${product.id}`}>
                        <img src={product.image} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-body font-semibold text-sm text-foreground truncate">{product.name}</p>
                            <Badge variant="outline" className={`text-xs font-body capitalize flex-shrink-0 ${
                              status === "approved" ? "border-success text-success" :
                              status === "pending" ? "border-warning text-warning" :
                              "border-destructive text-destructive"
                            }`}>{status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground font-body">{product.category}</p>
                          <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                              <Eye className="w-3 h-3" /> {perf.views.toLocaleString()} views
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                              <Heart className="w-3 h-3" /> {perf.wishlist} wishlisted
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                              <ShoppingCart className="w-3 h-3" /> {perf.orders} orders
                            </span>
                            <span className="flex items-center gap-1 text-xs text-success font-body font-medium">
                              <TrendingUp className="w-3 h-3" /> {perf.conversion}% CVR
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="font-display font-bold text-sm text-primary">{product.price.toLocaleString()} ETB</span>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" className="w-7 h-7" data-testid={`view-product-${product.id}`}><Eye className="w-3.5 h-3.5" /></Button>
                            <Button size="icon" variant="ghost" className="w-7 h-7" data-testid={`edit-product-${product.id}`}><Edit className="w-3.5 h-3.5" /></Button>
                            <Button size="icon" variant="ghost" className="w-7 h-7 hover:text-destructive" data-testid={`delete-product-${product.id}`}><Trash2 className="w-3.5 h-3.5" /></Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-card rounded-xl shadow-card overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-display font-bold text-lg text-foreground">Order Management</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        {["Order ID", "Buyer", "Product", "Amount", "Status", "Date", "Action"].map(h => (
                          <th key={h} className="text-left text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_ORDERS.map(order => (
                        <tr key={order.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 text-sm font-body font-semibold text-foreground">#{order.id}</td>
                          <td className="px-4 py-3 text-sm font-body text-foreground">{order.buyer}</td>
                          <td className="px-4 py-3 text-sm font-body text-muted-foreground">{order.product}</td>
                          <td className="px-4 py-3 text-sm font-body font-semibold text-primary">{order.amount.toLocaleString()} ETB</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className={`text-xs font-body ${statusColors[order.status]}`}>{order.status}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm font-body text-muted-foreground">{order.date}</td>
                          <td className="px-4 py-3">
                            <Button size="sm" variant="ghost" className="h-7 text-xs">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ANALYTICS */}
          {activeTab === "analytics" && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Time filter */}
              <div className="flex gap-2 flex-wrap">
                {["Today", "7 Days", "30 Days", "This Month", "This Year"].map(f => (
                  <button
                    key={f}
                    className="px-3 py-1.5 rounded-lg text-xs font-body font-medium bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    data-testid={`time-filter-${f.toLowerCase().replace(" ", "-")}`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-xl p-5 shadow-card">
                  <h3 className="font-display font-bold text-base text-foreground mb-4">Revenue vs Orders</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={REVENUE_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "DM Sans" }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 11, fontFamily: "DM Sans" }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fontFamily: "DM Sans" }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 11, fontFamily: "DM Sans" }} />
                      <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue (ETB)" stroke="hsl(186,47%,25%)" strokeWidth={2} dot={{ r: 3 }} />
                      <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="hsl(43,56%,52%)" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-card rounded-xl p-5 shadow-card">
                  <h3 className="font-display font-bold text-base text-foreground mb-4">Product Performance</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead>
                        <tr className="border-b border-border">
                          {["Product", "Views", "❤", "Orders", "CVR"].map(h => (
                            <th key={h} className="text-left pb-2 text-muted-foreground font-semibold pr-3 last:pr-0">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {PRODUCT_PERFORMANCE.map((p, i) => (
                          <tr key={i} className="border-b border-border last:border-0">
                            <td className="py-2.5 pr-3 text-foreground font-medium max-w-[120px] truncate">{p.name}</td>
                            <td className="py-2.5 pr-3 text-muted-foreground">{p.views.toLocaleString()}</td>
                            <td className="py-2.5 pr-3 text-muted-foreground">{p.wishlist}</td>
                            <td className="py-2.5 pr-3 text-foreground font-semibold">{p.orders}</td>
                            <td className="py-2.5 text-success font-semibold">{p.conversion}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-5 shadow-card">
                <h3 className="font-display font-bold text-base text-foreground mb-4">Orders by Month (Bar Chart)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "DM Sans" }} />
                    <YAxis tick={{ fontSize: 11, fontFamily: "DM Sans" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="orders" name="orders" fill="hsl(186,47%,25%)" radius={[4, 4, 0, 0]}>
                      {REVENUE_DATA.map((_, i) => (
                        <Cell key={i} fill={i === REVENUE_DATA.length - 1 ? "hsl(43,56%,52%)" : "hsl(186,47%,25%)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* MESSAGES */}
          {activeTab === "messages" && (
            <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[500px]">
                {/* Conversation list */}
                <div className="bg-card rounded-xl shadow-card overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-display font-bold text-base text-foreground">Messages</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto divide-y divide-border">
                    {MOCK_MESSAGES.map(msg => (
                      <button
                        key={msg.id}
                        className={`w-full flex items-start gap-3 p-3 text-left hover:bg-muted/50 transition-colors ${msg.unread ? "bg-primary/3" : ""}`}
                        data-testid={`message-thread-${msg.id}`}
                      >
                        <div className="w-9 h-9 rounded-full gradient-teal flex items-center justify-center text-primary-foreground text-xs font-bold font-body flex-shrink-0">
                          {msg.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-body font-medium text-foreground ${msg.unread ? "font-semibold" : ""}`}>{msg.buyer}</p>
                            <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{msg.message}</p>
                        </div>
                        {msg.unread && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat area */}
                <div className="md:col-span-2 bg-card rounded-xl shadow-card overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-border flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full gradient-teal flex items-center justify-center text-primary-foreground font-bold text-sm">DM</div>
                    <div>
                      <p className="font-body font-semibold text-sm text-foreground">Dawit M.</p>
                      <p className="text-xs text-success font-body">Online</p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
                    <div className="flex justify-start">
                      <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-3 py-2 max-w-xs">
                        <p className="text-sm font-body text-foreground">Is the coffee still available for bulk order?</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">2m ago</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="gradient-teal rounded-2xl rounded-br-sm px-3 py-2 max-w-xs">
                        <p className="text-sm font-body text-primary-foreground">Yes! We offer bulk discounts for orders of 5kg or more. Would you like details?</p>
                        <p className="text-[10px] text-primary-foreground/60 mt-0.5">Just now</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-t border-border flex gap-2">
                    <input
                      placeholder="Reply to Dawit M..."
                      value={replyMsg["1"] || ""}
                      onChange={e => setReplyMsg(prev => ({ ...prev, "1": e.target.value }))}
                      className="flex-1 h-9 px-3 rounded-lg border border-input bg-background text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring"
                      data-testid="seller-reply-input"
                    />
                    <Button size="sm" variant="default" className="gap-1.5" data-testid="seller-send-btn">
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* NOTIFICATIONS / ALERTS */}
          {activeTab === "notifications" && (
            <motion.div key="notifications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-card rounded-xl shadow-card divide-y divide-border">
                {[
                  { type: "approval", title: "Product Approved", body: "Your 'Yirgacheffe Coffee Beans' listing is now live.", time: "15 min ago", icon: CheckCircle, color: "text-success bg-success/10" },
                  { type: "rejection", title: "Product Needs Revision", body: "Admin feedback: 'Please upload clearer product images and correct the description.'", time: "1 hour ago", icon: XCircle, color: "text-destructive bg-destructive/10" },
                  { type: "order", title: "New Order #GJ-045", body: "Dawit M. placed an order for Yirgacheffe Coffee × 2 — 1,700 ETB", time: "2 hours ago", icon: ShoppingCart, color: "text-info bg-info/10" },
                  { type: "review", title: "New 5-Star Review", body: "Hanna T. left a review: 'Amazing quality coffee! The aroma is incredible.'", time: "3 hours ago", icon: Star, color: "text-secondary bg-secondary/10" },
                  { type: "message", title: "New Message", body: "Sara A. asked: 'Can you ship to Dire Dawa?'", time: "5 hours ago", icon: MessageCircle, color: "text-blue-500 bg-blue-500/10" },
                ].map((notif, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 hover:bg-muted/20 transition-colors" data-testid={`seller-notif-${i}`}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${notif.color}`}>
                      <notif.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-sm text-foreground">{notif.title}</p>
                      <p className="text-xs text-muted-foreground font-body mt-0.5">{notif.body}</p>
                      <p className="text-[10px] text-muted-foreground font-body mt-1">{notif.time}</p>
                    </div>
                    {notif.type === "rejection" && (
                      <Button size="sm" variant="outline" className="flex-shrink-0 text-xs h-7">
                        Edit Product
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
};

export default SellerDashboard;
