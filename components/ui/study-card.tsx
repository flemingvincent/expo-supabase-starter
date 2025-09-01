import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface StudyCardProps {
	title: string;
	subtitle: string;
	icon?: React.ReactNode;
	iconBgColor?: string;
	bgColor?: string;
	onPress?: () => void;
	size?: "large" | "small";
	className?: string;
}

export function StudyCard({
	title,
	subtitle,
	icon,
	iconBgColor = "bg-white",
	bgColor = "bg-blue-500",
	onPress,
	size = "small",
	className,
}: StudyCardProps) {
	const isLarge = size === "large";

	return (
		<TouchableOpacity
			onPress={onPress}
			activeOpacity={0.8}
			className={cn(
				"rounded-2xl p-4 shadow-sm",
				isLarge ? "flex-1 min-h-[160px]" : "bg-white",
				isLarge && bgColor,
				className,
			)}
		>
			<View
				className={cn(
					"flex-row items-center",
					isLarge && "flex-col items-start",
				)}
			>
				{icon && (
					<View
						className={cn(
							"rounded-xl items-center justify-center mb-2",
							isLarge ? "w-16 h-16" : "w-12 h-12",
							isLarge ? iconBgColor : bgColor,
						)}
					>
						{icon}
					</View>
				)}
				<View className={cn(!isLarge && icon && "ml-3", "flex-1")}>
					<Text
						className={cn(
							"font-semibold",
							isLarge ? "text-white text-xl mb-1" : "text-gray-900 text-base",
						)}
					>
						{title}
					</Text>
					<Text
						className={cn(
							"text-sm",
							isLarge ? "text-white/90" : "text-gray-500",
						)}
					>
						{subtitle}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}
