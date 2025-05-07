'use client';

import { getCurrentUser, fetchUserAttributes } from '@aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        setEmail(attributes.email || user.username);
      } catch {
        router.push('/admin/login');
      }
    }

    checkAuth();
  }, [router]);

  return (
    <div className="max-w-3xl mx-auto mt-20">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-4">Logged in as: {email}</p>
    </div>
  );
}
