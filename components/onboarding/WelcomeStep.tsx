import React, { useRef, useEffect } from "react";
import {
	View,
	TouchableOpacity,
	Animated,
	Dimensions,
	ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Text as SvgText } from "react-native-svg";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/image";
import { SafeAreaView } from "@/components/safe-area-view";
import { usePressAnimation } from "@/hooks/onPressAnimation";
import { FormData } from "@/types/onboarding";

const { width, height } = Dimensions.get("window");

interface WelcomeStepProps {
	formData: FormData;
	onNext: () => void;
	isLoading: boolean;
}

const WelcomeStep = ({ formData, onNext, isLoading }: WelcomeStepProps) => {
	// Animation setup
	const contentOpacity = useRef(new Animated.Value(0)).current;
	const contentTranslateY = useRef(new Animated.Value(20)).current;
	const titleOpacity = useRef(new Animated.Value(0)).current;
	const titleScale = useRef(new Animated.Value(0.95)).current;
	const statsOpacity = useRef(new Animated.Value(0)).current;
	const statsTranslateY = useRef(new Animated.Value(15)).current;
	const featuresOpacity = useRef(new Animated.Value(0)).current;
	const featuresTranslateY = useRef(new Animated.Value(15)).current;
	const buttonOpacity = useRef(new Animated.Value(0)).current;
	const buttonTranslateY = useRef(new Animated.Value(20)).current;

	// Images
	const appIcon = require("@/assets/mm-homie-transparent-bg.png");
	const cardOneImage = require("@/assets/homie-with-grocery-cart.png");
	const cardTwoImage = require("@/assets/homie-on-groceries.png");

	// Press animation for button
	const buttonPress = usePressAnimation({
		hapticStyle: "Medium",
		pressDistance: 4,
	});

	useEffect(() => {
		// Staggered entrance animations matching your design pattern
		const titleTimer = setTimeout(() => {
			Animated.parallel([
				Animated.timing(titleOpacity, {
					toValue: 1,
					duration: 400,
					useNativeDriver: true,
				}),
				Animated.spring(titleScale, {
					toValue: 1,
					tension: 50,
					friction: 8,
					useNativeDriver: true,
				}),
			]).start();
		}, 100);

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
		}, 200);

		const statsTimer = setTimeout(() => {
			Animated.parallel([
				Animated.timing(statsOpacity, {
					toValue: 1,
					duration: 400,
					useNativeDriver: true,
				}),
				Animated.timing(statsTranslateY, {
					toValue: 0,
					duration: 400,
					useNativeDriver: true,
				}),
			]).start();
		}, 400);

		const featuresTimer = setTimeout(() => {
			Animated.parallel([
				Animated.timing(featuresOpacity, {
					toValue: 1,
					duration: 400,
					useNativeDriver: true,
				}),
				Animated.timing(featuresTranslateY, {
					toValue: 0,
					duration: 400,
					useNativeDriver: true,
				}),
			]).start();
		}, 600);

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
		}, 800);

		return () => {
			clearTimeout(titleTimer);
			clearTimeout(contentTimer);
			clearTimeout(statsTimer);
			clearTimeout(featuresTimer);
			clearTimeout(buttonTimer);
		};
	}, []);

	return (
			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={{ 
					flexGrow: 1,
					paddingHorizontal: 16,
					paddingTop: 20,
					paddingBottom: 40
				}}
			>
				{/* Animated Title Section */}
				<Animated.View
					style={{
						opacity: titleOpacity,
						transform: [{ scale: titleScale }],
					}}
					className="items-center mt-4 mb-6"
				>
					<Svg width="320" height="80">
						<SvgText
							x="160"
							y="60"
							textAnchor="middle"
							fill="#25551b"
							stroke="#E2F380"
							strokeWidth="0"
							letterSpacing="2"
							fontFamily="MMDisplay"
							fontSize="38"
							fontWeight="bold"
						>
							ALL SET!
						</SvgText>
					</Svg>
					
					{/* App Icon */}
					<View className="my-4">
						<Image
							source={appIcon}
							className="w-48 h-48 mx-auto"
							contentFit="contain"
						/>
					</View>
				</Animated.View>

				{/* Feature Cards */}
				<Animated.View
					style={{
						opacity: featuresOpacity,
						transform: [{ translateY: featuresTranslateY }],
					}}
					className="mb-8"
				>
					{/* Smart Pairing Card */}
					<View className="bg-background/80 rounded-2xl p-6 mb-4 shadow-md border border-primary/10">
						<View className="flex-row items-center">
							<View className="mr-4">
								<Image
									source={cardOneImage}
									className="w-20 h-20"
									contentFit="contain"
								/>
							</View>
							<View className="flex-1">
								<View className="flex-row items-center mb-2">
									<Ionicons name="leaf" size={18} color="#25551b" className="mr-2" />
									<Text className="text-primary text-lg font-semibold">
										Smart Ingredient Pairing
									</Text>
								</View>
								<Text className="text-primary/80 text-sm leading-relaxed">
									Meals chosen to maximize ingredient overlap, reducing waste and saving money
								</Text>
							</View>
						</View>
					</View>

					{/* One-Click Shopping Card */}
					<View className="bg-background/80 rounded-2xl p-6 shadow-md border border-primary/10">
						<View className="flex-row items-center">
							<View className="mr-4">
								<Image
									source={cardTwoImage}
									className="w-20 h-20"
									contentFit="contain"
								/>
							</View>
							<View className="flex-1">
								<View className="flex-row items-center mb-2">
									<Ionicons name="basket" size={18} color="#25551b" className="mr-2" />
									<Text className="text-primary text-lg font-semibold">
										One-Click Shopping
									</Text>
								</View>
								<Text className="text-primary/80 text-sm leading-relaxed">
									Send ingredients directly to your grocery cart for seamless checkout
								</Text>
							</View>
						</View>
					</View>
				</Animated.View>

				{/* Continue Button */}
				<Animated.View
					style={{
						opacity: buttonOpacity,
						transform: [{ translateY: buttonTranslateY }],
					}}
					className="mt-auto"
				>
					<Button
						size="lg"
						variant="secondary"
						onPress={onNext}
						disabled={isLoading}
						className="w-full"
						accessibilityRole="button"
						accessibilityLabel="Start cooking with MealMate"
						accessibilityHint="Enter the main app to view your personalized meals"
						accessibilityState={{
							disabled: isLoading,
							busy: isLoading,
						}}
						{...buttonPress}
					>
						<View className="flex-row items-center justify-center">
							<Text className="text-white text-xl mr-3 font-semibold">
								{isLoading ? "Loading..." : "Let's start cooking!"}
							</Text>
							<Ionicons name="arrow-forward" size={20} color="#fff" />
						</View>
					</Button>
				</Animated.View>
			</ScrollView>
	);
};

export default WelcomeStep;