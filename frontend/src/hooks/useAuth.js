// Re-export the context hook so existing imports of useAuth() still work
// without changing any other files.
export { useAuthContext as default } from "../context/AuthContext";
