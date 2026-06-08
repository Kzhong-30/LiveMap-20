/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        surface: {
          DEFAULT: '#1A1D27',
          dark: '#0F1117',
          deeper: '#0A0C10',
        },
        accent: {
          DEFAULT: '#00D4AA',
          hover: '#00E4BA',
        },
        border: {
          DEFAULT: '#2A2D3A',
          hover: '#3A3D4A',
        },
      },
    },
  },
  plugins: [],
};
