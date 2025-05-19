import {
	View,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { router } from "expo-router";
import { useState, useCallback } from "react";
import { useAuth } from "@/context/supabase-provider";
import { Ionicons } from "@expo/vector-icons";

import { Text } from "@/components/ui/text";
import { supabase } from "@/config/supabase";
import { FormData } from "@/types/onboarding";

// Import the step components
import DetailsStep from "@/components/onboarding/DetailsStep";
import PlanningStep from "@/components/onboarding/PlanningStep";
import GoalsStep from "@/components/onboarding/GoalsStep";
import PreferencesStep from "@/components/onboarding/DietaryStep";
import { useAppData } from "@/context/app-data-provider";

export default function OnboardingScreen() {
	const { session, profile, updateProfile } = useAuth();
	const { userPreferences } = useAppData();
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
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

	const completeOnboarding = async () => {
		try {
			setIsLoading(true);
	
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
	
			// Navigate to home screen
			router.replace("/");
		} catch (error) {
			console.error("Error completing onboarding:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleNext = () => {
		if (currentStep === steps.length - 1) {
			completeOnboarding();
		} else {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrevious = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleSkipStep = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		}
	};

	const ProgressIndicator = () => (
		<View className="mb-8">
			<View className="flex-row justify-between items-center mb-4">
				{currentStep > 0 ? (
					<TouchableOpacity onPress={handlePrevious}>
						<View className="flex-row items-center">
							<Ionicons name="chevron-back" size={16} color="#374151" />
							<Text className="text-gray-600 text-sm ml-1">Back</Text>
						</View>
					</TouchableOpacity>
				) : (
					<View />
				)}

				{currentStep < steps.length && (
					<TouchableOpacity onPress={handleSkipStep}>
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

	const renderCurrentStep = () => {
		switch (currentStep) {
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

	return (
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
				<View className="flex-1">{renderCurrentStep()}</View>
			</View>
		</KeyboardAvoidingView>
	);
}
