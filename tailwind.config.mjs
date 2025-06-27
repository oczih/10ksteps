import daisyui from 'daisyui';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [daisyui, typography],
};

export default config;