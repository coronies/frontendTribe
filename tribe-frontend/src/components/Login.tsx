import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFlip } from './AuthCard';
import { LoadingSpinner } from './LoadingSpinner';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const { setIsFlipped } = useFlip();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-mono">
      <div className="space-y-4">
        <div className="shadow-[inset_6px_6px_10px_0_rgba(0,0,0,0.1),inset_-6px_-6px_10px_0_rgba(255,255,255,0.8)]
          rounded-2xl bg-gray-100 p-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border-none focus:ring-0
              text-gray-700 placeholder-gray-400 tracking-tight"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="shadow-[inset_6px_6px_10px_0_rgba(0,0,0,0.1),inset_-6px_-6px_10px_0_rgba(255,255,255,0.8)]
          rounded-2xl bg-gray-100 p-2">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border-none focus:ring-0
              text-gray-700 placeholder-gray-400 tracking-tight"
            placeholder="Enter your password"
            required
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm bg-red-50/50 rounded-xl p-3
            shadow-[inset_2px_2px_5px_0_rgba(0,0,0,0.1),inset_-2px_-2px_5px_0_rgba(255,255,255,0.8)]
            tracking-tight">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gray-800 text-white font-medium rounded-xl
            shadow-[inset_6px_6px_12px_#1f2937,inset_-6px_-6px_12px_#374151]
            hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
            tracking-tight"
        >
          {loading ? <LoadingSpinner /> : 'Sign In'}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600 tracking-tight">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => setIsFlipped(true)}
              className=" text-white bg-gray-800 hover:text-white-900 font-medium focus:outline-none
                px-2 py-1 rounded-lg transition-all duration-200 tracking-tight"
            >
              Create an Account
            </button>
          </p>
        </div>
      </div>
    </form>
  );
}
