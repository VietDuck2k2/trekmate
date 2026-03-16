import React, { useState, useEffect } from 'react';
import { profileAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const ProfilePage = () => {
   const [profile, setProfile] = useState(null);
   const [formData, setFormData] = useState({
      displayName: '',
      location: '',
      bio: '',
      experienceLevel: 'BEGINNER',
      avatarUrl: ''
   });
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(false);
   const { user, updateUser } = useAuth();

   useEffect(() => {
      loadProfile();
   }, []);

   const loadProfile = async () => {
      try {
         setLoading(true);
         setError(null);
         const profileData = await profileAPI.getProfile();
         setProfile(profileData);

         // Populate form with current data
         setFormData({
            displayName: profileData.displayName || '',
            location: profileData.location || '',
            bio: profileData.bio || '',
            experienceLevel: profileData.experienceLevel || 'BEGINNER',
            avatarUrl: profileData.avatarUrl || ''
         });
      } catch (err) {
         setError(err.message || 'Failed to load profile');
      } finally {
         setLoading(false);
      }
   };

   const handleInputChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (success) setSuccess(false);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      try {
         setSaving(true);
         setError(null);
         setSuccess(false);

         const response = await profileAPI.updateProfile(formData);

         // Update the local profile state
         setProfile(prev => ({ ...prev, ...response.user }));

         // Update AuthContext if displayName or avatarUrl changed
         if (formData.displayName !== user.displayName || formData.avatarUrl !== user.avatarUrl) {
            updateUser({
               ...user,
               displayName: formData.displayName,
               avatarUrl: formData.avatarUrl
            });
         }

         setSuccess(true);
         // Scroll to top to see success message or just alert
         window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
         setError(err.message || 'Failed to update profile');
      } finally {
         setSaving(false);
      }
   };

   if (loading) {
      return (
         <Layout>
            <div className="flex items-center justify-center min-h-screen pt-20">
               <div className="text-xl text-slate-500 animate-pulse">Loading profile...</div>
            </div>
         </Layout>
      );
   }

   return (
      <Layout>
         <div className="max-w-4xl mx-auto px-4 pb-20 pt-24">
            {/* Header Section */}
            <header className="relative mb-8 flex flex-col items-center">
               <div
                  className="h-48 md:h-64 w-full rounded-3xl shadow-sm overflow-hidden bg-cover bg-center"
                  style={{
                     backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
                  }}
               ></div>

               {/* Avatar Container */}
               <div className="relative -mt-16 md:-mt-20 z-10 flex flex-col items-center">
                  <div className="relative group">
                     <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden shadow-md bg-white">
                        <img
                           alt="Profile Avatar"
                           className="w-full h-full object-cover"
                           src={formData.avatarUrl || 'https://via.placeholder.com/150'}
                           onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                        />
                     </div>
                     <button
                        type="button"
                        className="absolute bottom-1 right-1 md:bottom-2 md:right-2 p-2.5 bg-green-700 text-white rounded-full shadow-lg hover:bg-green-800 hover:scale-105 transition-all flex items-center justify-center border-2 border-white dark:border-slate-900"
                        onClick={() => document.getElementById('avatar-input').focus()}
                     >
                        <span className="material-icons-round text-sm">edit</span>
                     </button>
                  </div>

                  {/* Name and Location (Centered below avatar) */}
                  <div className="text-center mt-4">
                     <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                        {formData.displayName || 'Your Name'}
                     </h1>
                     <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 text-sm font-medium">
                        <span className="material-icons-round text-base opacity-70">location_on</span>
                        {formData.location || 'Location not set'}
                     </p>
                  </div>
               </div>
            </header>

            {/* Notifications */}
            {error && (
               <div className="mb-6 px-5 py-4 bg-red-50 text-red-600 border border-red-200 rounded-2xl flex items-center gap-3 font-medium">
                  <span className="material-icons-round text-xl">error</span>
                  {error}
               </div>
            )}
            {success && (
               <div className="mb-6 px-5 py-4 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl flex items-center gap-3 font-medium">
                  <span className="material-icons-round text-xl">check_circle</span>
                  Profile updated successfully!
               </div>
            )}

            {/* Stats Section */}
            {profile && profile.stats && (
               <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8">
                  <div className="bg-white dark:bg-slate-900/50 p-5 md:p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                     <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
                        <span className="material-icons-round text-xl md:text-2xl">explore</span>
                     </div>
                     <div>
                        <span className="block text-xl md:text-2xl font-bold text-slate-800 dark:text-white leading-tight">{profile.stats.totalCreatedTrips || 0}</span>
                        <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5 block">Trips Created</span>
                     </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900/50 p-5 md:p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                     <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
                        <span className="material-icons-round text-xl md:text-2xl">group_add</span>
                     </div>
                     <div>
                        <span className="block text-xl md:text-2xl font-bold text-emerald-600 leading-tight">{profile.stats.totalJoinedTrips || 0}</span>
                        <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5 block">Trips Joined</span>
                     </div>
                  </div>
               </div>
            )}

            {/* Forms Section */}
            <form onSubmit={handleSubmit} className="space-y-6">
               <section className="bg-white dark:bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                     <span className="material-icons-round text-slate-700 dark:text-slate-300">person</span>
                     <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Personal Details</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-6">
                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 px-1">Display Name</label>
                        <input
                           className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 dark:text-white outline-none placeholder:text-slate-400"
                           type="text"
                           value={formData.displayName}
                           onChange={(e) => handleInputChange('displayName', e.target.value)}
                           required
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 px-1">Location</label>
                        <input
                           className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 dark:text-white outline-none placeholder:text-slate-400"
                           placeholder="e.g., Hanoi, Da Nang, HCMC"
                           type="text"
                           value={formData.location}
                           onChange={(e) => handleInputChange('location', e.target.value)}
                        />
                     </div>
                     <div className="md:col-span-2 space-y-2 mt-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 px-1">Avatar URL</label>
                        <input
                           id="avatar-input"
                           className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 dark:text-white outline-none placeholder:text-slate-400 font-mono text-sm"
                           placeholder="https://example.com/your-avatar.jpg"
                           type="url"
                           value={formData.avatarUrl}
                           onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
                        />
                     </div>
                     <div className="md:col-span-2 space-y-2 mt-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 px-1">Experience Level</label>
                        <div className="relative">
                           <select
                              className="w-full appearance-none bg-slate-50 dark:bg-slate-800/50 border border-transparent rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 dark:text-white outline-none cursor-pointer"
                              value={formData.experienceLevel}
                              onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                           >
                              <option value="BEGINNER">Beginner (I stay on the paths)</option>
                              <option value="INTERMEDIATE">Intermediate (I enjoy day hikes)</option>
                              <option value="ADVANCED">Advanced (I do multi-day trekking)</option>
                              <option value="EXPERT">Expert (I'm a mountain goat)</option>
                           </select>
                           <span className="material-icons-round absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
                        </div>
                     </div>
                  </div>
               </section>

               <section className="bg-white dark:bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                     <span className="material-icons-round text-slate-700 dark:text-slate-300">auto_awesome</span>
                     <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">About Me</h2>
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 px-1">Bio</label>
                     <textarea
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 dark:text-white outline-none resize-none placeholder:text-slate-400 leading-relaxed"
                        placeholder="Tell others about your trekking style and interests..."
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                     ></textarea>
                  </div>
               </section>

               <section className="bg-slate-50/80 dark:bg-slate-900/20 p-6 md:p-8 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-6 opacity-80">
                     <span className="material-icons-round text-[18px]">lock_outline</span>
                     <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 dark:text-white">Account Information (Read-only)</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                     <div>
                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</span>
                        <p className="text-slate-700 dark:text-slate-300 font-medium">{profile?.email}</p>
                     </div>
                     <div>
                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Account Role</span>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold tracking-wide">
                           <span className="material-icons-round text-sm">verified</span>
                           {profile?.role || 'USER'}
                        </div>
                     </div>
                  </div>
               </section>

               <div className="flex justify-end pt-4 pb-12">
                  <button
                     type="submit"
                     disabled={saving}
                     className="w-full sm:w-auto px-10 py-4 bg-emerald-900 hover:bg-emerald-800 text-white font-bold rounded-2xl shadow-lg shadow-emerald-900/20 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                     <span className="material-icons-round text-[20px]">save</span>
                     {saving ? 'Saving...' : 'Save Profile Changes'}
                  </button>
               </div>
            </form>
         </div>
      </Layout>
   );
};

export default ProfilePage;