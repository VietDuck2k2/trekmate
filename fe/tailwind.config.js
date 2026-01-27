/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      "./src/**/*.{js,jsx,ts,tsx}",
   ],
   darkMode: "class",
   theme: {
      extend: {
         colors: {
            primary: "#2D5A27", // Forest Green
            accent: "#8B5E3C",  // Wood Brown
            "background-light": "#F8FAF9",
            "background-dark": "#0F172A",
         },
         fontFamily: {
            display: ["DM Serif Display", "serif"],
            sans: ["Inter", "sans-serif"],
            jakarta: ["Plus Jakarta Sans", "sans-serif"],
            serif: ["Playfair Display", "serif"],
            outfit: ["Outfit", "sans-serif"],
         },
         borderRadius: {
            DEFAULT: "0.75rem",
            "xl": "1.25rem",
            "2xl": "1.5rem",
            "3xl": "2rem",
         },
         keyframes: {
            'pulse-subtle': {
               '0%, 100%': { transform: 'scale(1)', opacity: '1' },
               '50%': { transform: 'scale(1.1)', opacity: '0.9' },
            }
         },
         animation: {
            'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
         }
      },
   },
   plugins: [],
}
