'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AddProductForm from './addProduct';

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createProduct = async (formData) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:8000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Server error');

      router.push('/product ');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return <AddProductForm onSubmit={createProduct} loading={loading} error={error} />;
}