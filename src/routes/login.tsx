import React, { useState } from "react";
import { useNavigate, createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";
import { env } from "../env";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${env.VITE_API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Store the token and user data using auth hook
      if (data.success && data.data?.token) {
        login(data.data.user, data.data.token);
        // Navigate to admin dashboard after successful login
        navigate({ to: "/dashboard" });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${env.VITE_API_URL}/api/auth/google/login`);
      const data = await res.json();
      if (!res.ok || !data.data?.authUrl)
        throw new Error("Failed to get Google OAuth URL");
      window.location.href = data.data.authUrl;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="my-6 flex items-center justify-center">
        <span className="text-gray-500">or</span>
      </div>
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50"
        disabled={loading}
      >
        <svg className="w-5 h-5" viewBox="0 0 48 48">
          <g>
            <path
              fill="#4285F4"
              d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.7 30.77 0 24 0 14.82 0 6.71 5.13 2.69 12.56l7.98 6.2C13.13 13.13 18.13 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.64 7.03l7.19 5.59C43.93 37.13 46.1 31.3 46.1 24.55z"
            />
            <path
              fill="#FBBC05"
              d="M9.67 28.77c-1.13-3.36-1.13-6.98 0-10.34l-7.98-6.2C-1.13 17.13-1.13 30.87 1.69 35.44l7.98-6.2z"
            />
            <path
              fill="#EA4335"
              d="M24 46c6.48 0 11.92-2.15 15.89-5.85l-7.19-5.59c-2.01 1.35-4.6 2.14-8.7 2.14-5.87 0-10.87-3.63-13.33-8.86l-7.98 6.2C6.71 42.87 14.82 48 24 48z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </g>
        </svg>
        {loading ? "Redirecting..." : "Login with Google"}
      </button>
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => navigate({ to: "/signup" })}
            className="text-blue-600 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
