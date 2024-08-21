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
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
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
        slidein: {
          "0%": { transform: "translate(0, -100%)", opacity: 0 },
          "100%": { transform: "translate(0, 0)", opacity: 1 },
        },
      },
      animation: {
        slidein: "slidein .5s ease-in-out",
        gradient: "gradient 6s linear infinite",
        blob: "blob 7s infinite",
        fade: "fadeIn .5s ease-in-out",
      },
      backgroundImage: {
        pengu: 'url("../public/pengu-ani.gif")',
      },
      colors: {
        "darkest-blue": "#0B0C15",
        "darker-blue": "#131523",
        "darker-gray": "#0e111c",
        "lighter-gray": "#191f30",
        "pris-purple": "#988BFA",
        "pris-pink": "#DD88FF",
        "pris-light-pink": "#F1C2FF",
        "button-blue": "#074F9C",
        "pris-blue": "#B1DFFF",
        "pris-yellow": "#F8D283",
        "not-white": "#9397AE",
        "idle-purple": "#1C1F33",
        "idle-purple-b": "#323757",
        "active-purple": "#2D314E",
        "active-purple-b": "#656C9D",
        "lightest-purple": "#383C5E",
        white: "#e6e9f0",
        whitish: "#afadc9",
      },
    },
  },
  plugins: [],
};
