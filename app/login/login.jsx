export default function LoginForm({ onSubmit, error, loading }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const fields = Object.fromEntries(new FormData(e.target));
    if (fields.email && fields.password) onSubmit(fields);
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 tracking-tight">Welcome Back</h2>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center font-medium">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {['email', 'password'].map((name) => (
          <div key={name}>
            <input
              type={name}
              name={name}
              placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
              disabled={loading}
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm disabled:bg-gray-50"
              required
            />
          </div>
        ))}
        <button type="submit" disabled={loading} className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm shadow-sm disabled:opacity-50">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}