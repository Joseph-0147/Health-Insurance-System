module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Corona theme colors
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        sidebar: {
          dark: '#191c24',
          hover: '#2c2e33',
          border: '#2c2e33',
        },
        card: {
          bg: '#ffffff',
          border: '#e8ebf1',
        },
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-success': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-danger': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        'gradient-warning': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'gradient-info': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        'gradient-purple': 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
        'gradient-pink': 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
        'gradient-cyan': 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      },
      boxShadow: {
        'card': '0 0 10px 0 rgba(0, 0, 0, 0.1)',
        'card-hover': '0 5px 20px 0 rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}
