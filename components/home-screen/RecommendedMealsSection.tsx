import { View, ScrollView, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "@/config/supabase";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Recipe } from "@/types/recipe";
import { MealCard } from "./MealCard";

interface RecommendedMealsSectionProps {
	mealsPerWeek: number;
	onMealPress?: (meal: Recipe) => void;
	onSeeAllPress?: () => void;
}

export const RecommendedMealsSection = ({ 
	mealsPerWeek, 
	onMealPress,
	onSeeAllPress 
}: RecommendedMealsSectionProps) => {
	const [meals, setMeals] = useState<Recipe[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Color schemes for different meals - rotating through vibrant colors like explore page
	const mealColorSchemes = [
		{ text: "#F88675", background: "#FFC2B9" }, // Coral
		{ text: "#FFB524", background: "#FFDF9E" }, // Orange
		{ text: "#54CDC3", background: "#BEF1ED" }, // Teal
		{ text: "#6B8E23", background: "#D3E4CD" }, // Green
		{ text: "#FF6525", background: "#FFA884" }, // Orange-red
		{ text: "#4CAF50", background: "#A5D6A7" }, // Green
		{ text: "#9C27B0", background: "#CE93D8" }, // Purple
		{ text: "#FF5722", background: "#FFAB91" }, // Deep orange
	];

	const fetchRecommendedMeals = async () => {
		try {
			setLoading(true);
			setError(null);

			// Fetch recipes from Supabase - you can add filters here later for personalization
			let { data: recipes, error } = await supabase
				.from('recipe')
				.select('*')
				.limit(Math.max(mealsPerWeek, 6)); // Get at least 6 for variety

			if (error) {
				console.error('Error fetching recommended meals:', error);
				setError(error.message);
				return;
			}

			setMeals(recipes || []);
		} catch (err) {
			console.error('Unexpected error fetching meals:', err);
			setError('Failed to fetch recommended meals');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRecommendedMeals();
	}, [mealsPerWeek]);

	// Display the number of meals based on user's preference, but cap at available meals
	const displayMeals = meals.slice(0, Math.min(mealsPerWeek, meals.length));

	// Loading state
	if (loading) {
		return (
			<View className="mb-6">
				<View className="flex-row items-center justify-between mb-4 px-4">
					<Text className="text-gray-700 text-2xl font-bold tracking-wide uppercase">
						Recommended for you
					</Text>
				</View>
				
				<View className="items-center py-8 px-4">
					<View className="bg-[#D3E4CD] rounded-2xl p-6 items-center">
						<Text className="text-[#6B8E23] text-lg font-semibold mb-2">
							Finding perfect meals...
						</Text>
						<Text className="text-[#6B8E23]/80 text-center">
							Curating recommendations just for you
						</Text>
					</View>
				</View>
			</View>
		);
	}

	// Error state
	if (error) {
		return (
			<View className="mb-6">
				<View className="flex-row items-center justify-between mb-4 px-4">
					<Text className="text-gray-700 text-2xl font-bold tracking-wide uppercase">
						Recommended for you
					</Text>
				</View>
				
				<View className="items-center py-8 px-4">
					<View className="bg-[#FF6525] rounded-2xl p-6 items-center">
						<Ionicons name="alert-circle-outline" size={32} color="#FFF" className="mb-3" />
						<Text className="text-background text-lg font-semibold mb-2">
							Oops! Something went wrong
						</Text>
						<Text className="text-background/90 text-center mb-4">
							{error}
						</Text>
						<Button 
							onPress={fetchRecommendedMeals}
							size="sm"
							variant="default"
							className="bg-background"
						>
							<View className="flex-row items-center">
								<Ionicons name="refresh" size={16} color="#FF6525" className="mr-2" />
								<Text className="text-[#FF6525] font-semibold">Try Again</Text>
							</View>
						</Button>
					</View>
				</View>
			</View>
		);
	}

	return (
		<View className="mb-8">
			{/* Section Header - matching explore page style */}
			<View className="flex-row items-center justify-between mb-4 px-4">
                <View className="flex-1">
                    <Text className="text-gray-700 text-2xl uppercase font-montserrat-bold">
                        Recommended for you
                    </Text>
                    <Text className="text-gray-600 text-xl font-montserrat-semibold">
                        We picked {displayMeals.length} meals just for you
                    </Text>
                </View>
			</View>
			
			{/* Meals Scroll View */}
			{displayMeals.length > 0 ? (
				<ScrollView 
					horizontal 
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ paddingHorizontal: 16, paddingRight: 32 }}
					decelerationRate="fast"
					snapToInterval={288} // Card width + margin
					snapToAlignment="start"
				>
					{displayMeals.map((meal: Recipe, index: number) => (
						<MealCard 
							key={meal.id} 
							recipe={meal} 
							colors={mealColorSchemes[index % mealColorSchemes.length]}
							onPress={() => onMealPress?.(meal)}
						/>
					))}
				</ScrollView>
			) : (
				/* Show message if no meals available */
				<View className="items-center py-8 px-4">
					<View className="bg-gray-100 rounded-2xl p-6 items-center">
						<Ionicons name="restaurant-outline" size={32} color="#666" className="mb-3" />
						<Text className="text-gray-600 text-lg font-semibold mb-2">
							No recommendations yet
						</Text>
						<Text className="text-gray-500 text-center">
							Complete your preferences to get personalized meal suggestions
						</Text>
					</View>
				</View>
			)}
		</View>
	);
};