/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "whites":"#f8f8f8",
        "blue":"#005af4",
        "red":"#e32328"
      },
      screens:{
        "sm":'1px',
        "md":"768px",
        "lg":"1080px"
      }
    },
  },
  plugins: [],
}

