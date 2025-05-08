'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser, signOut } from '@aws-amplify/auth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        setIsAuthenticated(!!user);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkUser();
  }, [pathname]);

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login');
  };

  // Don't show sidebar on /admin/login
  const isLoginPage = pathname === '/admin/login';

  return (
    <div className="flex min-h-fit">
      {isAuthenticated && !isLoginPage && (
        <>
          {/* Sidebar */}
          <div className="bg-blue-800 text-white w-64 p-4 hidden md:block">
            <h2 className="text-2xl font-bold mb-6">Admin</h2>
            <nav className="space-y-4">
              <Link href="/admin/dashboard" className="block hover:underline">Dashboard</Link>
              <Link href="/admin/users" className="block hover:underline">Users</Link>
              <button onClick={handleLogout} className="mt-4 bg-red-500 px-3 py-1 rounded hover:bg-red-600">
                Logout
              </button>
            </nav>
          </div>

          {/* Mobile Navbar */}
          <div className="md:hidden p-4 bg-blue-800 text-white w-full">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Admin</h2>
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-lg">☰</button>
            </div>
            {menuOpen && (
              <div className="mt-2 space-y-2">
                <Link href="/admin/dashboard" className="block">Dashboard</Link>
                <Link href="/admin/users" className="block">Users</Link>
                <button onClick={handleLogout} className="w-full text-left mt-2 bg-red-500 px-3 py-1 rounded hover:bg-red-600">
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Main content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
