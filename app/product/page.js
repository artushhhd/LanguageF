'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductList from './product';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        const userRes = await fetch('http://localhost:8000/api/user', { headers });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUserId(userData.id);
        }
        const res = await fetch('http://localhost:8000/api/products', { headers });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        
        setProducts(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500 text-sm">Loading...</p>;
  if (error) return <div className="text-center mt-10 text-red-500 text-sm">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/addProduct" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
          Add New
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <ProductList products={products} currentUserId={userId} />
      )}
    </div>
  );
}