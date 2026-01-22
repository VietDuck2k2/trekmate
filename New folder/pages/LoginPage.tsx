
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
    navigate('/home');
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-background-light dark:bg-background-dark font-sans">
      <div className="relative hidden w-full lg:block lg:w-1/2 xl:w-3/5">
        <img 
          alt="Misty forest at dawn" 
          className="absolute inset-0 h-full w-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqQZKTSzh63Je6v2E_CeWnWmZit-GFvm95oiIuVtloCcNNxanXjdcqGBr4PVldUjyIaevj92QIFJ6z3h5Q0picwJUCqlQ7DT2P4dfW6wBB4z6xQNgcWpeDOJGxXHkyfe4h_ZYhjTQahmcLm2TU0HBGdomvbv8QER3RuFQWWGP1lqsEpTPWBJGpAeCmV3bv1Db7XZ6AhloLy5qaKiENspxWCSgCh4lKIgPE-0VZaljEjZLd4oLL6Ae_8fRqZN3a5P3K2dlrvey0FGI" 
        />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-white text-4xl">landscape</span>
            <span className="font-display text-white text-3xl tracking-wide">TrekMate</span>
          </div>
          <div className="max-w-md">
            <h2 className="font-display text-white text-5xl leading-tight mb-6">Explore the world's untamed beauty.</h2>
            <p className="text-white/90 text-lg leading-relaxed">
              Join a community of adventurers and find your next breathtaking journey. Every peak is within reach.
            </p>
          </div>
          <div className="text-white/60 text-sm">
            © 2024 TrekMate. All rights reserved.
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 xl:w-2/5 sm:px-12 md:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="font-display text-4xl text-gray-900 dark:text-white mb-3">Login to TrekMate</h1>
            <p className="text-gray-500 dark:text-gray-400">Welcome back! Please enter your details.</p>
          </div>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="email">Email address</label>
              <input className="block w-full rounded-lg border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white px-4 py-3 text-gray-900 shadow-sm transition focus:border-primary focus:ring-primary focus:ring-1 sm:text-sm" id="email" name="email" placeholder="name@example.com" required type="email"/>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">Password</label>
                <a className="text-xs font-semibold text-primary hover:text-green-700 transition" href="#">Forgot password?</a>
              </div>
              <input className="block w-full rounded-lg border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white px-4 py-3 text-gray-900 shadow-sm transition focus:border-primary focus:ring-primary focus:ring-1 sm:text-sm" id="password" name="password" placeholder="••••••••" required type="password"/>
            </div>
            <div className="flex items-center">
              <input className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:bg-gray-800 dark:border-gray-700" id="remember-me" name="remember-me" type="checkbox"/>
              <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300" htmlFor="remember-me">Remember me for 30 days</label>
            </div>
            <button className="flex w-full justify-center rounded-lg bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-green-800 transition duration-200" type="submit">
              Sign in
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background-light dark:bg-background-dark px-3 text-gray-500 dark:text-gray-400">Or continue with</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                Google
              </button>
              <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <svg className="h-5 w-5 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.161 22 16.403 22 12.017 22 6.484 17.522 2 12 2z"></path>
                </svg>
                GitHub
              </button>
            </div>
          </div>
          <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account? <a className="font-semibold text-primary hover:text-green-700 transition" href="#">Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
