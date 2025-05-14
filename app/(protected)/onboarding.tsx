import { View, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useAuth } from "@/context/supabase-provider";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, H2, Muted } from "@/components/ui/typography";

export default function OnboardingScreen() {
	const { updateProfile } = useAuth();
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	const steps = [
		{
			title: "Welcome to MealMate!",
			subtitle: "Your personal cooking companion",
			content: "Discover delicious recipes, save your favorites, and create your own culinary masterpieces.",
			icon: "restaurant-outline",
		},
		{
			title: "Discover Recipes",
			subtitle: "Find your next favorite dish",
			content: "Browse thousands of recipes from around the world. Filter by cuisine, dietary preferences, and cooking time.",
			icon: "search-outline",
		},
		{
			title: "Save & Organize",
			subtitle: "Keep track of what you love",
			content: "Save recipes to your personal collection and organize them into custom categories for easy access.",
			icon: "bookmark-outline",
		},
		{
			title: "Share & Connect",
			subtitle: "Be part of our community",
			content: "Share your own recipes, rate others, and connect with fellow food enthusiasts.",
			icon: "people-outline",
		},
	];

	const handleNext = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrevious = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleCompleteOnboarding = async () => {
		try {
			setIsLoading(true);
			await updateProfile({ onboarding_completed: true });
			router.replace("/");
		} catch (error) {
			console.error("Error completing onboarding:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const ProgressIndicator = () => (
		<View className="flex-row items-center justify-center mb-8">
			{steps.map((_, index) => (
				<View key={index} className="flex-row items-center">
					<View
						className={`w-3 h-3 rounded-full mx-1 ${
							index <= currentStep ? "bg-blue-500" : "bg-gray-300"
						}`}
					/>
					{index < steps.length - 1 && (
						<View
							className={`w-8 h-0.5 ${
								index < currentStep ? "bg-blue-500" : "bg-gray-300"
							}`}
						/>
					)}
				</View>
			))}
		</View>
	);

	const StepContent = ({ step }: { step: typeof steps[0] }) => (
		<View className="items-center">
			<View className="w-24 h-24 bg-white rounded-full items-center justify-center mb-6 shadow-sm">
				<Ionicons
					name={step.icon as any}
					size={40}
					color="#3B82F6"
				/>
			</View>
			<H1 className="text-center mb-3 text-gray-800">{step.title}</H1>
			<H2 className="text-center mb-6 text-gray-600 font-normal">{step.subtitle}</H2>
			<Text className="text-center text-gray-600 leading-6 px-4">
				{step.content}
			</Text>
		</View>
	);

	return (
		<View className="flex-1 bg-background p-6" style={{ backgroundColor: "#F1F3E4" }}>
			{/* Skip Link */}
			<View className="absolute top-12 right-6 z-10">
				<Link href="/" asChild>
					<TouchableOpacity className="p-2">
						<Text className="text-gray-500 text-sm">Skip</Text>
					</TouchableOpacity>
				</Link>
			</View>

			{/* Progress Indicator */}
			<View className="mt-16">
				<ProgressIndicator />
			</View>

			{/* Step Content */}
			<View className="flex-1 justify-center">
				<StepContent step={steps[currentStep]} />
			</View>

			{/* Navigation */}
			<View className="flex-row justify-between items-center">
				{/* Previous Button */}
				<Button
					variant="outline"
					onPress={handlePrevious}
					disabled={currentStep === 0}
					className={`min-w-24 ${currentStep === 0 ? "opacity-50" : ""}`}
				>
					<View className="flex-row items-center">
						<Ionicons name="chevron-back" size={16} color="#374151" />
						<Text className="ml-1">Back</Text>
					</View>
				</Button>

				{/* Current Step Indicator */}
				<Text className="text-gray-500 text-sm">
					{currentStep + 1} of {steps.length}
				</Text>

				{/* Next/Complete Button */}
				{currentStep < steps.length - 1 ? (
					<Button onPress={handleNext} className="min-w-24">
						<View className="flex-row items-center">
							<Text className="mr-1">Next</Text>
							<Ionicons name="chevron-forward" size={16} color="white" />
						</View>
					</Button>
				) : (
					<Button
						onPress={handleCompleteOnboarding}
						disabled={isLoading}
						className="min-w-24"
					>
						<Text>{isLoading ? "Loading..." : "Get Started"}</Text>
					</Button>
				)}
			</View>
		</View>
	);
}