"use client";

import { useState } from "react";
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
        <NavMenu />
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
          <div className="grid grid-cols-5 gap-2 p-4 border-b">
            <MobilePopupLink href="/dashboard/support" icon={<LifebuoyIcon className="w-6 h-6" />} label="Support" />
            <MobilePopupLink href="/logout" icon={<ArrowLeftOnRectangleIcon className="w-6 h-6" />} label="Logout" />
          </div>
        </div>
      )}
    </div>
  );
}

// Sidebar nav for desktop
function NavMenu() {
  return (
    <nav className="space-y-4">
      <NavLink href="/dashboard" icon={<RectangleStackIcon className="w-5 h-5" />} label="Dashboard" />
      <NavLink href="/dashboard/profile" icon={<UserIcon className="w-5 h-5" />} label="Profile" />
      <NavLink href="/dashboard/settings" icon={<Cog6ToothIcon className="w-5 h-5" />} label="Settings" />
      <NavLink href="/dashboard/courses" icon={<BookOpenIcon className="w-5 h-5" />} label="Courses" />
      <NavLink href="/dashboard/feed" icon={<ChatBubbleLeftRightIcon className="w-5 h-5" />} label="Feed" />
      <NavLink href="/dashboard/support" icon={<LifebuoyIcon className="w-5 h-5" />} label="Support" />
      <NavLink href="/logout" icon={<ArrowLeftOnRectangleIcon className="w-5 h-5" />} label="Logout" />
    </nav>
  );
}

// Generic nav link
function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 text-gray-700 hover:text-blue-600 text-sm transition">
      {icon}
      {label}
    </Link>
  );
}

// Bottom nav link
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
