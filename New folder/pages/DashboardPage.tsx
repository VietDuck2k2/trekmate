
import React from 'react';
import Layout from '../components/Layout';

const DashboardPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 mt-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
              <span>Dashboard</span>
              <span className="material-icons-round text-xs">chevron_right</span>
              <span className="text-primary font-medium">My Trips</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white">My Adventures</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your trekking journeys and connect with the community.</p>
          </div>
          <button className="bg-primary hover:bg-emerald-800 text-white px-8 py-4 rounded-2xl flex items-center gap-2 font-semibold shadow-xl shadow-primary/20 transition-all transform hover:-translate-y-1 active:scale-95">
            <span className="material-icons-round">add</span>
            Create New Trip
          </button>
        </header>

        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <span className="material-icons-round text-orange-600">rocket_launch</span>
              </div>
              <h2 className="text-2xl font-bold dark:text-white">Ongoing Trips</h2>
              <span className="px-2 py-0.5 bg-slate-200 dark:bg-zinc-800 rounded-md text-sm font-bold">2</span>
            </div>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar snap-x">
            <div className="flex-shrink-0 w-[400px] group relative rounded-[32px] overflow-hidden snap-start shadow-2xl">
              <img alt="Mountain landscape" className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh-4ysonQGKUbGvMOHuf-ef51_dZF50Dz3risL0eIr225WXAV4yo1cAApGswz17AT0NbN0diXnIF6Dk1vB4qP5Y8pfu7YrLHj6ypF_R31OXfXeNac2ycwfg5ZUOAoZMELem_9G2ah_fPTXsyNElaZg5Nt1Xcq0wqv57Kycg7_4Fy-JDMUwpOS_RGmv_zNZw3WCHtp1sEAjlsGwOnqLkzBL0P-5WqvXjCVqtDWvQU8xi1W3ooaKugtCxrtjQ7Ogf3SeL-B0DEZk838"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute top-6 right-6">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full text-xs font-bold tracking-widest uppercase">Ongoing</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 backdrop-blur-sm bg-white/10 border-t border-white/20">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Everest Base Camp</h3>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <span className="material-icons-round text-sm">location_on</span>
                      <span>Himalayas, Nepal</span>
                    </div>
                  </div>
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-400"></div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-500"></div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-800 flex items-center justify-center text-[10px] text-white font-bold">+12</div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">Expert</span>
                    <span className="px-3 py-1 bg-white/20 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">Jan 12 - Feb 02</span>
                  </div>
                  <button className="bg-accent text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-[#744d31] transition-colors">Details</button>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0 w-[400px] group relative rounded-[32px] overflow-hidden snap-start shadow-2xl">
              <img alt="Lake scenery" className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUDs7y7-wmOo4G-FN1GoySrmFpD93pVZHPA__3BFdZjJT_gh2RXy1LtMRpbrJ9h2epRkR-HiqsadJHbUBr4XE2hD-wIWlnEsR7OuGg43ajnQKQewnLS4IxAs-Cifo04pcDJveOvv32K53WsUs2D_XBI8PbhfpLUs3MkfG2Z_kpFfm_h5FUGsrr9Y_vbUa7JUgj3tAKT54qun6vmIfwVdhONd5DehesYijIzYuOogaLtsux8fPkXaqvgLo80q6b-TYdkET0JNQp70Q"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute top-6 right-6">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full text-xs font-bold tracking-widest uppercase">Ongoing</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 backdrop-blur-sm bg-white/10 border-t border-white/20">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Dalat Pine Forest</h3>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <span className="material-icons-round text-sm">location_on</span>
                      <span>Lam Dong, Vietnam</span>
                    </div>
                  </div>
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-400"></div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-800 flex items-center justify-center text-[10px] text-white font-bold">+4</div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">Moderate</span>
                    <span className="px-3 py-1 bg-white/20 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">Feb 15 - Feb 18</span>
                  </div>
                  <button className="bg-accent text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-[#744d31] transition-colors">Details</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="material-icons-round text-blue-600">calendar_today</span>
              </div>
              <h2 className="text-2xl font-bold dark:text-white">Upcoming</h2>
              <span className="px-2 py-0.5 bg-slate-200 dark:bg-zinc-800 rounded-md text-sm font-bold">1</span>
            </div>
            <a className="text-primary font-semibold text-sm hover:underline" href="#">See all</a>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="group relative rounded-[32px] overflow-hidden shadow-xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
              <div className="relative h-64">
                <img alt="Nature" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAB1-qLo8Wt178lrFHtVG9yQihVRjSa1ay5w0VASvSCvfgaFilHMqDX9yJaQX2LP13CHVAucOg8zHoGpY-1fLOZ5HDxUnjVBUgIR0OWAtsOATAxWq4oVj30OB6sSVOYX2jeVHV2pOXNLxorB1In0EFbfJn4_if_d9A22qz0Xr5uSUdvoWydjvKNwbj-jB4tIDVD_Qd9_5Nhv1StY_HTgs0z9ykD_rP5yYr_ZlwiMRv21VIqe8XkPc-ftmJI-Rp061bwNn4e6QEmb4o"/>
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">Organizer</span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold dark:text-white">Ha Giang Loop Expedition</h3>
                  <span className="text-accent font-bold">Mar 10, 2024</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 mb-6 line-clamp-2">Experience the most dramatic landscapes in Southeast Asia. This trek covers the limestone peaks of Dong Van Karst Plateau.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300"></div>
                      <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold">+8</div>
                    </div>
                    <span className="text-sm text-slate-400">10 participants</span>
                  </div>
                  <button className="flex items-center gap-2 text-primary font-bold group">
                    Manage Trip
                    <span className="material-icons-round group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-[32px] flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-primary transition-colors">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <span className="material-icons-round text-slate-400 group-hover:text-white">add_circle_outline</span>
              </div>
              <h3 className="text-xl font-bold dark:text-white mb-2">Plan your next trek</h3>
              <p className="text-slate-400 max-w-xs">Don't have enough adventures yet? Find something new or create one!</p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <span className="material-icons-round text-emerald-600">check_circle</span>
              </div>
              <h2 className="text-2xl font-bold dark:text-white">Memories</h2>
              <span className="px-2 py-0.5 bg-slate-200 dark:bg-zinc-800 rounded-md text-sm font-bold">14</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-slate-100 dark:border-zinc-800 group hover:shadow-lg transition-all">
              <div className="relative h-40 rounded-2xl overflow-hidden mb-4">
                <img alt="Lake" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrMYaDFZ7dsIE33pgA0A6uixRvWH6P3i_WjrhSApo7kcrchnU8dJxH1Yf96S1WVBTXsNqEPKCD1KDv6nXjPuUts-KRUYx9w6vceaEVZzHaahE22lIUvd8dsXcHXgIRvpG90om3NolT1GDqQYcOa4H0Jfw4eLczgCLgVX5yeF4lcLwG4GQeJLus728NzHAiBqjmJyfkfTNPn_svyaJ7SWT9-A2PuGMHz_jZCNSCI5pqUaArTkBTVW1uylnPAHE0XwCfVSyB05BBObg"/>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-slate-800">Dec 2023</span>
                </div>
              </div>
              <h4 className="font-bold dark:text-white">Lake Baikal Winter</h4>
              <p className="text-xs text-slate-400 mb-4">Siberia, Russia</p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-1">
                  <div className="w-6 h-6 rounded-full bg-slate-200 border border-white dark:border-zinc-900"></div>
                  <div className="w-6 h-6 rounded-full bg-slate-300 border border-white dark:border-zinc-900"></div>
                </div>
                <span className="material-icons-round text-slate-300 group-hover:text-primary transition-colors cursor-pointer">photo_library</span>
              </div>
            </div>
            
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-slate-100 dark:border-zinc-800 group hover:shadow-lg transition-all">
              <div className="relative h-40 rounded-2xl overflow-hidden mb-4">
                <img alt="Alps" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA24SZ7bsgjJeK6VCuXtICs437CbkeOAgtfBkP2ZBzPWmAwsP400UZY6FLomngYZZFcXb0fGsSZ2z2uKFm7h2JDPD6qSeiidD_K0aijdtRCC6tm_PCekyibg1hS7bQPGHuRtocMv77OGtkMpsQnXXh-xV3HtDa0gydj6WwqpxXyIeEPK5HrqQv1YVwB16NNmpn03M74UbU3_FDD7Xd3xK12iByMalLtGEeKN2V59MY-hsERrFyv0MsX3bGvIbqW4E1fwRMq6VR2WCI"/>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-slate-800">Oct 2023</span>
                </div>
              </div>
              <h4 className="font-bold dark:text-white">The Swiss Alps</h4>
              <p className="text-xs text-slate-400 mb-4">Grindelwald, Switzerland</p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-1">
                  <div className="w-6 h-6 rounded-full bg-slate-200 border border-white dark:border-zinc-900"></div>
                  <div className="w-6 h-6 rounded-full bg-slate-300 border border-white dark:border-zinc-900"></div>
                </div>
                <span className="material-icons-round text-slate-300 group-hover:text-primary transition-colors cursor-pointer">photo_library</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default DashboardPage;
