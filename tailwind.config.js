/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Semantic tokens (remapped to the Apple light palette)
        bg: "#F5F5F7", // page background
        card: "#FFFFFF", // card surface
        panel: "#F5F5F7", // subtle inner surface
        border: "#D2D2D7", // card border
        separator: "#E5E5EA", // hairline separator
        ink: "#1D1D1F", // primary text / titles
        body: "#3D3D3F", // body text
        muted: "#6E6E73", // secondary text
        placeholder: "#AEAEB2",

        // Accent palette (blue primary, others in support)
        gold: "#0071E3", // legacy "gold" token -> Apple blue (primary)
        blue: "#0071E3",
        lavender: "#AF52DE", // experts (iOS purple)
        purple: "#AF52DE",
        turquoise: "#5AC8FA", // métier (iOS light blue)
        teal: "#5AC8FA",
        success: "#34C759", // iOS green
        warning: "#FF9F0A", // iOS orange
        danger: "#FF3B30", // iOS red
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Inter",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "18px",
        pill: "980px",
      },
      boxShadow: {
        card: "none",
        soft: "0 4px 16px rgba(0,0,0,0.06)",
      },
      keyframes: {
        fadeup: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadein: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        modalin: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        toastup: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeup: "fadeup 0.3s ease both",
        fadein: "fadein 0.15s ease both",
        modalin: "modalin 0.2s ease both",
        toastup: "toastup 0.25s ease both",
      },
    },
  },
  plugins: [],
};
