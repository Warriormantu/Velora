import { useState, useEffect } from "react";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineXMark } from "react-icons/hi2";
import API from "../../services/api";
import Loader from "../../components/ui/Loader";
import toast from "react-hot-toast";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  image: "",
};

/**
 * Admin product management page.
 * Supports creating, editing, and deleting products via a modal form.
 */
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = creating, else editing
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products?limit=100"); // Get all for admin table easily
      setProducts(data.products || data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyProduct);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image,
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploadingImage(true);

    try {
      const { data } = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // Assuming backend is at localhost:5000, if not it will use relative path. 
      // It's safer to use the full backend URL for images if they aren't external links.
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      // Clean up api folder from base URL if present
      const serverUrl = baseUrl.replace('/api', '');
      
      setForm({ ...form, image: `${serverUrl}${data.image}` });
      toast.success("Image uploaded!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      if (editing) {
        await API.put(`/products/${editing}`, payload);
        toast.success("Product updated");
      } else {
        await API.post("/products", payload);
        toast.success("Product created");
      }

      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-display)] text-midnight">
            Products
          </h1>
          <p className="text-sm text-midnight-lighter mt-1">{products.length} products</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2 bg-gold text-midnight text-sm font-semibold rounded-full hover:bg-gold-light transition-all"
        >
          <HiOutlinePlus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-ivory-dark text-midnight-lighter text-left">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-ivory/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=80"}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                      <span className="font-medium text-midnight truncate max-w-[200px]">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-midnight-lighter">{product.category}</td>
                  <td className="px-4 py-3 font-semibold">₹{product.price}</td>
                  <td className="px-4 py-3">
                    <span className={`${product.stock < 10 ? "text-red-500" : "text-green-600"} font-medium`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-1.5 hover:bg-ivory-dark rounded-lg transition-colors text-midnight-lighter hover:text-gold"
                      >
                        <HiOutlinePencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-midnight-lighter hover:text-red-500"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════ Modal ═══════ */}
      {modalOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-midnight">
                  {editing ? "Edit Product" : "Add Product"}
                </h3>
                <button onClick={() => setModalOpen(false)} className="p-1 hover:bg-ivory-dark rounded-full transition-colors">
                  <HiOutlineXMark className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {[
                  { name: "name", label: "Product Name", type: "text", placeholder: "e.g. Organic Mangoes" },
                  { name: "description", label: "Description", type: "textarea", placeholder: "Describe the product..." },
                  { name: "price", label: "Price (₹)", type: "number", placeholder: "299" },
                  { name: "category", label: "Category", type: "text", placeholder: "e.g. Fruits" },
                  { name: "stock", label: "Stock", type: "number", placeholder: "50" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-midnight mb-1">{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        rows={3}
                        required
                        className="w-full px-3 py-2 bg-ivory border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all resize-none"
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required
                        className="w-full px-3 py-2 bg-ivory border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                      />
                    )}
                  </div>
                ))}

                {/* File Upload Field */}
                <div>
                  <label className="block text-sm font-medium text-midnight mb-1">Product Image</label>
                  <input
                    type="file"
                    onChange={uploadFileHandler}
                    disabled={uploadingImage}
                    className="w-full px-3 py-2 bg-ivory border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all mt-1"
                  />
                  {uploadingImage && <div className="text-sm text-gold mt-1 animate-pulse">Uploading image...</div>}
                  {form.image && (
                    <div className="mt-3">
                      <img src={form.image} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-2.5 border border-gray-200 text-midnight text-sm font-medium rounded-full hover:bg-ivory-dark transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploadingImage}
                    className="flex-1 py-2.5 bg-gold text-midnight text-sm font-semibold rounded-full hover:bg-gold-light transition-all disabled:opacity-50"
                  >
                    {saving ? "Saving..." : editing ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminProducts;
