const API_URL = 'http://localhost:8000/api'; // Replace with your actual Laravel API URL

// 1. Check your existing register function
export async function registerUser(formData) {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  if (!res.ok) throw { status: res.status, errors: (await res.json()).errors };
  return res.json();
}

// 2. ADD THIS LOGIN FUNCTION BELOW IT
export async function loginUser(credentials) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error('Invalid email or password.');
  return res.json();
}