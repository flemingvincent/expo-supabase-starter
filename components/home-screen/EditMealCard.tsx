// components/meal-card.tsx
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { usePressAnimation } from "@/hooks/onPressAnimation";
import { Image } from "@/components/image";
import { MealPlanItem } from "@/types/state";

interface MealCardProps {
	meal: MealPlanItem;
	onSwap?: (mealId: string) => void;
	onRemove?: (mealId: string) => void;
	showActions?: boolean;
	showAddButton?: boolean;
	variant?: "default" | "compact";
}

export function EditMealCard({
	meal,
	onSwap,
	onRemove,
	variant = "default",
}: MealCardProps) {
	const buttonPress = usePressAnimation({
		hapticStyle: "Medium",
		pressDistance: 4,
	});

	return (
		<View
			style={{
				backgroundColor: "#FFFFFF",
				borderWidth: 2,
				borderColor: "#EBEBEB",
				borderBottomWidth: 4,
				borderBottomColor: "#EBEBEB",
			}}
			className={`rounded-xl overflow-hidden ${
				variant === "compact" ? "max-h-24" : "max-h-32"
			}`}
		>
			<View className="flex-row">
				{/* Image Section */}
				<View
					className={`${variant === "compact" ? "w-20 h-20" : "w-28 h-28"} p-2`}
				>
					<View
						className="w-full h-full rounded-lg overflow-hidden"
						style={{
							shadowColor: "#000000",
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.1,
							shadowRadius: 4,
							elevation: 3,
						}}
					>
						{meal.recipe.image_url ? (
							<Image
								source={
									typeof meal.recipe.image_url === "string"
										? { uri: meal.recipe.image_url }
										: meal.recipe.image_url
								}
								className="w-full h-full"
								contentFit="cover"
							/>
						) : (
							<View className="w-full h-full bg-gray-100 items-center justify-center">
								<Ionicons
									name="restaurant-outline"
									size={variant === "compact" ? 24 : 32}
									color="#9CA3AF"
								/>
							</View>
						)}
					</View>
				</View>

				<View className="flex-1 p-3 pr-2 min-h-0">
					<View className="flex-row justify-between items-center h-full">
						<View className="flex-1 flex flex-col justify-between min-h-0">
							<Text
								className={`${
									variant === "compact"
										? "text-base font-montserrat-semibold"
										: "text-lg font-montserrat-semibold"
								} text-gray-900`}
								numberOfLines={variant === "compact" ? 1 : 2}
							>
								{meal.recipe.name}
							</Text>

							{(meal.recipe.total_time ?? 0) > 0 && (
								<View className="flex-row items-center gap-3">
									<View className="flex-row items-center gap-1">
										<Ionicons
											name="time-outline"
											size={variant === "compact" ? 14 : 16}
											color="#6B7280"
										/>
										<Text
											className={`${
												variant === "compact" ? "text-sm" : "text-base"
											} text-gray-600`}
										>
											{(meal.recipe.total_time ?? 0)} mins
										</Text>
									</View>
								</View>
							)}
						</View>

                        <View className="flex-col justify-center pl-2 gap-1">
                            {onRemove && (
                                <TouchableOpacity
                                    className="bg-red-50 p-2 rounded-lg"
                                    onPress={() => onRemove(meal.id)}
                                    {...buttonPress}
                                >
                                    <Ionicons name="close" size={18} color="#DC2626" />
                                </TouchableOpacity>
                            )}
                        </View>
					</View>
				</View>
			</View>
		</View>
	);
}
