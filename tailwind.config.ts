import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          0:    "#050402",
          DEFAULT: "#0b0907",
          1:    "#110e0a",
          2:    "#181410",
          3:    "#221c15",
          line: "rgba(201,169,106,0.14)",
        },
        ivory:  "#f3e8d2",
        cream:  "#e6d8bc",
        paper:  "#efe5cf",
        paper2: "#ddcfb0",
        gold: {
          DEFAULT: "#c9a96a",
          bright:  "#e6cd92",
          deep:    "#8a7240",
          soft:    "rgba(201,169,106,0.55)",
        },
        maroon:   "#5c2230",
        moss:     "#4a523a",
        indigo:   "#2d3147",
        bluegrey: "#4a5567",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "EB Garamond", "Georgia", "serif"],
        sans:  ["var(--font-inter)", "Helvetica Neue", "Arial", "sans-serif"],
        deva:  ["var(--font-tiro)", "var(--font-cormorant)", "serif"],
        hand:  ["var(--font-italianno)", "var(--font-cormorant)", "cursive"],
      },
      maxWidth: { site: "1320px" },
      transitionTimingFunction: {
        cinema: "cubic-bezier(.22,.61,.36,1)",
        out:    "cubic-bezier(.16,1,.3,1)",
      },
      letterSpacing: {
        eyebrow: "0.34em",
        rule:    "0.38em",
        nav:     "0.26em",
        btn:     "0.28em",
      },
    },
  },
  plugins: [],
} satisfies Config;
