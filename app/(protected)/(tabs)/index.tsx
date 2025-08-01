import { View, ScrollView } from "react-native";
import { useAuth } from "@/context/supabase-provider";
import { useAppData } from "@/context/app-data-provider";
import { SafeAreaView } from "@/components/safe-area-view";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Recipe } from "@/types/recipe";
import { RecommendedMealsSection } from "@/components/home-screen/RecommendedMealsSection";
import { supabase } from "@/config/supabase";
import { usePressAnimation } from "@/hooks/onPressAnimation";

export default function Home() {
	const { profile, profileLoading } = useAuth();
	const { userPreferences } = useAppData();

	// Header color schemes that rotate
	const headerColorSchemes = [
		{ text: "#FF6525", background: "#FFE0D1" },
		{ text: "#54CDC3", background: "#E8F9F7" },
		{ text: "#FFB524", background: "#FFF2D6" },
		{ text: "#F88675", background: "#FFE5E1" },
	];
	
	const currentHeaderScheme = headerColorSchemes[new Date().getDay() % headerColorSchemes.length];

	if (profileLoading) {
		return (
			<SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
				<View className="flex-1 items-center justify-center px-4">
					<View 
						style={{ 
							backgroundColor: "#FFF2D6",
							borderColor: "#FFB524",
							shadowColor: "#FFB524",
						}}
						className="border-2 rounded-2xl p-8 items-center shadow-[0px_4px_0px_0px] w-full max-w-sm"
					>
						<View className="bg-[#FFB524] w-16 h-16 rounded-xl items-center justify-center mb-6">
							<Ionicons name="restaurant" size={32} color="#FFF" />
						</View>
						<Text className="text-[#FFB524] text-xl font-montserrat-bold tracking-wider uppercase mb-4 text-center">
							Getting your meal plan ready
						</Text>
						<Text className="text-[#FFB524]/80 text-lg font-montserrat-semibold text-center">
							Just a moment while we prepare everything...
						</Text>
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

	// Get greeting based on time of day
	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return "Good morning";
		if (hour < 17) return "Good afternoon";
		return "Good evening";
	};

	const greeting = getGreeting();
	const userName = profile?.display_name || "there";

	return (
		<SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 20 }}
			>
				{/* Simple Header Section */}
				{/* <View className="px-4 pb-6">
					<Text className="text-gray-900 text-lg font-montserrat-semibold mb-1">
						{greeting}
					</Text>
					<Text className="text-gray-900 text-2xl font-montserrat-bold tracking-wide">
						{userName}!
					</Text>
				</View> */}

				{/* Recommended Meals Section */}
				<RecommendedMealsSection
					mealsPerWeek={6} // Temporary hardcoded value
					onSeeAllPress={handleSeeAllPress}
				/>
			</ScrollView>
		</SafeAreaView>
	);
}