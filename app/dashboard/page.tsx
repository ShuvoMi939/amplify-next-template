"use client";

import { useEffect, useState } from "react";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await fetchAuthSession();
        const email =
          session.tokens?.idToken?.payload?.email ||
          session.tokens?.accessToken?.payload?.username ||
          "";
        if (session.tokens?.idToken) {
          setIsAuthenticated(true);
          setUserEmail(email);
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
      console.error("Logout error:", err);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Checking session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-red-600 px-4">
        <p className="text-xl font-semibold">You must be logged in to access the dashboard.</p>
        <Link href="/login" className="mt-4 text-blue-500 underline text-base">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800">Welcome 👋</h1>
          <p className="text-lg text-gray-600 mt-2">
            Logged in as <strong>{userEmail}</strong>
          </p>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
          >
            Log out
          </button>
        </header>

        <section className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all duration-300">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">🔐 Secure Area</h2>
            <p className="text-gray-600 text-sm">This section is only accessible to authenticated users.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all duration-300">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">📊 Your Stats</h2>
            <p className="text-gray-600 text-sm">View your quiz results, activity logs, or learning progress.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all duration-300">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">⚙️ Settings</h2>
            <p className="text-gray-600 text-sm">Manage your account settings and preferences.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all duration-300">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">📘 Help</h2>
            <p className="text-gray-600 text-sm">Learn how to use the platform or contact support.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
