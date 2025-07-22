import React, { useRef, useEffect } from "react";
import { View, TouchableOpacity, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Text as SvgText } from "react-native-svg";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "@/components/safe-area-view";
import { Image } from "@/components/image";
import { usePressAnimation } from "@/hooks/onPressAnimation";
import { FormData } from "@/types/onboarding";

const { width } = Dimensions.get("window");

interface WelcomeStepProps {
	formData: FormData;
	onNext: () => void;
	isLoading: boolean;
}

const WelcomeStep = ({ formData, onNext, isLoading }: WelcomeStepProps) => {
	// Animation setup
	const contentOpacity = useRef(new Animated.Value(0)).current;
	const contentTranslateY = useRef(new Animated.Value(30)).current;
	const titleOpacity = useRef(new Animated.Value(0)).current;
	const titleScale = useRef(new Animated.Value(0.9)).current;
	const cardsOpacity = useRef(new Animated.Value(0)).current;
	const cardsTranslateY = useRef(new Animated.Value(20)).current;
	const buttonOpacity = useRef(new Animated.Value(0)).current;
	const buttonTranslateY = useRef(new Animated.Value(20)).current;
    const cardOneImage = require("@/assets/homie-with-grocery-cart.png");
    const cardTwoImage = require("@/assets/homie-on-groceries.png");


	// Press animation for button
	const buttonPress = usePressAnimation({
		hapticStyle: "Medium",
		pressDistance: 4,
	});

	useEffect(() => {
		// Staggered entrance animations
		const titleTimer = setTimeout(() => {
			Animated.parallel([
				Animated.timing(titleOpacity, {
					toValue: 1,
					duration: 600,
					useNativeDriver: true,
				}),
				Animated.spring(titleScale, {
					toValue: 1,
					tension: 50,
					friction: 8,
					useNativeDriver: true,
				}),
			]).start();
		}, 200);

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
		}, 600);

		const cardsTimer = setTimeout(() => {
			Animated.parallel([
				Animated.timing(cardsOpacity, {
					toValue: 1,
					duration: 400,
					useNativeDriver: true,
				}),
				Animated.timing(cardsTranslateY, {
					toValue: 0,
					duration: 400,
					useNativeDriver: true,
				}),
			]).start();
		}, 900);

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
		}, 1200);

		return () => {
			clearTimeout(titleTimer);
			clearTimeout(contentTimer);
			clearTimeout(cardsTimer);
			clearTimeout(buttonTimer);
		};
	}, []);

	const totalMeals = formData.mealsPerWeek;
	const displayName = formData.name || "there";

	return (
		<SafeAreaView className="flex-1 bg-lightgreen" edges={["top", "bottom"]}>
			<View className="flex-1 px-4 justify-center">

                <Animated.View
                    style={{
                        opacity: titleOpacity,
                        transform: [{ scale: titleScale }]
                    }}
                    className="items-center mb-8"
                >
                    <Svg width="300" height="60">
                        <SvgText
                            x="150"
                            y="45"
                            textAnchor="middle"
                            fill="#25551b"
                            stroke="#E2F380"
                            strokeWidth="0"
                            letterSpacing="2"
                            fontFamily="MMDisplay"
                            fontSize="32"
                            fontWeight="bold"
                        >
                            WELCOME!
                        </SvgText>
                    </Svg>
                </Animated.View>

				{/* Welcome Message */}
				<Animated.View
					style={{
						opacity: contentOpacity,
						transform: [{ translateY: contentTranslateY }],
					}}
					className="items-center mb-12"
				>
					<Text className="text-primary text-lg text-center px-4 leading-relaxed">
						We've selected {totalMeals} {totalMeals === 1 ? "meal" : "meals"}{" "}
						for your first week with MealMate.
					</Text>
				</Animated.View>

				{/* Feature Cards */}
				<Animated.View
					style={{
						opacity: cardsOpacity,
						transform: [{ translateY: cardsTranslateY }],
					}}
					className="mb-12"
				>
					{/* First Card */}
					<View className="bg-background/90 rounded-2xl p-6 mb-4 shadow-lg border border-primary/10">
						<View className="flex-row items-center">
							<Image
                                source={cardOneImage}
                                className="w-32 h-32 mx-auto"
                                contentFit="contain"
                            />
							<View className="flex-1">
								<Text className="text-primary text-2xl font-semibold mb-2">
									Ingredient efficiency
								</Text>
								<Text className="text-primary/80 text-base leading-relaxed">
									Meals are chosen to maximise ingredient overlap, so you waste less and save more.
								</Text>
							</View>
						</View>
					</View>

					{/* Second Card */}
					<View className="bg-background/90 rounded-2xl p-6 shadow-lg border border-primary/10">
						<View className="flex-row items-center">
							<Image
                                source={cardTwoImage}
                                className="w-32 h-32 mx-auto"
                                contentFit="contain"
                            />
							<View className="flex-1">
								<Text className="text-primary text-2xl font-semibold mb-2">
									Grocer checkout
								</Text>
								<Text className="text-primary/80 text-base leading-relaxed">
									Send your ingredients directly to an online grocery cart for a smooth checkout.
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
				>
					<Button
						size="lg"
						variant="secondary"
						onPress={onNext}
						disabled={isLoading}
						className="w-full"
						accessibilityRole="button"
						accessibilityLabel="See my meals"
						accessibilityHint="View your personalized meal selection"
						accessibilityState={{
							disabled: isLoading,
							busy: isLoading,
						}}
						{...buttonPress}
					>
						<View className="flex-row items-center justify-center">
							<Text className="text-white text-xl mr-3 font-semibold">
								{isLoading ? "Loading..." : "See my meals"}
							</Text>
							<Ionicons name="arrow-forward" size={20} color="#fff" />
						</View>
					</Button>
				</Animated.View>
			</View>
		</SafeAreaView>
	);
};

export default WelcomeStep;
