
import React from 'react';
import Layout from '../components/Layout';

const TripDetailsPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-8 mt-20">
        <div className="relative h-[500px] rounded-xl overflow-hidden mb-12 shadow-2xl">
          <img alt="Mountain landscape" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4DSYAZ30N8fMRhzPgO9dbH0uyb6Qt3vhAH085QyTVzyZ_bOJZCHvXqz2ap-hBf3jeGya5mNKRIgt2pWCL5XhAoi9e96RKBxBaiEzjtlwsUGEaRtqHjymSqj0ZXaWw_PrflYz-IgSWnRUvXS30n6Xfra9OlDtIhpeJ0MKe_GcCNJYrSD3Xdnz-qfa-g7t1B22mKhQJaLcjrVsFl4DID6WQu7k6XbxWtOlh6rvaxMG50Dyief1AnR2FGXE-7CMiQFtWs37SK598MPE"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="glass-overlay p-8 rounded-xl max-w-2xl text-white">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 rounded-full flex items-center gap-1">Easy Difficulty</span>
                <span className="px-3 py-1 bg-white/10 text-white text-xs font-bold border border-white/20 rounded-full flex items-center gap-1">Hải Phòng</span>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 rounded-full flex items-center gap-1">$1,000,000</span>
              </div>
              <h1 className="text-5xl font-display mb-2 leading-tight">Đi chơi tết</h1>
              <p className="text-white/80 text-lg">Đón tết cùng những người bạn đồng hành mới trên những đỉnh núi mây mù.</p>
            </div>
            <button className="bg-primary hover:bg-emerald-800 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95 whitespace-nowrap">
              <span className="material-symbols-rounded">edit</span>
              Edit Trip Details
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 p-6 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <span className="material-symbols-rounded">stars</span>
              </div>
              <div>
                <p className="font-semibold text-emerald-900 dark:text-emerald-100 text-lg">You are the organizer</p>
                <p className="text-emerald-700/70 dark:text-emerald-400/70">You have full control over managing participants and trip details.</p>
              </div>
            </div>

            <section>
              <h2 className="text-3xl font-display mb-6 flex items-center gap-3">
                <span className="material-symbols-rounded text-primary">auto_stories</span>
                The Journey
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                đi chơi với nhóm bạn đại học. Kế hoạch là leo núi ngắm mây và tận hưởng không khí trong lành của những ngày đầu năm mới. Chúng tôi sẽ cùng nhau vượt qua những cung đường mòn, cắm trại qua đêm và đón ánh bình minh đầu tiên trên đỉnh núi.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-display mb-6 flex items-center gap-3">
                <span className="material-symbols-rounded text-primary">distance</span>
                Meeting Point
              </h2>
              <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                 <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-2xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center">
                      <span className="material-symbols-rounded">location_on</span>
                    </div>
                    <div>
                      <p className="font-bold">Đại học quốc gia</p>
                      <p className="text-xs text-slate-500">Meeting at 08:00 AM</p>
                    </div>
                  </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-display mb-6 flex items-center gap-3">
                <span className="material-symbols-rounded text-amber-500">warning</span>
                Requirements
              </h2>
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 p-8 rounded-xl">
                <p className="text-amber-900 dark:text-amber-100 italic leading-relaxed text-lg">"cái gì cung ok"</p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200/70">
                    <span className="material-symbols-rounded text-base">check_circle</span> Comfortable Shoes
                  </div>
                  <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200/70">
                    <span className="material-symbols-rounded text-base">check_circle</span> Warm Clothing
                  </div>
                  <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200/70">
                    <span className="material-symbols-rounded text-base">check_circle</span> Good Spirits
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <h3 className="font-display text-xl mb-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <span className="material-symbols-rounded text-primary">calendar_today</span>
                Trip Dates
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-lg flex flex-col items-center justify-center border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Jan</span>
                    <span className="text-lg font-bold text-primary">27</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Start Date</p>
                    <p className="font-semibold">Tuesday, Jan 27, 2026</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-lg flex flex-col items-center justify-center border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Jan</span>
                    <span className="text-lg font-bold text-primary">31</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">End Date</p>
                    <p className="font-semibold">Saturday, Jan 31, 2026</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-display text-xl flex items-center gap-2">
                  <span className="material-symbols-rounded text-primary">group</span>
                  Participants
                </h3>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-bold">2 Joined</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">D</div>
                  <div>
                    <p className="text-sm font-bold">Duc Dep Trai</p>
                    <span className="text-[9px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full uppercase">Organizer</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                  <p className="text-sm font-medium">UserTest2222</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TripDetailsPage;
