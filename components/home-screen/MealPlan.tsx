import { View, ScrollView, TouchableOpacity } from "react-native";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { MealCard } from "./MealCard";
import { usePressAnimation } from "@/hooks/onPressAnimation";
import { useAppData } from "@/context/app-data-provider";
import { MealPlanItem } from "@/types/database";

export const MealPlanSection = () => {
	const router = useRouter();
	const calendarScrollRef = useRef<ScrollView>(null);

	const {
		currentMealPlan,
		weeks,
		currentWeek,
		loading,
		error,
		getCurrentMealPlan,
		generateInitialMealPlan,
		updateMealServings,
		getWeekById,
		getWeeksRange,
		loadMealPlanForWeek,
	} = useAppData();

	const [selectedWeekId, setSelectedWeekId] = useState<string | null>(null);
	const [isLoadingWeekPlan, setIsLoadingWeekPlan] = useState(false);

	useEffect(() => {
		if (currentWeek && !selectedWeekId) {
			setSelectedWeekId(currentWeek.id);
		}
	}, [currentWeek, selectedWeekId]);

	const displayWeeks = useMemo(() => {
		return getWeeksRange(0, 3);
	}, [weeks, getWeeksRange]);

	const buttonPress = usePressAnimation({
		hapticStyle: "Medium",
		pressDistance: 4,
	});

	const handleMealPress = (meal: MealPlanItem) => {
		console.log("pressed meal:", meal.recipe.name);
		router.push(`/recipe/${meal.recipe.id}`);
	};

	const handleWeekPress = useCallback(async (weekId: string) => {
		if (weekId === selectedWeekId) return;
		
		setSelectedWeekId(weekId);
		setIsLoadingWeekPlan(true);
		
		try {
			await loadMealPlanForWeek(weekId);
		} catch (error) {
			console.error("Error loading meal plan for week:", error);
		} finally {
			setIsLoadingWeekPlan(false);
		}
	}, [selectedWeekId, loadMealPlanForWeek]);

	const handleEditMeals = () => {
		const selectedWeek = getWeekById(selectedWeekId!);
		if (!selectedWeek) return;

		router.push({
			pathname: '/meal-planner',
			params: {
				weekId: selectedWeek.id,
				weekStart: selectedWeek.start_date,
				weekEnd: selectedWeek.end_date,
				displayRange: selectedWeek.display_range,
			}
		});
	};

	const handleGenerateNewPlan = async () => {
		try {
			await generateInitialMealPlan();
		} catch (error) {
			console.error("Error generating new meal plan:", error);
		}
	};

	const displayMeals = getCurrentMealPlan();
	const selectedWeek = selectedWeekId ? getWeekById(selectedWeekId) : null;
	const totalServings = displayMeals.reduce((sum, meal) => sum + meal.servings, 0);

	const StickyCalendarSection = useMemo(
		() => (
			<View
				className="pb-4"
				style={{
					backgroundColor: "#FFFFFF",
					borderBottomWidth: 1,
					borderBottomColor: "#E2E2E2",
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					zIndex: 10,
				}}
			>
				<ScrollView
					ref={calendarScrollRef}
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ paddingHorizontal: 12 }}
				>
					<View className="flex-row gap-3 py-1">
						{displayWeeks.map((week) => (
							<TouchableOpacity
								key={week.id}
								onPress={() => handleWeekPress(week.id)}
								style={{
									backgroundColor:
										week.id === selectedWeekId ? "#CCEA1F" : "#FFFFFF",
									borderColor: week.id === selectedWeekId ? "#25551b" : "#E2E2E2",
									shadowColor: week.id === selectedWeekId ? "#25551b" : "#E2E2E2",
								}}
								className="py-4 px-4 border-2 rounded-xl items-center min-w-[100px] shadow-[0px_2px_0px_0px] active:shadow-[0px_0px_0px_0px] active:translate-y-[2px]"
							>
								<Text
									className="text-sm font-montserrat-bold"
									style={{
										color: week.id === selectedWeekId ? "#25551b" : "#6B7280",
									}}
								>
									{week.displayTitle}
								</Text>
								<Text
									className="text-lg font-montserrat-semibold"
									style={{
										color: week.id === selectedWeekId ? "#25551b" : "#374151",
									}}
								>
									{week.display_range}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</ScrollView>
			</View>
		),
		[displayWeeks, selectedWeekId, handleWeekPress],
	);

	// Enhanced loading state with sticky calendar
	if (loading) {
		return (
			<View className="flex-1">
				{StickyCalendarSection}

				{/* Content that scrolls underneath - with top padding for sticky header */}
				<ScrollView
					className="flex-1"
					contentContainerStyle={{ paddingTop: 100 }}
				>
					{/* Loading Header */}
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
									YOUR MEAL PLAN
								</Text>
								<Text className="text-gray-700 text-2xl font-montserrat-bold">
									Loading your selected meals
								</Text>
							</View>
							<View
								style={{
									backgroundColor: "#FFFFFF",
								}}
								className="w-12 h-12 rounded-xl items-center justify-center"
							>
								<Ionicons name="calendar" size={24} color="#25551b" />
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
										LOADING MEAL PLAN
									</Text>
								</View>
							);
						})}
					</ScrollView>
				</ScrollView>
			</View>
		);
	}

	// Enhanced error state with sticky calendar
	if (error) {
		return (
			<View className="flex-1">
				{StickyCalendarSection}

				<ScrollView
					className="flex-1"
					contentContainerStyle={{ paddingTop: 100 }}
				>
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
									Can't load your meal plan
								</Text>
							</View>
						</View>

						<Text className="text-[#FF6525]/80 text-center mb-4">
							{error?.message}
						</Text>

						<Button
							onPress={handleGenerateNewPlan}
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
				</ScrollView>
			</View>
		);
	}

	return (
		<View className="flex-1">
			{StickyCalendarSection}

			<ScrollView
				className="flex-1 bg-background"
				contentContainerStyle={{ paddingTop: 110, paddingBottom: 20 }}
				showsVerticalScrollIndicator={false}
			>
				{/* Section Header with Selected Week Info */}
				<View
					style={{
						borderWidth: 2,
						borderColor: "#EBEBEB",
						backgroundColor: "#FFFFFF",
						shadowColor: "#EBEBEB",
					}}
					className="mx-4 mb-4 border rounded-2xl p-4 shadow-[0px_2px_0px_0px]"
				>
					<View className="flex-row items-center justify-between">
						<View className="flex-1">
							<Text className="text-xl uppercase font-montserrat-bold tracking-wide mb-1 text-gray-700">
								{selectedWeek?.is_current_week
									? "Your meal plan"
									: `Week ${selectedWeek?.display_range} plan`}
							</Text>
							<Text className="text-md font-montserrat text-gray-500">
								{selectedWeek?.is_current_week
									? `${displayMeals.length} meal${displayMeals.length !== 1 ? "s" : ""} selected • ${totalServings} total servings`
									: `Meal plan for ${selectedWeek?.display_range}`}
							</Text>
						</View>

						<View className="px-4 py-2 flex-row items-center justify-center gap-1 rounded-lg bg-lightgreen text-primary">
							<Text className="text-sm font-montserrat-semibold text-primary">
								{displayMeals.length}
							</Text>
							<Ionicons name="restaurant" size={20} color="#25551b" />
						</View>
					</View>

					{/* Loading indicator for week changes */}
					{isLoadingWeekPlan && (
						<View className="mt-3 pt-3 border-t border-gray-200">
							<Text className="text-gray-500 text-sm text-center">
								Loading meal plan...
							</Text>
						</View>
					)}
				</View>

				{/* Meals Content */}
				{displayMeals.length > 0 ? (
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{
							paddingHorizontal: 16,
							paddingRight: 32,
							paddingBottom: 4,
						}}
						decelerationRate="fast"
						snapToInterval={334}
						snapToAlignment="start"
					>
						{displayMeals.map((meal: MealPlanItem, index: number) => (
							<MealCard
								key={meal.id}
								recipe={meal}
								onPress={() => handleMealPress(meal)}
								onServingsChange={updateMealServings}
								showServingsEditor={true}
								weekStatus={selectedWeek?.status}
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
							<Ionicons name="calendar-outline" size={32} color="#FFF" />
						</View>
						<Text className="text-[#6B8E23] text-xl font-montserrat-bold tracking-wide uppercase mb-2 text-center">
							{selectedWeek?.is_current_week
								? "No meals planned"
								: `No meals for week ${selectedWeek?.display_range}`}
						</Text>
						<Text className="text-[#6B8E23]/80 text-center font-montserrat-semibold mb-4">
							{selectedWeek?.is_current_week
								? "Let's create your first meal plan!"
								: "Start planning meals for this week"}
						</Text>
						
						{selectedWeek?.is_current_week && (
							<Button
								onPress={handleGenerateNewPlan}
								variant="outline"
								className="border-[#6B8E23] bg-transparent"
								{...buttonPress}
							>
								<Text className="text-[#6B8E23] font-montserrat-semibold">
									Generate Meal Plan
								</Text>
							</Button>
						)}
					</View>
				)}

				{/* Enhanced Action Buttons */}
				{selectedWeek && (
					<View className="px-4 flex-1 gap-4 mt-6">
						{/* Edit meals button - for current and future weeks */}
						{selectedWeek.status !== 'past' && (
							<Button
								variant="outline"
								accessibilityRole="button"
								accessibilityLabel="Edit meals"
								accessibilityHint="Edit your meal plan and adjust servings"
								className="border-2"
								onPress={handleEditMeals}
								{...buttonPress}
							>
                                <Text className="uppercase">Change meals</Text>
							</Button>
						)}
						
						{/* Add to cart button - only for current week */}
						{selectedWeek.is_current_week && displayMeals.length > 0 && (
							<Button
								variant="default"
								accessibilityRole="button"
								accessibilityLabel="Add ingredients to cart"
								accessibilityHint="Add ingredients for the selected meals to your cart"
								{...buttonPress}
							>
                                <Text>Confirm</Text>
							</Button>
						)}
					</View>
				)}
			</ScrollView>
		</View>
	);
};