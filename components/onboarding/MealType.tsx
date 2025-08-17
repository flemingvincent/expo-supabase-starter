// components/onboarding/MealTypesStep.tsx
import React, { useRef, useEffect } from "react";
import { View, TouchableOpacity, ScrollView, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Text as SvgText } from "react-native-svg";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "@/components/safe-area-view";
import { usePressAnimation } from "@/hooks/onPressAnimation";
import { FormData } from "@/types/onboarding";

interface MealTypesStepProps {
	formData: FormData;
	handleFormChange: (field: keyof FormData, value: any) => void;
	onNext: () => void;
	isLoading: boolean;
}

const MealTypesStep = ({
	formData,
	handleFormChange,
	onNext,
	isLoading,
}: MealTypesStepProps) => {
	// Animation setup similar to other screens
	const contentOpacity = useRef(new Animated.Value(0)).current;
	const contentTranslateY = useRef(new Animated.Value(20)).current;
	const buttonOpacity = useRef(new Animated.Value(0)).current;
	const buttonTranslateY = useRef(new Animated.Value(20)).current;

	// Press animation for button
	const buttonPress = usePressAnimation({
		hapticStyle: "Medium",
		pressDistance: 4,
	});

	// Press animation for meal type selection
	const mealTypePress = usePressAnimation({
		hapticStyle: "Light",
		pressDistance: 2,
	});

	// Available meal types
	const mealTypes = [
		"Quick & Easy",
		"Budget friendly",
		"High-Protein",
		"Family-Friendly",
		"Low-Carb",
		"Vegetarian",
	];

	useEffect(() => {
		// Content entrance animation
		const contentTimer = setTimeout(() => {
			Animated.parallel([
				Animated.timing(contentOpacity, {
					toValue: 1,
					duration: 400,
					useNativeDriver: true,
				}),
				Animated.timing(contentTranslateY, {
					toValue: 0,
					duration: 400,
					useNativeDriver: true,
				}),
			]).start();
		}, 100);

		// Button entrance animation
		const buttonTimer = setTimeout(() => {
			Animated.parallel([
				Animated.timing(buttonOpacity, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.timing(buttonTranslateY, {
					toValue: 0,
					duration: 300,
					useNativeDriver: true,
				}),
			]).start();
		}, 300);

		return () => {
			clearTimeout(contentTimer);
			clearTimeout(buttonTimer);
		};
	}, []);

	const toggleMealType = (mealType: string) => {
		// Assuming formData has a mealTypes field - you'll need to add this to your FormData interface
		const currentMealTypes = formData.mealTypes || [];
		let updatedMealTypes;

		if (currentMealTypes.includes(mealType)) {
			updatedMealTypes = currentMealTypes.filter((type) => type !== mealType);
		} else {
			updatedMealTypes = [...currentMealTypes, mealType];
		}

		handleFormChange("mealTypes", updatedMealTypes);
	};

	const isSelected = (mealType: string) => {
		const currentMealTypes = formData.mealTypes || [];
		return currentMealTypes.includes(mealType);
	};

	return (
		<SafeAreaView className="flex-1 bg-lightgreen" edges={["top"]}>
			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16 }}
			>
				{/* Animated Title Section */}
				<Animated.View
					style={{
						opacity: contentOpacity,
						transform: [{ translateY: contentTranslateY }],
					}}
					className="items-center mt-8 mb-8"
				>
					{/* SVG Title matching signup style */}
					<Svg width="320" height="60">
						<SvgText
							x="160"
							y="50"
							textAnchor="middle"
							fill="#25551b"
							stroke="#E2F380"
							strokeWidth="0"
							letterSpacing="2"
							fontFamily="MMDisplay"
							fontSize="30"
							fontWeight="bold"
						>
							MEAL TYPES
						</SvgText>
					</Svg>
					<Text className="text-primary text-lg text-center px-4">
						What type of meals fit your household?
					</Text>
				</Animated.View>

				{/* Form Container matching signup style */}
				<Animated.View
					style={{
						opacity: contentOpacity,
						transform: [{ translateY: contentTranslateY }],
					}}
					className="w-full bg-background/80 rounded-2xl p-6 shadow-md"
				>
					<View className="gap-4">
						{/* Meal Type Selection Options */}
						<View className="mb-4">
							<Text className="text-primary text-base mb-4 ml-1 font-medium">
								Choose all that apply
							</Text>

							<View className="gap-3">
								{mealTypes.map((mealType, index) => (
									<TouchableOpacity
										key={index}
										onPress={() => toggleMealType(mealType)}
										className={`w-full p-4 rounded-xl border-2 ${
											isSelected(mealType)
												? "bg-primary/10 border-primary"
												: "bg-white/90 border-primary/20"
										}`}
										accessibilityRole="button"
										accessibilityLabel={`${isSelected(mealType) ? "Remove" : "Add"} ${mealType} meal type`}
										accessibilityHint={`Toggle ${mealType} as a meal type preference`}
										accessibilityState={{ selected: isSelected(mealType) }}
										{...mealTypePress}
									>
										<View className="flex-row items-center justify-between">
											<Text
												className={`text-lg font-medium ${
													isSelected(mealType)
														? "text-primary"
														: "text-primary/80"
												}`}
											>
												{mealType}
											</Text>

											{isSelected(mealType) && (
												<View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
													<Ionicons name="checkmark" size={16} color="#fff" />
												</View>
											)}
										</View>
									</TouchableOpacity>
								))}
							</View>
						</View>

						{/* Continue Button with animation and matching style */}
						<Animated.View
							style={{
								opacity: buttonOpacity,
								transform: [{ translateY: buttonTranslateY }],
							}}
							className="mt-4"
						>
							<Button
								size="lg"
								variant="default"
								onPress={onNext}
								disabled={isLoading}
								className="w-full"
								accessibilityRole="button"
								accessibilityLabel="Continue to next step"
								accessibilityHint="Proceed to the dietary preferences step of onboarding"
								accessibilityState={{
									disabled: isLoading,
									busy: isLoading,
								}}
								{...buttonPress}
							>
								<View className="flex-row items-center justify-center">
									<Text className="text-primary text-xl mr-2 font-semibold">
										{isLoading ? "Saving..." : "Continue"}
									</Text>
									<Ionicons name="arrow-forward" size={20} color="#25551b" />
								</View>
							</Button>
						</Animated.View>
					</View>
				</Animated.View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default MealTypesStep;
