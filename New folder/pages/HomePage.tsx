
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Difficulty, Trek } from '../types';

const MOCK_TREKS: Trek[] = [
  {
    id: '1',
    title: 'Đi chơi tết cùng bạn bè',
    location: 'Hải Phòng, Vietnam',
    description: 'Explore the beautiful coastal mountains and enjoy the festive atmosphere with a small group of enthusiasts.',
    difficulty: Difficulty.EASY,
    date: 'Jan 27, 2026',
    members: 2,
    maxMembers: 10,
    organizer: { name: 'Duc Dep Trai', id: 'duc' },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBEzkuoDREPpaOYR_qcUzEohQVcwASay1kXXVg6qFIUwYdsniT-W6q5G-UCLQHdPB9gJEuE_RP6lTX_1QIdqUy2fVI0j8i1rmup1VHMDck1XLT0INdXJZPXmSSXQ8T7PbjMBf23Cxlg7LMMJCD3RVlaOdyhlMC5xd1Fa9kzT0KjEBljjrhoaXGeq-PqdBWYsPTvWtjQjJJzFuE-qD13ZLyP6QY3so4AmBNfKq_sBxIjlKyut5bHb7TITUOoUJi1TSldmwQH_yrLPM'
  },
  {
    id: '2',
    title: 'Cloud Hunting Adventure',
    location: 'Tà Xùa, Son La',
    description: 'A challenging but rewarding trek to the famous cloud paradise of North Vietnam. High endurance required.',
    difficulty: Difficulty.MODERATE,
    date: 'Feb 12, 2026',
    members: 5,
    maxMembers: 15,
    organizer: { name: 'An Nguyen', id: 'an' },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmWsPpJxrYygh6eCmm7Lbf-kKIFH_WxvG6BdeuE2sxycX0qMCILl05VEaXcQ0CYYuGlTQxN8O1cwFrlrzyNvOMv_H7Yk0Oi7gfHjXOMu_Wk4kXrqgJ9fqvSjoxmW-RwmLCId_mTFBGNbyfjYVZ_iiVTZqkZfrDwV8_VUW4pRAeegcvcu6jLRVeB7CUEOXOExWeraIQ9I049K8b1nrmZhWZf6rif0bMDP5NmUqMScVRau5pllJZTz5ySBiGXDPOH51e3jP7ifwvnLk'
  },
  {
    id: '3',
    title: 'Pine Forest Retreat',
    location: 'Dalat, Highlands',
    description: 'A gentle walk through ancient pine forests followed by a sunset coffee over the valley.',
    difficulty: Difficulty.EASY,
    date: 'Mar 05, 2026',
    members: 8,
    maxMembers: 20,
    organizer: { name: 'Le Hoang', id: 'hoang' },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpL9tOtT5MYwcOOs8sQmOUfnXGvVLQwTAf7ciZ2nslOoXqalBW7m6nwrUF_a9xyRs8SVyD_fqGnqN3U9nYr8vrlrmlCoHLCxMiecH-QnwAK__bsDvKhag-00ps-alQbJsf9mqSw8BFAJc6hgzr8wBE-5EEqBu8_Ix4df6UykCz2NlaaEDEVQDT8fOxzMl2oxZqxtqSitHPQXlWwdD2LfxLTObuZef0zDTu6TV0bC1mwYXkczunKUr6CylbS-Tz7223l7cJTVw-tYA'
  }
];

const HomePage: React.FC = () => {
  return (
    <Layout transparentNav>
      <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden">
        <img 
          alt="Cinematic mountain lake" 
          className="absolute inset-0 w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI5j42jC2RpjCUzkARsbcAU3cPX1EBgJ2_5STRqIH5OSiic-iNR8u-CSU0FueZItWy8c4XCwkfkgO2ISSaJ-hnecA0VpuC5KmYXNuKtN4CWH4-AydGade0QN7nbvSx8mMaDW_jatxEBw5aYyL82JhidG6deCeN7ef-xelcse5PHrfAVkQezNaY5FWC7hSBSfWnliOlnMLdnlhNBMPW0FU4Vskndxxl9o64CU0eoY5oqKICq2NOp4wTeDanahzQSG987aLfzXwSaow" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background-light dark:to-background-dark"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 pt-20">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 font-display tracking-tight">
            Discover Your Next <br/> <span className="text-emerald-400">Wild Adventure</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl font-light mb-12">
            Connect with fellow trekkers and explore the world's most breathtaking trails.
          </p>
          <div className="bg-white/70 backdrop-blur-xl dark:bg-zinc-800/70 w-full max-w-5xl rounded-2xl md:rounded-full p-2 md:p-3 shadow-2xl flex flex-col md:flex-row gap-2 md:items-center">
            <div className="flex-1 flex items-center px-4 gap-3 py-2 md:py-0 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700">
              <span className="material-icons-outlined text-slate-400">location_on</span>
              <div className="flex flex-col items-start w-full">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Location</label>
                <input className="bg-transparent border-none p-0 w-full text-sm font-medium focus:ring-0 placeholder:text-slate-400 dark:text-white" placeholder="Where to?" type="text"/>
              </div>
            </div>
            <div className="flex-1 flex items-center px-4 gap-3 py-2 md:py-0 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700">
              <span className="material-icons-outlined text-slate-400">calendar_today</span>
              <div className="flex flex-col items-start w-full">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">When</label>
                <input className="bg-transparent border-none p-0 w-full text-sm font-medium focus:ring-0 placeholder:text-slate-400 dark:text-white" placeholder="Add dates" type="text"/>
              </div>
            </div>
            <div className="flex-1 flex items-center px-4 gap-3 py-2 md:py-0">
              <span className="material-icons-outlined text-slate-400">speed</span>
              <div className="flex flex-col items-start w-full text-left">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Difficulty</label>
                <select className="bg-transparent border-none p-0 w-full text-sm font-medium focus:ring-0 text-slate-700 dark:text-slate-300 appearance-none">
                  <option>All Levels</option>
                  <option>Easy</option>
                  <option>Moderate</option>
                  <option>Challenging</option>
                </select>
              </div>
            </div>
            <button className="bg-primary hover:bg-emerald-800 text-white font-bold px-8 py-4 rounded-xl md:rounded-full transition-all shadow-lg flex items-center justify-center gap-2">
              <span className="material-icons-outlined">search</span>
              <span>Find Trek</span>
            </button>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 md:-mt-16 pb-20 relative z-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display dark:text-white mb-2">Available Trips</h2>
            <div className="h-1 w-20 bg-primary rounded-full"></div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors">
              <span className="material-icons-outlined">filter_list</span>
            </button>
            <button className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors">
              <span className="material-icons-outlined">grid_view</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_TREKS.map(trek => (
            <Link key={trek.id} to={`/details/${trek.id}`} className="group cursor-pointer">
              <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 dark:border-slate-700">
                <div className="relative overflow-hidden aspect-[4/5]">
                  <img alt={trek.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={trek.image} />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-lg ${trek.difficulty === Difficulty.EASY ? 'bg-emerald-500/90' : 'bg-orange-500/90'}`}>
                      {trek.difficulty}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors flex items-center justify-center">
                      <span className="material-icons-outlined text-xl">favorite_border</span>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <span className="material-icons-outlined text-sm">location_on</span>
                    <span>{trek.location}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 dark:text-white group-hover:text-primary transition-colors">{trek.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-6">{trek.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold uppercase">
                        {trek.organizer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-semibold dark:text-slate-300">{trek.organizer.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] uppercase font-bold text-slate-400">{trek.date}</span>
                      <span className="text-sm font-bold text-primary">{trek.members} members</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-6">
          <p className="text-slate-500 dark:text-slate-400 text-sm">Showing 12 of 48 exciting treks</p>
          <button className="px-10 py-3 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all duration-300">
            Discover More Adventures
          </button>
        </div>
      </main>
    </Layout>
  );
};

export default HomePage;
