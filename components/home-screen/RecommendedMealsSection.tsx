import { View, ScrollView, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { supabase } from "@/config/supabase";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Recipe } from "@/types/recipe";
import { MealCard } from "./MealCard";
import { usePressAnimation } from "@/hooks/onPressAnimation";

interface RecommendedMealsSectionProps {
	mealsPerWeek: number;
	onSeeAllPress?: () => void;
}
interface RecipeWithTags extends Recipe {
	tagIds?: string[];
}

export const RecommendedMealsSection = ({
	mealsPerWeek,
	onSeeAllPress,
}: RecommendedMealsSectionProps) => {
	const router = useRouter();
	const [meals, setMeals] = useState<RecipeWithTags[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const buttonPress = usePressAnimation({
		hapticStyle: "Medium",
		pressDistance: 4,
	});

	const headerColorSchemes = [
		{ text: "#6B7280", background: "#F9FAFB", accent: "#FF6525" },
		{ text: "#6B7280", background: "#F9FAFB", accent: "#54CDC3" },
		{ text: "#6B7280", background: "#F9FAFB", accent: "#FFB524" },
		{ text: "#6B7280", background: "#F9FAFB", accent: "#F88675" },
	];

	const currentHeaderScheme =
		headerColorSchemes[new Date().getDay() % headerColorSchemes.length];

	const fetchRecommendedMeals = async () => {
		try {
			setLoading(true);
			setError(null);

			// Fetch all recipes with their associated tag_ids from the junction table
			let { data: recipes, error } = await supabase
				.from("recipe")
				.select(
					`
				*,
				recipe_tags(
					tag_id
				)
			`,
				)
				.limit(Math.max(mealsPerWeek, 6));

			if (error) {
				console.error("Error fetching recommended meals:", error);
				setError(error.message);
				return;
			}

			// Transform the data to extract just the tag_ids
			const recipesWithTags =
				recipes?.map((recipe) => ({
					...recipe,
					tagIds:
						recipe.recipe_tags?.map((rt: any) => rt.tag_id).filter(Boolean) ||
						[],
				})) || [];

			console.log("Fetched recipes with tags:", recipesWithTags);
			setMeals(recipesWithTags);
		} catch (err) {
			console.error("Unexpected error fetching meals:", err);
			setError("Failed to fetch recommended meals");
		} finally {
			setLoading(false);
		}
	};

	// Handle meal press navigation
	const handleMealPress = (meal: Recipe) => {
		console.log("pressed meal:", meal.name);
		router.push(`/recipe/${meal.id}`);
	};

	useEffect(() => {
		fetchRecommendedMeals();
	}, [mealsPerWeek]);

	const displayMeals = meals.slice(0, Math.min(mealsPerWeek, meals.length));

	// Enhanced loading state with bold energy
	if (loading) {
		return (
			<View className="mb-6">
				{/* Toned Down Header */}
				<View
					style={{
						backgroundColor: "#F9FAFB",
						borderColor: "#E5E7EB",
					}}
					className="mx-4 mb-6 border rounded-2xl p-6"
				>
					<View className="flex-row items-center justify-between">
						<View className="flex-1">
							<Text className="text-gray-500 text-sm font-montserrat-bold tracking-wide uppercase mb-1">
								MEAL RECOMMENDATIONS
							</Text>
							<Text className="text-gray-700 text-2xl font-montserrat-bold">
								Curating your perfect meals
							</Text>
						</View>
						<View
							style={{
								backgroundColor: currentHeaderScheme.accent + "15",
							}}
							className="w-12 h-12 rounded-xl items-center justify-center"
						>
							<Ionicons
								name="restaurant"
								size={24}
								color={currentHeaderScheme.accent}
							/>
						</View>
					</View>
				</View>

				{/* Loading Cards Preview */}
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ paddingHorizontal: 16, paddingRight: 32 }}
				>
					{[0, 1, 2].map((index) => {
                        const defaultColors = [
							{ text: "#F88675", background: "#FFE5E1" },
							{ text: "#FFB524", background: "#FFF2D6" },
							{ text: "#54CDC3", background: "#E8F9F7" },
						];
						const colors = defaultColors[index];

						return (
                            <View
                                key={index}
                                style={{
                                    backgroundColor: colors.background,
                                    borderColor: colors.text,
                                    width: 280,
                                }}
                                className="mr-4 border-2 rounded-2xl p-6 h-[380px] justify-center items-center"
                            >
                                <View
                                    style={{ backgroundColor: colors.text + "20" }}
                                    className="w-16 h-16 rounded-xl mb-4 items-center justify-center"
                                >
                                    <Ionicons
                                        name="restaurant-outline"
                                        size={32}
                                        color={colors.text}
                                    />
                                </View>
                                <Text
                                    style={{ color: colors.text }}
                                    className="font-montserrat-bold tracking-wide uppercase text-center"
                                >
                                    FINDING PERFECT MEAL
                                </Text>
                            </View>
                        );
					})}
				</ScrollView>
			</View>
		);
	}

	// Enhanced error state
	if (error) {
		return (
			<View className="mb-6">
				<View
					style={{
						backgroundColor: "#FFE0D1",
						borderColor: "#FF6525",
						shadowColor: "#FF6525",
					}}
					className="mx-4 mb-6 border-2 rounded-2xl p-6 shadow-[0px_4px_0px_0px]"
				>
					<View className="flex-row items-center mb-4">
						<View className="bg-[#FF6525] w-12 h-12 rounded-xl items-center justify-center mr-4">
							<Ionicons name="alert-circle" size={24} color="#FFF" />
						</View>
						<View className="flex-1">
							<Text className="text-[#FF6525] text-md font-montserrat-bold tracking-wide uppercase mb-1">
								OOPS! SOMETHING WENT WRONG
							</Text>
							<Text className="text-[#FF6525] text-lg font-montserrat-bold tracking-wide uppercase">
								Can't load your meals
							</Text>
						</View>
					</View>

					<Text className="text-[#FF6525]/80 text-center mb-4">{error}</Text>

					<Button
						onPress={fetchRecommendedMeals}
						variant="outline"
						className="border-[#FF6525] bg-transparent"
						{...buttonPress}
					>
						<View className="flex-row items-center">
							<Ionicons
								name="refresh"
								size={16}
								color="#FF6525"
								className="mr-2"
							/>
							<Text className="text-[#FF6525] font-montserrat-bold tracking-wide uppercase">
								Try Again
							</Text>
						</View>
					</Button>
				</View>
			</View>
		);
	}

	return (
		<View className="mb-8">
			{/* Toned Down Section Header */}
			<View
				style={{
					backgroundColor: currentHeaderScheme.background,
					borderColor: "#E5E7EB",
				}}
				className="mx-4 mb-6 border rounded-2xl p-6"
			>
				<View className="flex-row items-center justify-between">
					<View className="flex-1">
						<Text
							style={{ color: currentHeaderScheme.accent }}
							className="text-sm font-montserrat-bold tracking-wide uppercase mb-1"
						>
							MEAL RECOMMENDATIONS
						</Text>
						<Text
							style={{ color: currentHeaderScheme.text }}
							className="text-2xl font-montserrat-bold"
						>
							{displayMeals.length} meals picked for you
						</Text>
					</View>
					<TouchableOpacity
						onPress={onSeeAllPress}
						style={{
							backgroundColor: currentHeaderScheme.accent + "15",
						}}
						className="w-10 h-10 rounded-lg items-center justify-center"
						activeOpacity={0.7}
					>
						<Ionicons
							name="arrow-forward"
							size={20}
							color={currentHeaderScheme.accent}
						/>
					</TouchableOpacity>
				</View>
			</View>

			{/* Meals Scroll View */}
			{displayMeals.length > 0 ? (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{
						paddingHorizontal: 16,
						paddingRight: 32,
						paddingBottom: 20,
					}}
					decelerationRate="fast"
					snapToInterval={288}
					snapToAlignment="start"
				>
					{displayMeals.map((meal: Recipe, index: number) => (
						<MealCard
							key={meal.id}
							recipe={meal}
							onPress={() => handleMealPress(meal)}
						/>
					))}
				</ScrollView>
			) : (
				/* Enhanced empty state */
				<View
					style={{
						backgroundColor: "#EBF3E7",
						borderColor: "#6B8E23",
						shadowColor: "#6B8E23",
					}}
					className="mx-4 border-2 rounded-2xl p-6 shadow-[0px_4px_0px_0px] items-center"
				>
					<View className="bg-[#6B8E23] w-16 h-16 rounded-xl items-center justify-center mb-4">
						<Ionicons name="restaurant-outline" size={32} color="#FFF" />
					</View>
					<Text className="text-[#6B8E23] text-xl font-montserrat-bold tracking-wide uppercase mb-2 text-center">
						No recommendations yet
					</Text>
					<Text className="text-[#6B8E23]/80 text-center font-montserrat-semibold">
						Complete your preferences to get personalized meal suggestions
					</Text>
				</View>
			)}

			{/* Enhanced Action Buttons */}
			<View className="px-4 flex-1 gap-4 mt-6">
				<Button
					variant="outline"
					accessibilityRole="button"
					accessibilityLabel="Change meals"
					accessibilityHint="Proceed to change your meal preferences"
					className="border-2"
					{...buttonPress}
				>
					<Text className="uppercase">Change meals</Text>
				</Button>
				<Button
					variant="default"
					accessibilityRole="button"
					accessibilityLabel="Add ingredients to cart"
					accessibilityHint="Add ingredients for the selected meals to your cart"
					{...buttonPress}
				>
					<Text>Add ingredients to cart</Text>
				</Button>
			</View>
		</View>
	);
};
