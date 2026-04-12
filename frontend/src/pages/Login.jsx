import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineEnvelope, HiOutlineLockClosed } from "react-icons/hi2";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

/**
 * Login page with email/password form.
 * Redirects to home after successful login.
 */
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await login(email, password);
      toast.success("Welcome back!");
      // Redirect admin to admin panel, regular users to home
      navigate(userData.role === "admin" ? "/admin" : "/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-[family-name:var(--font-display)] text-midnight">
            Welcome Back
          </h1>
          <p className="text-sm text-midnight-lighter mt-2">
            Sign in to your VELORA account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Email</label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-midnight-lighter" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-ivory border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-midnight-lighter" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-ivory border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 bg-gold text-midnight font-semibold rounded-full hover:bg-gold-light transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-gold/20"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Demo credentials hint */}
          <div className="mt-4 p-3 bg-cream rounded-xl text-center">
            <p className="text-xs text-midnight-lighter">
              <span className="font-semibold">Demo Admin:</span> admin@velora.com / admin123
            </p>
          </div>
        </form>

        {/* Sign up link */}
        <p className="text-center text-sm text-midnight-lighter mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-gold font-semibold hover:text-gold-dark transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
