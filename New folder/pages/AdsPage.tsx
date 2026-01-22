
import React from 'react';
import Layout from '../components/Layout';
import { Ad } from '../types';

const MOCK_ADS: Ad[] = [
  {
    id: '1',
    brand: 'Quan Ao Brands',
    title: 'MerPerle Dalat Hotel',
    description: 'Experience luxury in the heart of the "City of Eternal Spring". Our hotel offers breathtaking valley views and premium services.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOb-31X8hWMPVxIAKqxIfP4aCSnXAn3K7X9GT6XNLryuczFiNEC-Prrvea-5QsN6vuLObBt10ov3EgYq3iOmqAFMzVTIIh18LQfnVwX36L135hlYu9dJ7GDjpNm7S9Ki1mlB_QVRPemoNxCrunC5UFQDBOp8yGElGv5kptc-arw76EU1lPr8kfAAgeWHl0fLd14KBmyWa_6A9p9BjPUAywvrHG6cpq_GvpO9QrsK19avqFXrF_M_J-m5XTrjW-CgkhiNGnOSwzJWw',
    logoLetter: 'Q',
    logoBg: 'bg-blue-500',
    rating: 4.9
  },
  {
    id: '2',
    brand: 'Summit Gear',
    title: 'Pro Hiking Backpack 45L',
    description: 'Lightweight, waterproof, and ergonomically designed for long-distance treks. The ultimate companion for your wild journey.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTXQ8R_rKMAgKdHD4z-I0gHSw0W5NJDp8s_ErDhKOkjlivPxq89yRymfI60W2B76f4AO66Bg_BssUV-Cm2FdnOIlmy9S0qEtZxUSIEHIZWLCrVG0_363tLxBoCHQuhE_IRrw4FYDNS7gsOwj9D6H8GAkaKj_dUFrwCA3xyf4j43OCoEmQMq_PuEnDqvXNUUFMuIjA4DaksG9FhbAuSOc-r4Aw8kaSf6y3Yw5N3eFD2-DZCLzABqOLha73DHw3aTDr7IuLgjLAq-UE',
    logoLetter: 'S',
    logoBg: 'bg-orange-500',
    tag: 'NEW'
  },
  {
    id: '3',
    brand: 'Alpine Guides Co.',
    title: 'Guided Himalayan Trek',
    description: 'Professional mountaineers leading safe and exhilarating expeditions across the roof of the world. Limited spots available for Oct.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9M8Zqfs6QqzbB2ANY50tDyqqEcwIPNcsYHBrRJ_pv0RhD6u5IKsHyJ25WTMgY0ZmAMUJlfg27DTR6EuFVK8x-V7vX3YqeNDW7XtRrFUI4ffCk9VQR5SBnotV8ydGt_dIFAztRbFGqXdqGZ6ojITCjwRsGyUhRztE5Bk0Ph-jOxrI2xLDzj8RBxkXWKAtjz6WKiiqiP1ObY0sdh6h_UDj5AlfhyHm5IeAJt-DRRW49pYD3fwGDChMNPyskUxA4tXShO4UlCZTz3xM',
    logoLetter: 'A',
    logoBg: 'bg-emerald-600'
  }
];

const AdsPage: React.FC = () => {
  return (
    <Layout>
      <header className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-widest">Premium Partners</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight font-outfit">
                Discover Gear <br/><span className="text-primary">&amp; Services</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl">
                Handpicked recommendations from our trusted brand partners to elevate your next adventure.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-24">
        <div className="relative -mt-8 mb-16">
          <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center">
            <div className="pl-4 pr-2">
              <span className="material-icons-outlined text-slate-400">search</span>
            </div>
            <input className="flex-grow bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-200 py-4 placeholder:text-slate-400" placeholder="Search ads by title, description, or brand..." type="text"/>
            <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-colors shadow-lg flex items-center gap-2">
              Filter
              <span className="material-icons-outlined text-sm">tune</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_ADS.map(ad => (
            <div key={ad.id} className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500">
              <div className="relative h-64 overflow-hidden">
                <img alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={ad.image} />
                {ad.rating && (
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1">
                    <span className="material-icons-outlined text-xs">star</span> {ad.rating}
                  </div>
                )}
                {ad.tag && (
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary">
                    {ad.tag}
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-full ${ad.logoBg} flex items-center justify-center text-white text-xs font-bold shadow-md`}>{ad.logoLetter}</div>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{ad.brand}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{ad.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2">{ad.description}</p>
                <button className="inline-flex items-center justify-center w-full py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all duration-300">
                  Learn More
                  <span className="material-icons-outlined ml-2 text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}

          <div className="bg-primary flex flex-col items-center justify-center p-8 rounded-2xl text-center text-white relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <span className="material-icons-outlined text-6xl mb-4">handshake</span>
              <h3 className="text-2xl font-bold mb-4">Become a Brand Partner</h3>
              <p className="text-green-100 mb-8 text-sm opacity-90">
                Join our network and showcase your services to a community of passionate travelers and adventurers.
              </p>
              <button className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors">
                Contact Us Today
              </button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default AdsPage;
