import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CheckCircle, XCircle, Users, Package, TrendingUp, AlertTriangle, Search, Filter, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  pendingApprovals: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

interface PendingProduct {
  id: string;
  title: string;
  seller: string;
  category: string;
  price: number;
  submittedAt: string;
  image: string;
}

interface AdminDashboardProps {
  stats: DashboardStats;
  pendingProducts: PendingProduct[];
  onApproveProduct?: (productId: string) => void;
  onRejectProduct?: (productId: string, reason: string) => void;
}

const chartData = [
  { month: 'Jan', sales: 4000, users: 2400 },
  { month: 'Feb', sales: 3000, users: 1398 },
  { month: 'Mar', sales: 2000, users: 9800 },
  { month: 'Apr', sales: 2780, users: 3908 },
  { month: 'May', sales: 1890, users: 4800 },
  { month: 'Jun', sales: 2390, users: 3800 },
];

const categoryData = [
  { name: 'Electronics', value: 35 },
  { name: 'Fashion', value: 25 },
  { name: 'Home & Living', value: 20 },
  { name: 'Others', value: 20 },
];

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

export const AdminDashboard = ({
  stats,
  pendingProducts,
  onApproveProduct,
  onRejectProduct,
}: AdminDashboardProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<PendingProduct | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const filteredProducts = pendingProducts.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReject = () => {
    if (selectedProduct && rejectionReason.trim()) {
      onRejectProduct?.(selectedProduct.id, rejectionReason);
      setShowRejectDialog(false);
      setRejectionReason('');
      setSelectedProduct(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Manage products, users, and platform settings
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Products</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {stats.totalProducts.toLocaleString()}
                </p>
              </div>
              <Package className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Users</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {stats.totalUsers.toLocaleString()}
                </p>
              </div>
              <Users className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Pending Approvals</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {stats.pendingApprovals}
                </p>
              </div>
              <AlertTriangle className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Revenue</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  ₦{(stats.totalRevenue / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +{stats.monthlyGrowth}% this month
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <Card className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Sales & Users Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Category Distribution */}
          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Products by Category
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Tabs for Management */}
        <Tabs defaultValue="approvals" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <TabsTrigger value="approvals">Product Approvals</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Product Approvals Tab */}
          <TabsContent value="approvals" className="space-y-4">
            <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search by product name or seller..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="space-y-4">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500 dark:text-slate-400">
                      No pending products found
                    </p>
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {product.title}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          by {product.seller} • {product.category}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                          Submitted: {new Date(product.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900 dark:text-white">
                          ₦{product.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => onApproveProduct?.(product.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowRejectDialog(true);
                          }}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users">
            <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400">
                User management features coming soon...
              </p>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400">
                Reports and moderation features coming soon...
              </p>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400">
                Site settings and configuration coming soon...
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Rejection Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 dark:text-white">
              Reject Product
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
              Please provide a reason for rejecting this product. The seller will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter rejection reason..."
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white"
            rows={4}
          />
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel className="border-slate-300 dark:border-slate-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject Product
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
