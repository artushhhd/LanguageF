'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductList from '../product/product';

export default function LikedProductsPage() {
  const [likedProducts, setLikedProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        // 1. Получаем ID текущего пользователя
        const userRes = await fetch('http://localhost:8000/api/user', { headers });
        let currentId = null;
        if (userRes.ok) {
          const userData = await userRes.json();
          currentId = userData.id;
          setUserId(currentId);
        }

        // 2. Получаем все продукты
        const res = await fetch('http://localhost:8000/api/products', { headers });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const allProducts = await res.json();

        // 3. Фильтруем: оставляем только лайкнутые текущим юзером
        if (currentId) {
          const filtered = allProducts.filter(p => 
            p.likes?.some(like => like.user_id === currentId)
          );
          setLikedProducts(filtered);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedData();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500 text-sm">Loading Favorites...</p>;
  if (error) return <div className="text-center mt-10 text-red-500 text-sm">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/product" className="text-xs text-blue-600 hover:underline block mb-1">
            ← Back to All Products
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Favorites ❤️
          </h1>
        </div>
      </div>

      {likedProducts.length === 0 ? (
        <div className="text-center py-10 border rounded-xl bg-gray-50">
          <p className="text-gray-500 mb-4">You haven't liked any products yet.</p>
          <Link href="/product" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
            Browse Products
          </Link>
        </div>
      ) : (
        <ProductList products={likedProducts} currentUserId={userId} />
      )}
    </div>
  );
}