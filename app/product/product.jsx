'use client';

import { useState } from 'react';

export default function ProductList({ products = [], currentUserId }) {
  const [localProducts, setLocalProducts] = useState(products);

  const [likedIds, setLikedIds] = useState(
    products.filter(p => p.likes?.some(l => l.user_id === currentUserId)).map(p => p.id)
  );
  
  const [likesCounts, setLikesCounts] = useState(
    products.reduce((acc, p) => ({ ...acc, [p.id]: p.likes?.length || 0 }), {})
  );

  const toggleLike = async (productId) => {
    const isLiked = likedIds.includes(productId);
    
    setLikedIds(prev => isLiked ? prev.filter(id => id !== productId) : [...prev, productId]);
    setLikesCounts(prev => ({
      ...prev,
      [productId]: isLiked ? prev[productId] - 1 : prev[productId] + 1
    }));

    try {
      await fetch(`http://localhost:8000/api/products/${productId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (err) {
      setLikedIds(prev => isLiked ? [...prev, productId] : prev.filter(id => id !== productId));
      setLikesCounts(prev => ({
        ...prev,
        [productId]: isLiked ? prev[productId] + 1 : prev[productId] - 1
      }));
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const previousProducts = localProducts;
    setLocalProducts(prev => prev.filter(p => p.id !== productId));

    try {
      const res = await fetch(`http://localhost:8000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!res.ok) throw new Error('Delete failed');
    } catch (err) {
      setLocalProducts(previousProducts);
      alert('Could not delete product. Please try again.');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {localProducts.map((p) => {
        const hasLike = likedIds.includes(p.id);
        const totalLikes = likesCounts[p.id] || 0;
        const isOwner = currentUserId && p.user_id === currentUserId;
        
        return (
          <div key={p.id} className="p-4 border rounded-xl shadow-sm bg-white text-sm flex flex-col justify-between h-full">
            <div>
              {p.img_url && (
                <img 
                  src={p.img_url} 
                  alt={p.name} 
                  className="w-full h-48 object-cover rounded-md mb-2" 
                />
              )}
              
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h2 className="font-semibold text-base text-gray-800">{p.name}</h2>
                  {p.user?.name && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Seller: <span className="font-medium text-gray-600">{p.user.name}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-3 text-gray-500 font-medium">
                  {isOwner && (
                    <button 
                      onClick={() => handleDelete(p.id)} 
                      className="text-xs text-red-500 hover:text-red-700 bg-red-50 px-2 py-1 rounded transition-colors font-normal"
                    >
                      Delete
                    </button>
                  )}
                  
                  <div className="flex items-center space-x-1">
                    <span>{totalLikes}</span>
                    <button onClick={() => toggleLike(p.id)} className="text-lg transition-transform active:scale-95">
                      {hasLike ? '❤️' : '🤍'}
                    </button>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-500 my-3 line-clamp-2">{p.description}</p>
            </div>

            <div className="mt-4 pt-2 border-t border-gray-50 space-y-3">
              <div className="flex justify-between items-center font-medium">
                <span className="text-blue-600 text-base">{p.price} $</span>
                <span className="text-xs text-gray-400">Stock: {p.stock}</span>
              </div>
              
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-medium py-2 rounded-xl transition-all shadow-sm">
                Buy Now
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}