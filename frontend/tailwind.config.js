/** @type {import('tailwindcss').Config} */

import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "#46b9b0",
          foreground: "#80BDA9",
        },
        primaryLight: {
          DEFAULT: "#d1edeb",
          // foreground: "#80BDA9",
        },
        primaryDeep: {
          DEFAULT: "#277871",
          // foreground: "#80BDA9",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        ultraLight: {
          DEFAULT: "#f6fbfb",
          // foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        adminInput: "#D9D9D9",
        deleteRed: "#FF0000",
      },
      ring: "#007A53",
      chart: {
        1: "hsl(var(--chart-1))",
        2: "hsl(var(--chart-2))",
        3: "hsl(var(--chart-3))",
        4: "hsl(var(--chart-4))",
        5: "hsl(var(--chart-5))",
      },
      fontFamily: {
        sans: ['"Open Sans"', "sans-serif"],
        bangla: ['"Hind Siliguri"', '"Noto Sans Bengali"', "sans-serif"],
        amiri: ['"Amiri"', "serif"],
        hindi: ['"Hind Siliguri"', '"Noto Sans Bengali"', "sans-serif"],
        arabic: ["Nabi", "Amiri"],
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
