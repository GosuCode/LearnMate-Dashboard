import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-6xl font-bold text-blue-600 mb-8">📚</div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to LearnMate
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          Your AI-powered e-learning platform that generates summaries, quizzes,
          and categorizes academic content.
        </p>

        {!loading && (
          <div className="space-y-4">
            {user ? (
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Welcome back, {user.name || user.email}!
                </h2>
                <p className="text-gray-600 mb-4">
                  You're all set to start learning with AI-powered tools.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => (window.location.href = "/dashboard")}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                  >
                    Go to Admin Dashboard
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      window.location.reload();
                    }}
                    className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Get Started
                </h2>
                <p className="text-gray-600 mb-4">
                  Sign up or log in to access AI-powered learning tools.
                </p>
                <div className="space-y-2">
                  <a
                    href="/signup"
                    className="block w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors text-center"
                  >
                    Sign Up
                  </a>
                  <a
                    href="/login"
                    className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-center"
                  >
                    Login
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              AI Summaries
            </h3>
            <p className="text-gray-600">
              Generate intelligent summaries of your academic content
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Smart Quizzes
            </h3>
            <p className="text-gray-600">
              Create personalized quizzes to test your knowledge
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Content Categorization
            </h3>
            <p className="text-gray-600">
              Organize and categorize your learning materials
            </p>
          </div>
        </div>
      </header>
    </div>
  );
}
