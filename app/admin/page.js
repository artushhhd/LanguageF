'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminDashboard from './admin';

export default function AdminPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(true);

  useEffect(() => {
    const fetchAdminPayload = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        // Validate account profile status 
        const userRes = await fetch('http://localhost:8000/api/user', { headers });
        if (userRes.ok) {
          const user = await userRes.json();
          // Safeguard block targeting permitted higher administration clearances
          if (!['admin', 'superadmin', 'moder'].includes(user.role)) {
            setAuthorized(false);
            setLoading(false);
            return;
          }
        } else {
          setAuthorized(false);
          setLoading(false);
          return;
        }

        // Fetch analytical aggregate layout items
        const dashboardRes = await fetch('http://localhost:8000/api/admin/dashboard', { headers });
        if (dashboardRes.ok) {
          setData(await dashboardRes.json());
        } else {
          setAuthorized(false);
        }
      } catch (err) {
        console.error(err);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminPayload();
  }, []);

  if (loading) return <p className="text-center mt-12 text-gray-400 text-sm">Loading System Console...</p>;

  if (!authorized) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center p-6 border rounded-xl bg-red-50 text-red-700 space-y-4">
        <p className="font-semibold text-base">Security Exception: Access Forbidden</p>
        <p className="text-sm text-red-600/80">Your profile credentials do not hold management permissions.</p>
        <Link href="/product" className="inline-block bg-white border border-red-200 text-red-700 px-4 py-2 rounded-lg text-xs font-medium shadow-sm">
          Return to Storefront
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Management Console</h1>
          <p className="text-xs text-gray-400 mt-0.5">Global system scope control panel</p>
        </div>
        <Link href="/product" className="text-xs font-medium text-blue-600 hover:underline">
          ← Shop View
        </Link>
      </div>

      <AdminDashboard 
        metrics={{ users_count: data?.users_count, products_count: data?.products_count }} 
        products={data?.latest_products} 
      />
    </div>
  );
}