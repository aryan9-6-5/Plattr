import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        surface: {
          warm: "#FDFCF8",
          elevated: "hsl(var(--surface-elevated))",
        },
        // Plattr brand colors (direct hex for use with arbitrary values)
        plattr: {
          primary:    "#1B4332",
          dark:       "#1B4332",
          darker:     "#0F2318",
          secondary:  "#2D6A4F",
          tint:       "#D8F3DC",
          bg:         "#FDFCF8",
          "bg-alt":   "#F3F2EE",
          border:     "#E5E1D8",
          text:       "#1B2D24",
          "text-sec": "#4A6357",
          "text-muted": "#7A9A88",
          accent:     "#D32F2F",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",
      },
      boxShadow: {
        soft:      "var(--shadow-soft)",
        card:      "var(--shadow-card)",
        elevated:  "var(--shadow-elevated)",
        sm:        "var(--shadow-sm)",
        md:        "var(--shadow-md)",
        lg:        "var(--shadow-lg)",
        glow:      "var(--shadow-glow)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        "pulse-ring": {
          "0%":          { boxShadow: "0 0 0 0 rgba(82,183,136,0.5)" },
          "70%":         { boxShadow: "0 0 0 8px rgba(82,183,136,0)" },
          "100%":        { boxShadow: "0 0 0 0 rgba(82,183,136,0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-up":        "fade-up 0.6s ease-out forwards",
        float:            "float 3s ease-in-out infinite",
        "pulse-ring":     "pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite",
      },
    },
  },
  plugins: [tailwindAnimate],
} satisfies Config;
