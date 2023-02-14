module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx,html}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    colors: {
      black: "#000000",
      text: "#FFFFFF",
      white: "#FFFFFF",
      lightWhite: "#e6e6e6",
      background: "#003249",
      blue: "#003249",
      red: "#D04D07",
      yellow: "#F79301",
      purple: "#350E3A",
      burgandy: "#5B040C",
      lightPurple: "#A18AB8",
      pink: "#BE3674",
    },
    fontFamily: {
      sans: ["Calibri", "sans-serif"],
      serif: ["Calibri", "serif"],
      roboto: ["Roboto Mono", "serif"],
    },
    extend: {
      backgroundImage: {
        "home-video": "url('./assets/homepagevideo.mp4')",
        "tye-logo": "url('./assets/logo.png')",
      },
      backgroundSize: {
        auto: "auto",
        cover: "cover",
        contain: "contain",
        256: "256px",
      },
      spacing: {
        "1/10": "10%",
        "2/10": "20%",
        "3/10": "30%",
        "4/10": "40%",
        "5/10": "50%",
        "6/10": "60%",
        "7/10": "70%",
        "8/10": "80%",
        "9/10": "90%",
        full: "100%",
        25: "25px",
        50: "50px",
        100: "100px",
        400: "400px",
      },
      keyframes: {
        outleft: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        inright: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      animation: {
        transitionout: "outleft 1s linear infinite hidden",
        transitionin: "inright 1s linear infinite",
      },
    },
  },
  plugins: [require("autoprefixer")],
  variants: {
    scrollbar: ["rounded"],
  },
};
