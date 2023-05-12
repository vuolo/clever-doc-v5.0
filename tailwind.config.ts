import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // firefly: '#0F2830',
          // emerald: '#014751',
          // green: '#00D37F',
          // mint: '#AFF8C8',
          // bananaYellow: '#FFEEB4',
          // zircon: '#F8FBFF',
          // lilac: '#D2C4FB'

          // gold: '#f7c763',
          // lilac: '#a5a5ff'

          gold: "#ffd400",
          purple: "#6237de",
        },
      },
      keyframes: {
        processingbar: {
          "0%": { marginLeft: "0%" },
          "50%": { marginLeft: "55%" },
          "100%": { marginLeft: "0%" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
