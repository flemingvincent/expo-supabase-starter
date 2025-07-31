import { View, ScrollView } from "react-native";
import { useAuth } from "@/context/supabase-provider";
import { useAppData } from "@/context/app-data-provider";
import { SafeAreaView } from "@/components/safe-area-view";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Recipe } from "@/types/recipe";
import { RecommendedMealsSection } from "@/components/home-screen/RecommendedMealsSection";
import { supabase } from "@/config/supabase";

export default function Home() {
	const { profile, profileLoading } = useAuth();
	const { userPreferences } = useAppData();

	if (profileLoading) {
		return (
			<SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
				<View className="flex-1 items-center justify-center">
					<View className="bg-[#FFB524] rounded-2xl p-8 items-center shadow-lg">
						<Text className="text-background text-2xl font-bold tracking-wider uppercase mb-4">
							LOADING
						</Text>
						<Text className="text-background/80 text-lg">Getting your meal plan ready...</Text>
					</View>
				</View>
			</SafeAreaView>
		);
	}

	const handleMealPress = (meal: Recipe) => {
		console.log("Meal pressed:", meal.name);
		// TODO: Navigate to meal details
	};

	const handleSeeAllPress = () => {
		console.log("See all pressed");
		// TODO: Navigate to explore or full recommendations page
	};

	return (
		<SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
			<ScrollView 
				className="flex-1"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 20 }}
			>
				{/* Header Section */}
				<View className="px-4 pb-4">
					<Text className="text-gray-900 text-3xl font-bold tracking-wide font-montserrat-bold">
						Hi {profile?.display_name || 'there'}!
					</Text>
				</View>

				{/* Recommended Meals Section */}
				<RecommendedMealsSection
					// mealsPerWeek={userPreferences?.meals_per_week ?? 3}
                    mealsPerWeek={6} // Temporary hardcoded value
					onMealPress={handleMealPress}
					onSeeAllPress={handleSeeAllPress}
				/>
			</ScrollView>
		</SafeAreaView>
	);
}