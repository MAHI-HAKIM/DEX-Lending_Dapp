/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system", 
          "BlinkMacSystemFont", 
          '"Segoe UI"', 
          '"Roboto"', 
          '"Oxygen"', 
          '"Ubuntu"', 
          '"Cantarell"', 
          '"Fira Sans"', 
          '"Droid Sans"', 
          '"Helvetica Neue"', 
          "sans-serif"
        ],
      },
    },
  },
  plugins: [],
}
