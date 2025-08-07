import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, ScrollView, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Text as SvgText } from "react-native-svg";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { usePressAnimation } from "@/hooks/onPressAnimation";
import { supabase } from "@/config/supabase";
import { FormData } from "@/types/onboarding";
import { useAppData } from "@/context/app-data-provider";

interface PreferencesStepProps {
    formData: FormData;
    handleFormChange: (field: keyof FormData, value: any) => void;
    onNext: () => void;
    isLoading: boolean;
}   

const PreferencesStep = ({
    formData,
    handleFormChange,
    onNext,
    isLoading
}: PreferencesStepProps) => {
    const { tags } = useAppData();
    const [groupedTags, setGroupedTags] = useState<{[key: string]: any[]}>({});
    
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

    // Press animation for tag selection
    const tagPress = usePressAnimation({
        hapticStyle: 'Light',
        pressDistance: 1,
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
    
    useEffect(() => {
        // Filter out goal tags and group remaining tags by their type
        const groups: {[key: string]: any[]} = {};
        
        tags.forEach(tag => {
            // Skip goals as they're handled in GoalsStep
            if (tag.type === "goal") return;
            
            const type = tag.type || "other";
            if (!groups[type]) {
                groups[type] = [];
            }
            groups[type].push(tag);
        });
        
        setGroupedTags(groups);
    }, [tags]);

    const toggleTag = (tagId: string) => {
        let updatedPreferences;
        if (formData.userPreferenceTags.includes(tagId)) {
            updatedPreferences = formData.userPreferenceTags.filter(
                id => id !== tagId
            );
        } else {
            updatedPreferences = [...formData.userPreferenceTags, tagId];
        }
        handleFormChange('userPreferenceTags', updatedPreferences);
    };
    
    // Helper function to get display name for tag types
    const getTypeDisplayName = (type: string): string => {
        switch(type) {
            case "allergen": return "Allergies & Intolerances";
            case "diet": return "Dietary Preferences";
            case "budget": return "Budget Preferences";
            case "time": return "Cooking Time";
            case "macro": return "Health / Macro Goals";
            case "cuisine": return "Cuisines";
            case "meal_type": return "Meal Types";
            case "skill_level": return "Recipe Difficulty";
            case "method": return "Cooking Methods";
            case "equipment": return "Kitchen Equipment";
            default: return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }
    };

    // Order of tag groups to display - prioritizing allergens, then dietary preferences
    const typeOrder = [
        "allergen",
        "diet",
        "budget",
        "time",
        "macro",
        "cuisine",
        "meal_type",
        "skill_level",
        "method",
        "equipment"
    ];

    return (
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
                <Svg width="380" height="60">
                    <SvgText
                        x="190"
                        y="50"
                        textAnchor="middle"
                        fill="#25551b"
                        stroke="#E2F380"
                        strokeWidth="0"
                        letterSpacing="2"
                        fontFamily="MMDisplay"
                        fontSize="28"
                        fontWeight="bold"
                    >
                        PREFERENCES
                    </SvgText>
                </Svg>
                <Text className="text-primary text-lg text-center px-4">
                    Tell us your preferences to find perfect recipes
                </Text>
            </Animated.View>

            {/* Form Container matching PlanningStep style */}
            <Animated.View
                style={{
                    opacity: contentOpacity,
                    transform: [{ translateY: contentTranslateY }]
                }}
                className="w-full bg-background/80 rounded-2xl p-6 shadow-md mb-12"
            >
                {tags.length < 1 ? (
                    <View className="items-center justify-center py-20">
                        <Text className="text-primary/70">Loading options...</Text>
                    </View>
                ) : (
                    <View className="gap-6">
                        {typeOrder.map(type => (
                            groupedTags[type] && groupedTags[type].length > 0 && (
                                <View key={type}>
                                    {/* Section Header */}
                                    <Text className="text-primary text-base mb-3 ml-1 font-medium">
                                        {getTypeDisplayName(type)}
                                    </Text>
                                    
                                    {/* Tags Container */}
                                    <View className="bg-white/50 rounded-xl p-4 border border-primary/10">
                                        <View className="flex-row flex-wrap -m-1">
                                            {groupedTags[type].map((tag) => (
                                                <TouchableOpacity
                                                    key={tag.id}
                                                    onPress={() => toggleTag(tag.id)}
                                                    className={`px-3 py-2 m-1 rounded-full border ${
                                                        formData.userPreferenceTags.includes(tag.id)
                                                            ? "bg-primary border-primary"
                                                            : "bg-white border-primary/30"
                                                    }`}
                                                    accessibilityRole="button"
                                                    accessibilityLabel={`${formData.userPreferenceTags.includes(tag.id) ? 'Remove' : 'Add'} ${tag.name} preference`}
                                                    accessibilityHint={`Toggle ${tag.name} as a preference`}
                                                    accessibilityState={{ selected: formData.userPreferenceTags.includes(tag.id) }}
                                                    {...tagPress}
                                                >
                                                    <View className="flex-row items-center">
                                                        <Text className={`font-medium text-sm ${
                                                            formData.userPreferenceTags.includes(tag.id)
                                                                ? "text-white"
                                                                : "text-primary"
                                                        }`}>
                                                            {tag.name}
                                                        </Text>

                                                        {formData.userPreferenceTags.includes(tag.id) && (
                                                            <Ionicons
                                                                name="checkmark"
                                                                size={14}
                                                                color="#fff"
                                                                style={{ marginLeft: 4 }}
                                                            />
                                                        )}
                                                    </View>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            )
                        ))}

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
                                variant="funky"
                                onPress={onNext}
                                disabled={isLoading}
                                className="w-full"
                                accessibilityRole="button"
                                accessibilityLabel="Complete onboarding"
                                accessibilityHint="Finish the onboarding process and start using the app"
                                accessibilityState={{ 
                                    disabled: isLoading,
                                    busy: isLoading 
                                }}
                                {...buttonPress}
                            >
                                <View className="flex-row items-center justify-center">
                                    <Text className="text-primary text-xl mr-2 font-semibold">
                                        {isLoading ? "Saving..." : "Let's get cooking"}
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
                )}
            </Animated.View>
        </ScrollView>
    );
};

export default PreferencesStep;