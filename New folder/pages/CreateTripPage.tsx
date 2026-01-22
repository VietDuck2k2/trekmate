
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { generateTrekDetails } from '../geminiService';

const CreateTripPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSmartSuggest = async () => {
    if (!title) return;
    setIsGenerating(true);
    const details = await generateTrekDetails(title);
    if (details) {
      setDescription(details.description || '');
      // In a real app, you'd fill all fields
    }
    setIsGenerating(false);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 mt-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Create New Trip</h1>
          <p className="text-slate-500 dark:text-slate-400">Design your perfect trekking adventure and find the right companions.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white dark:bg-slate-900/50 p-8 rounded-2xl shadow-sm space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-icons-round text-primary">info</span>
                  <h2 className="text-xl font-bold">General Information</h2>
                </div>
                <button 
                  onClick={handleSmartSuggest}
                  disabled={isGenerating || !title}
                  className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded-full hover:bg-primary/20 transition-all disabled:opacity-50"
                >
                  <span className="material-icons-round text-sm">auto_awesome</span>
                  {isGenerating ? 'Generating...' : 'Smart Suggest'}
                </button>
              </div>
              <div className="space-y-4">
                <div className="relative group">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Trip Title *</label>
                  <input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-0 border-b-2 border-slate-200 dark:border-slate-700 w-full py-3 focus:ring-0 focus:border-primary placeholder-slate-300 dark:placeholder-slate-600 bg-transparent transition-all" 
                    placeholder="e.g., Everest Base Camp Trek" 
                    type="text"
                  />
                </div>
                <div className="relative group">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Description</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border-0 border-b-2 border-slate-200 dark:border-slate-700 w-full py-3 focus:ring-0 focus:border-primary placeholder-slate-300 dark:placeholder-slate-600 bg-transparent transition-all resize-none" 
                    placeholder="Describe your trip, what to expect, highlights, etc." 
                    rows={4}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/50 p-8 rounded-2xl shadow-sm space-y-8">
              <div className="flex items-center gap-2">
                <span className="material-icons-round text-primary">explore</span>
                <h2 className="text-xl font-bold">Logistics & Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="relative">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Location *</label>
                  <div className="flex items-center">
                    <span className="material-icons-round text-slate-400 text-sm mr-2">place</span>
                    <input className="border-0 border-b-2 border-slate-200 dark:border-slate-700 w-full py-2 focus:ring-0 focus:border-primary bg-transparent" placeholder="Himalayas, Nepal" type="text"/>
                  </div>
                </div>
                <div className="relative">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Difficulty Level</label>
                  <div className="flex items-center">
                    <span className="material-icons-round text-slate-400 text-sm mr-2">leaderboard</span>
                    <select className="border-0 border-b-2 border-slate-200 dark:border-slate-700 w-full py-2 focus:ring-0 focus:border-primary bg-transparent appearance-none">
                      <option>Easy</option>
                      <option selected>Moderate</option>
                      <option>Challenging</option>
                      <option>Expert</option>
                    </select>
                  </div>
                </div>
                <div className="relative">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Start Date *</label>
                  <div className="flex items-center">
                    <span className="material-icons-round text-slate-400 text-sm mr-2">calendar_today</span>
                    <input className="border-0 border-b-2 border-slate-200 dark:border-slate-700 w-full py-2 focus:ring-0 focus:border-primary bg-transparent" type="date"/>
                  </div>
                </div>
                <div className="relative">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">End Date *</label>
                  <div className="flex items-center">
                    <span className="material-icons-round text-slate-400 text-sm mr-2">event</span>
                    <input className="border-0 border-b-2 border-slate-200 dark:border-slate-700 w-full py-2 focus:ring-0 focus:border-primary bg-transparent" type="date"/>
                  </div>
                </div>
                <div className="relative">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Max Participants</label>
                  <div className="flex items-center">
                    <span className="material-icons-round text-slate-400 text-sm mr-2">group</span>
                    <input className="border-0 border-b-2 border-slate-200 dark:border-slate-700 w-full py-2 focus:ring-0 focus:border-primary bg-transparent" placeholder="10" type="number"/>
                  </div>
                </div>
                <div className="relative">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Cost Per Person</label>
                  <div className="flex items-center">
                    <span className="material-icons-round text-slate-400 text-sm mr-2">payments</span>
                    <input className="border-0 border-b-2 border-slate-200 dark:border-slate-700 w-full py-2 focus:ring-0 focus:border-primary bg-transparent" placeholder="$500" type="text"/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Live Preview</h3>
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-bold">Draft</span>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white dark:border-slate-800">
                <div className="relative h-64 bg-slate-200 dark:bg-slate-800">
                  <img alt="Mountain Landscape" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASiDAwf8VRAJxaDWkbAB3uQtClGbL5AFrXVf_YeWDkzUih6oLucTwae9MhNfnfDbh7IvBbmWSdVhG3Ae1FwYloC9DugijIU9W5T2-5T4fvnEjFp8wzJaebzFWA39PftMhyJq84Q9TxMP26LZW2QQ18EXzARFdwMLOINYBbVbXR1qtr7xJXI1ZGXjVo9uh4pViHR3hWb3g42fZShgGerQV77Vo_5oyNGpPOo7RRmlNZ0DPP40VeYk9Bql7k4b6owhfwWsAOlj2mEzs"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="bg-primary/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Organizer</span>
                    <h4 className="text-2xl font-bold mt-2 leading-tight">{title || 'Your Trek Title Here'}</h4>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3">
                    {description || 'Start typing your description to see it appear here. Share what makes this trek special...'}
                  </p>
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">D</div>
                      <div className="text-xs">
                        <p className="font-bold">Duc Dep Trai</p>
                        <p className="text-slate-400">Organizer</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Starts</p>
                      <p className="text-sm font-bold text-primary">TBD</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="fixed bottom-8 right-8 flex gap-4">
          <button className="px-8 py-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-white rounded-full font-bold shadow-lg transition-all">
            Save Draft
          </button>
          <button className="px-10 py-4 bg-primary hover:bg-opacity-90 text-white rounded-full font-bold shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2">
            <span className="material-icons-round">rocket_launch</span>
            Create Trip
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CreateTripPage;
