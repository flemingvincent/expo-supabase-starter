/** @type {import('tailwindcss').Config} */
const { plugin } = require("twrnc");
module.exports = {
	content: [],
	theme: {
		extend: {
			colors: {
				// Light
				background: "hsl(0, 0%, 100%)",
				foreground: "hsl(0, 0%, 3.9%)",
				card: "hsl(0, 0%, 100%)",
				"card-foreground": "hsl(0, 0%, 3.9%)",
				popover: "hsl(0, 0%, 100%)",
				"popover-foreground": "hsl(0, 0%, 3.9%)",
				primary: "hsl(0, 0%, 9%)",
				"primary-foreground": "hsl(0, 0%, 98%)",
				secondary: "hsl(0, 0%, 96.1%)",
				"secondary-foreground": "hsl(0, 0%, 9%)",
				muted: "hsl(0, 0%, 96.1%)",
				"muted-foreground": "hsl(0, 0%, 45.1%)",
				accent: "hsl(0, 0%, 96.1%)",
				"accent-foreground": "hsl(0, 0%, 9%)",
				destructive: "hsl(0, 84.2%, 60.2%)",
				"destructive-foreground": "hsl(0, 0%, 98%)",
				border: "hsl(0, 0%, 89.8%)",
				input: "hsl(0, 0%, 89.8%)",
				ring: "hsl(0, 0%, 3.9%)",
				// Dark
				"dark-background": "hsl(0, 0%, 3.9%)",
				"dark-foreground": "hsl(0, 0%, 98%)",
				"dark-card": "hsl(0, 0%, 3.9%)",
				"dark-card-foreground": "hsl(0, 0%, 98%)",
				"dark-popover": "hsl(0, 0%, 3.9%)",
				"dark-popover-foreground": "hsl(0, 0%, 98%)",
				"dark-primary": "hsl(0, 0%, 98%)",
				"dark-primary-foreground": "hsl(0, 0%, 9%)",
				"dark-secondary": "hsl(0, 0%, 14.9%)",
				"dark-secondary-foreground": "hsl(0, 0%, 98%)",
				"dark-muted": "hsl(0, 0%, 14.9%)",
				"dark-muted-foreground": "hsl(0, 0%, 63.9%)",
				"dark-accent": "hsl(0, 0%, 14.9%)",
				"dark-accent-foreground": "hsl(0, 0%, 98%)",
				"dark-destructive": "hsl(0, 62.8%, 30.6%)",
				"dark-destructive-foreground": "hsl(0, 0%, 98%)",
				"dark-border": "hsl(0, 0%, 14.9%)",
				"dark-input": "hsl(0, 0%, 14.9%)",
				"dark-ring": "hsl(0, 0%, 83.1%)",
			},
		},
	},
	plugins: [
		plugin(({ addUtilities }) => {
			addUtilities({
				// Typography
				h1: `text-4xl text-foreground dark:text-dark-foreground font-extrabold tracking-tight lg:text-5xl`,
				h2: `text-3xl text-foreground dark:text-dark-foreground font-semibold tracking-tight`,
				h3: `text-2xl text-foreground dark:text-dark-foreground font-semibold tracking-tight`,
				h4: `text-xl text-foreground dark:text-dark-foreground font-semibold tracking-tight`,
				p: `leading-7 text-foreground dark:text-dark-foreground`,
				lead: `text-xl text-muted-foreground dark:text-dark-muted-foreground`,
				large: `text-lg text-foreground dark:text-dark-foreground font-semibold`,
				small: `text-sm text-foreground dark:text-dark-foreground font-medium leading-[0px]`,
				muted: `text-sm text-muted-foreground dark:text-dark-muted-foreground`,
			});
		}),
	],
};
