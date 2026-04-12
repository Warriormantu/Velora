import { Link, useLocation } from "react-router-dom";
import { HiOutlineSquares2X2, HiOutlineCube, HiOutlineClipboardDocumentList, HiOutlineArrowLeftOnRectangle } from "react-icons/hi2";
import useAuth from "../../hooks/useAuth";

/**
 * Shared admin layout with sidebar navigation.
 * Wraps all admin pages for consistent navigation.
 */
const AdminLayout = ({ children }) => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: HiOutlineSquares2X2 },
    { name: "Products", path: "/admin/products", icon: HiOutlineCube },
    { name: "Orders", path: "/admin/orders", icon: HiOutlineClipboardDocumentList },
  ];

  const isActive = (path) =>
    path === "/admin" ? pathname === "/admin" : pathname.startsWith(path);

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-midnight text-white border-r border-white/5 flex-shrink-0">
        {/* Admin header */}
        <div className="px-5 py-5 border-b border-white/10">
          <p className="text-gold font-semibold text-sm tracking-wider uppercase">Admin Panel</p>
          <p className="text-white/40 text-xs mt-1 truncate">{user?.email}</p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive(item.path)
                  ? "bg-gold/15 text-gold"
                  : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Back to store */}
        <div className="px-3 py-4 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            <HiOutlineArrowLeftOnRectangle className="w-5 h-5" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Mobile admin nav */}
      <div className="md:hidden w-full bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="flex overflow-x-auto px-4 py-2 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all
                ${isActive(item.path)
                  ? "bg-gold text-midnight"
                  : "bg-ivory-dark text-midnight-lighter hover:bg-ivory"
                }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 bg-ivory overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
