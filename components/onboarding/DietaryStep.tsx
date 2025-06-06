import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, H4 } from "@/components/ui/typography";
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
        if (formData.user_preference_tags.includes(tagId)) {
            updatedPreferences = formData.user_preference_tags.filter(
                id => id !== tagId
            );
        } else {
            updatedPreferences = [...formData.user_preference_tags, tagId];
        }
        handleFormChange('user_preference_tags', updatedPreferences);
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
            className="w-full"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
        >
            <View className="w-full">
                <View className="mb-8">
                    <H1 className="w-full text-left mb-3">Recipe Preferences</H1>
                    <H4 className="w-full text-left text-gray-600 font-normal">
                        Tell us your preferences to help us find the perfect recipes for you
                    </H4>
                </View>

                {tags.length < 1 ? (
                    <View className="items-center justify-center py-8">
                        <Text className="text-gray-600">Loading options...</Text>
                    </View>
                ) : (
                    <View className="mb-8">
                        {typeOrder.map(type => (
                            groupedTags[type] && groupedTags[type].length > 0 && (
                                <View key={type} className="mb-6">
                                    <Text className="mb-2 text-[#25551B] font-montserrat-bold text-lg">
                                        {getTypeDisplayName(type)}
                                    </Text>
                                    <View className="flex-row flex-wrap">
                                        {groupedTags[type].map((tag) => (
                                            <TouchableOpacity
                                                key={tag.id}
                                                onPress={() => toggleTag(tag.id)}
                                                className={`px-4 py-2 m-1 rounded-full ${
                                                    formData.user_preference_tags.includes(tag.id)
                                                        ? "bg-[#E2F380]"
                                                        : "bg-white"
                                                }`}
                                            >
                                                <View className="flex-row items-center">
                                                    <Text className="text-[#25551B] font-montserrat-medium">
                                                        {tag.name}
                                                    </Text>

                                                    {formData.user_preference_tags.includes(tag.id) && (
                                                        <Ionicons
                                                            name="checkmark"
                                                            size={16}
                                                            color="#25551B"
                                                            className="ml-1"
                                                        />
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )
                        ))}
                    </View>
                )}

                <View className="mt-8">
                    <Button
                        onPress={onNext}
                        className="w-full"
                        variant={'funky'}
                        disabled={isLoading}
                    >
                        <View className="flex-row items-center justify-center">
                            <Text className="mr-2 !text-xl font-montserrat-semibold">
                                {isLoading ? "Saving..." : "Let's get cooking"}
                            </Text>
                            <Ionicons name="arrow-forward" size={16} color="#25551b" />
                        </View>
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
};

export default PreferencesStep;