/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      greycliff: ["greycliff-cf", "sans-serif"],
      soleil: ["soleil", "sans-serif"],
    },
    extend: {
      keyframes: {
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
      animation: {
        gradient: "gradient 6s linear infinite",
        blob: "blob 7s infinite",
      },
      backgroundImage: {
        pengu: 'url("../public/pengu-ani.gif")',
      },
      colors: {
        "darkest-blue": "#0B0C15",
        "pris-purple": "#988BFA",
        "pris-pink": "#DD88FF",
        "pris-light-pink": "#F1C2FF",
        "pris-blue": "#B1DFFF",
        "pris-yellow": "#F8D283",
        "not-white": "#d7ccd9",
      },
    },
  },
  plugins: [],
};
