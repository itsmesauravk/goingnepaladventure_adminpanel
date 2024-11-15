import type { Config } from "tailwindcss"

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#373F7E",
        secondary: "#5D83C4",
        background: "#F3F4F6",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config
