import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { usePressAnimation } from "@/hooks/onPressAnimation";

interface CounterProps {
	value: number;
	onIncrement: () => void;
	onDecrement: () => void;
	label: string;
	min?: number;
	max?: number;
}

const Counter = ({
	value,
	onIncrement,
	onDecrement,
	label,
	min = 1,
	max = 20,
}: CounterProps) => {
	// Press animations for buttons
	const decrementPress = usePressAnimation({
		hapticStyle: "Light",
		pressDistance: 2,
	});

	const incrementPress = usePressAnimation({
		hapticStyle: "Light",
		pressDistance: 2,
	});

	const isMinDisabled = value <= min;
	const isMaxDisabled = value >= max;

	return (
		<View className="mb-4">
			{/* Label */}
			<Text className="text-primary text-base mb-3 ml-1 font-medium">
				{label}
			</Text>

			{/* Counter Container */}
			<View className="bg-white/90 rounded-xl p-4 border border-primary/20">
				<View className="flex-row items-center justify-between">
					{/* Value Display */}
					<View className="flex-1 items-center">
						<Text className="text-primary text-3xl font-bold">{value}</Text>
					</View>

					{/* Controls */}
					<View className="flex-row items-center">
						{/* Decrement Button */}
						<TouchableOpacity
							onPress={onDecrement}
							disabled={isMinDisabled}
							className={`h-12 w-12 rounded-full items-center justify-center mr-3 ${
								isMinDisabled
									? "bg-gray-100 border border-gray-200"
									: "bg-white border-2 border-primary"
							}`}
							accessibilityRole="button"
							accessibilityLabel={`Decrease ${label}`}
							accessibilityHint={`Decrease the number of ${label} by 1`}
							accessibilityState={{ disabled: isMinDisabled }}
							{...(!isMinDisabled ? decrementPress : {})}
						>
							<Ionicons
								name="remove"
								size={24}
								color={isMinDisabled ? "#9CA3AF" : "#25551B"}
							/>
						</TouchableOpacity>

						{/* Increment Button */}
						<TouchableOpacity
							onPress={onIncrement}
							disabled={isMaxDisabled}
							className={`h-12 w-12 rounded-full items-center justify-center ${
								isMaxDisabled
									? "bg-gray-100 border border-gray-200"
									: "bg-primary border-2 border-primary"
							}`}
							accessibilityRole="button"
							accessibilityLabel={`Increase ${label}`}
							accessibilityHint={`Increase the number of ${label} by 1`}
							accessibilityState={{ disabled: isMaxDisabled }}
							{...(!isMaxDisabled ? incrementPress : {})}
						>
							<Ionicons
								name="add"
								size={24}
								color={isMaxDisabled ? "#9CA3AF" : "#fff"}
							/>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</View>
	);
};

export default Counter;
