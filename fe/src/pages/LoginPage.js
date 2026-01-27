import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const LoginPage = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');

   const { login } = useAuth();
   const navigate = useNavigate();
   const location = useLocation();

   // Get redirect path from location state or default based on role
   const getRedirectPath = (userRole) => {
      const from = location.state?.from?.pathname;
      if (from && from !== '/login') {
         return from;
      }
      switch (userRole) {
         case 'ADMIN': return '/admin/users';
         case 'BRAND': return '/brand';
         case 'USER':
         default: return '/';
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
         const response = await authAPI.login({ email, password });

         if (response.success) {
            login(response.user, response.token);
            const redirectPath = getRedirectPath(response.user.role);
            navigate(redirectPath, { replace: true });
         }
      } catch (err) {
         setError(err.message || 'Login failed');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex min-h-screen flex-col lg:flex-row bg-white dark:bg-slate-900 font-sans">
         {/* Left Side - Image */}
         <div className="relative hidden w-full lg:block lg:w-1/2 xl:w-3/5">
            <img
               alt="Misty forest at dawn"
               className="absolute inset-0 h-full w-full object-cover"
               src="https://images.unsplash.com/photo-1519702202685-da9435b62b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            />
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
            <div className="absolute inset-0 flex flex-col justify-between p-12">
               <div className="flex items-center gap-2">
                  <span className="material-icons-round text-white text-4xl">landscape</span>
                  <span className="font-display text-white text-3xl tracking-wide font-bold">TrekMate</span>
               </div>
               <div className="max-w-md">
                  <h2 className="font-display text-white text-5xl leading-tight mb-6 font-bold">Explore the world's untamed beauty.</h2>
                  <p className="text-white/90 text-lg leading-relaxed">
                     Join a community of adventurers and find your next breathtaking journey. Every peak is within reach.
                  </p>
               </div>
               <div className="text-white/60 text-sm">
                  © 2024 TrekMate. All rights reserved.
               </div>
            </div>
         </div>

         {/* Right Side - Form */}
         <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 xl:w-2/5 sm:px-12 md:px-24">
            <div className="mx-auto w-full max-w-sm">
               <div className="mb-10 text-center lg:text-left">
                  <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-3">Login to TrekMate</h1>
                  <p className="text-slate-500 dark:text-slate-400">Welcome back! Please enter your details.</p>
               </div>

               {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm flex items-center gap-2">
                     <span className="material-icons-round text-base">error</span>
                     {error}
                  </div>
               )}

               <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="email">Email address</label>
                     <input
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-primary focus:ring-primary focus:ring-2 sm:text-sm outline-none"
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                     />
                  </div>
                  <div>
                     <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">Password</label>
                        <a className="text-xs font-semibold text-primary hover:text-emerald-700 transition" href="#">Forgot password?</a>
                     </div>
                     <input
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-primary focus:ring-primary focus:ring-2 sm:text-sm outline-none"
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                     />
                  </div>
                  <div className="flex items-center">
                     <input className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-700" id="remember-me" name="remember-me" type="checkbox" />
                     <label className="ml-2 block text-sm text-slate-700 dark:text-slate-300" htmlFor="remember-me">Remember me for 30 days</label>
                  </div>
                  <button
                     className="flex w-full justify-center rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-emerald-700 transition duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                     type="submit"
                     disabled={loading}
                  >
                     {loading ? 'Signing in...' : 'Sign in'}
                  </button>
               </form>

               <div className="mt-8">
                  <div className="relative">
                     <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                     </div>
                     <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-slate-900 px-3 text-slate-500 dark:text-slate-400">Or continue with</span>
                     </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                     <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                        Google
                     </button>
                     <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                        <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="h-5 w-5 dark:invert" />
                        GitHub
                     </button>
                  </div>
               </div>
               <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
                  Don't have an account? <Link className="font-semibold text-primary hover:text-emerald-700 transition" to="/register">Register here</Link>
               </p>
            </div>
         </div>
      </div>
   );
};

export default LoginPage;