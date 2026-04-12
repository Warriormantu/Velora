import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import API from "../services/api";
import toast from "react-hot-toast";

/**
 * Checkout page with delivery address form and order placement.
 * Reduces stock on the backend and clears cart after successful order.
 */
const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        products: cartItems.map((item) => ({
          productId: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
        totalAmount: cartTotal,
        deliveryAddress: address,
        paymentStatus: "paid",
      };

      await API.post("/orders", orderData);
      clearCart();
      toast.success("Order placed successfully! 🎉");
      navigate("/orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-midnight mb-4">Your cart is empty</h2>
        <button onClick={() => navigate("/")} className="text-gold font-semibold hover:text-gold-dark">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-display)] text-midnight mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
        {/* Address Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-midnight mb-4">Delivery Address</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "fullName", label: "Full Name", type: "text", placeholder: "John Doe" },
                { name: "phone", label: "Phone", type: "tel", placeholder: "+91 98765 43210" },
                { name: "street", label: "Street Address", type: "text", placeholder: "123 Main Street, Apt 4", full: true },
                { name: "city", label: "City", type: "text", placeholder: "Mumbai" },
                { name: "state", label: "State", type: "text", placeholder: "Maharashtra" },
                { name: "pincode", label: "Pin Code", type: "text", placeholder: "400001" },
              ].map((field) => (
                <div key={field.name} className={field.full ? "sm:col-span-2" : ""}>
                  <label className="block text-sm font-medium text-midnight mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={address[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required
                    className="w-full px-4 py-2.5 bg-ivory border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Payment (simulated) */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-midnight mb-4">Payment</h3>
            <div className="p-4 bg-cream rounded-xl text-center">
              <p className="text-sm text-midnight-lighter">
                💳 Payment is simulated for demo. Orders are marked as <span className="font-semibold text-green-600">Paid</span> automatically.
              </p>
            </div>
          </div>

          {/* Place Order Button (visible on mobile) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full lg:hidden py-3 bg-gold text-midnight font-semibold rounded-full hover:bg-gold-light transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Placing Order..." : `Place Order — ₹${cartTotal}`}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit sticky top-20">
          <h3 className="text-lg font-semibold text-midnight mb-4">Order Summary</h3>

          <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
            {cartItems.map((item) => (
              <div key={item.product._id} className="flex items-center gap-3">
                <img
                  src={item.product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=80"}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-midnight truncate">{item.product.name}</p>
                  <p className="text-xs text-midnight-lighter">Qty: {item.quantity}</p>
                </div>
                <span className="text-xs font-semibold text-midnight">
                  ₹{item.product.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-midnight-lighter">Subtotal</span>
              <span className="font-medium">₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-midnight-lighter">Delivery</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <span className="font-semibold text-midnight">Total</span>
              <span className="text-xl font-bold text-midnight">₹{cartTotal}</span>
            </div>
          </div>

          {/* Place Order Button (desktop) — uses formRef to submit */}
          <button
            type="button"
            onClick={() => formRef.current?.requestSubmit()}
            disabled={loading}
            className="hidden lg:block w-full mt-4 py-3 bg-gold text-midnight font-semibold rounded-full hover:bg-gold-light transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
