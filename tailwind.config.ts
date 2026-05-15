import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        placeSticker: {
          "0%": { transform: "scale(0.5)", opacity: "0.3" },
          "70%": { transform: "scale(1.1)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-6px)" },
          "75%": { transform: "translateX(6px)" },
        },
        selectPulse: {
          "0%, 100%": { boxShadow: "0 0 0 2px #3b82f6" },
          "50%": { boxShadow: "0 0 0 5px #3b82f688" },
        },
      },
      animation: {
        placeSticker: "placeSticker 0.35s ease-out",
        shake: "shake 0.3s ease-in-out",
        selectPulse: "selectPulse 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
