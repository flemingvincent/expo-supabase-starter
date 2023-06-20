import * as React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

import tw from "@/lib/tailwind";

export type ButtonVariantTypes =
	| "default"
	| "destructive"
	| "outline"
	| "secondary"
	| "ghost"
	| "link";

export interface IButtonProps
	extends React.ComponentProps<typeof TouchableOpacity> {
	children?: React.ReactNode;
	variant?: ButtonVariantTypes;
	size?: "default" | "sm" | "lg";
	label?: string;
	isLoading?: boolean;
}

export const Button = ({
	children,
	variant = "default",
	size = "default",
	label = "Button",
	isLoading = false,
	...props
}: IButtonProps) => {
	return (
		<TouchableOpacity
			style={[
				tw`items-center justify-center rounded-md`,
				variant === "default" && tw`bg-primary dark:bg-dark-primary`,
				variant === "destructive" &&
					tw`bg-destructive dark:bg-dark-destructive`,
				variant === "outline" && tw`border border-input`,
				variant === "secondary" && tw`bg-secondary dark:bg-dark-secondary`,
				variant === "ghost" && tw``,
				variant === "link" && tw``,
				size === "default" && tw`h-10 px-4 py-2`,
				size === "sm" && tw`h-9 px-3 rounded-md`,
				size === "lg" && tw`h-11 px-8 rounded-md`,
			]}
			{...props}
		>
			{isLoading ? (
				<ActivityIndicator size={"small"} />
			) : (
				<Text
					style={[
						variant === "default" &&
							tw`text-primary-foreground dark:text-dark-primary-foreground`,
						variant === "destructive" &&
							tw`text-destructive-foreground dark:text-dark-destructive-foreground`,
						variant === "secondary" &&
							tw`text-secondary-foreground dark:text-dark-secondary-foreground`,
						variant === "outline" && tw`text-input`,
						variant === "ghost" &&
							tw`text-primary-foreground dark:text-dark-primary-foreground`,
						variant === "link" && tw`text-primary dark:text-dark-primary`,
					]}
				>
					{label}
				</Text>
			)}
		</TouchableOpacity>
	);
};
