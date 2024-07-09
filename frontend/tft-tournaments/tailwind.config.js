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
      },
      animation: {
        gradient: "gradient 6s linear infinite",
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
      },
    },
  },
  plugins: [],
};
