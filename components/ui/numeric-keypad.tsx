import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface NumericKeypadProps {
	onKeyPress: (key: string) => void;
	onDelete: () => void;
	className?: string;
}

export function NumericKeypad({
	onKeyPress,
	onDelete,
	className,
}: NumericKeypadProps) {
	const keys = [
		["1", "2", "3"],
		["4", "5", "6"],
		["7", "8", "9"],
		["", "0", "delete"],
	];

	const renderKey = (key: string) => {
		if (key === "") {
			return <View className="w-24 h-14" />;
		}

		if (key === "delete") {
			return (
				<TouchableOpacity
					onPress={onDelete}
					className="w-24 h-14 items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200"
				>
					<Text className="text-lg">⌫</Text>
				</TouchableOpacity>
			);
		}

		return (
			<TouchableOpacity
				onPress={() => onKeyPress(key)}
				className="w-24 h-14 items-center justify-center bg-white rounded-lg active:bg-gray-100 border border-gray-200"
			>
				<Text className="text-xl font-semibold text-gray-900">{key}</Text>
				{key !== "0" && (
					<Text className="text-xs text-gray-500 mt-0.5">
						{key === "2" && "ABC"}
						{key === "3" && "DEF"}
						{key === "4" && "GHI"}
						{key === "5" && "JKL"}
						{key === "6" && "MNO"}
						{key === "7" && "PQRS"}
						{key === "8" && "TUV"}
						{key === "9" && "WXYZ"}
					</Text>
				)}
			</TouchableOpacity>
		);
	};

	return (
		<View className={cn("bg-gray-50 p-4", className)}>
			{keys.map((row, rowIndex) => (
				<View key={rowIndex} className="flex-row justify-around mb-3">
					{row.map((key, keyIndex) => (
						<View key={`${rowIndex}-${keyIndex}`}>{renderKey(key)}</View>
					))}
				</View>
			))}
		</View>
	);
}
