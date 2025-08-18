import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/image";
import { Recipe, RecipeWithTags } from "@/types/recipe";
import { useAppData } from "@/context/app-data-provider";
import { getRecipeColorScheme } from "@/lib/colors";
import * as Haptics from 'expo-haptics';

interface MealCardProps {
	recipe: RecipeWithTags;
	onPress?: () => void;
	width?: number;
	variant?: "horizontal" | "vertical";
}

export const MealCard = ({
	recipe,
	onPress,
	width = 320,
	variant = "horizontal",
}: MealCardProps) => {
	const { tags } = useAppData();
	const colors = getRecipeColorScheme(recipe.tagIds, tags);

	const handlePress = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		onPress?.();
	};

	return (
		<Pressable
			onPress={handlePress}
			accessibilityRole="button"
			accessibilityLabel={`View ${recipe.name} meal`}
			style={{
				width,
			}}
			className="mr-4"
		>
			{({ pressed }) => (
				<View
					style={{
						backgroundColor: "#FFFFFF",
						height: 380,
						// Thick bottom border instead of shadow for better visibility
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
									typeof recipe.image_url === "string"
										? { uri: recipe.image_url }
										: recipe.image_url
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
					<View className="flex-1 p-4">
						{/* Stats Pills - matching your detail page style */}
						<View className="flex-row gap-2 mb-3">
							<View
								style={{
									borderColor: colors.text,
									backgroundColor: colors.background,
									shadowColor: colors.text,
								}}
								className="flex-row items-center gap-1 px-2 py-1 border rounded-full shadow-[0px_1px_0px_0px]"
							>
								<Ionicons name="star" size={12} color={colors.text} />
								<Text
									style={{ color: colors.text }}
									className="text-xs font-montserrat-bold"
								>
									{recipe.difficulty || "Easy"}
								</Text>
							</View>

							{recipe.total_time && (
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
										{recipe.total_time}m
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
								{recipe.name}
							</Text>
							
							{recipe.description && (
								<Text
									className="text-sm font-montserrat-medium text-gray-500 mt-2 leading-5"
									numberOfLines={2}
								>
									{recipe.description}
								</Text>
							)}
						</View>

						{/* Bottom Section */}
						{/* <View className="space-y-3">
							<View
								style={{
									backgroundColor: "#CCEA1F",
									borderColor: "#25551b",
									shadowColor: "#25551b",
								}}
								className="flex-row items-center justify-center gap-2 px-3 py-2 border rounded-xl shadow-[0px_2px_0px_0px]"
							>
								<Ionicons name="flash" size={16} color="#25551b" />
								<Text
									style={{ color: "#25551b" }}
									className="font-montserrat-bold text-sm tracking-wide uppercase"
								>
									98% Match
								</Text>
							</View>
						</View> */}
					</View>
				</View>
			)}
		</Pressable>
	);
};