import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/image";
import { Recipe } from "@/types/recipe";

interface MealCardProps {
	recipe: Recipe;
	colors: { text: string; background: string };
	onPress?: () => void;
	width?: number;
	variant?: 'horizontal' | 'vertical';
}

export const MealCard = ({ 
	recipe, 
	colors, 
	onPress, 
	width = 280,
	variant = 'horizontal'
}: MealCardProps) => {
	return (
		<TouchableOpacity
			style={{ backgroundColor: colors.background, width }}
			className="p-4 rounded-xl mr-4"
			onPress={onPress}
			accessibilityRole="button"
			accessibilityLabel={`View ${recipe.name} meal`}
			activeOpacity={0.7}
		>
			<View className="min-h-[280px] flex-1 justify-between">
				{/* Top section */}
				<View>
					<Text 
						style={{ color: colors.text }}
						className="text-xl font-montserrat-semibold uppercase mb-2 leading-tight"
					>
						MEAL
					</Text>

					<View 
						style={{ backgroundColor: colors.text }}
						className={`${variant === 'horizontal' ? 'aspect-[4/3]' : 'aspect-square'} rounded-lg overflow-hidden mb-3`}
					>
						<Image
							source={typeof recipe.image_url === 'string' ? { uri: recipe.image_url } : recipe.image_url}
							className="w-full h-full"
							contentFit="cover"
						/>
					</View>

					<Text 
						className="text-background text-2xl font-montserrat-bold tracking-wide uppercase leading-tight"
						numberOfLines={3}
						style={{ lineHeight: 28 }}
					>
						{recipe.name}
					</Text>
				</View>

				{/* Bottom section - always pinned to bottom */}
				<View className="flex-row justify-between items-end mt-3">
					<View className="flex-row items-center gap-1">
						<Ionicons name="star" size={20} color={colors.text} />
						<Text 
							style={{ color: colors.text }}
							className="text-lg font-montserrat-semibold"
						>
							{recipe.difficulty || "Easy"}
						</Text>
					</View>
					<View className="flex-row items-center gap-1">
						<Ionicons name="time-outline" size={20} color={colors.text} />
						<Text 
							style={{ color: colors.text }}
							className="text-lg font-montserrat-semibold"
						>
							{recipe.total_time} mins
						</Text>
					</View>
				</View>
			</View>

				{/* Additional meal-specific info */}
				{/* {recipe.serves && (
					<View className="flex-row items-center gap-1 mt-2">
						<Ionicons name="people-outline" size={16} color={colors.text} />
						<Text 
							style={{ color: colors.text }}
							className="text-sm font-montserrat-semibold"
						>
							Serves {recipe.serves}
						</Text>
					</View>
				)} */}
		</TouchableOpacity>
	);
};