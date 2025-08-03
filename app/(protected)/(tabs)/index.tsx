import { View } from "react-native";
import { useAuth } from "@/context/supabase-provider";
import { SafeAreaView } from "@/components/safe-area-view";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { RecommendedMealsSection } from "@/components/home-screen/RecommendedMealsSection";

export default function Home() {
	const { profileLoading } = useAuth();

	if (profileLoading) {
		return (
			<SafeAreaView className="flex-1 bg-white" edges={["top"]}>
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

	const handleSeeAllPress = () => {
		console.log("See all pressed");
		// TODO: Navigate to explore or full recommendations page
	};

	return (
		<SafeAreaView className="flex-1 bg-white" edges={["top"]}>
			<RecommendedMealsSection
				mealsPerWeek={6} // Temporary hardcoded value
				onSeeAllPress={handleSeeAllPress}
			/>
		</SafeAreaView>
	);
}