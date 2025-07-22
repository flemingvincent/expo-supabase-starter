import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Pressable } from "react-native";
import { cn } from "@/lib/utils";
import { TextClassContext } from "@/components/ui/text";

const buttonVariants = cva(
	"group flex-row items-center justify-center rounded-2xl web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
	{
		variants: {
			variant: {
				default: "bg-lightgreen border-2 text-primary border-primary shadow-[0px_4px_0px_0px_#25551b] web:transition-all web:duration-300 active:shadow-[0px_0px_0px_0px_#25551b] active:translate-y-[4px] web:hover:shadow-[0px_0px_0px_0px_#25551b] web:hover:translate-y-[4px]",
				destructive: "bg-destructive web:hover:opacity-90 active:opacity-90",
				outline: "border border-input bg-background web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent",
				secondary: "bg-primary border-2 text-white active:text-white border-primary web:transition-all web:duration-300 shadow-[0px_4px_0px_0px_#71830C] active:shadow-[0px_0px_0px_0px_#71830C] active:translate-y-[4px]",
				funky: "bg-pink border-2 border-primary shadow-[4px_4px_0px_0px_#25551b] web:transition-all web:duration-300 active:shadow-[2px_2px_0px_0px_#25551b] active:translate-x-[2px] active:translate-y-[2px] web:hover:shadow-[2px_2px_0px_0px_#25551b] web:hover:translate-x-[2px] web:hover:translate-y-[2px]",
				ghost:
					"web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent",
				link: "web:underline-offset-4 web:hover:underline web:focus:underline",
			},
			size: {
				default: "h-11 px-8 native:h-14",
				sm: "h-9 px-3",
				lg: "h-11 px-8 native:h-14",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "lg",
		},
	},
);

const buttonTextVariants = cva(
	"web:whitespace-nowrap text-sm native:text-base font-medium web:transition-colors",
	{
		variants: {
			variant: {
				default: "text-primary font-bold tracking-wide uppercase group-active:text-primary web:transition-all",
				funky: "text-primary font-bold tracking-wide uppercase group-active:text-primary web:transition-all",
				destructive: "text-destructive-foreground",
				outline: "group-active:text-accent-foreground",
				secondary: "text-white font-semibold group-active:text-white web:transition-all",
				ghost: "group-active:text-accent-foreground",
				link: "text-primary group-active:underline",
			},
			size: {
				default: "",
				sm: "",
				lg: "native:text-lg",
				icon: "",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
	VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<
	React.ComponentRef<typeof Pressable>,
	ButtonProps
>(({ className, variant, size, ...props }, ref) => {
	return (
		<TextClassContext.Provider
			value={buttonTextVariants({
				variant,
				size,
				className: "web:pointer-events-none",
			})}
		>
			<Pressable
				className={cn(
					props.disabled && "opacity-50 web:pointer-events-none",
					buttonVariants({ variant, size, className }),
				)}
				ref={ref}
				role="button"
				{...props}
			/>
		</TextClassContext.Provider>
	);
});
Button.displayName = "Button";

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };