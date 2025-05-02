"use client";

import { useState, useEffect } from "react";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  RectangleStackIcon,
  UserIcon,
  Cog6ToothIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  LifebuoyIcon,
  ArrowLeftOnRectangleIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [showMore, setShowMore] = useState(false);
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
      } catch {
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
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
        <NavMenu handleLogout={handleLogout} />
        <div className="text-xs text-gray-500 mt-8">Logged in as {userEmail}</div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>

      {/* Bottom nav for mobile */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-around items-center md:hidden py-2 shadow z-50">
        <BottomNavLink href="/dashboard" icon={<RectangleStackIcon className="w-6 h-6" />} />
        <BottomNavLink href="/dashboard/profile" icon={<UserIcon className="w-6 h-6" />} />
        <BottomNavLink href="/dashboard/feed" icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />} />
        <BottomNavLink href="/dashboard/courses" icon={<BookOpenIcon className="w-6 h-6" />} />
        <BottomNavLink href="/dashboard/settings" icon={<Cog6ToothIcon className="w-6 h-6" />} />
        <button
          onClick={() => setShowMore(!showMore)}
          className="text-gray-600 hover:text-blue-600 transition"
        >
          <EllipsisVerticalIcon className="w-6 h-6" />
        </button>
      </nav>

      {/* Popup above bottom nav */}
      {showMore && (
        <div className="fixed bottom-10 left-0 w-full bg-white border-t z-50">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <span className="text-sm font-medium text-gray-700">More Options</span>
            <button onClick={() => setShowMore(false)}>
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2 p-4 border-b">
            <MobilePopupLink href="/dashboard/support" icon={<LifebuoyIcon className="w-6 h-6" />} label="Support" />
            <button
              onClick={handleLogout}
              className="flex flex-col items-center text-red-600 hover:text-red-800 transition"
            >
              <ArrowLeftOnRectangleIcon className="w-6 h-6" />
              <span className="text-xs mt-1">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Sidebar nav for desktop
function NavMenu({ handleLogout }: { handleLogout: () => void }) {
  return (
    <nav className="space-y-4 text-sm text-gray-700">
      <NavLink href="/dashboard" icon={<RectangleStackIcon className="w-5 h-5" />} label="Dashboard" />
      <NavLink href="/dashboard/profile" icon={<UserIcon className="w-5 h-5" />} label="Profile" />
      <NavLink href="/dashboard/settings" icon={<Cog6ToothIcon className="w-5 h-5" />} label="Settings" />
      <NavLink href="/dashboard/courses" icon={<BookOpenIcon className="w-5 h-5" />} label="Courses" />
      <NavLink href="/dashboard/feed" icon={<ChatBubbleLeftRightIcon className="w-5 h-5" />} label="Feed" />
      <NavLink href="/dashboard/support" icon={<LifebuoyIcon className="w-5 h-5" />} label="Support" />
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-600 hover:underline text-sm mt-4"
      >
        <ArrowLeftOnRectangleIcon className="w-5 h-5" />
        Logout
      </button>
    </nav>
  );
}

// Desktop + sidebar nav link
function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 hover:text-blue-600 transition">
      {icon}
      {label}
    </Link>
  );
}

// Bottom nav link for mobile
function BottomNavLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="text-gray-600 hover:text-blue-600 transition">
      {icon}
    </Link>
  );
}

// Popup item
function MobilePopupLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition">
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
}
