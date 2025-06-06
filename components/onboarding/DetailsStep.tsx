// components/onboarding/DetailsStep.tsx
import React, { useState } from "react";
import { View, TextInput, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { FormData } from "@/types/onboarding";
import { H1, H4 } from "../ui/typography";

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

	return (
		<ScrollView
			className="w-full"
			showsVerticalScrollIndicator={false}
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
		>
			<View className="w-full">
				<View className="mb-12">
					<H1 className="w-full text-left mb-3">Details</H1>
					<H4 className="w-full text-left text-gray-600 font-normal">
						Tell us a bit about yourself
					</H4>
				</View>

				<View className="mb-6">
					<Text className="text-gray-700 text-lg mb-3 ml-2 font-montserrat-medium">
						Name
					</Text>
					<TextInput
						className={`w-full h-14 px-5 rounded-full bg-white text-gray-800 ${
							focusedField === "name"
								? "border-2 border-green"
								: "border border-gray-300"
						}`}
						placeholder="Enter your name"
						value={formData.name}
						onChangeText={(value) => handleFormChange("name", value)}
						onFocus={() => setFocusedField("name")}
						onBlur={() => setFocusedField(null)}
						placeholderTextColor="#9CA3AF"
						style={{ fontFamily: "Montserrat-Regular" }}
						autoCapitalize="words"
						autoComplete="name"
						textContentType="name"
						returnKeyType="next"
					/>
				</View>

				<View className="mb-6">
					<Text className="text-gray-700 text-lg mb-3 ml-2 font-montserrat-medium">
						Country
					</Text>
					<TextInput
						className={`w-full h-14 px-5 rounded-full bg-white text-gray-800 ${
							focusedField === "country"
								? "border-2 border-green"
								: "border border-gray-300"
						}`}
						placeholder="Enter your country"
						value={formData.country}
						onChangeText={(value) => handleFormChange("country", value)}
						onFocus={() => setFocusedField("country")}
						onBlur={() => setFocusedField(null)}
						placeholderTextColor="#9CA3AF"
						style={{ fontFamily: "Montserrat-Regular" }}
						autoCapitalize="words"
						autoComplete="country"
						textContentType="countryName"
						returnKeyType="next"
					/>
				</View>

				<View className="mb-6">
					<Text className="text-gray-700 text-lg mb-3 ml-2 font-montserrat-medium">
						City
					</Text>
					<TextInput
						className={`w-full h-14 px-5 rounded-full bg-white text-gray-800 ${
							focusedField === "city"
								? "border-2 border-green"
								: "border border-gray-300"
						}`}
						placeholder="Enter your city"
						value={formData.city}
						onChangeText={(value) => handleFormChange("city", value)}
						onFocus={() => setFocusedField("city")}
						onBlur={() => setFocusedField(null)}
						placeholderTextColor="#9CA3AF"
						style={{ fontFamily: "Montserrat-Regular" }}
						autoCapitalize="words"
						textContentType="addressCity"
						returnKeyType="next"
					/>
				</View>

				<View className="mb-8">
					<Text className="text-gray-700 text-lg mb-3 ml-2 font-montserrat-medium">
						Postcode
					</Text>
					<TextInput
						className={`w-full h-14 px-5 rounded-full bg-white text-gray-800 ${
							focusedField === "postcode"
								? "border-2 border-green"
								: "border border-gray-300"
						}`}
						placeholder="Enter your postcode"
						value={formData.postcode !== 0 ? formData.postcode.toString() : ""} // Convert number to string
						onChangeText={(value) => {
							// Parse the string value to a number, or 0 if empty/invalid
							const numValue = value ? parseInt(value, 10) : 0;
							handleFormChange("postcode", numValue);
						}}
						onFocus={() => setFocusedField("postcode")}
						onBlur={() => setFocusedField(null)}
						placeholderTextColor="#9CA3AF"
						style={{ fontFamily: "Montserrat-Regular" }}
						autoCapitalize="characters"
						autoComplete="postal-code"
						textContentType="postalCode"
						keyboardType="number-pad" // Added for better numeric input
						returnKeyType="done"
					/>
				</View>

				{/* Continue Button - now part of the form */}
				<View className="mt-8">
					<Button
						onPress={onNext}
						className="w-full"
						disabled={isLoading}
					>
						<View className="flex-row items-center justify-center">
							<Text className="mr-2 !text-xl font-montserrat-semibold">
								{isLoading ? "Saving..." : "Continue"}
							</Text>
							<Ionicons name="arrow-forward" size={16} color="#25551b" />
						</View>
					</Button>
				</View>
			</View>
		</ScrollView>
	);
};

export default DetailsStep;
