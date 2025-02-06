/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [daisyui,],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#474CFF",
          "secondary": "#EBF2FA",
          "accent": "#252525",
          "neutral": "#3d4451",
          "base-100": "#ffffff",
        },
      },
      "dark",
    ],
  },
};
