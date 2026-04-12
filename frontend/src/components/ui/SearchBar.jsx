import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineMagnifyingGlass, HiOutlineXMark, HiOutlineClock } from "react-icons/hi2";
import API from "../../services/api";

/**
 * SearchBar — live-search dropdown + Enter/submit navigates to /search page.
 * Debounces API calls by 300ms. Keyboard navigable (↑↓ Enter Escape).
 */
const SearchBar = ({ placeholder = 'Search "sugar"', className = "" }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const navigate = useNavigate();
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // ── Live search (debounced 300ms) ───────────────────────────────
  const fetchResults = useCallback(async (q) => {
    if (!q.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.get(`/products?search=${encodeURIComponent(q)}&limit=6`);
      setResults(data.products || []);
      setOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.trim()) {
      debounceRef.current = setTimeout(() => fetchResults(query), 300);
    } else {
      setResults([]);
      setOpen(false);
    }
    return () => clearTimeout(debounceRef.current);
  }, [query, fetchResults]);

  // ── Close dropdown on outside click ─────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Navigation to full search results page ───────────────────────
  const goToSearch = (q = query) => {
    if (!q.trim()) return;
    setOpen(false);
    setQuery(q);
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  // ── Keyboard: ↑ ↓ Enter Escape ──────────────────────────────────
  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        navigate(`/product/${results[activeIndex]._id}`);
        setOpen(false);
        setQuery(results[activeIndex].name);
      } else {
        goToSearch();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Input */}
      <div className="relative">
        <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActiveIndex(-1); }}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          aria-label="Search products"
          className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm text-midnight placeholder:text-gray-400 focus:outline-none focus:border-gray-200 focus:bg-white focus:ring-1 focus:ring-gray-200 transition-all font-medium"
        />

        {/* Clear / Loading indicator */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <span className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin block" />
          ) : query ? (
            <button onClick={handleClear} className="text-gray-400 hover:text-midnight transition-colors">
              <HiOutlineXMark className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-[200] overflow-hidden animate-fade-in">
          {results.length === 0 && !loading ? (
            <div className="px-4 py-6 text-center text-sm text-gray-400">
              No products found for <span className="font-semibold text-midnight">"{query}"</span>
            </div>
          ) : (
            <>
              <ul>
                {results.map((product, idx) => (
                  <li key={product._id}>
                    <button
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => {
                        navigate(`/product/${product._id}`);
                        setOpen(false);
                        setQuery(product.name);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        activeIndex === idx ? "bg-ivory" : "hover:bg-gray-50"
                      }`}
                    >
                      {/* Thumbnail */}
                      <img
                        src={product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=80"}
                        alt={product.name}
                        className="w-10 h-10 object-contain rounded-lg bg-gray-50 border border-gray-100 shrink-0"
                      />
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-midnight truncate">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.category} · {product.weight}</p>
                      </div>
                      {/* Price */}
                      <span className="text-sm font-bold text-midnight shrink-0">₹{product.price}</span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* "See all results" footer */}
              <button
                onClick={() => goToSearch()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-t border-gray-100 text-sm font-semibold text-gold hover:bg-ivory transition-colors"
              >
                <HiOutlineMagnifyingGlass className="w-4 h-4" />
                See all results for "{query}"
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
