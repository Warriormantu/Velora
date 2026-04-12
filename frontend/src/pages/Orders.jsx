import { useState, useEffect } from "react";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import API from "../services/api";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

/**
 * User's order history page.
 * Shows all orders with status, items, and totals. Updates in real-time.
 */
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get("/orders/user");
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();

    // Real-time WebSockets tracking
    const socket = io(import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : "http://localhost:5000");

    socket.on("orderStatusUpdated", (updatedOrder) => {
      setOrders((prevOrders) => {
        // If the updated order belongs to this list, update it
        const exists = prevOrders.some((o) => o._id === updatedOrder._id);
        if (exists) {
          toast(`Order #${updatedOrder._id.slice(-8).toUpperCase()} is now ${updatedOrder.orderStatus.toUpperCase()}!`, { icon: "🔔" });
          return prevOrders.map((o) => (o._id === updatedOrder._id ? updatedOrder : o));
        }
        return prevOrders;
      });
    });

    return () => socket.disconnect();
  }, []);

  // Status badge color mapping
  const statusColors = {
    placed: "bg-blue-100 text-blue-700",
    confirmed: "bg-indigo-100 text-indigo-700",
    shipped: "bg-yellow-100 text-yellow-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-display)] text-midnight mb-8">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={HiOutlineClipboardDocumentList}
          title="No orders yet"
          message="When you place an order, it will show up here"
        />
      ) : (
        <div className="space-y-4 animate-fade-in">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-sm transition-shadow"
            >
              {/* Order header */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-ivory-dark/50">
                <div className="flex flex-wrap items-center gap-4 text-xs text-midnight-lighter">
                  <span>
                    <span className="font-semibold text-midnight">Order ID:</span>{" "}
                    {order._id.slice(-8).toUpperCase()}
                  </span>
                  <span>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      statusColors[order.orderStatus] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Order items */}
              <div className="p-4">
                <div className="space-y-2">
                  {order.products.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=100"}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-midnight truncate">{item.name}</p>
                        <p className="text-xs text-midnight-lighter">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-midnight">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                  <span className="text-sm text-midnight-lighter">Total</span>
                  <span className="text-lg font-bold text-midnight">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
