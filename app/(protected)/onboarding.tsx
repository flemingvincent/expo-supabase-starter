import { View, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { Link, router } from "expo-router";
import { useState, useCallback } from "react";
import { useAuth } from "@/context/supabase-provider";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, H2, H3, H4, Muted } from "@/components/ui/typography";

interface FormData {
	name: string;
	country: string;
	city: string;
	postcode: string;
}

// Move FormStep component outside or use useCallback
const FormStepComponent = ({ 
	formData, 
	handleFormChange,
	onNext,
	isLoading,
	onComplete
}: { 
	formData: FormData; 
	handleFormChange: (field: keyof FormData, value: string) => void;
	onNext: () => void;
	isLoading: boolean;
	onComplete: () => void;
}) => {
	const [focusedField, setFocusedField] = useState<string | null>(null);

	return (
		<ScrollView 
			className="w-full"
			showsVerticalScrollIndicator={false}
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
		>
			<View className="w-full">
				<View className="mb-6">
					<Text className="text-gray-700 text-lg mb-3 ml-2 font-montserrat-medium">Name</Text>
					<TextInput
						className={`w-full h-14 px-5 rounded-full bg-white text-gray-800 ${
							focusedField === 'name' 
								? 'border-2 border-green' 
								: 'border border-gray-300'
						}`}
						placeholder="Enter your name"
						value={formData.name}
						onChangeText={(value) => handleFormChange('name', value)}
						onFocus={() => setFocusedField('name')}
						onBlur={() => setFocusedField(null)}
						placeholderTextColor="#9CA3AF"
						style={{ fontFamily: 'Montserrat-Regular' }}
						autoCapitalize="words"
						autoComplete="name"
						textContentType="name"
						returnKeyType="next"
					/>
				</View>
				
				<View className="mb-6">
					<Text className="text-gray-700 text-lg mb-3 ml-2 font-montserrat-medium">Country</Text>
					<TextInput
						className={`w-full h-14 px-5 rounded-full bg-white text-gray-800 ${
							focusedField === 'country' 
								? 'border-2 border-green' 
								: 'border border-gray-300'
						}`}
						placeholder="Enter your country"
						value={formData.country}
						onChangeText={(value) => handleFormChange('country', value)}
						onFocus={() => setFocusedField('country')}
						onBlur={() => setFocusedField(null)}
						placeholderTextColor="#9CA3AF"
						style={{ fontFamily: 'Montserrat-Regular' }}
						autoCapitalize="words"
						autoComplete="country"
						textContentType="countryName"
						returnKeyType="next"
					/>
				</View>
				
				<View className="mb-6">
					<Text className="text-gray-700 text-lg mb-3 ml-2 font-montserrat-medium">City</Text>
					<TextInput
						className={`w-full h-14 px-5 rounded-full bg-white text-gray-800 ${
							focusedField === 'city' 
								? 'border-2 border-green' 
								: 'border border-gray-300'
						}`}
						placeholder="Enter your city"
						value={formData.city}
						onChangeText={(value) => handleFormChange('city', value)}
						onFocus={() => setFocusedField('city')}
						onBlur={() => setFocusedField(null)}
						placeholderTextColor="#9CA3AF"
						style={{ fontFamily: 'Montserrat-Regular' }}
						autoCapitalize="words"
						textContentType="addressCity"
						returnKeyType="next"
					/>
				</View>
				
				<View className="mb-8">
					<Text className="text-gray-700 text-lg mb-3 ml-2 font-montserrat-medium">Postcode</Text>
					<TextInput
						className={`w-full h-14 px-5 rounded-full bg-white text-gray-800 ${
							focusedField === 'postcode' 
								? 'border-2 border-green' 
								: 'border border-gray-300'
						}`}
						placeholder="Enter your postcode"
						value={formData.postcode}
						onChangeText={(value) => handleFormChange('postcode', value)}
						onFocus={() => setFocusedField('postcode')}
						onBlur={() => setFocusedField(null)}
						placeholderTextColor="#9CA3AF"
						style={{ fontFamily: 'Montserrat-Regular' }}
						autoCapitalize="characters"
						autoComplete="postal-code"
						textContentType="postalCode"
						returnKeyType="done"
					/>
				</View>

				{/* Continue Button - now part of the form */}
				<View className="mt-8">
					<Button onPress={onNext} className="w-full" variant={"secondary"}>
						<View className="flex-row items-center justify-center">
							<Text className="mr-2">Continue</Text>
							<Ionicons name="arrow-forward" size={16} color="#25551b" />
						</View>
					</Button>
				</View>
			</View>
		</ScrollView>
	);
};

export default function OnboardingScreen() {
	const { updateProfile } = useAuth();
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState<FormData>({
		name: "",
		country: "",
		city: "",
		postcode: "",
	});

	const steps = [
		{
			title: "Details",
			subtitle: "Tell us a bit about yourself...",
			content: "",
			icon: "person-outline",
			isForm: true,
		},
		{
			title: "Welcome to MealMate!",
			subtitle: "Your personal cooking companion",
			content: "Discover delicious recipes, save your favorites, and create your own culinary masterpieces.",
			icon: "restaurant-outline",
			isForm: false,
		},
		{
			title: "Discover Recipes",
			subtitle: "Find your next favorite dish",
			content: "Browse thousands of recipes from around the world. Filter by cuisine, dietary preferences, and cooking time.",
			icon: "search-outline",
			isForm: false,
		},
		{
			title: "Save & Organize",
			subtitle: "Keep track of what you love",
			content: "Save recipes to your personal collection and organize them into custom categories for easy access.",
			icon: "bookmark-outline",
			isForm: false,
		},
		{
			title: "Share & Connect",
			subtitle: "Be part of our community",
			content: "Share your own recipes, rate others, and connect with fellow food enthusiasts.",
			icon: "people-outline",
			isForm: false,
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

	const handleSkipStep = () => {
		// Skip current step and move to next
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		}
	};

	// Stable callback to prevent re-renders
	const handleFormChange = useCallback((field: keyof FormData, value: string) => {
		setFormData(prev => ({
			...prev,
			[field]: value,
		}));
	}, []);

	const handleCompleteOnboarding = async () => {
		try {
			setIsLoading(true);
			// Update profile with form data and mark onboarding complete
			await updateProfile({ 
				onboarding_completed: true,
				display_name: formData.name || undefined,
				// You can add other fields to your profile table as needed
				// country: formData.country,
				// city: formData.city,
				// postcode: formData.postcode,
			});
			router.replace("/");
		} catch (error) {
			console.error("Error completing onboarding:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const ProgressIndicator = () => (
		<View className="mb-8">
			{/* Link buttons above pills */}
			<View className="flex-row justify-between items-center mb-4">
				{/* Back button - only visible after step 1 */}
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
				
				{/* Skip button - now skips current step */}
				{currentStep < steps.length - 1 && (
					<TouchableOpacity onPress={handleSkipStep}>
						<View className="flex-row items-center">
							<Text className="text-gray-600 text-sm mr-1">Skip</Text>
							<Ionicons name="chevron-forward" size={16} color="#374151" />
						</View>
					</TouchableOpacity>
				)}
			</View>
			
			{/* Numerical indicator and progress pills in same row */}
			<View className="flex-row items-center">
				{/* Numerical indicator */}
				<Text className="text-gray-600 text-sm font-medium mr-4">
					{currentStep + 1}/{steps.length}
				</Text>
				
				{/* Progress pills */}
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
		<KeyboardAvoidingView 
			style={{ flex: 1 }} 
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
		>
			<View className="flex-1 bg-background p-6" style={{ backgroundColor: "#F1F3E4" }}>
				{/* Progress Indicator */}
				<View className="mt-16">
					<ProgressIndicator />
				</View>

				{/* Step Content */}
				<View className="flex-1">
					{steps[currentStep].isForm ? 
						<FormStepComponent 
							formData={formData} 
							handleFormChange={handleFormChange}
							onNext={handleNext}
							isLoading={isLoading}
							onComplete={handleCompleteOnboarding}
						/> : 
						<View className="justify-center flex-1">
							<StepContent step={steps[currentStep]} />
						</View>
					}
				</View>

				{/* Navigation - only for non-form steps */}
				{!steps[currentStep].isForm && (
					<View className="mt-8 pb-8">
						{/* Continue Button */}
						{currentStep < steps.length - 1 ? (
							<Button onPress={handleNext} className="w-full" variant={"secondary"}>
								<View className="flex-row items-center justify-center">
									<Text className="mr-2">Continue</Text>
									<Ionicons name="arrow-forward" size={16} color="#25551b" />
								</View>
							</Button>
						) : (
							<Button
								onPress={handleCompleteOnboarding}
								disabled={isLoading}
								className="w-full"
								variant={"funky"}
							>
								<View className="flex-row items-center justify-center">
									<Text className="mr-2">{isLoading ? "Loading..." : "Let's get cooking"}</Text>
									<Ionicons name="arrow-forward" size={16} color="#25551b" />
								</View>
							</Button>
						)}
					</View>
				)}
			</View>
		</KeyboardAvoidingView>
	);
}