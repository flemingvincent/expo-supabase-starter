import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/image";
import { Recipe } from "@/types/recipe";
import { useAppData } from "@/context/app-data-provider";
import { getRecipeColorScheme } from "@/lib/colors";

export interface RecipeWithTags extends Recipe {
	tagIds?: string[];
}

interface MealCardProps {
	recipe: RecipeWithTags;
	onPress?: () => void;
	width?: number;
	variant?: "horizontal" | "vertical";
}

export const MealCard = ({
	recipe,
	onPress,
	width = 280,
	variant = "horizontal",
}: MealCardProps) => {
	const { tags } = useAppData();
	const colors = getRecipeColorScheme(recipe.tagIds, tags);

	return (
		<TouchableOpacity
			onPress={onPress}
			accessibilityRole="button"
			accessibilityLabel={`View ${recipe.name} meal`}
			activeOpacity={0.7}
			style={{
				width,
			}}
			className="mr-4"
		>
			<View
				style={{
					backgroundColor: colors.background,
					borderColor: colors.text,
					shadowColor: colors.text,
					height: 380,
				}}
				className="border-2 rounded-2xl p-6 justify-between"
				pointerEvents="none" // This is the key fix!
			>
				{/* Top content section */}
				<View pointerEvents="none">
					{/* Header section */}
					<View className="mb-4" pointerEvents="none">
						<Text
							style={{ color: colors.text }}
							className="text-md font-montserrat-bold tracking-wide uppercase"
						>
							MEAL RECOMMENDATION
						</Text>
					</View>

					{/* Image section */}
					<View
						style={{ backgroundColor: colors.text }}
						className={`${variant === "horizontal" ? "aspect-[4/3]" : "aspect-square"} w-full rounded-xl overflow-hidden mb-4 mx-auto`}
						pointerEvents="none"
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
					</View>

					{/* Title section */}
					<Text
						style={{ color: colors.text }}
						className="text-2xl font-montserrat-bold tracking-wide uppercase leading-tight"
						numberOfLines={3}
					>
						{recipe.name}
					</Text>
				</View>

				{/* Info badges - always at bottom */}
				<View className="flex-row justify-between items-center" pointerEvents="none">
					<View
						style={{
							backgroundColor: colors.text + "20",
							borderColor: colors.text,
						}}
						className="flex-row items-center gap-2 px-3 py-2 border rounded-xl"
					>
						<Ionicons name="star" size={16} color={colors.text} />
						<Text
							style={{ color: colors.text }}
							className="font-montserrat-bold tracking-wide uppercase"
						>
							{recipe.difficulty || "Easy"}
						</Text>
					</View>

					<View
						style={{
							backgroundColor: colors.text + "20",
							borderColor: colors.text,
						}}
						className="flex-row items-center gap-2 px-3 py-2 border rounded-xl"
					>
						<Ionicons name="time-outline" size={16} color={colors.text} />
						<Text
							style={{ color: colors.text }}
							className="font-montserrat-bold tracking-wide uppercase"
						>
							{recipe.total_time}M
						</Text>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
};