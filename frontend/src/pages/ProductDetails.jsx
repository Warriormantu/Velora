import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlinePlus, HiOutlineMinus, HiOutlineCube } from "react-icons/hi2";
import API from "../services/api";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import Loader from "../components/ui/Loader";

/**
 * Full product detail page.
 * Shows large image, full description, price, stock status, and add-to-cart controls (stepper).
 */
const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { addToCart, removeFromCart, updateQuantity, cartItems } = useCart();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Loader />;
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-midnight">Product not found</h2>
        <Link to="/" className="text-gold mt-4 inline-block hover:text-gold-light transition-colors">
          Go back home
        </Link>
      </div>
    );
  }

  // Find this product in the cart (if it exists)
  const cartItem = cartItems.find((item) => item.product._id === product._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => addToCart(product);
  
  const handleIncrement = () => updateQuantity(product._id, quantity + 1);
  
  const handleDecrement = () => {
    if (quantity <= 1) {
      removeFromCart(product._id);
    } else {
      updateQuantity(product._id, quantity - 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Back link */}
      <Link
        to="/#products"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-midnight-lighter hover:text-gold transition-colors mb-8"
      >
        <HiOutlineArrowLeft className="w-4 h-4" /> Back to products
      </Link>

      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-ivory-dark group">
            <img
              src={product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            {/* Category badge */}
            <span className="inline-block px-3 py-1 bg-midnight text-gold text-xs font-bold tracking-widest uppercase rounded-full w-fit mb-5 shadow-sm">
              {product.category}
            </span>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-display)] text-midnight mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Description */}
            <p className="text-midnight-lighter/90 text-sm md:text-base leading-relaxed mb-8 max-w-lg">
              {product.description}
            </p>

            {/* Price & Stock info row */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8 mb-10 pb-8 border-b border-gray-100">
              <div>
                <p className="text-xs text-midnight-lighter font-medium mb-1 uppercase tracking-wider">Price</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold text-midnight">₹{product.price}</span>
                  <span className="text-sm font-medium text-midnight-lighter">/ unit</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-midnight-lighter font-medium mb-1 uppercase tracking-wider">Availability</p>
                <div className="flex items-center gap-1.5 h-[40px]">
                  <HiOutlineCube className={`w-5 h-5 ${product.stock > 0 ? "text-green-600" : "text-red-500"}`} />
                  {product.stock > 0 ? (
                    <span className="text-sm text-green-600 font-semibold">
                      In Stock <span className="text-midnight-lighter font-normal">({product.stock} available)</span>
                    </span>
                  ) : (
                    <span className="text-sm text-red-500 font-semibold">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>

            {/* Cart Controls (Hidden for Admin) */}
            {!isAdmin && (
              <div className="mb-4">
                {product.stock === 0 ? (
                  /* Out of stock */
                  <div className="inline-block px-8 py-4 rounded-full text-sm font-bold bg-gray-100 text-gray-400">
                    Currently Unavailable
                  </div>
                ) : quantity > 0 ? (
                  /* Quantity stepper */
                  <div className="inline-flex items-center bg-ivory-dark border border-gray-200 rounded-full p-1 shadow-sm">
                    <button
                      onClick={handleDecrement}
                      className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-midnight hover:bg-gold hover:text-midnight hover:border-transparent transition-all shadow-sm"
                    >
                      <HiOutlineMinus className="w-5 h-5" />
                    </button>
                    <div className="w-16 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold text-midnight leading-none">{quantity}</span>
                      <span className="text-[10px] text-midnight-lighter font-medium uppercase tracking-wider mt-0.5">in cart</span>
                    </div>
                    <button
                      onClick={handleIncrement}
                      className="w-12 h-12 rounded-full bg-midnight text-gold flex items-center justify-center hover:bg-gold hover:text-midnight transition-all shadow-sm"
                    >
                      <HiOutlinePlus className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  /* Add button */
                  <button
                    onClick={handleAdd}
                    className="flex items-center justify-center gap-2 px-10 py-4 bg-gold text-midnight font-bold rounded-full hover:bg-gold-light transition-all duration-300 hover:shadow-xl hover:shadow-gold/20 hover:-translate-y-0.5 w-full sm:w-auto"
                  >
                    <HiOutlinePlus className="w-5 h-5" /> Add to Cart
                  </button>
                )}
              </div>
            )}
            
            {/* Admin Notice */}
            {isAdmin && (
              <div className="p-4 bg-ivory-dark rounded-xl border border-gray-200 max-w-md">
                <p className="text-sm text-midnight-lighter">
                  <span className="font-semibold text-midnight block mb-1">Admin View</span>
                  Cart controls are disabled for administrative accounts.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
