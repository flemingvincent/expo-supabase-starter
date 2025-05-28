import {
	View,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	Animated,
	Dimensions,
} from "react-native";
import { router } from "expo-router";
import { useState, useCallback, useRef, useEffect } from "react";
import { useAuth } from "@/context/supabase-provider";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Text as SvgText } from "react-native-svg";
import { Image } from "@/components/image";

import { Text } from "@/components/ui/text";
import { supabase } from "@/config/supabase";
import { FormData } from "@/types/onboarding";

// Import the step components
import DetailsStep from "@/components/onboarding/DetailsStep";
import PlanningStep from "@/components/onboarding/PlanningStep";
import GoalsStep from "@/components/onboarding/GoalsStep";
import PreferencesStep from "@/components/onboarding/DietaryStep";
import { useAppData } from "@/context/app-data-provider";

const { width, height } = Dimensions.get('window');

// Success Animation Component (unchanged)
const SuccessAnimation = ({ visible, onComplete }: { visible: boolean; onComplete: () => void }) => {
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scaleAnim = useRef(new Animated.Value(0.9)).current;
	const progressAnim = useRef(new Animated.Value(0)).current;
	const [loadingText, setLoadingText] = useState("Analyzing your preferences...");
	
	const animationStarted = useRef(false);
	const onCompleteRef = useRef(onComplete);
	const hasCompleted = useRef(false);

	const appIcon = require("@/assets/mm-homie-transparent-bg.png");

	const loadingMessages = [
		"Analyzing your preferences...",
		"Curating the perfect meal-kit for you...",
		"Personalizing your experience...",
		"Almost ready! Finalizing your setup..."
	];

	useEffect(() => {
		onCompleteRef.current = onComplete;
	}, [onComplete]);

	useEffect(() => {
		if (visible && !animationStarted.current) {
			animationStarted.current = true;
			
			Animated.parallel([
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 400,
					useNativeDriver: true,
				}),
				Animated.spring(scaleAnim, {
					toValue: 1,
					tension: 50,
					friction: 8,
					useNativeDriver: true,
				}),
			]).start();

			Animated.timing(progressAnim, {
				toValue: 100,
				duration: 5500,
				useNativeDriver: false,
			}).start(() => {
				setTimeout(() => {
					if (!hasCompleted.current) {
						hasCompleted.current = true;
						onCompleteRef.current();
					}
				}, 500);
			});

			const textInterval = setInterval(() => {
				setLoadingText(prev => {
					const currentIndex = loadingMessages.indexOf(prev);
					const nextIndex = (currentIndex + 1) % loadingMessages.length;
					return loadingMessages[nextIndex];
				});
			}, 1500);

			return () => {
				clearInterval(textInterval);
			};
		}
	}, [visible, fadeAnim, scaleAnim, progressAnim]);

	if (!visible) return null;

	return (
		<Animated.View
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width,
				height,
				backgroundColor: '#E2F380',
				justifyContent: 'center',
				alignItems: 'center',
				opacity: fadeAnim,
				zIndex: 1000,
				paddingHorizontal: 20,
			}}
		>
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<View style={{ marginBottom: 40 }}>
					<Svg width="380" height="120" style={{ marginVertical: 10 }}>
						<SvgText
							x="190"
							y="75"
							textAnchor="middle"
							fill="#25551b"
							stroke="#E2F380"
							strokeWidth="0"
							letterSpacing="3"
							fontFamily="MMDisplay"
							fontSize="42"
							fontWeight="bold"
						>
							MEALMATE
						</SvgText>
					</Svg>
				</View>

				<Animated.View
					style={{
						transform: [{ scale: scaleAnim }],
						marginBottom: 60,
					}}
				>
					<Image
						source={appIcon}
						className="w-48 h-48 mx-auto"
						contentFit="contain"
					/>
				</Animated.View>

				<View style={{ 
					width: width * 0.85,
					marginBottom: 30,
					alignSelf: 'center'
				}}>
					<View
						style={{
							height: 16,
							backgroundColor: 'rgba(37, 85, 27, 0.3)',
							borderRadius: 8,
							overflow: 'hidden',
							borderWidth: 2,
							borderColor: '#25551B',
							width: '100%',
						}}
					>
						<Animated.View
							style={{
								height: '100%',
								backgroundColor: '#FF6B6B',
								borderRadius: 6,
								width: progressAnim.interpolate({
									inputRange: [0, 100],
									outputRange: ['0%', '100%'],
								}),
								shadowColor: '#FF6B6B',
								shadowOffset: { width: 0, height: 0 },
								shadowOpacity: 1,
								shadowRadius: 6,
								elevation: 5,
							}}
						/>
					</View>
				</View>

				<Animated.View
					style={{
						opacity: fadeAnim,
						transform: [{ translateY: fadeAnim.interpolate({
							inputRange: [0, 1],
							outputRange: [10, 0],
						})}]
					}}
				>
					<Text className="text-[#25551B] text-lg font-montserrat-medium text-center">
						{loadingText}
					</Text>
				</Animated.View>
			</View>
		</Animated.View>
	);
};

export default function OnboardingScreen() {
	const { session, profile, updateProfile } = useAuth();
	const { userPreferences } = useAppData();
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward');

	// Animation values for current and next step
	const currentStepAnim = useRef(new Animated.Value(0)).current;
	const nextStepAnim = useRef(new Animated.Value(width)).current;

	const [formData, setFormData] = useState<FormData>({
		name: profile?.display_name ?? "",
		country: profile?.country ?? "",
		city: profile?.city ?? "",
		postcode: profile?.post_code ?? 0,
		mealsPerWeek: userPreferences?.meals_per_week ?? 1,
		servesPerMeal: userPreferences?.serves_per_meal ?? 1,
		goalId: userPreferences?.goal_tag_id ?? null,
		user_preference_tags: userPreferences?.user_preference_tags ?? [],
	});

	const steps = [
		"Details",
		"Planning",
		"Goals",
		"Dietary Preferences",
	];

	const handleFormChange = useCallback((field: keyof FormData, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	}, []);

	const animateToStep = useCallback((newStep: number, direction: 'forward' | 'backward') => {
		if (isTransitioning || newStep === currentStep) return;

		setIsTransitioning(true);
		setTransitionDirection(direction);

		// Set initial positions based on direction
		if (direction === 'forward') {
			// Current step will move left (negative), next step comes from right (positive)
			currentStepAnim.setValue(0);
			nextStepAnim.setValue(width);
		} else {
			// Current step will move right (positive), next step comes from left (negative)  
			currentStepAnim.setValue(0);
			nextStepAnim.setValue(-width);
		}

		// Animate both screens simultaneously
		Animated.parallel([
			Animated.timing(currentStepAnim, {
				toValue: direction === 'forward' ? -width : width,
				duration: 300,
				useNativeDriver: true,
			}),
			Animated.timing(nextStepAnim, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}),
		]).start(() => {
			// Update step first
			setCurrentStep(newStep);
			
			// Use setTimeout to ensure React has fully completed its update cycle
			setTimeout(() => {
				// Double-check we're still in the right state before cleaning up
				setIsTransitioning(false);
				// Reset positions for next animation
				currentStepAnim.setValue(0);
				nextStepAnim.setValue(direction === 'forward' ? width : -width);
			}, 50); // Small delay to ensure React reconciliation is complete
		});
	}, [currentStep, isTransitioning, currentStepAnim, nextStepAnim]);

	const completeOnboarding = async () => {
		try {
			setIsLoading(true);
			setShowSuccess(true);
	
			await updateProfile({
				display_name: formData.name || undefined,
				country: formData.country || undefined,
				city: formData.city || undefined,
				post_code: formData.postcode || undefined,
				onboarding_completed: true,
			});

			const { data: prefData, error: prefError } = await supabase
				.from("user_preferences")
				.upsert({
					user_id: session?.user?.id,
					meals_per_week: formData.mealsPerWeek,
					serves_per_meal: formData.servesPerMeal,
					goal_tag_id: formData.goalId,
				}, { onConflict: "user_id" })
				.select();
	
			if (prefError) throw prefError;
	
			if (
				formData.user_preference_tags.length > 0 &&
				prefData &&
				prefData.length > 0
			) {
				const preferenceId = prefData[0].id;
	
				const { error: deleteError } = await supabase
					.from("user_preference_tags")
					.delete()
					.eq("user_preference_id", preferenceId);
	
				if (deleteError) throw deleteError;
	
				const tagInserts = formData.user_preference_tags.map((tagId) => ({
					user_preference_id: preferenceId,
					tag_id: tagId,
				}));
	
				const { error: insertError } = await supabase
					.from("user_preference_tags")
					.insert(tagInserts);
	
				if (insertError) throw insertError;
			}
		} catch (error) {
			console.error("Error completing onboarding:", error);
			setShowSuccess(false);
			router.replace("/");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSuccessComplete = () => {
		router.replace("/");
	};

	const handleNext = () => {
		if (currentStep === steps.length - 1) {
			completeOnboarding();
		} else {
			animateToStep(currentStep + 1, 'forward');
		}
	};

	const handlePrevious = () => {
		if (currentStep > 0) {
			animateToStep(currentStep - 1, 'backward');
		}
	};

	const handleSkipStep = () => {
		if (currentStep < steps.length - 1) {
			animateToStep(currentStep + 1, 'forward');
		}
	};

	const ProgressIndicator = () => (
		<View className="mb-8">
			<View className="flex-row justify-between items-center mb-4">
				{currentStep > 0 ? (
					<TouchableOpacity onPress={handlePrevious} disabled={isTransitioning}>
						<View className="flex-row items-center">
							<Ionicons name="chevron-back" size={16} color="#374151" />
							<Text className="text-gray-600 text-sm ml-1">Back</Text>
						</View>
					</TouchableOpacity>
				) : (
					<View />
				)}

				{currentStep < steps.length - 1 && (
					<TouchableOpacity onPress={handleSkipStep} disabled={isTransitioning}>
						<View className="flex-row items-center">
							<Text className="text-gray-600 text-sm mr-1">Skip</Text>
							<Ionicons name="chevron-forward" size={16} color="#374151" />
						</View>
					</TouchableOpacity>
				)}
			</View>

			<View className="flex-row items-center">
				<Text className="text-gray-600 text-sm font-medium mr-4">
					{currentStep + 1}/{steps.length}
				</Text>

				<View className="flex-row flex-1 justify-between">
					{steps.map((_, index) => (
						<View
							key={index}
							className="flex-1 mx-1 h-2 rounded-full border"
							style={{
								backgroundColor: index <= currentStep ? "#FFBDBD" : "#C4C4C4",
								borderColor: index <= currentStep ? "#25551B" : "#C4C4C4",
								borderWidth: index <= currentStep ? 1 : 0,
							}}
						/>
					))}
				</View>
			</View>
		</View>
	);

	const getStepComponent = (stepIndex: number) => {
		switch (stepIndex) {
			case 0:
				return (
					<DetailsStep
						formData={formData}
						handleFormChange={handleFormChange}
						onNext={handleNext}
						isLoading={isLoading}
					/>
				);
			case 1:
				return (
					<PlanningStep
						formData={formData}
						handleFormChange={handleFormChange}
						onNext={handleNext}
						isLoading={isLoading}
					/>
				);
			case 2:
				return (
					<GoalsStep
						formData={formData}
						handleFormChange={handleFormChange}
						onNext={handleNext}
						isLoading={isLoading}
					/>
				);
			case 3:
				return (
					<PreferencesStep
						formData={formData}
						handleFormChange={handleFormChange}
						onNext={handleNext}
						isLoading={isLoading}
					/>
				);
			default:
				return null;
		}
	};

	const getNextStep = () => {
		if (transitionDirection === 'forward') {
			return currentStep + 1;
		} else {
			return currentStep - 1;
		}
	};

	return (
		<>
			{!showSuccess && (
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
				>
					<View
						className="flex-1 bg-background p-6"
						style={{ backgroundColor: "#F1F3E4" }}
					>
						<View className="mt-16">
							<ProgressIndicator />
						</View>
						
						<View style={{ flex: 1, overflow: 'hidden' }}>
							{/* Current Step */}
							<Animated.View
								style={{
									position: 'absolute',
									width: '100%',
									height: '100%',
									transform: [{ translateX: currentStepAnim }],
								}}
							>
								{getStepComponent(currentStep)}
							</Animated.View>

							{/* Next Step (only visible during transition) */}
							{isTransitioning && (
								<Animated.View
									style={{
										position: 'absolute',
										width: '100%',
										height: '100%',
										transform: [{ translateX: nextStepAnim }],
										opacity: isTransitioning ? 1 : 0, // Extra safety
									}}
								>
									{getStepComponent(getNextStep())}
								</Animated.View>
							)}
						</View>
					</View>
				</KeyboardAvoidingView>
			)}

			<SuccessAnimation 
				visible={showSuccess} 
				onComplete={handleSuccessComplete}
			/>
		</>
	);
}