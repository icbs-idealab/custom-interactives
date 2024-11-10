module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scans all files in src for Tailwind classes
    "./public/index.html"          // Scans index.html for Tailwind classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
