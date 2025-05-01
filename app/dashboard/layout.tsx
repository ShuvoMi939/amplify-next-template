"use client";

import { useEffect, useState } from "react";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Heroicons v2 imports
import HomeIcon from "@heroicons/react/24/outline/HomeIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import Cog6ToothIcon from "@heroicons/react/24/outline/Cog6ToothIcon";
import BookOpenIcon from "@heroicons/react/24/outline/BookOpenIcon";
import ChatBubbleLeftRightIcon from "@heroicons/react/24/outline/ChatBubbleLeftRightIcon";
import LifebuoyIcon from "@heroicons/react/24/outline/LifebuoyIcon";
import ArrowLeftOnRectangleIcon from "@heroicons/react/24/outline/ArrowLeftOnRectangleIcon";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
          setUserEmail(String(rawEmail));
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg animate-pulse">Checking session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-700 mb-6">You must be logged in to access the dashboard.</p>
          <Link href="/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
        <div className="space-y-3 text-gray-700">
          <NavLink href="/dashboard" icon={<HomeIcon className="w-5 h-5" />} label="Home" />
          <NavLink href="/dashboard/profile" icon={<UserIcon className="w-5 h-5" />} label="Profile" />
          <NavLink href="/dashboard/settings" icon={<Cog6ToothIcon className="w-5 h-5" />} label="Settings" />
          <NavLink href="/dashboard/feed" icon={<ChatBubbleLeftRightIcon className="w-5 h-5" />} label="Feed" />
          <NavLink href="/dashboard/courses" icon={<BookOpenIcon className="w-5 h-5" />} label="Courses" />
          <NavLink href="/dashboard/posts" icon={<ChatBubbleLeftRightIcon className="w-5 h-5" />} label="Posts" />
          <NavLink href="/dashboard/support" icon={<LifebuoyIcon className="w-5 h-5" />} label="Support" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:underline text-sm mt-4"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            Logout
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-8">Logged in as {userEmail}</div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

function NavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50 transition text-sm font-medium"
    >
      {icon}
      {label}
    </Link>
  );
}
