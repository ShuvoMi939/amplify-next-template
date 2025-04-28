module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./app/**/*.{js,ts,jsx,tsx}", // Ensure your app folder is included for Tailwind to purge correctly
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  