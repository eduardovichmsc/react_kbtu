import { useState, type FormEvent, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";

export const Login = () => {
  const { user, login, loginWithGoogle, loading, error, clearError, isConfigured } =
    useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Redirect destination if user was redirected from a protected page
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || "/profile";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email.trim() || !password) {
      setLocalError("Please enter both email and password.");
      return;
    }

    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch {
      // Error is set in AuthContext
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    clearError();
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch {
      // Error is set in AuthContext
    }
  };

  const displayError = localError || error;

  return (
    <div className="max-w-md mx-auto my-10 px-4">
      <div className="bg-white border border-gray-200 p-8 shadow-xs">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Sign In
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Access your account and manage resources
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
            <div className="flex items-center justify-between mb-1.5">
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors disabled:bg-gray-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 text-sm transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Authenticating..." : "Sign In with Email"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-500 font-medium">Or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium py-2.5 px-4 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="mt-6 text-center text-xs text-gray-500 pt-4 border-t border-gray-100">
          <span>Don&apos;t have an account yet? </span>
          <Link
            to="/signup"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
