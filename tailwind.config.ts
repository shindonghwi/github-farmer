import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        github: {
          bg: "#0d1117",
          "bg-secondary": "#161b22",
          border: "#30363d",
          text: "#c9d1d9",
          "text-muted": "#8b949e",
          accent: "#58a6ff",
          green: {
            0: "#161b22",
            1: "#0e4429",
            2: "#006d32",
            3: "#26a641",
            4: "#39d353",
          },
        },
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 1.5s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px #39d353" },
          "100%": { boxShadow: "0 0 20px #39d353, 0 0 30px #39d353" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
