
import React, { useState } from 'react';
import Layout from '../components/Layout';

const ProfilePage: React.FC = () => {
  const [displayName, setDisplayName] = useState('Duc Dep Trai');
  const [location, setLocation] = useState('Hanoi, Vietnam');
  const [experience, setExperience] = useState('Intermediate (I enjoy day hikes)');
  const [bio, setBio] = useState('I love exploring the northern highlands of Vietnam. Always looking for new trails and friendly trekking mates!');

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 pb-20 pt-28">
        {/* Header Section */}
        <header className="relative mb-24">
          <div 
            className="h-64 w-full rounded-2xl shadow-xl overflow-hidden bg-cover bg-center" 
            style={{ 
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCls2axklqTlGXutynv-b3Z_IZBaTn2ujhqjRPp7amc9dN1l64CC1nC7pgjH_bb-7KcpKd1eUFtHBnzhgX1GfDT3BBZ3oR5jw78i7245pT4Vbri4CsyJiRkwb8fVyMWmo3ccUMdMPPvyOpxDe3Dg_zI2lBrs8FFdW-0qPrxpi2CxSQc1ofneK8RK0YI3je7-JeSQrE3uc148I7EQcx1QnFOcz_ESSTOv7STt13I8S1Qq2sJzC8VK0XLswDSh_Ci40mghgV3BROIKME')` 
            }}
          ></div>
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background-light dark:border-background-dark overflow-hidden shadow-2xl bg-white">
                <img 
                  alt="Profile Avatar" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQY1xxePCAJbFeMsyTy9146gT5XyeVw-nnIM_2MNcMF4A7Q4KaYwkJusEu6IDBi4IIcrT3jZ-JmgoQyEnw8DP1vjHvOGx7RVT_fZ0HCDbpSs4RYensYe33ssZ-8_F4jTuWIZBJxPnIsOjEIC3eOXtwrhnJ90IPXuhKU_yF8uZfTIYVJjCIAi5qU4hUi6-zjArt_ERASA3fTwWgy1iXc43NJuy7C887iRAKSd79qJmbd-WmD-wmY5MfsxpraISNq8WSXmfbDqxCE10" 
                />
              </div>
              <button className="absolute bottom-1 right-1 md:bottom-2 md:right-2 p-2.5 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center">
                <span className="material-icons-round text-sm">photo_camera</span>
              </button>
            </div>
          </div>
          <div className="hidden md:block absolute -bottom-10 left-56">
            <h1 className="text-3xl font-bold dark:text-white">{displayName}</h1>
            <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <span className="material-icons-round text-base">location_on</span> {location}
            </p>
          </div>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5 group hover:border-primary/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
              <span className="material-icons-round">explore</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-primary">2</span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trips Created</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5 group hover:border-primary/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110">
              <span className="material-icons-round">group_add</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-emerald-600">3</span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trips Joined</span>
            </div>
          </div>
        </div>

        {/* Forms Section */}
        <div className="space-y-8">
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
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 px-1">Location</label>
                <input 
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-primary focus:border-primary transition-all text-slate-800 dark:text-white outline-none" 
                  placeholder="e.g., Hanoi, Da Nang, HCMC" 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 px-1">Experience Level</label>
                <div className="relative">
                  <select 
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-primary focus:border-primary transition-all text-slate-800 dark:text-white outline-none"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  >
                    <option>Beginner (I stay on the paths)</option>
                    <option>Intermediate (I enjoy day hikes)</option>
                    <option>Advanced (I do multi-day trekking)</option>
                    <option>Expert (I'm a mountain goat)</option>
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
                value={bio}
                onChange={(e) => setBio(e.target.value)}
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
                <p className="text-slate-700 dark:text-slate-300 font-medium">nguyenvietduc170802@gmail.com</p>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Account Role</span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-wide">
                  <span className="material-icons-round text-sm">verified</span>
                  USER
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-4">
            <button 
              className="w-full md:w-auto px-12 py-4 bg-primary hover:bg-emerald-800 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2"
              onClick={() => alert('Profile changes saved successfully!')}
            >
              <span className="material-icons-round">save</span>
              Save Profile Changes
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
