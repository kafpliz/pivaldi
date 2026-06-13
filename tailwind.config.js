/** @type {import('tailwindcss').Config} */

const palette = {
  brown100: 'rgba(217, 211, 198, 1)',
  brown200: 'rgba(212, 203, 188, 1)',
  brown300: 'rgba(185, 143, 89, 1)',
  brown400: 'rgba(182, 164, 135, 1)',
  brown500: 'rgba(180, 157, 125, 1)',
  brown600: 'rgba(178, 157, 126, 1)',
  brown700: 'rgba(176, 157, 125, 1)',
  brown800: 'rgba(162, 138, 103, 1)',
  brown900: 'rgba(161, 109, 28, 1)',
  brown950: 'rgba(143, 113, 77, 1)',
  brown1000: 'rgba(140, 110, 74, 1)',
  dark100: 'rgba(105, 90, 67, 1)',
  dark200: 'rgba(67, 48, 20, 1)',
  dark300: 'rgba(67, 48, 19, 1)',
};

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        active: palette.brown600,
        'primary-btn': 'var(--color-primary-btns)',
        'primary-comp': 'var(--color-primary-components)',
        "primary-modal": 'var(--color-primary-modal)',

        tab: {
          active: palette.brown600,
        },

        home: {
          'block-1': palette.brown1000,
          'block-2': palette.brown700,
          'link-1': palette.brown800,
          'link-2': palette.brown950,
          'link-3': palette.brown500,
          'btns': palette.brown100,
        },
        user: {
          'link-1': palette.brown300,
          'link-2': palette.brown900,
          'link-3': palette.brown300,
          'text-1': palette.brown900,
          'btn-1': palette.brown1000,
        },
        affiche: {
          bar: palette.dark100,
          text: palette.brown100,
        },
        delivery: {
          bg: palette.brown400,
        },
        comp: {
          'bg-bar': palette.brown600,
        },
        menu: {
          'tabs': palette.brown700,
        },
      },
      textColor: {
        primary: 'var(--color-text-primary)',
        'home-btns': palette.dark200,
        'brown': palette.dark300,
      },

      backgroundColor: ({ theme }) => ({
        ...theme('colors.home'),
        ...theme('colors.user'),
      }),
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'home-card': '16px 15px 21px -3px rgba(255, 250, 239, 0.5) inset, 6px 6px 18px -3px rgba(0, 0, 0, 0.47)',
      },
    },
  },
  plugins: [],
}
