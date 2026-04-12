import { useNavigate } from 'react-router-dom';

const scrollToSection = (categoryName) => {
  const sectionId = `carousel-${categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    // If not on home page, navigate home first then scroll
    window.location.href = '/';
  }
};

const PromoBanners = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Large Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-6 group cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/90 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80"
          alt="Fresh Groceries"
          className="w-full h-48 md:h-64 object-cover object-right group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">
            Stock up on daily essentials
          </h2>
          <p className="text-gold mt-2 text-sm md:text-lg max-w-md">
            Get farm-fresh goodness & a range of exotic fruits, vegetables, eggs & more
          </p>
          <div className="mt-6">
            <button
              onClick={() => scrollToSection('Fruits & Vegetables')}
              className="px-6 py-2.5 bg-white text-midnight font-bold rounded-lg shadow hover:bg-gold hover:text-white transition-colors duration-200"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* Small Banners Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Banner 1 - Dairy */}
        <div
          onClick={() => scrollToSection('Dairy, Bread & Eggs')}
          className="relative rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900 to-teal-800/80 z-10" />
          <img
            src="https://images.unsplash.com/photo-1550583724-b2692bcac993?w=400&q=80"
            alt="Dairy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="relative z-20 p-6 flex flex-col h-full justify-between min-h-[160px]">
            <div>
              <h3 className="text-xl font-bold text-white leading-tight">Dairy essentials<br/>delivered fresh!</h3>
              <p className="text-white/80 text-xs mt-2">Milk, curd, butter, eggs & more</p>
            </div>
            <button className="mt-4 px-4 py-1.5 bg-white text-teal-900 font-bold rounded-lg w-max text-sm hover:bg-gray-100 transition-colors">
              Order Now
            </button>
          </div>
        </div>

        {/* Banner 2 - Snacks */}
        <div
          onClick={() => scrollToSection('Snacks & Munchies')}
          className="relative rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-500/80 z-10" />
          <img
            src="https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80"
            alt="Snacks"
            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="relative z-20 p-6 flex flex-col h-full justify-between min-h-[160px]">
            <div>
              <h3 className="text-xl font-bold text-white leading-tight">Snacks & Munchies<br/>at your door</h3>
              <p className="text-white/90 text-xs mt-2">Chips, namkeen, biscuits & more</p>
            </div>
            <button className="mt-4 px-4 py-1.5 bg-midnight text-gold font-bold rounded-lg w-max text-sm hover:bg-midnight-light transition-colors">
              Order Now
            </button>
          </div>
        </div>

        {/* Banner 3 - Cold Drinks */}
        <div
          onClick={() => scrollToSection('Cold Drinks & Juices')}
          className="relative rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-800/80 z-10" />
          <img
            src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80"
            alt="Drinks"
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="relative z-20 p-6 flex flex-col h-full justify-between min-h-[160px]">
            <div>
              <h3 className="text-xl font-bold text-white leading-tight">Cold Drinks &<br/>Juices, chilled!</h3>
              <p className="text-white/80 text-xs mt-2">Coca-Cola, Real juice & more</p>
            </div>
            <button className="mt-4 px-4 py-1.5 bg-midnight text-white font-bold rounded-lg w-max text-sm hover:bg-midnight-light transition-colors">
              Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanners;

