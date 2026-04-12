import { useRef } from "react";
import { HiOutlineChevronRight, HiOutlineChevronLeft } from "react-icons/hi2";
import ProductCard from "./ProductCard";

const ProductCarousel = ({ title, products }) => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -800, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 800, behavior: "smooth" });
    }
  };

  if (!products || products.length === 0) return null;

  // Create a URL-safe anchor ID matching what CategoryGrid generates
  const sectionId = `carousel-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  return (
    <div id={sectionId} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 scroll-mt-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-[family-name:var(--font-display)] text-midnight">
          {title}
        </h2>
        <button
          onClick={() => {
            if (scrollRef.current) {
              scrollRef.current.scrollBy({ left: 800, behavior: 'smooth' });
            }
          }}
          className="text-gold font-semibold text-sm hover:text-gold-light transition-colors"
        >
          see all →
        </button>
      </div>

      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-midnight opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 focus:outline-none"
        >
          <HiOutlineChevronLeft className="w-5 h-5" />
        </button>

        {/* Carousel Container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product._id} className="min-w-[180px] sm:min-w-[200px] snap-start shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-midnight opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 focus:outline-none"
        >
          <HiOutlineChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ProductCarousel;
