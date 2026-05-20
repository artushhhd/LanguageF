"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    fetch("http://localhost:8000/api/profile", {
      headers: { 
        "Accept": "application/json", 
        "Authorization": `Bearer ${token}` 
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("token");
      });
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
  };

  if (!user) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile Details</h2>
      <div className="space-y-4 text-gray-700 font-medium">
        <p><span className="text-xs text-gray-400 block uppercase">Name</span>{user.name}</p>
        <p><span className="text-xs text-gray-400 block uppercase">Email</span>{user.email}</p>
      </div>
      <button onClick={logout} className="mt-8 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition text-sm">
        Log Out
      </button>
    </div>
  );
}