'use client';

import { useState } from 'react';

export default function AdminDashboard({ metrics, products = [] }) {
  const [localProducts, setLocalProducts] = useState(products);

  const handleDelete = async (productId) => {
    if (!confirm('Force delete this item from the platform?')) return;

    try {
      const res = await fetch(`http://localhost:8000/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });

      if (res.ok) {
        setLocalProducts(prev => prev.filter(p => p.id !== productId));
      } else {
        alert('Action unauthorized or server rejected operation.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 text-sm">
      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
          <p className="text-gray-400 font-medium text-xs uppercase tracking-wider">Total Active Accounts</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{metrics?.users_count ?? 0}</p>
        </div>
        <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
          <p className="text-gray-400 font-medium text-xs uppercase tracking-wider">Global Product Inventory</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{metrics?.products_count ?? 0}</p>
        </div>
      </div>

      {/* Global Inventory Management List */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-semibold text-gray-800 text-base">Global Item Catalog</h2>
        </div>

        {localProducts.length === 0 ? (
          <p className="p-6 text-gray-400 text-center">No platform items currently listed.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {localProducts.map((p) => (
              <div key={p.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-400">
                    ID: <span className="font-mono text-gray-600 mr-3">{p.id}</span>
                    Owner: <span className="text-gray-600 font-medium">{p.user?.name || 'Unknown'}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-gray-700">{p.price} $</span>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-medium transition-colors text-xs"
                  >
                    Force Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}