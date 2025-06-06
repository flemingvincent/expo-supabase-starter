// components/onboarding/PlanningStep.tsx
import React from "react";
import { View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, H4 } from "@/components/ui/typography";
import Counter from "./Counter";
import { FormData } from "@/types/onboarding";

interface PlanningStepProps {
    formData: FormData;
    handleFormChange: (field: keyof FormData, value: any) => void;
    onNext: () => void;
    isLoading: boolean;
}

const PlanningStep = ({
    formData,
    handleFormChange,
    onNext,
    isLoading
}: PlanningStepProps) => {
    const handleIncrementMeals = () => {
        if (formData.mealsPerWeek < 20) {
            handleFormChange("mealsPerWeek", formData.mealsPerWeek + 1);
        }
    };

    const handleDecrementMeals = () => {
        if (formData.mealsPerWeek > 1) {
            handleFormChange("mealsPerWeek", formData.mealsPerWeek - 1);
        }
    };

    const handleIncrementServes = () => {
        if (formData.servesPerMeal < 12) {
            handleFormChange("servesPerMeal", formData.servesPerMeal + 1);
        }
    };

    const handleDecrementServes = () => {
        if (formData.servesPerMeal > 1) {
            handleFormChange("servesPerMeal", formData.servesPerMeal - 1);
        }
    };

    return (
        <ScrollView
            className="w-full"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
        >
            <View className="w-full">
                <View className="mb-12">
                    <H1 className="w-full text-left mb-3">Planning</H1>
                    <H4 className="w-full text-left text-gray-600 font-normal">
                        How often and how much are you cooking?
                    </H4>
                </View>

                <Counter
                    label="Meals per week"
                    value={formData.mealsPerWeek}
                    onIncrement={handleIncrementMeals}
                    onDecrement={handleDecrementMeals}
                    min={1}
                    max={20}
                />

                <Counter
                    label="Serves per meal"
                    value={formData.servesPerMeal}
                    onIncrement={handleIncrementServes}
                    onDecrement={handleDecrementServes}
                    min={1}
                    max={12}
                />

                {/* Continue Button */}
                <View className="mt-8">
                    <Button onPress={onNext} className="w-full" disabled={isLoading}>
                        <View className="flex-row items-center justify-center">
                            <Text className="mr-2 !text-xl font-montserrat-semibold">{isLoading ? "Saving..." : "Continue"}</Text>
                            <Ionicons name="arrow-forward" size={16} color="#25551b" />
                        </View>
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
};

export default PlanningStep;