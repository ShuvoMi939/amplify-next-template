"use client";

import { useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

  if (isAuthenticated === null) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Checking session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center mt-20 text-red-600">
        You must be logged in to access the dashboard.
        <div className="mt-4">
          <Link href="/login" className="text-blue-500 underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-700">
        Welcome to your dashboard. You're successfully logged in!
      </p>

      {/* Example dashboard content */}
      <div className="mt-6 space-y-3">
        <p className="bg-gray-100 p-4 rounded shadow">
          🔒 You can place secure user content here.
        </p>
        <p className="bg-gray-100 p-4 rounded shadow">
          📊 Stats, profile settings, links, etc.
        </p>
      </div>
    </section>
  );
}
