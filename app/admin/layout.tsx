// app/admin/layout.tsx

import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
      {/* You can add a custom admin header or sidebar here */}
      {children}
    </div>
  );
}
