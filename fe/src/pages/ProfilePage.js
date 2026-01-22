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
         <div className="max-w-4xl mx-auto px-4 pb-20 pt-28">
            {/* Header Section */}
            <header className="relative mb-24">
               <div
                  className="h-64 w-full rounded-2xl shadow-xl overflow-hidden bg-cover bg-center"
                  style={{
                     backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
                  }}
               ></div>
               <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0">
                  <div className="relative group">
                     <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden shadow-2xl bg-white">
                        <img
                           alt="Profile Avatar"
                           className="w-full h-full object-cover"
                           src={formData.avatarUrl || 'https://via.placeholder.com/150'}
                           onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                        />
                     </div>
                     <button
                        type="button"
                        className="absolute bottom-1 right-1 md:bottom-2 md:right-2 p-2.5 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
                        onClick={() => document.getElementById('avatar-input').focus()}
                     >
                        <span className="material-icons-round text-sm">edit</span>
                     </button>
                  </div>
               </div>
               <div className="hidden md:block absolute -bottom-10 left-56">
                  <h1 className="text-3xl font-bold dark:text-white">{formData.displayName || 'Your Name'}</h1>
                  <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                     <span className="material-icons-round text-base">location_on</span> {formData.location || 'Location not set'}
                  </p>
               </div>
            </header>

            {/* Notifications */}
            {error && (
               <div className="mb-8 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl flex items-center gap-3">
                  <span className="material-icons-round">error</span>
                  {error}
               </div>
            )}
            {success && (
               <div className="mb-8 p-4 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl flex items-center gap-3">
                  <span className="material-icons-round">check_circle</span>
                  Profile updated successfully!
               </div>
            )}

            {/* Stats Section */}
            {profile && profile.stats && (
               <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5 group hover:border-primary/30 transition-all">
                     <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                        <span className="material-icons-round">explore</span>
                     </div>
                     <div>
                        <span className="block text-2xl font-bold text-primary">{profile.stats.totalCreatedTrips || 0}</span>
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trips Created</span>
                     </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5 group hover:border-primary/30 transition-all">
                     <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110">
                        <span className="material-icons-round">group_add</span>
                     </div>
                     <div>
                        <span className="block text-2xl font-bold text-emerald-600">{profile.stats.totalJoinedTrips || 0}</span>
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trips Joined</span>
                     </div>
                  </div>
               </div>
            )}

            {/* Forms Section */}
            <form onSubmit={handleSubmit} className="space-y-8">
               <section className="bg-white dark:bg-slate-900/40 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-2 mb-6 text-primary">
                     <span className="material-icons-round">person</span>
                     <h2 className="text-xl font-bold text-slate-800 dark:text-white">Personal Details</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 px-1">Display Name</label>
                        <input
                           className="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-primary focus:border-primary transition-all text-slate-800 dark:text-white outline-none"
                           type="text"
                           value={formData.displayName}
                           onChange={(e) => handleInputChange('displayName', e.target.value)}
                           required
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 px-1">Location</label>
                        <input
                           className="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-primary focus:border-primary transition-all text-slate-800 dark:text-white outline-none"
                           placeholder="e.g., Hanoi, Da Nang, HCMC"
                           type="text"
                           value={formData.location}
                           onChange={(e) => handleInputChange('location', e.target.value)}
                        />
                     </div>
                     <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 px-1">Avatar URL</label>
                        <input
                           id="avatar-input"
                           className="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-primary focus:border-primary transition-all text-slate-800 dark:text-white outline-none"
                           placeholder="https://example.com/your-avatar.jpg"
                           type="url"
                           value={formData.avatarUrl}
                           onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
                        />
                     </div>
                     <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 px-1">Experience Level</label>
                        <div className="relative">
                           <select
                              className="w-full appearance-none bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-primary focus:border-primary transition-all text-slate-800 dark:text-white outline-none"
                              value={formData.experienceLevel}
                              onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                           >
                              <option value="BEGINNER">Beginner (I stay on the paths)</option>
                              <option value="INTERMEDIATE">Intermediate (I enjoy day hikes)</option>
                              <option value="ADVANCED">Advanced (I do multi-day trekking)</option>
                              <option value="EXPERT">Expert (I'm a mountain goat)</option>
                           </select>
                           <span className="material-icons-round absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
                        </div>
                     </div>
                  </div>
               </section>

               <section className="bg-white dark:bg-slate-900/40 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-2 mb-6 text-primary">
                     <span className="material-icons-round">auto_awesome</span>
                     <h2 className="text-xl font-bold text-slate-800 dark:text-white">About Me</h2>
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 px-1">Bio</label>
                     <textarea
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-primary focus:border-primary transition-all text-slate-800 dark:text-white outline-none resize-none"
                        placeholder="Tell others about your trekking style and interests..."
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                     ></textarea>
                  </div>
               </section>

               <section className="bg-slate-50 dark:bg-slate-900/20 p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-6 opacity-60">
                     <span className="material-icons-round">lock_outline</span>
                     <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white">Account Information (Read-only)</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-8">
                     <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Email Address</span>
                        <p className="text-slate-700 dark:text-slate-300 font-medium">{profile?.email}</p>
                     </div>
                     <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Account Role</span>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-wide">
                           <span className="material-icons-round text-sm">verified</span>
                           {profile?.role || 'USER'}
                        </div>
                     </div>
                  </div>
               </section>

               <div className="flex justify-end pt-4">
                  <button
                     type="submit"
                     disabled={saving}
                     className="w-full md:w-auto px-12 py-4 bg-primary hover:bg-emerald-800 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                     <span className="material-icons-round">save</span>
                     {saving ? 'Saving...' : 'Save Profile Changes'}
                  </button>
               </div>
            </form>
         </div>
      </Layout>
   );
};

export default ProfilePage;