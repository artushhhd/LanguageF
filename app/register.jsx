export default function RegisterForm({ formData = {}, onChange, onSubmit, errors = {}, globalError, success }) {
  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 tracking-tight">Create Account</h2>

      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm text-center font-medium">Registration successful! Redirecting...</div>}
      {globalError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center font-medium">{globalError}</div>}

      <form onSubmit={onSubmit} className="space-y-4">
        {[
          { name: 'name', type: 'text', label: 'Name' },
          { name: 'email', type: 'email', label: 'Email' },
          { name: 'password', type: 'password', label: 'Password' },
          { name: 'password_confirmation', type: 'password', label: 'Confirm Password' }
        ].map((field) => (
          <div key={field.name}>
            <input 
              type={field.type} 
              name={field.name} 
              value={formData[field.name] || ''}
              placeholder={field.label} 
              onChange={onChange} 
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" 
            />
            {errors[field.name] && <span className="text-red-500 text-xs mt-1 block px-1">{errors[field.name][0]}</span>}
          </div>
        ))}
        <button type="submit" className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm shadow-sm">
          Register
        </button>
      </form>
    </div>
  );
}