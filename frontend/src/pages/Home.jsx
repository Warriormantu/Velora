import { useState, useEffect } from "react";
import API from "../services/api";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import PromoBanners from "../components/home/PromoBanners";
import CategoryGrid from "../components/home/CategoryGrid";
import ProductCarousel from "../components/product/ProductCarousel";

/**
 * Home page — Blinkit style layout with Promo Banners, Category Grid, and Horizontal Product Carousels.
 */
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // For this blinkit style UI, we typically fetch all top products 
  // and display them grouped by category in carousels.
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Fetch a larger limit to populate multiple carousels
      const { data } = await API.get(`/products?page=1&limit=24`);
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Group products by their category
  const productsByCategory = products.reduce((acc, product) => {
    const cat = product.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white">
      {/* ═══════ Promo Banners ═══════ */}
      <section className="bg-white">
        <PromoBanners />
      </section>

      {/* ═══════ Category Grid ═══════ */}
      <section className="bg-white border-b border-gray-100 pb-4">
        <CategoryGrid />
      </section>

      {/* ═══════ Product Carousels ═══════ */}
      <section className="py-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            title="No products available"
            message="Check back later for fresh inventory"
          />
        ) : (
          <div className="flex flex-col gap-6">
            {Object.entries(productsByCategory).map(([category, items]) => (
              <ProductCarousel 
                key={category} 
                title={category} 
                products={items} 
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

