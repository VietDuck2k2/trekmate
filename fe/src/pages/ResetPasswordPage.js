import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const ResetPasswordPage = () => {
   const { token } = useParams();
   const navigate = useNavigate();
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [success, setSuccess] = useState(false);

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (password !== confirmPassword) {
         setError('Passwords do not match');
         return;
      }

      setLoading(true);
      setError('');

      try {
         await authAPI.resetPassword(token, password);
         setSuccess(true);
         setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
         setError(err.message || 'Reset failed');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
         <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
            <div className="text-center mb-8">
               <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Reset Password</h1>
               <p className="text-slate-500">Set a new password for your account.</p>
            </div>

            {success && (
               <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl text-sm font-medium">
                  Password reset successful! Redirecting to login...
               </div>
            )}

            {error && (
               <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-sm font-medium">
                  {error}
               </div>
            )}

            {!success && (
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">New Password</label>
                     <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                        placeholder="••••••••"
                        required
                        minLength={6}
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
                     <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                        placeholder="••••••••"
                        required
                     />
                  </div>

                  <button
                     type="submit"
                     disabled={loading}
                     className="w-full py-3.5 bg-primary hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-primary/20 transition transform active:scale-95 disabled:opacity-50"
                  >
                     {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
               </form>
            )}

            <div className="mt-8 text-center text-sm">
               <Link to="/login" className="text-primary font-bold hover:underline">Back to Login</Link>
            </div>
         </div>
      </div>
   );
};

export default ResetPasswordPage;
