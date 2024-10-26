/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        bgSidebar : "rgba(195, 219, 255, 0.31)"
      },
      fontFamily:{
        poppins: ["Poppins"],
      }
    },
  },
  plugins: [],
}