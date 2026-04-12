import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { HiOutlineMagnifyingGlass, HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import API from "../services/api";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/ui/Loader";
import SearchBar from "../components/ui/SearchBar";

const SORT_OPTIONS = [
  { label: "Relevance", value: "" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest First", value: "newest" },
];

/**
 * Full-page search results with filtering, sorting, and pagination.
 * URL: /search?q=<query>&category=<cat>&sort=<sort>
 */
const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("category") || "";
  const sortParam = searchParams.get("sort") || "";

  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 16;

  // ── Fetch results whenever query / filters / page change ─────────
  useEffect(() => {
    setPage(1);
  }, [query, categoryFilter, sortParam]);

  useEffect(() => {
    if (!query.trim()) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search: query,
          limit: LIMIT,
          page,
          ...(categoryFilter && { category: categoryFilter }),
        });

        const { data } = await API.get(`/products?${params}`);
        let items = data.products || [];

        // Client-side sort (backend already supports createdAt desc)
        if (sortParam === "price_asc") items = [...items].sort((a, b) => a.price - b.price);
        else if (sortParam === "price_desc") items = [...items].sort((a, b) => b.price - a.price);

        setProducts(items);
        setTotal(data.total || items.length);
        setTotalPages(data.pages || 1);

        // Build unique category list from first full fetch
        if (page === 1 && !categoryFilter) {
          const cats = [...new Set(items.map((p) => p.category))].filter(Boolean);
          setAllCategories(cats);
        }
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, categoryFilter, sortParam, page]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  if (!query.trim()) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-16 h-16 bg-ivory-dark rounded-full flex items-center justify-center">
          <HiOutlineMagnifyingGlass className="w-8 h-8 text-gold" />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold text-midnight">Search for products</h1>
          <p className="text-sm text-gray-400 mt-1">Use the search bar above to find what you need</p>
        </div>
        <div className="w-full max-w-md">
          <SearchBar placeholder="Search for products..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Top bar: query + mobile search ─────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Mobile search re-entry */}
          <div className="md:hidden mb-3">
            <SearchBar placeholder={`Search products...`} />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-midnight">
                Results for <span className="text-gold">"{query}"</span>
              </h1>
              {!loading && (
                <p className="text-sm text-gray-400 mt-0.5">
                  {total === 0 ? "No products found" : `${total} product${total !== 1 ? "s" : ""} found`}
                </p>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 shrink-0">
              <HiOutlineAdjustmentsHorizontal className="w-4 h-4 text-gray-400 hidden sm:block" />
              <select
                value={sortParam}
                onChange={(e) => setFilter("sort", e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-midnight focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* ── Sidebar: Category filters ──────────────────────────── */}
        {allCategories.length > 1 && (
          <aside className="hidden md:block w-52 shrink-0">
            <div className="bg-white border border-gray-100 rounded-xl p-4 sticky top-24">
              <h3 className="text-sm font-bold text-midnight mb-3">Category</h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setFilter("category", "")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      !categoryFilter
                        ? "bg-gold/10 text-gold font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    All Categories
                  </button>
                </li>
                {allCategories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setFilter("category", cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        categoryFilter === cat
                          ? "bg-gold/10 text-gold font-semibold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}

        {/* ── Main results grid ───────────────────────────────────── */}
        <main className="flex-1 min-w-0">
          {/* Mobile category pills */}
          {allCategories.length > 1 && (
            <div className="md:hidden flex overflow-x-auto gap-2 pb-4 mb-4" style={{ scrollbarWidth: "none" }}>
              <button
                onClick={() => setFilter("category", "")}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  !categoryFilter ? "bg-midnight text-white border-midnight" : "border-gray-200 text-gray-600 bg-white"
                }`}
              >
                All
              </button>
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter("category", cat)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    categoryFilter === cat ? "bg-midnight text-white border-midnight" : "border-gray-200 text-gray-600 bg-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          ) : products.length === 0 ? (
            /* ── Empty state ── */
            <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
              <div className="w-20 h-20 bg-ivory-dark rounded-full flex items-center justify-center">
                <HiOutlineMagnifyingGlass className="w-10 h-10 text-gray-300" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-midnight">No results for "{query}"</h2>
                <p className="text-sm text-gray-400 mt-1">Try different keywords or browse by category</p>
              </div>
              <Link
                to="/"
                className="px-6 py-2.5 bg-gold text-midnight font-semibold rounded-full text-sm hover:bg-gold-light transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  >
                    ← Prev
                  </button>
                  <span className="text-sm text-gray-500 px-3">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchResults;
