import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: '#f3f4f6',
            h1: {
              color: '#93c5fd',
              fontWeight: '700',
            },
            h2: {
              color: '#93c5fd',
              fontWeight: '600',
            },
            h3: {
              color: '#93c5fd',
              fontWeight: '600',
            },
            strong: {
              color: '#93c5fd',
            },
            code: {
              color: '#93c5fd',
              backgroundColor: '#1f2937',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
            },
            blockquote: {
              borderLeftColor: '#3b82f6',
              color: '#d1d5db',
            },
            a: {
              color: '#60a5fa',
              '&:hover': {
                color: '#93c5fd',
              },
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
