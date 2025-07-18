import React, { useEffect, useState } from "react";
import {
  useNavigate,
  createFileRoute,
  useSearch,
} from "@tanstack/react-router";
import { env } from "../env";

export const Route = createFileRoute("/auth-callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth-callback" });

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const error = urlParams.get("error");

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error("No authorization code received");
        }

        // Exchange the code for tokens
        const res = await fetch(
          `${env.VITE_API_URL}/api/auth/google/callback`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Authentication failed");

        // Store the token and user data
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        // Navigate to the main application
        navigate({ to: "/" });
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 border rounded shadow bg-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Completing authentication...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 border rounded shadow bg-white">
        <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
          Authentication Error
        </h2>
        <div className="mb-4 text-red-600">{error}</div>
        <button
          onClick={() => navigate({ to: "/login" })}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return null;
}
