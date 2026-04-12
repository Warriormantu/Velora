import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuth from "./hooks/useAuth";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AdminLayout from "./components/layout/AdminLayout";
import Loader from "./components/ui/Loader";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import SearchResults from "./pages/SearchResults";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";

/**
 * Protected Route wrapper.
 * Redirects to /login if user is not authenticated.
 * Redirects admin users away from shopper-only pages.
 */
const ProtectedRoute = ({ children, shopperOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" />;
  // Block admin from shopper-only pages (cart, checkout, orders)
  if (shopperOnly && user.role === "admin") return <Navigate to="/admin" />;
  return children;
};

/**
 * Admin Route wrapper.
 * Redirects to / if user is not an admin.
 */
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" />;
  return user.role === "admin" ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#0F172A",
            color: "#fff",
            borderRadius: "100px",
            padding: "10px 20px",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#C6A75E", secondary: "#0F172A" },
          },
        }}
      />

      <div className="flex flex-col min-h-screen bg-ivory">
        <Navbar />

        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/search" element={<SearchResults />} />

            {/* Shopper-only routes (blocked for admin) */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute shopperOnly>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute shopperOnly>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute shopperOnly>
                  <Orders />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes (wrapped in AdminLayout for sidebar) */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout><AdminDashboard /></AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminLayout><AdminProducts /></AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminLayout><AdminOrders /></AdminLayout>
                </AdminRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
