// app/swap-meals.tsx
import { View, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/context/app-data-provider";
import { usePressAnimation } from "@/hooks/onPressAnimation";
import { Image } from "@/components/image";

export default function MealPlannerScreen() {
	const router = useRouter();
	const params = useLocalSearchParams();
	const { weekId, weekStart, weekEnd, displayRange } = params;
	
	const {
		recommendedMeals,
		recipes,
		getWeekById,
		loading,
		error
	} = useAppData();
	
	const buttonPress = usePressAnimation({
		hapticStyle: "Medium",
		pressDistance: 4,
	});
	
	const selectedWeek = weekId ? getWeekById(weekId as string) : null;
	
	const [selectedMeals, setSelectedMeals] = useState(recommendedMeals);
	const [hasChanges, setHasChanges] = useState(false);
	
	useEffect(() => {
		setSelectedMeals(recommendedMeals);
	}, [recommendedMeals]);
	
	const handleBack = () => {
		if (hasChanges) {
			// TODO: Add confirmation dialog
			router.back();
		} else {
			router.back();
		}
	};
	
	const handleSaveChanges = () => {
		// TODO: Save changes to database
		console.log("Saving changes for week:", weekId);
		router.back();
	};
	
	if (loading) {
		return (
			<SafeAreaView className="flex-1 bg-background">
				<View className="flex-1 justify-center items-center">
					<Text className="text-lg font-montserrat-semibold text-gray-600">
						Loading meals...
					</Text>
				</View>
			</SafeAreaView>
		);
	}
	
	if (error) {
		return (
			<SafeAreaView className="flex-1 bg-background">
				<View className="flex-1 justify-center items-center px-6">
					<View className="bg-[#FF6525] w-16 h-16 rounded-xl items-center justify-center mb-4">
						<Ionicons name="alert-circle" size={32} color="#FFF" />
					</View>
					<Text className="text-xl font-montserrat-bold text-[#FF6525] mb-2">
						Something went wrong
					</Text>
					<Text className="text-center text-gray-600 mb-4">
						{error.message}
					</Text>
					<Button
						onPress={handleBack}
						variant="outline"
						className="border-[#FF6525]"
						{...buttonPress}
					>
						<Text className="text-[#FF6525] font-montserrat-semibold">
							Go Back
						</Text>
					</Button>
				</View>
			</SafeAreaView>
		);
	}
	
	return (
		<SafeAreaView className="flex-1 bg-white">
			<View className="bg-white border-b border-gray-200">
				<View className="flex-row items-center justify-between px-4 py-3">
					<TouchableOpacity
						onPress={handleBack}
						className="p-2"
						{...buttonPress}
					>
						<Ionicons name="arrow-back" size={24} color="#374151" />
					</TouchableOpacity>
					
					<Text className="text-lg font-montserrat-bold text-gray-900">
						Swap Meals
					</Text>
					
					<TouchableOpacity
						onPress={handleSaveChanges}
						disabled={!hasChanges}
						className="p-2"
						{...buttonPress}
					>
						<Text 
							className={`font-montserrat-semibold ${
								hasChanges ? 'text-primary' : 'text-gray-400'
							}`}
						>
							Save
						</Text>
					</TouchableOpacity>
				</View>
				
				<View className="px-4 pb-4">
					<View
						style={{
							backgroundColor: "#CCEA1F",
							borderColor: "#25551b",
							shadowColor: "#25551b",
						}}
						className="py-4 px-4 border-2 rounded-xl shadow-[0px_2px_0px_0px]"
					>
						<View className="flex-row items-center justify-between">
							<View>
								<Text 
									className="text-xs font-montserrat-bold mb-1"
									style={{ color: "#25551b" }}
								>
									{selectedWeek?.displayTitle || 'Selected Week'}
								</Text>
								<Text 
									className="text-lg font-montserrat-semibold"
									style={{ color: "#25551b" }}
								>
									{selectedWeek?.display_range || displayRange}
								</Text>
							</View>
							<View className="bg-[#25551b]/10 px-3 py-1 rounded-lg">
								<Text className="text-[#25551b] font-montserrat-semibold">
									{selectedMeals.length} meals
								</Text>
							</View>
						</View>
					</View>
				</View>
			</View>
			
			<ScrollView 
				className="flex-1"
				showsVerticalScrollIndicator={false}
			>
				<View className="px-4 pt-4">
					<Text className="text-lg font-montserrat-bold text-gray-900 mb-3">
						Your Selected Meals ({selectedMeals.length})
					</Text>
					
					{selectedMeals.length > 0 ? (
						<View className="flex flex-col gap-2">
							{selectedMeals.map((meal) => (
								<View
									key={meal.id}
									style={{
										backgroundColor: "#FFFFFF",
										borderWidth: 2,
										borderColor: "#EBEBEB",
										borderBottomWidth: 4,
										borderBottomColor: "#EBEBEB",
									}}
									className="rounded-xl overflow-hidden"
								>
									<View className="flex-row">
										<View className="w-28 h-28 p-2">
											<View 
												className="w-full h-full rounded-lg overflow-hidden"
												style={{
													shadowColor: "#000000",
													shadowOffset: { width: 0, height: 2 },
													shadowOpacity: 0.1,
													shadowRadius: 4,
													elevation: 3,
												}}
											>
												{meal.image_url && (
													<Image
														source={
															typeof meal.image_url === "string"
																? { uri: meal.image_url }
																: meal.image_url
														}
														className="w-full h-full"
														contentFit="cover"
													/>
												)}
												{!meal.image_url && (
													<View className="w-full h-full bg-gray-100 items-center justify-center">
														<Ionicons name="restaurant-outline" size={32} color="#9CA3AF" />
													</View>
												)}
											</View>
										</View>
										
										{/* Content Section */}
										<View className="flex-1 p-3 pr-2">
											<View className="flex-row justify-between items-start">
												<View className="flex-1">
													<Text className="text-lg font-montserrat-semibold text-gray-900 mb-1" numberOfLines={2}>
														{meal.name}
													</Text>
													<View className="flex-row items-center gap-3">
														<View className="flex-row items-center gap-1">
															<Ionicons name="time-outline" size={16} color="#6B7280" />
															<Text className="text-base text-gray-600">
																{(meal.prep_time || 0) + (meal.cook_time || 0)} min
															</Text>
														</View>
													</View>
												</View>
												
												{/* Action Buttons */}
												{/* <View className="flex-col-reverse pl-2 gap-1">
													<TouchableOpacity
														className="bg-gray-100 p-2 rounded-lg"
														{...buttonPress}
													>
														<Ionicons name="swap-horizontal" size={18} color="#374151" />
													</TouchableOpacity>
													<TouchableOpacity
														className="bg-red-50 p-2 rounded-lg"
														{...buttonPress}
													>
														<Ionicons name="close" size={18} color="#DC2626" />
													</TouchableOpacity>
												</View> */}
											</View>
										</View>
									</View>
								</View>
							))}
						</View>
					) : (
						<View className="bg-gray-50 rounded-xl p-6 items-center">
							<Ionicons name="restaurant-outline" size={48} color="#9CA3AF" />
							<Text className="text-gray-600 font-montserrat-semibold mt-3">
								No meals selected for this week
							</Text>
							<Text className="text-gray-500 text-sm mt-1 text-center">
								Browse recipes below to add meals
							</Text>
						</View>
					)}
				</View>
				
				{/* Divider */}
				<View className="h-px bg-gray-200 mx-4 my-6" />
				
				{/* Available Recipes Section */}
				<View className="px-4 pb-6">
					<Text className="text-lg font-montserrat-bold text-gray-900 mb-3">
						Available Recipes
					</Text>
					
					{/* Placeholder for recipes grid */}
					<View className="bg-gray-50 rounded-xl p-6 items-center">
						<Text className="text-gray-600 font-montserrat-semibold">
							Recipe selection coming soon
						</Text>
						<Text className="text-gray-500 text-sm mt-1 text-center">
							{recipes.length} recipes available
						</Text>
					</View>
				</View>
			</ScrollView>
            <View className="bg-white border-t border-gray-200 px-4 py-3">
                <View className="flex-row gap-3">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onPress={handleBack}
                        {...buttonPress}
                    >
                        <Text className="font-montserrat-semibold">Cancel</Text>
                    </Button>
                    <Button
                        variant="default"
                        className="flex-1"
                        onPress={handleSaveChanges}
                        {...buttonPress}
                    >
                        <Text className="font-montserrat-semibold">
                            Save Changes
                        </Text>
                    </Button>
                </View>
            </View>
		</SafeAreaView>
	);
}