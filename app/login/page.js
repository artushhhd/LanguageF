'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoginForm from './login'; 
import { loginUser } from '../../src/cors/api'; 

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (credentials) => {
    setError('');
    setLoading(true);
    try {
      const data = await loginUser(credentials);
      if (data?.token) {
        localStorage.setItem('token', data.token);
        document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
        router.replace('/profile');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full container mx-auto">
      <LoginForm onSubmit={handleLogin} error={error} loading={loading} />
      <div className="text-center mt-4">
        <Link href="/" className="text-sm text-gray-500 hover:text-blue-600 transition-colors inline-block">
          Don't have an account? Register
        </Link>
      </div>
    </div>
  );
}