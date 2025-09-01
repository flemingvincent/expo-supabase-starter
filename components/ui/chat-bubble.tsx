import React from "react";
import { View, Image } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
	message: string;
	isUser?: boolean;
	avatar?: string;
	timestamp?: string;
	className?: string;
}

export function ChatBubble({
	message,
	isUser = false,
	avatar,
	timestamp,
	className,
}: ChatBubbleProps) {
	return (
		<View
			className={cn(
				"flex-row mb-4",
				isUser ? "justify-end" : "justify-start",
				className,
			)}
		>
			{!isUser && avatar && (
				<Image
					source={{ uri: avatar }}
					className="w-10 h-10 rounded-full mr-2"
				/>
			)}

			<View className={cn("max-w-[75%]", isUser ? "items-end" : "items-start")}>
				<View
					className={cn(
						"px-4 py-3 rounded-2xl",
						isUser ? "bg-green-500 rounded-br-sm" : "bg-gray-100 rounded-bl-sm",
					)}
				>
					<Text
						className={cn("text-base", isUser ? "text-white" : "text-gray-900")}
					>
						{message}
					</Text>
				</View>

				{timestamp && (
					<Text className="text-xs text-gray-400 mt-1 px-1">{timestamp}</Text>
				)}
			</View>

			{isUser && avatar && (
				<Image
					source={{ uri: avatar }}
					className="w-10 h-10 rounded-full ml-2"
				/>
			)}
		</View>
	);
}
