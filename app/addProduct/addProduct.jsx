'use client';

import { useState } from 'react';

export default function AddProductForm({ onSubmit, loading, error }) {
  const [form, setForm] = useState({ name: '', description: '', img_url: '', price: '', stock: '' });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0
    });
  };

  return (
    <form onSubmit={submit} className="max-w-md mx-auto mt-10 p-6 bg-white border rounded-xl shadow-sm space-y-4 text-sm">
      <h2 className="text-xl font-bold">New Product</h2>
      {error && <p className="text-red-500 text-xs">{error}</p>}

      <input type="text" name="name" placeholder="Name" required value={form.name} onChange={change} className="w-full p-2 border rounded-md" />
      <textarea name="description" placeholder="Description" value={form.description} onChange={change} className="w-full p-2 border rounded-md h-20 resize-none" />
      <input type="text" name="img_url" placeholder="Image URL" value={form.img_url} onChange={change} className="w-full p-2 border rounded-md" />
      <input type="number" step="0.01" name="price" placeholder="Price" required value={form.price} onChange={change} className="w-full p-2 border rounded-md" />
      <input type="number" name="stock" placeholder="Stock" required value={form.stock} onChange={change} className="w-full p-2 border rounded-md" />

      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded-md disabled:bg-gray-300">
        {loading ? 'Saving...' : 'Create'}
      </button>
    </form>
  );
}