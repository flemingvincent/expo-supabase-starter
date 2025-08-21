import { View, Pressable, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/image";
import { useAppData } from "@/context/app-data-provider";
import { getRecipeColorScheme } from "@/lib/colors";
import { usePressAnimation } from "@/hooks/onPressAnimation";
import * as Haptics from 'expo-haptics';
import { MealPlanItem } from "@/types/database";

interface MealCardProps {
	recipe: MealPlanItem;
	onPress?: () => void;
	onServingsChange?: (mealId: string, servings: number) => void;
	width?: number;
	variant?: "horizontal" | "vertical";
	showServingsEditor?: boolean;
	weekStatus?: 'past' | 'current' | 'future';
}

export const MealCard = ({
	recipe,
	onPress,
	onServingsChange,
	width = 320,
	variant = "horizontal",
	showServingsEditor = false,
	weekStatus = 'current',
}: MealCardProps) => {
	const { tags } = useAppData();
	const colors = getRecipeColorScheme(recipe.recipe.tagIds, tags);
	
	const buttonPress = usePressAnimation({
		hapticStyle: "Medium",
		pressDistance: 2,
	});

	const handlePress = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		onPress?.();
	};

	const handleServingsDecrease = () => {
		if (recipe.servings > 1 && onServingsChange) {
			onServingsChange(recipe.id, recipe.servings - 1);
		}
	};

	const handleServingsIncrease = () => {
		if (onServingsChange) {
			onServingsChange(recipe.id, recipe.servings + 1);
		}
	};

	const canEditServings = showServingsEditor && (weekStatus === 'current' || weekStatus === 'future');

	return (
		<Pressable
			onPress={handlePress}
			accessibilityRole="button"
			accessibilityLabel={`View ${recipe.recipe.name} meal`}
			style={{
				width,
			}}
			className="mr-4"
		>
			{({ pressed }) => (
				<View
					style={{
						backgroundColor: "#FFFFFF",
						height: canEditServings ? 420 : 380,
						borderWidth: 2,
						borderColor: "#EBEBEB",
						borderBottomWidth: pressed ? 2 : 6,
						borderBottomColor: "#EBEBEB",
						transform: [{ translateY: pressed ? 4 : 0 }],
					}}
					className="rounded-2xl overflow-hidden"
				>
					{/* Recipe Image */}
					<View className="relative p-2">
						<View
							className={`${variant === "horizontal" ? "aspect-[4/3]" : "aspect-square"} w-full overflow-hidden rounded-xl`}
							style={{
								shadowColor: "#000000",
								shadowOffset: { width: 0, height: 0 },
								shadowOpacity: 0.3,
								shadowRadius: 8,
								elevation: 8,
							}}
						>
							<Image
								source={
									typeof recipe.recipe.image_url === "string"
										? { uri: recipe.recipe.image_url }
										: recipe.recipe.image_url
								}
								className="w-full h-full"
								contentFit="cover"
							/>
							
							{/* Inner shadow overlay */}
							<View
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									shadowColor: "#000000",
									shadowOffset: { width: 0, height: 0 },
									shadowOpacity: 0.4,
									shadowRadius: 12,
									backgroundColor: 'transparent',
								}}
								className="rounded-xl"
								pointerEvents="none"
							/>
							
							{/* Alternative inner shadow using border gradient effect */}
							<View
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									borderWidth: 1,
									borderColor: 'rgba(0, 0, 0, 0.1)',
								}}
								className="rounded-xl"
								pointerEvents="none"
							/>
						</View>

						{/* Favorite Button Overlay */}
						<View
							style={{
								backgroundColor: "#FFFFFF",
								borderColor: "#EBEBEB",
								position: 'absolute',
								top: 12,
								right: 12,
							}}
							className="w-8 h-8 rounded-lg border items-center justify-center"
							pointerEvents="none"
						>
							<Ionicons name="heart-outline" size={16} color="#25551b" />
						</View>
					</View>

					{/* Content Section */}
					<View className={`flex-1 p-4 ${canEditServings ? 'pb-2' : ''}`}>
						{/* Stats Pills - matching your detail page style */}
						<View className="flex-row gap-2 mb-3">
							{recipe.recipe.total_time && (
								<View
									style={{
										borderColor: colors.text,
										backgroundColor: colors.background,
										shadowColor: colors.text,
									}}
									className="flex-row items-center gap-1 px-2 py-1 border rounded-full shadow-[0px_1px_0px_0px]"
								>
									<Ionicons name="time-outline" size={12} color={colors.text} />
									<Text
										style={{ color: colors.text }}
										className="text-xs font-montserrat-bold"
									>
										{recipe.recipe.total_time}m
									</Text>
								</View>
							)}
						</View>

						{/* Recipe Title */}
						<View className="flex-1 mb-3">
							<Text
								className="text-xl font-montserrat-bold text-gray-700 leading-tight"
								numberOfLines={2}
							>
								{recipe.recipe.name}
							</Text>
							
							{recipe.recipe.description && (
								<Text
									className="text-sm font-montserrat-medium text-gray-500 mt-2 leading-5"
									numberOfLines={canEditServings ? 1 : 2}
								>
									{recipe.recipe.description}
								</Text>
							)}
						</View>

						{/* Servings Display for Past Weeks */}
						{!canEditServings && showServingsEditor && (
							<View className="mt-2">
								<View className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
									<Text className="text-center text-sm font-montserrat-semibold text-gray-600">
										{recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}
									</Text>
								</View>
							</View>
						)}
					</View>

					{/* Servings Editor for Current/Future Weeks */}
					{canEditServings && (
						<View className="px-4 pb-3">
                            <View className="flex-row items-center justify-between bg-gray-100 rounded-lg px-3 py-2">
                                <Text className="text-sm font-montserrat-semibold text-gray-700">
                                    Servings
                                </Text>
                                
                                <View className="flex-row items-center bg-gray-50 rounded-lg p-1">
                                    <TouchableOpacity
                                        onPress={handleServingsDecrease}
                                        disabled={recipe.servings <= 1}
                                        className={`w-8 h-8 rounded-md items-center justify-center ${
                                            recipe.servings <= 1 ? 'bg-gray-200' : 'bg-white border border-gray-200'
                                        }`}
                                        {...buttonPress}
                                    >
                                        <Ionicons 
                                            name="remove" 
                                            size={16} 
                                            color={recipe.servings <= 1 ? "#9CA3AF" : "#374151"} 
                                        />
                                    </TouchableOpacity>
                                    
                                    <View className="w-12 items-center">
                                        <Text className="text-base font-montserrat-semibold text-gray-900">
                                            {recipe.servings}
                                        </Text>
                                    </View>
                                    
                                    <TouchableOpacity
                                        onPress={handleServingsIncrease}
                                        className="w-8 h-8 rounded-md bg-white border border-gray-200 items-center justify-center"
                                        {...buttonPress}
                                    >
                                        <Ionicons name="add" size={16} color="#374151" />
                                    </TouchableOpacity>
                                </View>
                            </View>
						</View>
					)}
				</View>
			)}
		</Pressable>
	);
};