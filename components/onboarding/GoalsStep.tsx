// components/onboarding/GoalsStep.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, ScrollView, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Text as SvgText } from "react-native-svg";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "@/components/safe-area-view";
import { usePressAnimation } from "@/hooks/onPressAnimation";
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

    // Animation setup similar to other screens
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const contentTranslateY = useRef(new Animated.Value(20)).current;
    const buttonOpacity = useRef(new Animated.Value(0)).current;
    const buttonTranslateY = useRef(new Animated.Value(20)).current;

    // Press animation for button
    const buttonPress = usePressAnimation({
        hapticStyle: 'Medium',
        pressDistance: 4,
    });

    // Press animation for goal selection
    const goalPress = usePressAnimation({
        hapticStyle: 'Light',
        pressDistance: 2,
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

    // Filter tags
    useEffect(() => {
        const filteredTags = tags.filter((tag) => tag.type === "goal");
        setGoalTags(filteredTags);
    }, [tags]);

    const handleGoalSelect = (goalId: string) => {
        handleFormChange("goalId", goalId);
    };
    
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
                            GOALS
                        </SvgText>
                    </Svg>
                    <Text className="text-primary text-lg text-center px-4">
                        What do you care about most?
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
                    <View className="gap-4">
                        {/* Goal Selection Options */}
                        <View className="mb-4">
                            <Text className="text-primary text-base mb-4 ml-1 font-medium">
                                Choose your primary goal
                            </Text>
                            
                            <View className="gap-3">
                                {goalTags.map((goal) => (
                                    <TouchableOpacity
                                        key={goal.id}
                                        onPress={() => handleGoalSelect(goal.id)}
                                        className={`w-full p-4 rounded-xl border-2 ${
                                            formData.goalId === goal.id
                                                ? "bg-primary/10 border-primary" 
                                                : "bg-white/90 border-primary/20"
                                        }`}
                                        accessibilityRole="button"
                                        accessibilityLabel={`Select ${goal.name} as your goal`}
                                        accessibilityHint={`Choose ${goal.name} as your primary cooking goal`}
                                        accessibilityState={{ selected: formData.goalId === goal.id }}
                                        {...goalPress}
                                    >
                                        <View className="flex-row items-center justify-between">
                                            <Text className={`text-lg font-medium ${
                                                formData.goalId === goal.id
                                                    ? "text-primary" 
                                                    : "text-primary/80"
                                            }`}>
                                                {goal.name}
                                            </Text>
                                            
                                            {formData.goalId === goal.id && (
                                                <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                                </View>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

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
                                disabled={!formData.goalId || isLoading}
                                className="w-full"
                                accessibilityRole="button"
                                accessibilityLabel="Continue to next step"
                                accessibilityHint="Proceed to the dietary preferences step of onboarding"
                                accessibilityState={{ 
                                    disabled: !formData.goalId || isLoading,
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

export default GoalsStep;