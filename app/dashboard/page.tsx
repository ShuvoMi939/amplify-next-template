"use client";

import { useEffect, useState } from "react";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await fetchAuthSession();
        if (session.tokens?.idToken) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        Checking session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Restricted 🔒</h1>
        <p className="text-gray-600 mb-6">
          You must be logged in to access the dashboard.
        </p>
        <Link
          href="/login"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">📊 Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back! You're logged in.</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 border rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700">🔐 Secure Area</h2>
            <p className="text-gray-600 text-sm mt-2">
              This is a protected area. Only authenticated users can see this.
            </p>
          </div>

          <div className="p-4 bg-gray-50 border rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700">📈 Your Stats</h2>
            <p className="text-gray-600 text-sm mt-2">
              Add user-specific statistics, progress tracking, or activity here.
            </p>
          </div>

          <div className="p-4 bg-gray-50 border rounded-lg shadow-sm col-span-1 md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-700">🧑 Profile Info</h2>
            <p className="text-gray-600 text-sm mt-2">
              Display user profile data here (e.g., name, email, role).
            </p>
          </div>
        </div>

        <footer className="text-center text-sm text-gray-400 mt-12">
          © {new Date().getFullYear()} YourSite. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
