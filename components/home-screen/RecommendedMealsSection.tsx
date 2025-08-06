import { View, ScrollView, TouchableOpacity } from "react-native";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "expo-router";
import { supabase } from "@/config/supabase";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Recipe } from "@/types/recipe";
import { MealCard } from "./MealCard";
import { usePressAnimation } from "@/hooks/onPressAnimation";
import { RecipeWithTags, useAppData } from "@/context/app-data-provider";

// Mock calendar data - generate weeks starting Monday and ending Sunday
const generateMockCalendarWeeks = () => {
	const weeks = [];
	const today = new Date();

	// Get current week's Monday
	const currentMonday = new Date(today);
	const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
	const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday, go back 6 days
	currentMonday.setDate(today.getDate() - daysFromMonday);

	// Generate 5 weeks: 2 previous, current, 2 next
	for (let weekOffset = -2; weekOffset <= 2; weekOffset++) {
		const weekStart = new Date(currentMonday);
		weekStart.setDate(currentMonday.getDate() + weekOffset * 7);

		const weekEnd = new Date(weekStart);
		weekEnd.setDate(weekStart.getDate() + 6);

		const monthNames = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];

		// Format week display - always include month names
		const startMonth = monthNames[weekStart.getMonth()];
		const endMonth = monthNames[weekEnd.getMonth()];
		const startDate = weekStart.getDate();
		const endDate = weekEnd.getDate();

		const dateRange = `${startDate} ${startMonth} - ${endDate} ${endMonth}`;

		// Check if this week contains today
		const isCurrentWeek = weekOffset === 0;

		// Generate title based on week offset
		let title;
		if (weekOffset < -1) {
			title = `${Math.abs(weekOffset)} weeks ago`;
		} else if (weekOffset === -1) {
			title = "Last week";
		} else if (weekOffset === 0) {
			title = "This week";
		} else if (weekOffset === 1) {
			title = "Next week";
		} else {
			title = `${weekOffset} weeks ahead`;
		}

		weeks.push({
			id: weekOffset.toString(),
			weekStart: weekStart.toISOString(),
			weekEnd: weekEnd.toISOString(),
			displayRange: dateRange,
			month: startMonth,
			isCurrentWeek,
			title: title,
			hasMeals: Math.random() > 0.2, // Random mock data for which weeks have meals
			mealCount: Math.floor(Math.random() * 8) + 2, // 2-9 meals per week
		});
	}

	return weeks;
};

export const RecommendedMealsSection = () => {
	const router = useRouter();
	const [selectedWeek, setSelectedWeek] = useState<string>("0"); // Current week ID
	const [calendarWeeks] = useState(generateMockCalendarWeeks());
	const calendarScrollRef = useRef<ScrollView>(null);

	// Use the context instead of local state
	const {
		recommendedMeals,
		loading,
		error,
		getRecommendedMeals,
		refreshRecommendations,
	} = useAppData();

	const buttonPress = usePressAnimation({
		hapticStyle: "Medium",
		pressDistance: 4,
	});

	// Handle meal press navigation
	const handleMealPress = (meal: Recipe) => {
		console.log("pressed meal:", meal.name);
		router.push(`/recipe/${meal.id}`);
	};

	const handleWeekPress = useCallback((weekId: string) => {
		setSelectedWeek(weekId);
		console.log("Selected week:", weekId);
	}, []);

	const displayMeals = getRecommendedMeals();
	const selectedWeekData = calendarWeeks.find(
		(week) => week.id === selectedWeek,
	);

	// Create sticky calendar component
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
						{calendarWeeks.map((week) => (
							<TouchableOpacity
								key={week.id}
								onPress={() => handleWeekPress(week.id)}
								style={{
									backgroundColor:
										week.id === selectedWeek ? "#CCEA1F" : "#FFFFFF",
									borderColor: week.id === selectedWeek ? "#25551b" : "#E2E2E2",
									shadowColor: week.id === selectedWeek ? "#25551b" : "#E2E2E2",
								}}
								className="py-4 px-4 border-2 rounded-xl items-center min-w-[100px] shadow-[0px_2px_0px_0px] active:shadow-[0px_0px_0px_0px] active:translate-y-[2px]"
							>
								<Text
									className="text-xs font-montserrat-bold mb-1"
									style={{
										color: week.id === selectedWeek ? "#25551b" : "#6B7280",
									}}
								>
									{week.title}
								</Text>
								<Text
									className="text-lg font-montserrat-semibold"
									style={{
										color: week.id === selectedWeek ? "#25551b" : "#374151",
									}}
								>
									{week.displayRange}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</ScrollView>
			</View>
		),
		[calendarWeeks, selectedWeek, handleWeekPress],
	);

	// Enhanced loading state with sticky calendar
	if (loading) {
		return (
			<View className="flex-1">
				{StickyCalendarSection}

				{/* Content that scrolls underneath - with top padding for sticky header */}
				<ScrollView
					className="flex-1"
					contentContainerStyle={{ paddingTop: 100 }} // Adjust based on calendar height
				>
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
									backgroundColor: "#FFFFFF",
								}}
								className="w-12 h-12 rounded-xl items-center justify-center"
							>
								<Ionicons name="restaurant" size={24} color="#25551b" />
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
					contentContainerStyle={{ paddingTop: 100 }} // Adjust based on calendar height
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
									Can't load your meals
								</Text>
							</View>
						</View>

						<Text className="text-[#FF6525]/80 text-center mb-4">
							{error?.message}
						</Text>

						<Button
							onPress={refreshRecommendations}
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
			{/* Sticky Calendar at the top */}
			{StickyCalendarSection}

			{/* Scrollable Content underneath */}
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
								{selectedWeekData?.isCurrentWeek
									? "Recommended for you"
									: `Week ${selectedWeekData?.displayRange} meals`}
							</Text>
							<Text className="text-md font-montserrat text-gray-500">
								{selectedWeekData?.isCurrentWeek
									? `We picked ${recommendedMeals.length} meal${recommendedMeals.length > 1 ? "s" : ""} we think you'll love`
									: `Meals from ${selectedWeekData?.displayRange}`}
							</Text>
						</View>

						<View className="px-4 py-2 flex-row items-center justify-center gap-1 rounded-lg bg-lightgreen text-primary">
							<Text className="text-sm font-montserrat-semibold text-primary">
								78%
							</Text>
							<Ionicons name="flash" size={24} color="#25551b" />
						</View>
					</View>
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
						{displayMeals.map((meal: Recipe, index: number) => (
							<MealCard
								key={meal.id}
								recipe={meal}
								onPress={() => handleMealPress(meal)}
							/>
						))}
					</ScrollView>
				) : (
					/* Enhanced empty state with calendar context */
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
							{selectedWeekData?.isCurrentWeek
								? "No meals this week"
								: `No meals for week ${selectedWeekData?.displayRange}`}
						</Text>
						<Text className="text-[#6B8E23]/80 text-center font-montserrat-semibold">
							Tap on a week above to plan meals or browse our recommendations
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
						<Text className="uppercase">Swap meals</Text>
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
			</ScrollView>
		</View>
	);
};
