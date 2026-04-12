import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineCube,
  HiOutlineClipboardDocumentList,
  HiOutlineCurrencyRupee,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import API from "../../services/api";
import Loader from "../../components/ui/Loader";

/**
 * Admin Dashboard — overview stats, real-time charts, recent orders, and low-stock alerts.
 */
const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes, analyticsRes] = await Promise.all([
          API.get("/products?limit=100"), // Get a large batch for low stock analysis
          API.get("/orders"),
          API.get("/orders/analytics"),
        ]);
        
        // Handle paginated response format for products
        const productsData = productsRes.data.products || productsRes.data;
        
        setProducts(productsData);
        setOrders(ordersRes.data);
        setAnalytics(analyticsRes.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const lowStock = products.filter((p) => p.stock < 10);
  const recentOrders = orders.slice(0, 5);

  const statusColors = {
    placed: "bg-blue-100 text-blue-700",
    confirmed: "bg-indigo-100 text-indigo-700",
    shipped: "bg-yellow-100 text-yellow-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const statCards = [
    { icon: HiOutlineCube, label: "Total Products", value: products.length, color: "bg-blue-50 text-blue-600", link: "/admin/products" },
    { icon: HiOutlineClipboardDocumentList, label: "Total Orders", value: orders.length, color: "bg-green-50 text-green-600", link: "/admin/orders" },
    { icon: HiOutlineCurrencyRupee, label: "Total Revenue", value: `₹${revenue.toLocaleString()}`, color: "bg-amber-50 text-amber-600", link: "/admin/orders" },
    { icon: HiOutlineExclamationTriangle, label: "Low Stock Items", value: lowStock.length, color: lowStock.length > 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600", link: "/admin/products" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-display)] text-midnight">
          Dashboard
        </h1>
        <p className="text-sm text-midnight-lighter mt-1">Overview of your VELORA store</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in">
        {statCards.map((card, i) => (
          <Link
            key={i}
            to={card.link}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200 group"
          >
            <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-xs text-midnight-lighter font-medium">{card.label}</p>
            <p className="text-xl font-bold text-midnight mt-0.5 group-hover:text-gold transition-colors">
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Revenue Chart Section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-midnight font-[family-name:var(--font-display)]">Revenue Overview (Last 7 Days)</h3>
        </div>
        <div className="h-72 w-full">
          {analytics.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-midnight-lighter bg-ivory/30 rounded-xl border border-dashed border-gray-200">
               No sales data for the last 7 days.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A859" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#C5A859" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: "#6B7280" }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: "#6B7280" }} 
                  tickFormatter={(value) => `₹${value}`}
                  dx={-10}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <Tooltip 
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" }}
                  formatter={(value) => [`₹${value}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C5A859" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-midnight">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-gold font-semibold hover:text-gold-dark transition-colors">
              View All →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-midnight-lighter">
              No orders yet
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3 hover:bg-ivory/50 transition-colors gap-2">
                  <div>
                    <p className="text-sm font-medium text-midnight">
                      #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-midnight-lighter mt-0.5">
                      {order.userId?.name || "User"} · {order.products.length} item{order.products.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-left sm:text-right flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${statusColors[order.orderStatus] || "bg-gray-100"}`}>
                      {order.orderStatus}
                    </span>
                    <span className="text-sm font-bold text-midnight">₹{order.totalAmount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-midnight">Low Stock Alerts</h3>
            <Link to="/admin/products" className="text-xs text-gold font-semibold hover:text-gold-dark transition-colors">
              Manage →
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-green-600">
              ✓ All products are well-stocked
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {lowStock.map((product) => (
                <div key={product._id} className="flex items-center gap-3 px-5 py-3 hover:bg-ivory/50 transition-colors">
                  <img
                    src={product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=80"}
                    alt={product.name}
                    className="w-9 h-9 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-midnight truncate">{product.name}</p>
                    <p className="text-xs text-midnight-lighter">{product.category}</p>
                  </div>
                  <span className={`text-sm font-bold ${product.stock === 0 ? "text-red-500" : "text-orange-500"}`}>
                    {product.stock === 0 ? "Out" : product.stock + " left"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
