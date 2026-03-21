import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginSuccess = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const { login } = useAuth();

   useEffect(() => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const userDataStr = params.get('user');

      if (token && userDataStr) {
         try {
            const userData = JSON.parse(decodeURIComponent(userDataStr));
            login(userData, token);
            navigate('/');
         } catch (error) {
            console.error('Error parsing user data:', error);
            navigate('/login?error=auth_failed');
         }
      } else {
         navigate('/login');
      }
   }, [location, login, navigate]);

   return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-900">
         <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Đang xác thực...</h2>
            <p className="text-slate-500 mt-2">Vui lòng đợi trong khi chúng tôi đăng nhập cho bạn.</p>
         </div>
      </div>
   );
};

export default LoginSuccess;
