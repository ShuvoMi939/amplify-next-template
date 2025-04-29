"use client";

import { useEffect, useState } from "react";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await fetchAuthSession();
        const rawEmail =
          session.tokens?.idToken?.payload?.email ||
          session.tokens?.accessToken?.payload?.username ||
          "";
        if (session.tokens?.idToken) {
          setIsAuthenticated(true);
          setUserEmail(String(rawEmail)); // Convert to string to avoid type error
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
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
        <div className="text-lg animate-pulse">Checking session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-700 mb-6">
            You must be logged in to access the dashboard.
          </p>
          <Link href="/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome, {userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Log out
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <div className="bg-gray-100 p-5 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              🔐 Secure Area
            </h3>
            <p className="text-gray-700">
              This is your private dashboard. Only authenticated users can see this.
            </p>
          </div>

          <div className="bg-gray-100 p-5 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              📊 Stats & Settings
            </h3>
            <p className="text-gray-700">
              Add stats, user preferences, or quick access links here.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-xl font-semibold text-gray-800 mb-2">
            🎯 Next Steps
          </h4>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Track your activity</li>
            <li>Customize your profile</li>
            <li>Access learning materials</li>
            <li>Stay updated with notifications</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
