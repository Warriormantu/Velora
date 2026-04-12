import { Link } from "react-router-dom";
import { HiOutlinePlus, HiOutlineMinus, HiOutlineClock } from "react-icons/hi2";
import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";

/**
 * Single product card styled like a quick-commerce (Blinkit) item.
 */
const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, updateQuantity, cartItems } = useCart();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const cartItem = cartItems.find((item) => item.product._id === product._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product._id, quantity + 1);
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity <= 1) {
      removeFromCart(product._id);
    } else {
      updateQuantity(product._id, quantity - 1);
    }
  };

  // Mock weight based on category or fixed string if missing
  const weight = product.weight || "1 unit";

  return (
    <Link
      to={`/product/${product._id}`}
      className="group flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full"
    >
      {/* Product Image Area */}
      <div className="relative pt-4 pb-2 px-4 flex items-center justify-center">
        {/* Mock Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-0 left-0 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-1 uppercase rounded-br-lg">
            {product.discount}% OFF
          </div>
        )}
        
        {/* Stock indicator inside image top right */}
        {product.stock < 10 && product.stock > 0 && (
          <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-100 text-red-600 text-[9px] font-semibold rounded">
            Only {product.stock}
          </span>
        )}

        <div className="w-28 h-28 flex items-center justify-center">
          <img
            src={product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200"}
            alt={product.name}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </div>

      {/* Delivery Time (Blinkit style) */}
      <div className="px-3">
        <div className="inline-flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded text-[9px] font-bold text-gray-600 uppercase">
          <HiOutlineClock className="w-3 h-3" />
          12 MINS
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-midnight leading-snug line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>
        
        <p className="text-xs text-midnight-lighter mt-1 mb-3">
          {weight}
        </p>

        {/* Bottom row: Price & Button */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            {product.discount > 0 && (
              <span className="text-[10px] text-gray-400 line-through">
                ₹{Math.round(product.price * (1 + product.discount/100))}
              </span>
            )}
            <span className="text-sm font-bold text-midnight">
              ₹{product.price}
            </span>
          </div>

          {isAdmin ? null : product.stock === 0 ? (
            <span className="px-2 py-1 rounded text-[10px] font-bold bg-gray-100 text-gray-400">
              OUT OF STOCK
            </span>
          ) : quantity > 0 ? (
            <div className="flex items-center bg-gold rounded overflow-hidden shadow-sm">
              <button
                onClick={handleDecrement}
                className="w-7 h-7 flex items-center justify-center text-midnight font-bold hover:bg-gold-light transition-colors"
              >
                <HiOutlineMinus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center text-xs font-bold text-midnight">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-7 h-7 flex items-center justify-center text-midnight font-bold hover:bg-gold-light transition-colors"
              >
                <HiOutlinePlus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="px-4 py-1.5 rounded text-xs font-bold uppercase border border-gold text-gold hover:bg-gold/10 transition-colors"
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

