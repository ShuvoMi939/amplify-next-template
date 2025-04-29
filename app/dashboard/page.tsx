"use client";

import { useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { redirect } from "next/navigation";

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await fetchAuthSession();
        if (session.tokens?.idToken) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="text-center mt-20 text-gray-500">Checking session...</div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center mt-20 text-red-600">
        You must be logged in to access the dashboard.
        <div className="mt-4">
          <link href="/login" className="text-blue-500 underline">Go to Login</link>
        </div>
      </div>
    );
  }

  return (
    <section className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-700">Welcome to your dashboard. You're logged in!</p>
      {/* Add more dashboard content here */}
    </section>
  );
}
