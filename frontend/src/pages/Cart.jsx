import { Link } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlineTrash, HiOutlinePlus, HiOutlineMinus, HiOutlineShieldCheck } from "react-icons/hi2";
import useCart from "../hooks/useCart";

const Cart = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();

  const handleIncrement = (item) => updateQuantity(item.product._id, item.quantity + 1);
  const handleDecrement = (item) => {
    if (item.quantity <= 1) {
      removeFromCart(item.product._id);
    } else {
      updateQuantity(item.product._id, item.quantity - 1);
    }
  };

  const deliveryFee = cartTotal > 0 ? (cartTotal > 500 ? 0 : 25) : 0;
  const grandTotal = cartTotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-fade-in flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-48 h-48 mb-6 relative">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" 
            alt="Empty Cart" 
            className="w-full h-full object-contain opacity-50 grayscale"
          />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-display)] text-midnight mb-2">
          Your cart is empty
        </h2>
        <p className="text-midnight-lighter mb-8 text-center max-w-sm">
          Looks like you haven't added anything to your cart yet. Let's find you some premium essentials.
        </p>
        <Link 
          to="/" 
          className="px-8 py-3.5 bg-gold text-midnight font-bold rounded-xl hover:bg-gold-light transition-all shadow-md hover:shadow-lg"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-8">
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <HiOutlineArrowLeft className="w-5 h-5 text-midnight" />
        </Link>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-midnight">Review Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="font-semibold text-midnight flex items-center gap-2">
                Items Details
              </h2>
              <span className="text-xs font-bold text-midnight bg-gold/20 px-2 py-1 rounded-full uppercase">
                {cartItems.length} Products
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div key={item.product._id} className="p-4 md:p-6 flex gap-4 md:gap-6 items-center">
                  {/* Image */}
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-ivory flex-shrink-0 border border-gray-100 flex items-center justify-center p-2">
                    <img 
                      src={item.product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200"} 
                      alt={item.product.name} 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-sm md:text-base font-semibold text-midnight leading-tight mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-midnight-lighter mb-3">{item.product.weight || "1 unit"}</p>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-midnight">₹{item.product.price}</span>
                      {item.product.discount > 0 && (
                        <span className="text-[10px] text-gray-400 line-through">
                          ₹{Math.round(item.product.price * (1 + item.product.discount/100))}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1">
                      <button 
                        onClick={() => handleDecrement(item)}
                        className="w-8 h-8 flex items-center justify-center text-midnight hover:bg-white rounded transition-colors shadow-sm"
                      >
                        {item.quantity === 1 ? <HiOutlineTrash className="w-4 h-4 text-red-500" /> : <HiOutlineMinus className="w-4 h-4" />}
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-midnight">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => handleIncrement(item)}
                        className="w-8 h-8 flex items-center justify-center text-midnight hover:bg-white rounded transition-colors shadow-sm"
                      >
                        <HiOutlinePlus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-midnight">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Delivery Note */}
            <div className="bg-green-50 p-4 flex items-start gap-3 border-t border-green-100">
              <HiOutlineShieldCheck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-800">Freshness Guarantee</p>
                <p className="text-xs text-green-700 mt-0.5">We promise fresh products delivery. Replacement on any quality issue!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bill Summary */}
        <div className="lg:sticky lg:top-28">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-midnight mb-4 flex items-center gap-2">
              Bill Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-midnight-lighter">Item Total</span>
                <span className="font-medium text-midnight">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-midnight-lighter">Handling Charge</span>
                <span className="font-medium text-midnight">₹5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-midnight-lighter">Delivery Fee</span>
                <span className="font-medium text-midnight">
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-bold tracking-wide uppercase text-xs line-through mr-1">₹25</span>
                  ) : null}
                  {deliveryFee === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-[10px] text-gray-400">Add ₹{500 - cartTotal} more for FREE Delivery</p>
              )}
            </div>

            <div className="border-t border-dashed border-gray-200 pt-4 mb-8">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="font-bold text-midnight">Grand Total</h3>
                  <p className="text-[10px] text-midnight-lighter uppercase tracking-widest mt-1">Inclusive of all taxes</p>
                </div>
                <span className="text-2xl font-bold font-[family-name:var(--font-display)] text-midnight">
                  ₹{grandTotal + 5}
                </span>
              </div>
            </div>

            <Link 
              to="/checkout"
              className="w-full flex items-center justify-center p-4 bg-midnight text-gold font-bold rounded-xl hover:bg-midnight-light transition-all shadow-md group"
            >
              Proceed to Checkout
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
