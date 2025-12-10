/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        quizBg: '#E3F5FF',
        quizCard: '#F5FDFF',
        quizPrimary: '#0F5465',
        quizAccent: '#B3E4FF',
      },
      boxShadow: {
        quiz: '0 40px 80px rgba(15, 116, 144, 0.25)',
      },
    },
  },
  plugins: [],
};
