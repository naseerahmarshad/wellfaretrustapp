/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      'primary': '#6C63FF',
      'secondary': '#5850CD',
      'gray-dark': '#273444',
      'gray': '#8492a6',
      'gray-light': '#d3dce6',
      'gray-light2': '#ddd',
      'gray-light3': '#eee',
      'gray-light4': '#f3f3f3',
      'white': '#fff',
    },
    fontFamily: {
      sans: ['Manrope', 'sans-serif'],
    },
    screens: {
      // 'tablet': '640px',
      // // => @media (min-width: 640px) { ... }
      // 'laptop': '1024px',
      // // => @media (min-width: 1024px) { ... }
      // 'desktop': '1280px',
      // // => @media (min-width: 1280px) { ... }
      // 'xllaptop': {'max': '1279px'},
      // // => @media (max-width: 1279px) { ... }
      // 'lgtablet': {'max': '1023px'},
      // // => @media (max-width: 1023px) { ... }
      // 'mdmobile': {'max': '767px'},
      // // => @media (max-width: 767px) { ... }
      // 'smmobile': {'max': '639px'},
      // // => @media (max-width: 639px) { ... }

      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
    },
    extend: {
    },
  },
  plugins: [],
};
