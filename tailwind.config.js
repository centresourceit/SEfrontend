/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // primary: "#181136",
        primary: {
          50: "#eeecf9",
          100: "#ccc5ed",
          200: "#ab9ee0",
          300: "#8977d4",
          400: "#6750c8",
          500: "#4e37af",
          600: "#3c2b88",
          700: "#2b1f61",
          800: "#181136",
          900: "#090613",
        },
        secondary: "#33dfec",
      },
    },
  },
  plugins: [],
};
