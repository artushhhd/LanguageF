'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RegisterForm from './register'; 
import { registerUser } from '../src/cors/api';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGlobalError('');
    setSuccess(false);

    try {
      const data = await registerUser(formData);
      setSuccess(true);
      
      if (data?.token) {
        localStorage.setItem('token', data.token);
        document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
      }
      setTimeout(() => router.replace('/login'), 1500);
    } catch (err) {
      err.status === 422 ? setErrors(err.errors || {}) : setGlobalError('Server error. Please try again later.');
    }
  };

  return (
    <div className="w-full container mx-auto">
      <RegisterForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} errors={errors} globalError={globalError} success={success} />
      <div className="text-center mt-4">
        <Link href="/login" className="text-sm text-gray-500 hover:text-blue-600 transition-colors inline-block">
          Already have an account? Log in
        </Link>
      </div>
    </div>
  );
}