// components/onboarding/DetailsStep.tsx
import React, { useState, useRef, useEffect } from "react";
import { View, TextInput, ScrollView, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Text as SvgText } from "react-native-svg";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "@/components/safe-area-view";
import { FormData } from "@/types/onboarding";
import { usePressAnimation } from "@/hooks/onPressAnimation";

interface DetailsStepProps {
	formData: FormData;
	handleFormChange: (field: keyof FormData, value: string | number) => void;
	onNext: () => void;
	isLoading: boolean;
}

const DetailsStep = ({
	formData,
	handleFormChange,
	onNext,
	isLoading,
}: DetailsStepProps) => {
	const [focusedField, setFocusedField] = useState<string | null>(null);

	// Animation setup similar to welcome screen
	const contentOpacity = useRef(new Animated.Value(0)).current;
	const contentTranslateY = useRef(new Animated.Value(20)).current;
	const buttonOpacity = useRef(new Animated.Value(0)).current;
	const buttonTranslateY = useRef(new Animated.Value(20)).current;

	// Press animation for button
	const buttonPress = usePressAnimation({
		hapticStyle: 'Medium',
		pressDistance: 4,
	});

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

	// Custom input component that matches the signup form styling
	const CustomFormInput = ({ 
		label, 
		placeholder, 
		value, 
		onChangeText, 
		fieldName,
		keyboardType = "default",
		autoCapitalize = "words",
		autoComplete,
		textContentType,
		returnKeyType = "next"
	}: {
		label: string;
		placeholder: string;
		value: string;
		onChangeText: (text: string) => void;
		fieldName: string;
		keyboardType?: any;
		autoCapitalize?: any;
		autoComplete?: any;
		textContentType?: any;
		returnKeyType?: any;
	}) => (
		<View className="mb-6">
			<Text className="text-primary text-base mb-2 ml-1 font-medium">
				{label}
			</Text>
			<TextInput
				className={`w-full h-14 px-4 rounded-xl bg-white/90 text-primary border ${
					focusedField === fieldName
						? "border-2 border-primary"
						: "border-primary/20"
				}`}
				placeholder={placeholder}
				placeholderTextColor="#25551b60"
				value={value}
				onChangeText={onChangeText}
				onFocus={() => setFocusedField(fieldName)}
				onBlur={() => setFocusedField(null)}
				keyboardType={keyboardType}
				autoCapitalize={autoCapitalize}
				autoComplete={autoComplete}
				textContentType={textContentType}
				returnKeyType={returnKeyType}
				style={{ 
					fontFamily: "Montserrat-Regular",
					fontSize: 16,
					color: "#25551b"
				}}
			/>
		</View>
	);

	return (
		<SafeAreaView className="flex-1 bg-lightgreen" edges={["top", "bottom"]}>
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
						transform: [{ translateY: contentTranslateY }]
					}}
					className="items-center mt-8 mb-8"
				>
					{/* SVG Title matching signup style */}
					<Svg width="280" height="60">
						<SvgText
							x="140"
							y="50"
							textAnchor="middle"
							fill="#25551b"
							stroke="#E2F380"
							strokeWidth="0"
							letterSpacing="2"
							fontFamily="MMDisplay"
							fontSize="36"
							fontWeight="bold"
						>
							DETAILS
						</SvgText>
					</Svg>
					<Text className="text-primary text-lg text-center px-4">
						Tell us a bit about yourself
					</Text>
				</Animated.View>

				{/* Form Container matching signup style */}
				<Animated.View
					style={{
						opacity: contentOpacity,
						transform: [{ translateY: contentTranslateY }]
					}}
					className="w-full bg-background/80 rounded-2xl p-6 shadow-md"
				>
					<View className="gap-2">
						<CustomFormInput
							label="Name"
							placeholder="Enter your name"
							value={formData.name}
							onChangeText={(value) => handleFormChange("name", value)}
							fieldName="name"
							autoCapitalize="words"
							autoComplete="name"
							textContentType="name"
							returnKeyType="next"
						/>

						<CustomFormInput
							label="Country"
							placeholder="Enter your country"
							value={formData.country}
							onChangeText={(value) => handleFormChange("country", value)}
							fieldName="country"
							autoCapitalize="words"
							autoComplete="country"
							textContentType="countryName"
							returnKeyType="next"
						/>

						<CustomFormInput
							label="City"
							placeholder="Enter your city"
							value={formData.city}
							onChangeText={(value) => handleFormChange("city", value)}
							fieldName="city"
							autoCapitalize="words"
							textContentType="addressCity"
							returnKeyType="next"
						/>

						<CustomFormInput
							label="Postcode"
							placeholder="Enter your postcode"
							value={formData.postcode !== 0 ? formData.postcode.toString() : ""}
							onChangeText={(value) => {
								const numValue = value ? parseInt(value, 10) : 0;
								handleFormChange("postcode", numValue);
							}}
							fieldName="postcode"
							keyboardType="number-pad"
							autoCapitalize="characters"
							autoComplete="postal-code"
							textContentType="postalCode"
							returnKeyType="done"
						/>

						{/* Continue Button with animation and matching style */}
						<Animated.View
							style={{
								opacity: buttonOpacity,
								transform: [{ translateY: buttonTranslateY }]
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
								accessibilityHint="Proceed to the planning step of onboarding"
								accessibilityState={{ 
									disabled: isLoading,
									busy: isLoading 
								}}
								{...buttonPress}
							>
								<View className="flex-row items-center justify-center">
									<Text className="text-primary text-xl mr-2 font-semibold">
										{isLoading ? "Saving..." : "Continue"}
									</Text>
									<Ionicons
										name="arrow-forward"
										size={20}
										color="#25551b"
									/>
								</View>
							</Button>
						</Animated.View>
					</View>
				</Animated.View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default DetailsStep;