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
               setError('Tên thương hiệu là bắt buộc đối với tài khoản thương hiệu');
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
         setError(err.message || 'Đăng ký thất bại');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex min-h-screen flex-col lg:flex-row bg-white dark:bg-slate-900 font-sans">
         {/* Left Side - Image */}
         <div className="relative hidden w-full lg:block lg:w-1/2 xl:w-3/5">
            <img
               alt="Người leo núi nhìn về chân trời"
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
                  <h2 className="font-display text-white text-5xl leading-tight mb-6 font-bold">Bắt đầu cuộc phiêu lưu tuyệt vời tiếp theo của bạn.</h2>
                  <p className="text-white/90 text-lg leading-relaxed">
                     Tạo một tài khoản để tham gia các chuyến đi trekking, tổ chức thám hiểm, hoặc quảng bá thương hiệu đồ ngoài trời của bạn.
                  </p>
               </div>
               <div className="text-white/60 text-sm">
                  © 2024 TrekMate. Bản quyền được bảo lưu.
               </div>
            </div>
         </div>

         {/* Right Side - Form */}
         <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 xl:w-2/5 sm:px-12 md:px-24">
            <div className="mx-auto w-full max-w-sm">
               <div className="mb-8 text-center lg:text-left">
                  <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-3">Tạo Tài Khoản</h1>
                  <p className="text-slate-500 dark:text-slate-400">Tham gia cộng đồng những nhà thám hiểm ngay hôm nay.</p>
               </div>

               {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm flex items-center gap-2">
                     <span className="material-icons-round text-base">error</span>
                     {error}
                  </div>
               )}

               <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="email">Địa chỉ Email</label>
                     <input
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-primary focus:ring-primary focus:ring-2 sm:text-sm outline-none"
                        id="email"
                        type="email"
                        placeholder="ten@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="displayName">Tên Hiển Thị</label>
                     <input
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-primary focus:ring-primary focus:ring-2 sm:text-sm outline-none"
                        id="displayName"
                        type="text"
                        placeholder="Tên của bạn"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                        disabled={loading}
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="password">Mật khẩu</label>
                     <input
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-primary focus:ring-primary focus:ring-2 sm:text-sm outline-none"
                        id="password"
                        type="password"
                        placeholder="Tạo mật khẩu (tối thiểu 6 ký tự)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        disabled={loading}
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="role">Loại Tài Khoản</label>
                     <div className="relative">
                        <select
                           id="role"
                           value={role}
                           onChange={(e) => setRole(e.target.value)}
                           disabled={loading}
                           className="block w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-primary focus:ring-primary focus:ring-2 sm:text-sm outline-none appearance-none"
                        >
                           <option value="USER">Phượt thủ (Cá nhân)</option>
                           <option value="BRAND">Thương hiệu / Doanh nghiệp</option>
                        </select>
                        <span className="material-icons-round absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
                     </div>
                  </div>

                  {role === 'BRAND' && (
                     <div className="animate-fade-in">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="brandName">Tên Thương Hiệu *</label>
                        <input
                           className="block w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-primary focus:ring-primary focus:ring-2 sm:text-sm outline-none"
                           id="brandName"
                           type="text"
                           placeholder="Nhập tên thương hiệu của bạn"
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
                     {loading ? 'Đang tạo tải khoản...' : 'Đăng ký'}
                  </button>
               </form>

               <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  Đã có tài khoản? <Link className="font-semibold text-primary hover:text-emerald-700 transition" to="/login">Đăng nhập tại đây</Link>
               </p>
            </div>
         </div>
      </div>
   );
};

export default RegisterPage;