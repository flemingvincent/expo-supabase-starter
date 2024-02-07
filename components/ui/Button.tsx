import { cva, type VariantProps } from "class-variance-authority";
import { useColorScheme } from "nativewind";
import * as React from "react";
import { Platform, Pressable, Text, View } from "react-native";

import * as Slot from "@/lib/rn-primatives/slot";
import { cn, isTextChildren } from "@/lib/utils";

const buttonVariants = cva("flex-row items-center justify-center rounded-md", {
	variants: {
		variant: {
			default: "bg-primary",
			destructive: "bg-destructive",
			outline: "border border-input bg-background",
			secondary: "bg-secondary",
			ghost: "",
			link: "",
		},
		size: {
			default: "h-10 px-4 py-2",
			sm: "h-9 rounded-md px-3",
			lg: "h-11 rounded-md px-8",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

const buttonTextVariants = cva("font-medium", {
	variants: {
		variant: {
			default: "text-primary-foreground",
			destructive: "text-destructive-foreground",
			outline: "text-foreground",
			secondary: "text-secondary-foreground",
			ghost: "text-foreground",
			link: "text-primary underline-offset-4 underline",
		},
		size: {
			default: "text-sm font-medium",
			sm: "text-sm font-medium",
			lg: "text-sm font-medium",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

const rippleColor = (isThemeDark: boolean) => {
	const secondary = isThemeDark ? "hsl(240 4% 16%)" : "hsl(240 5% 96%)";
	return {
		default: isThemeDark ? "#d4d4d8" : "#3f3f46",
		destructive: isThemeDark ? "#b91c1c" : "#f87171",
		outline: secondary,
		secondary: isThemeDark ? "#3f3f46" : "#e4e4e7",
		ghost: secondary,
		link: secondary,
	};
};

const Button = React.forwardRef<
	React.ElementRef<typeof Pressable>,
	React.ComponentPropsWithoutRef<typeof Pressable> &
		VariantProps<typeof buttonVariants> & {
			textClass?: string;
			androidRootClass?: string;
		}
>(
	(
		{
			className,
			textClass,
			variant = "default",
			size,
			children,
			androidRootClass,
			disabled,
			...props
		},
		ref,
	) => {
		const { colorScheme } = useColorScheme();
		const Root = Platform.OS === "android" ? View : Slot.Pressable;
		return (
			<Root
				className={cn(
					Platform.OS === "android" && "flex-row rounded-md overflow-hidden",
					Platform.OS === "android" && androidRootClass,
				)}
			>
				<Pressable
					className={cn(
						buttonVariants({
							variant,
							size,
							className: cn(className, disabled && "opacity-50"),
						}),
					)}
					ref={ref}
					android_ripple={{
						color: rippleColor(colorScheme === "dark")[variant as "default"],
						borderless: false,
					}}
					disabled={disabled}
					{...props}
				>
					{isTextChildren(children)
						? // @ts-ignore
							({ pressed, hovered }) => (
								<Text
									className={cn(
										hovered && "opacity-90",
										pressed && "opacity-70",
										buttonTextVariants({ variant, size, className: textClass }),
										disabled && "opacity-100",
									)}
								>
									{children as string | string[]}
								</Text>
							)
						: children}
				</Pressable>
			</Root>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonTextVariants, buttonVariants };
