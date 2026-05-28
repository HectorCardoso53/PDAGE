import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          950: '#000814',
          900: '#000f22',
          800: '#001428',
          700: '#001b3d',
          600: '#002654',
          500: '#003170',
          400: '#38b6ff',
          300: '#6ccaff',
          200: '#a0dcff',
          100: '#d0eeff',
          50:  '#eaf6ff',
        },
        accent: {
          600: '#d4a800',
          500: '#ffc107',
          400: '#ffd21f',
          300: '#ffdc3a',
          200: '#ffea70',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #000814 0%, #001428 50%, #001b3d 100%)',
        'gradient-section': 'linear-gradient(180deg, #000f22 0%, #001b3d 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(0,27,61,0.05) 0%, rgba(56,182,255,0.05) 100%)',
        'gradient-cta': 'linear-gradient(135deg, #001b3d 0%, #38b6ff 100%)',
      },
      boxShadow: {
        'card-hover': '0 6px 18px rgba(0, 0, 0, 0.08)',
        'glow-blue': '0 0 24px rgba(56, 182, 255, 0.30)',
        'glow-accent': '0 0 16px rgba(255, 210, 31, 0.40)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
