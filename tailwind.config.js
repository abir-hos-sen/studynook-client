/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6', // Violet
          600: '#7c3aed',
          700: '#6d28d9',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b', // Amber/Gold
          600: '#d97706',
        },
        dark: {
          bg: '#030712', // Rich Pitch Dark
          card: '#0f172a', // Slate Dark
          border: '#1e293b'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'], // Premium Outfitters font
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(139, 92, 246, 0.15)',
        'glow-accent': '0 0 20px rgba(245, 158, 11, 0.15)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
      },
      backgroundImage: {
        'mesh-dark': 'radial-gradient(at 0% 0%, rgba(124, 58, 237, 0.1) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(245, 158, 11, 0.05) 0px, transparent 50%)',
        'mesh-light': 'radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.05) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(245, 158, 11, 0.03) 0px, transparent 50%)',
      }
    },
  },
  plugins: [],
}
