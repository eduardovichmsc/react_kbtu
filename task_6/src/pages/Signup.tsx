import { useState, type FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";

export const Signup = () => {
  const { user, signup, loading, error, clearError, isConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/profile", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setValidationError("Email address is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setValidationError("Password is required.");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match. Please verify.");
      return;
    }

    try {
      await signup(cleanEmail, password);
      navigate("/profile", { replace: true });
    } catch {
      // Error is stored in AuthContext
    }
  };

  const displayError = validationError || error;

  return (
    <div className="max-w-md mx-auto my-10 px-4">
      <div className="bg-white border border-gray-200 p-8 shadow-xs">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Create Account
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign up to access protected tools and resources
          </p>
        </div>

        {!isConfigured && (
          <div className="mb-6 p-3 bg-neutral-50 border border-neutral-200 text-xs text-neutral-600">
            <span className="font-semibold text-neutral-800">Note:</span> Running in
            standard local authentication mode. Real credentials can be configured
            via <code className="bg-neutral-100 px-1 py-0.5 border border-neutral-200">.env.local</code>.
          </div>
        )}

        {displayError && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors disabled:bg-gray-50"
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors disabled:bg-gray-50"
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors disabled:bg-gray-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 text-sm transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500 pt-4 border-t border-gray-100">
          <span>Already have an account? </span>
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

