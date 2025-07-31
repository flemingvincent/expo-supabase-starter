import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/image";
import { Recipe } from "@/types/recipe";
import { Ionicons } from "@expo/vector-icons";

const MealItemCard = ({recipe}: {recipe: Recipe}) => {
    const porkColors = {
        text: "#F88675",
        background: "#FFC2B9",
    }

    const fishColors = {
        text: "#54CDC3",
        background: "#BEF1ED",
    }

    const chickenColors = {
        text: "#FFB524",
        background: "#FFDF9E",
    }

    const beefColors = {
        text: "#FF6525",
        background: "#FFA884",
    }

    const vegetarianColors = {
        text: "#6B8E23",
        background: "#D3E4CD",
    }

    const veganColors = {
        text: "#4CAF50",
        background: "#A5D6A7",
    }

    const randomizeColors = () => {
        const colors = [porkColors, fishColors, chickenColors, beefColors, vegetarianColors, veganColors];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const colors = randomizeColors();

	return (
		<TouchableOpacity
			style={{ backgroundColor: colors.background }}
			className="p-6 rounded-xl shadow-lg mb-6"
			accessibilityRole={"button"}
			accessibilityLabel={`View ${recipe.name} recipe`}
		>
			<View>
				{/* Title */}
                <Text 
					style={{ color: colors.text }}
					className="text-xl font-semibold uppercase mb-3 leading-tight"
				>
					PORK
				</Text>

                <View 
					style={{ backgroundColor: colors.text, boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.25)' }}
                    
					className="aspect-[4/3] rounded-lg overflow-hidden mb-2 p-6"
				>
                    <Image
                        source={typeof recipe.image_url === 'string' ? { uri: recipe.image_url } : recipe.image_url}
                        className="w-full h-full"
                        contentFit="cover"
                    />
                </View>

                <Text className="text-background text-3xl font-bold tracking-widest uppercase my-2 leading-tight">
					{recipe.name}
				</Text>

                <View className="flex-row justify-between items-center gap-2">
                    <View className="flex-row items-center gap-2">
                        <Ionicons name="star" size={18} color={colors.text} />
                        <Text 
							style={{ color: colors.text }}
							className="text-lg font-semibold"
						>
                            {recipe.difficulty} Easy
                        </Text>
					</View>
                    <View className="flex-row items-center gap-2">
                        <Ionicons name="list-outline" size={18} color={colors.text} />
                        <Text 
							style={{ color: colors.text }}
							className="text-lg font-semibold"
						>
                            5 ingredients
                        </Text>
					</View>
                    <View className="flex-row items-center gap-2">
                        <Ionicons name="time-outline" size={18} color={colors.text} />
                        <Text 
							style={{ color: colors.text }}
							className="text-lg font-semibold"
						>
                            {recipe.total_time} mins
                        </Text>
					</View>
				</View>
            </View>
		</TouchableOpacity>
	);
};

export default MealItemCard;