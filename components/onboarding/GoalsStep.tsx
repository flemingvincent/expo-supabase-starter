// components/onboarding/GoalsStep.tsx
import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, H4 } from "@/components/ui/typography";
import { supabase } from "@/config/supabase";
import { FormData } from "@/types/onboarding";
import { useAppData } from "@/context/app-data-provider";

interface GoalsStepProps {
    formData: FormData;
    handleFormChange: (field: keyof FormData, value: any) => void;
    onNext: () => void;
    isLoading: boolean;
}

const GoalsStep = ({
    formData,
    handleFormChange,
    onNext,
    isLoading
}: GoalsStepProps) => {
    const [goalTags, setGoalTags] = useState<typeof tags>([]);
    const { tags } = useAppData();

    // filter tags
    useEffect(() => {
        const filteredTags = tags.filter((tag) => tag.type === "goal");
        setGoalTags(filteredTags);
    }
    , []);
    
    return (
        <ScrollView
            className="w-full"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
        >
            <View className="w-full">
                <View className="mb-12">
                    <H1 className="w-full text-left mb-3">Goals</H1>
                    <H4 className="w-full text-left text-gray-600 font-normal">
                        What do you care about most?
                    </H4>
                </View>
                
                <View className="mb-8 flex flex-col justify-start items-center gap-4">
                    {goalTags.map((goal) => (
                        <TouchableOpacity
                        key={goal.id}
                        onPress={() => handleFormChange("goalId", goal.id)}
                        className={`w-full p-4 flex-row items-center justify-center rounded-full gap-2 ${
                            formData.goalId === goal.id
                                ? "bg-white border-2 border-[#25551B]" 
                                : "bg-white border border-gray-200"
                        }`}
                    >
                        {formData.goalId === goal.id && (
                            <Ionicons name="checkmark-circle" size={24} color="#25551B" />
                        )}
                        
                        <Text className="text-[#25551B] text-xl font-montserrat-semibold">
                            {goal.name}
                        </Text>
                    </TouchableOpacity>
                    ))}
                </View>

                {/* Continue Button */}
                <View className="mt-8">
                    <Button
                        onPress={onNext}
                        className="w-full"
                        disabled={!formData.goalId || isLoading}
                    >
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

export default GoalsStep;