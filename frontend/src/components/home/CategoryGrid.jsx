import { useNavigate } from 'react-router-dom';

const mockCategories = [
  { id: 1, name: "Dairy, Bread & Eggs", img: "https://images.unsplash.com/photo-1550583724-b2692bcac993?w=100&q=80" },
  { id: 2, name: "Fruits & Vegetables", img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=100&q=80" },
  { id: 3, name: "Cold Drinks & Juices", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=100&q=80" },
  { id: 4, name: "Snacks & Munchies", img: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=100&q=80" },
  { id: 5, name: "Breakfast & Instant", img: "https://images.unsplash.com/photo-1495461199391-8c39ab674295?w=100&q=80" },
  { id: 6, name: "Sweet Tooth", img: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=100&q=80" },
  { id: 7, name: "Bakery & Biscuits", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&q=80" },
  { id: 8, name: "Tea, Coffee & Milk", img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100&q=80" },
  { id: 9, name: "Personal Care", img: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=100&q=80" },
  { id: 10, name: "Atta, Rice & Dal", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100&q=80" },
];

const CategoryGrid = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (catName) => {
    // Create a URL-safe ID from category name
    const sectionId = `carousel-${catName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    // Navigate to home if not already there, then scroll
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-base font-bold text-midnight mb-4">Shop by Category</h2>
      <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-x-2 gap-y-6">
        {mockCategories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleCategoryClick(cat.name)}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-ivory-dark rounded-2xl overflow-hidden mb-2 group-hover:shadow-md group-hover:ring-2 group-hover:ring-gold/40 transition-all duration-200">
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="text-[10px] sm:text-xs text-center font-medium text-midnight leading-tight group-hover:text-gold transition-colors">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;

