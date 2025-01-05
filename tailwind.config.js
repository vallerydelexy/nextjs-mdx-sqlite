export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          darkGreen: "#075E54",
          brightGreen: "#25D366",
          lightBlue: "#DDECF2",
          darkBlue: "#585e61",
          cream: "#FCF4CB",
          darkCream: "#656251",
          brown: "#DAD3CC",
          darkBrown: "#575452",
        },
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
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
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
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        'pink-blossom': {
          '0%': {
            background:
              'radial-gradient(100% 225% at 0 100%, #ffb6c1 0, #ff69b4 100%), linear-gradient(-100deg, pink 70%, #ff1493), linear-gradient(200deg, pink, #ff69b4), linear-gradient(-3deg, #ff69b4, #ffb6c1 50%)',
            backgroundSize: '100% 100%',
            backgroundPosition: '0 60%',
            backgroundBlendMode: 'color-dodge, color-burn, color-burn, normal',
          },
          '20%': {
            background:
              'radial-gradient(100% 225% at 0 100%, #ffb6c1 0, #ff69b4 100%), linear-gradient(-100deg, pink 70%, #ff1493), linear-gradient(200deg, pink, #ff69b4), linear-gradient(-3deg, #ff69b4, #ffb6c1 50%)',
            backgroundSize: '105% 105%',
            backgroundPosition: '10% 50%',
            backgroundBlendMode: 'color-dodge, color-burn, color-burn, normal',
          },
          '40%': {
            background:
              'radial-gradient(100% 225% at 0 100%, #ffb6c1 0, #ff69b4 100%), linear-gradient(-100deg, pink 70%, #ff1493), linear-gradient(200deg, pink, #ff69b4), linear-gradient(-3deg, #ff69b4, #ffb6c1 50%)',
            backgroundSize: '110% 300%',
            backgroundPosition: '20% 40%',
            backgroundBlendMode: 'color-dodge, color-burn, color-burn, normal',
          },
          '60%': {
            background:
              'radial-gradient(100% 225% at 0 100%, #ffb6c1 0, #ff69b4 100%), linear-gradient(-100deg, pink 70%, #ff1493), linear-gradient(200deg, pink, #ff69b4), linear-gradient(-3deg, #ff69b4, #ffb6c1 50%)',
            backgroundSize: '115% 115%',
            backgroundPosition: '30% 30%',
            backgroundBlendMode: 'color-dodge, color-burn, color-burn, normal',
          },
          '80%': {
            background:
              'radial-gradient(100% 225% at 0 100%, #ffb6c1 0, #ff69b4 100%), linear-gradient(-100deg, pink 70%, #ff1493), linear-gradient(200deg, pink, #ff69b4), linear-gradient(-3deg, #ff69b4, #ffb6c1 50%)',
            backgroundSize: '250% 120%',
            backgroundPosition: '40% 20%',
            backgroundBlendMode: 'color-dodge, color-burn, color-burn, normal',
          },
          '100%': {
            background:
              'radial-gradient(100% 225% at 0 100%, #ffb6c1 0, #ff69b4 100%), linear-gradient(-100deg, pink 70%, #ff1493), linear-gradient(200deg, pink, #ff69b4), linear-gradient(-3deg, #ff69b4, #ffb6c1 50%)',
            backgroundSize: '100% 100%',
            backgroundPosition: '0 60%',
            backgroundBlendMode: 'color-dodge, color-burn, color-burn, normal',
          },
        },
      },
      animation: {
        'pink-blossom': 'pink-blossom 5s ease infinite',
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
	require('tailwindcss-motion')
  ],
};
