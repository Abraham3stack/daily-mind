/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        mist: "#F8FAFC",
        line: "#D9E2EC",
        accent: "#0F766E",
        coral: "#F97360",
        gold: "#F59E0B"
      },
      boxShadow: {
        card: "0 24px 60px -32px rgba(15, 23, 42, 0.28)"
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at top left, rgba(15,118,110,0.2), transparent 28%), radial-gradient(circle at top right, rgba(249,115,96,0.18), transparent 24%), linear-gradient(180deg, #F8FAFC 0%, #EEF6F6 100%)"
      }
    }
  },
  plugins: []
};
