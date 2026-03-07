import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const RegisterPage = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [displayName, setDisplayName] = useState('');
   const [role, setRole] = useState('USER');
   const [brandName, setBrandName] = useState('');
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');

   const { login } = useAuth();
   const navigate = useNavigate();

   const getRedirectPath = (userRole) => {
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
         const registrationData = {
            email,
            password,
            displayName,
            role,
         };

         if (role === 'BRAND') {
            if (!brandName.trim()) {
               setError('Brand name is required for brand accounts');
               setLoading(false);
               return;
            }
            registrationData.brandInfo = {
               brandName: brandName.trim(),
            };
         }

         const response = await authAPI.register(registrationData);

         if (response.success) {
            login(response.user, response.token);
            const redirectPath = getRedirectPath(response.user.role);
            navigate(redirectPath, { replace: true });
         }
      } catch (err) {
         setError(err.message || 'Registration failed');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex min-h-screen flex-col lg:flex-row bg-white dark:bg-slate-900 font-sans">
         {/* Left Side - Image */}
         <div className="relative hidden w-full lg:block lg:w-1/2 xl:w-3/5">
            <img
               alt="Mountain climber looking at horizon"
               className="absolute inset-0 h-full w-full object-cover"
               src="https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            />
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
            <div className="absolute inset-0 flex flex-col justify-between p-12">
               <div className="flex items-center gap-2">
                  <span className="material-icons-round text-white text-4xl">landscape</span>
                  <span className="font-display text-white text-3xl tracking-wide font-bold">TrekMate</span>
               </div>
               <div className="max-w-md">
                  <h2 className="font-display text-white text-5xl leading-tight mb-6 font-bold">Start your next great adventure.</h2>
                  <p className="text-white/90 text-lg leading-relaxed">
                     Create an account to join treks, organize expeditions, or promote your outdoor brand.
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
               <div className="mb-8 text-center lg:text-left">
                  <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-3">Create an Account</h1>
                  <p className="text-slate-500 dark:text-slate-400">Join the community of explorers today.</p>
               </div>

               {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm flex items-center gap-2">
                     <span className="material-icons-round text-base">error</span>
                     {error}
                  </div>
               )}

               <form className="space-y-5" onSubmit={handleSubmit}>
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
                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="displayName">Display Name</label>
                     <input
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-primary focus:ring-primary focus:ring-2 sm:text-sm outline-none"
                        id="displayName"
                        type="text"
                        placeholder="Your Name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                        disabled={loading}
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="password">Password</label>
                     <input
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-primary focus:ring-primary focus:ring-2 sm:text-sm outline-none"
                        id="password"
                        type="password"
                        placeholder="Create a password (min 6 chars)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        disabled={loading}
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="role">Account Type</label>
                     <div className="relative">
                        <select
                           id="role"
                           value={role}
                           onChange={(e) => setRole(e.target.value)}
                           disabled={loading}
                           className="block w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-primary focus:ring-primary focus:ring-2 sm:text-sm outline-none appearance-none"
                        >
                           <option value="USER">Trekker (Individual)</option>
                           <option value="BRAND">Brand / Business</option>
                        </select>
                        <span className="material-icons-round absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
                     </div>
                  </div>

                  {role === 'BRAND' && (
                     <div className="animate-fade-in">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="brandName">Brand Name *</label>
                        <input
                           className="block w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-primary focus:ring-primary focus:ring-2 sm:text-sm outline-none"
                           id="brandName"
                           type="text"
                           placeholder="Enter your brand name"
                           value={brandName}
                           onChange={(e) => setBrandName(e.target.value)}
                           required
                           disabled={loading}
                        />
                     </div>
                  )}

                  <button
                     className="flex w-full justify-center rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-emerald-700 transition duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                     type="submit"
                     disabled={loading}
                  >
                     {loading ? 'Creating Account...' : 'Register'}
                  </button>
               </form>

               <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  Already have an account? <Link className="font-semibold text-primary hover:text-emerald-700 transition" to="/login">Login here</Link>
               </p>
            </div>
         </div>
      </div>
   );
};

export default RegisterPage;