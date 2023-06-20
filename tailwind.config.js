/** @type {import('tailwindcss').Config} */
const { plugin } = require("twrnc");
module.exports = {
	content: [],
	theme: {
		extend: {
			colors: {
				// Light
				background: "#ffffff",
				foreground: "#0f172a",
				muted: "#f1f5f9",
				"muted-foreground": "#64748b",
				popover: "#ffffff",
				"popover-foreground": "#0f172a",
				card: "#ffffff",
				"card-foreground": "#0f172a",
				border: "#e2e8f0",
				input: "#e2e8f0",
				primary: "#0f172a",
				"primary-foreground": "#f8fafc",
				secondary: "#f1f5f9",
				"secondary-foreground": "#0f172a",
				accent: "#f1f5f9",
				"accent-foreground": "#0f172a",
				destructive: "#ff0000",
				"destructive-foreground": "#f8fafc",
				ring: "#94a3b8",
				// Dark
				"dark-background": "#030711",
				"dark-foreground": "#e1e7ef",
				"dark-muted": "#0f1629",
				"dark-muted-foreground": "#7f8ea3",
				"dark-popover": "#030711",
				"dark-popover-foreground": "#94a3b8",
				"dark-card": "#030711",
				"dark-card-foreground": "#e1e7ef",
				"dark-border": "#1d283a",
				"dark-input": "#1d283a",
				"dark-primary": "#f8fafc",
				"dark-primary-foreground": "#020205",
				"dark-secondary": "#0f172a",
				"dark-secondary-foreground": "#f8fafc",
				"dark-accent": "#1d283a",
				"dark-accent-foreground": "#f8fafc",
				"dark-destructive": "#811d1d",
				"dark-destructive-foreground": "#f8fafc",
				"dark-ring": "#1d283a",
			},
		},
	},
	plugins: [
		plugin(({ addUtilities }) => {
			addUtilities({
				// Typography
				h1: `text-4xl font-extrabold tracking-tight lg:text-5xl`,
				h2: `border-b pb-2 text-3xl font-semibold tracking-tight`,
				h3: `text-2xl font-semibold tracking-tight`,
				h4: `text-xl font-semibold tracking-tight`,
				p: `leading-7`,
				lead: `text-xl text-muted-foreground dark:text-dark-muted-foreground`,
				large: `text-lg font-semibold`,
				small: `text-sm font-medium leading-[0px]`,
				muted: `text-sm text-muted-foreground dark:text-dark-muted-foreground`,
			});
		}),
	],
};
