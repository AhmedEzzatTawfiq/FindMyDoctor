import React, { useContext, useState } from 'react';
import { CrmContext } from '../context/CrmContext';
import { toast } from 'react-toastify';

const StaffLogin = () => {
  const { staffLogin } = useContext(CrmContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await staffLogin(email, password);
    if (success) {
      // redirect handled elsewhere (e.g., using useNavigate)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-[80vh] flex items-center justify-center">
      <div className="flex flex-col gap-3 p-8 border rounded-xl shadow-lg w-full max-w-sm bg-white">
        <h2 className="text-2xl font-semibold text-center">Staff Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-primary text-white py-2 rounded">
          Login
        </button>
      </div>
    </form>
  );
};

export default StaffLogin;
