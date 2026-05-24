import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cairo:    ['Segoe UI', 'Tahoma', 'Arial Unicode MS', 'Noto Sans Arabic', 'Arial', 'sans-serif'],
        playfair: ['Georgia', 'Times New Roman', 'Noto Serif', 'serif'],
        arabic:   ['Segoe UI', 'Tahoma', 'Arial Unicode MS', 'Noto Sans Arabic', 'Arial', 'sans-serif'],
      },
      colors: {
        bs: {
          deep:   '#8B1A1A',
          vivid:  '#D41E2F',
          silver: '#B8B8B8',
          pearl:  '#F4EFE8',
          dark:   '#1C0A0A',
          mid:    '#4A1010',
        },
      },
      backgroundImage: {
        'bs-grad':   'linear-gradient(135deg, #8B1A1A 0%, #D41E2F 55%, #8B1A1A 100%)',
        'bs-silver': 'linear-gradient(135deg, #9a9a9a 0%, #d8d8d8 40%, #f0f0f0 60%, #B8B8B8 100%)',
        'bs-dark':   'linear-gradient(160deg, #1C0A0A 0%, #3D0E0E 50%, #8B1A1A 100%)',
      },
      screens: { xs: '400px' },
      borderRadius: { bs: '16px', 'bs-lg': '24px' },
    },
  },
  plugins: [],
};
export default config;
