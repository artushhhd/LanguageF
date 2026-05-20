'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductList from '../product/product';

export default function LikedProductsPage() {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Accept: 'application/json', Authorization: `Bearer ${token}` };

        // Fallback-friendly user check to prevent 404 crashes
        const userRes = await fetch('http://localhost:8000/api/user', { headers })
          .then(res => res.status === 404 ? fetch('http://localhost:8000/api/profile', { headers }) : res);

        let currentId = null;
        if (userRes.ok) {
          const userData = await userRes.json();
          currentId = userData.id;
          setUserId(currentId);
        }

        const res = await fetch('http://localhost:8000/api/products', { headers });
        if (res.ok) {
          const data = await res.json();
          setProducts(currentId ? data.filter(p => p.likes?.some(l => l.user_id === currentId)) : data.filter(p => p.likes?.length > 0));
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) return <div className="text-center mt-10 text-gray-500 text-sm">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 text-sm">
      <Link href="/product" className="text-blue-600 hover:underline mb-2 inline-block">
        ← Back to products
      </Link>
      <h1 className="text-2xl font-bold mb-6">Favorites ❤️</h1>

      {products.length === 0 ? (
        <p className="text-gray-500 text-center py-10 border rounded-xl bg-gray-50">No items found.</p>
      ) : (
        <ProductList products={products} currentUserId={userId} />
      )}
    </div>
  );
}