export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        oxanium: ["var(--font-oxanium)", "sans-serif"],
        firaCode: ["var(--font-fira-code)", "monospace"],
        merriweather: ["var(--font-merriweather)", "serif"],
        geistSans: ["var(--font-geist-sans)", "sans-serif"],
        geistMono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};