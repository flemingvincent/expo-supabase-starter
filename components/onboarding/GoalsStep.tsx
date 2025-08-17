// components/onboarding/GoalsStep.tsx
import React, { useState, useEffect, useRef } from "react";
import { 
    View, 
    TouchableOpacity, 
    ScrollView, 
    Animated,
    LayoutAnimation,
    UIManager,
    Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Text as SvgText } from "react-native-svg";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "@/components/safe-area-view";
import { usePressAnimation } from "@/hooks/onPressAnimation";
import { supabase } from "@/config/supabase";
import { FormData } from "@/types/onboarding";
import { useAppData } from "@/context/app-data-provider";
import * as Haptics from 'expo-haptics';
import { useAuth } from "@/context/supabase-provider";
import { UserPreferenceTag } from "@/types/state";

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface GoalsStepProps {
    formData: FormData;
    handleFormChange: (field: keyof FormData, value: any) => void;
    onNext: () => void;
    isLoading: boolean;
}

interface DraggableGoal {
    id: string;
    name: string;
    priority: number;
}

const GoalsStep = ({
    formData,
    handleFormChange,
    onNext,
    isLoading
}: GoalsStepProps) => {
    const [orderedGoals, setOrderedGoals] = useState<DraggableGoal[]>([]);
    const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const { tags } = useAppData();
    
    // Animation setup similar to other screens
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const contentTranslateY = useRef(new Animated.Value(20)).current;
    const buttonOpacity = useRef(new Animated.Value(0)).current;
    const buttonTranslateY = useRef(new Animated.Value(20)).current;

    // Animation values for each card
    const cardAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;
    const buttonScales = useRef<{ [key: string]: Animated.Value }>({}).current;

    // Press animation for button
    const buttonPress = usePressAnimation({
        hapticStyle: 'Medium',
        pressDistance: 4,
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

    // Initialize ordered goals from tags
    useEffect(() => {
        const userPreferenceTags = formData.userPreferenceTags || [];
        const goalTags = tags.filter((tag) => tag.type === "goal");

        const userGoalTags = userPreferenceTags.filter((tag) => goalTags.some(g => g.id === tag.tag_id));

        if (userGoalTags && userGoalTags.length > 0) {
            const orderedTags = userGoalTags.map((tag, index) => {
                const goalTag = goalTags.find(t => t.id === tag.tag_id);

                return goalTag ? {
                    id: goalTag.id,
                    name: goalTag.name,
                    priority: tag.priority ?? index + 1,
                } : null;
            }).filter(Boolean) as DraggableGoal[];

            setOrderedGoals(orderedTags);
            setHasUserInteracted(true);
        } else {

            const initialOrderedGoals = goalTags.map((tag, index) => ({
                id: tag.id,
                name: tag.name,
                priority: index
            }));
            setOrderedGoals(initialOrderedGoals);
        }
        
        // Initialize animation values for each goal
        goalTags.forEach((tag) => {
            if (!cardAnimations[tag.id]) {
                cardAnimations[tag.id] = new Animated.Value(1);
            }
            // Initialize button scales
            buttonScales[`${tag.id}-up`] = new Animated.Value(1);
            buttonScales[`${tag.id}-down`] = new Animated.Value(1);
        });
    }, [tags]);

    useEffect(() => {
        orderedGoals.forEach((goal) => {
            if (!cardAnimations[goal.id]) {
                cardAnimations[goal.id] = new Animated.Value(1);
            }

            buttonScales[`${goal.id}-up`] = new Animated.Value(1);
            buttonScales[`${goal.id}-down`] = new Animated.Value(1);
        });
    }, [orderedGoals]);

    const animateButtonPress = (goalId: string, direction: 'up' | 'down') => {
        const scaleValue = buttonScales[`${goalId}-${direction}`];
        
        Animated.sequence([
            Animated.timing(scaleValue, {
                toValue: 0.85,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start();
    };

    const animateCardSwap = (goalId1: string, goalId2: string, callback: () => void) => {
        const anim1 = cardAnimations[goalId1];
        const anim2 = cardAnimations[goalId2];
        
        // Pulse animation for swapping cards
        Animated.parallel([
            Animated.sequence([
                Animated.timing(anim1, {
                    toValue: 1.02,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(anim1, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                })
            ]),
            Animated.sequence([
                Animated.timing(anim2, {
                    toValue: 1.02,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(anim2, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                })
            ])
        ]).start();

        // Layout animation for position change
        LayoutAnimation.configureNext({
            duration: 300,
            create: {
                type: LayoutAnimation.Types.spring,
                property: LayoutAnimation.Properties.opacity,
                springDamping: 0.7,
            },
            update: {
                type: LayoutAnimation.Types.spring,
                springDamping: 0.7,
            },
        }, callback);
    };

    const moveGoalUp = (index: number) => {
        if (index === 0) return;
        
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        const currentGoal = orderedGoals[index];
        const previousGoal = orderedGoals[index - 1];
        
        animateButtonPress(currentGoal.id, 'up');
        setAnimatingIndex(index);
        setHasUserInteracted(true);
        
        animateCardSwap(currentGoal.id, previousGoal.id, () => {
            const newGoals = [...orderedGoals];
            [newGoals[index - 1], newGoals[index]] = [newGoals[index], newGoals[index - 1]];
            
            // Update order values
            const updatedGoals = newGoals.map((goal, idx) => ({
                ...goal,
                priority: idx
            }));
            
            setOrderedGoals(updatedGoals);
            
            setTimeout(() => setAnimatingIndex(null), 300);
        });
    };

    const moveGoalDown = (index: number) => {
        if (index === orderedGoals.length - 1) return;
        
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        const currentGoal = orderedGoals[index];
        const nextGoal = orderedGoals[index + 1];
        
        animateButtonPress(currentGoal.id, 'down');
        setAnimatingIndex(index);
        setHasUserInteracted(true); // Mark that user has interacted
        
        animateCardSwap(currentGoal.id, nextGoal.id, () => {
            const newGoals = [...orderedGoals];
            [newGoals[index], newGoals[index + 1]] = [newGoals[index + 1], newGoals[index]];
            
            // Update order values
            const updatedGoals = newGoals.map((goal, idx) => ({
                ...goal,
                priority: idx
            }));
            
            setOrderedGoals(updatedGoals);
            setTimeout(() => setAnimatingIndex(null), 300);
        });
    };

    const handleContinue = () => {
        const nonGoalTags = formData.userPreferenceTags.filter(tag => {
            const goalTags = tags.filter(t => t.type === "goal");
            return !goalTags.some(g => g.id === tag.tag_id);
        });

        const updatedGoalTags: UserPreferenceTag[] = orderedGoals.map((goal, index) => ({
            tag_id: goal.id,
            priority: index + 1
        }));

        const allTags = [...nonGoalTags, ...updatedGoalTags];

        handleFormChange('userPreferenceTags', allTags);

        onNext();
    };

    const renderGoalItem = (goal: DraggableGoal, index: number) => {
        const isFirst = index === 0;
        const isLast = index === orderedGoals.length - 1;
        const isAnimating = animatingIndex === index || animatingIndex === index - 1 || animatingIndex === index + 1;

        const cardScale = cardAnimations[goal.id] || new Animated.Value(1);
        const upButtonScale = buttonScales[`${goal.id}-up`] || new Animated.Value(1);
        const downButtonScale = buttonScales[`${goal.id}-down`] || new Animated.Value(1);

        return (
            <Animated.View
                key={goal.id}
                className="mb-3"
                style={{
                    transform: [{ scale: cardScale }],
                    opacity: isAnimating ? 0.95 : 1,
                }}
            >
                <View
                    className="flex-row items-center bg-white/90 rounded-xl border-2 overflow-hidden"
                    style={{
                        borderColor: index === 0 ? '#25551b40' : '#25551b20',
                        shadowColor: index === 0 ? "#25551b" : "#000",
                        shadowOffset: { 
                            width: 0, 
                            height: index === 0 ? 2 : 1 
                        },
                        shadowOpacity: index === 0 ? 0.2 : 0.1,
                        shadowRadius: index === 0 ? 4 : 2,
                        elevation: index === 0 ? 4 : 2,
                    }}
                >
                    {/* Priority indicator bar - gradient based on position */}
                    <View 
                        className="w-1.5 h-full"
                        style={{
                            backgroundColor: index === 0 ? '#25551b' : 
                                           index === 1 ? '#25551bAA' : 
                                           index === 2 ? '#25551b77' :
                                           '#25551b44'
                        }}
                    />
                    
                    {/* Goal content */}
                    <View className="flex-row items-center justify-between flex-1 py-3 pl-4 pr-2">
                        <View className="flex-row items-center flex-1">
                            <View 
                                className="w-9 h-9 rounded-full items-center justify-center mr-3"
                                style={{
                                    backgroundColor: index === 0 ? '#25551b' : 
                                                   index === 1 ? '#25551bAA' : 
                                                   index === 2 ? '#25551b77' :
                                                   '#25551b44'
                                }}
                            >
                                <Text className="text-white font-bold text-base">
                                    {index + 1}
                                </Text>
                            </View>
                            <View className="flex-1">
                                <Text className="text-lg font-medium text-primary">
                                    {goal.name}
                                </Text>
                                {index < 3 && (
                                    <Text className="text-xs text-primary/50 mt-0.5">
                                        {index === 0 ? "Highest Priority" : 
                                         index === 1 ? "High Priority" : 
                                         "Medium Priority"}
                                    </Text>
                                )}
                            </View>
                        </View>
                        
                        {/* Arrow control buttons - more prominent */}
                        <View className="flex-row items-center gap-1">
                            <Animated.View style={{ transform: [{ scale: upButtonScale }] }}>
                                <TouchableOpacity
                                    onPress={() => moveGoalUp(index)}
                                    disabled={isFirst || animatingIndex !== null}
                                    className={`rounded-lg items-center justify-center ${
                                        isFirst ? 'bg-gray-100' : 'bg-primary/10'
                                    }`}
                                    style={{
                                        width: 40,
                                        height: 40,
                                    }}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Move ${goal.name} up`}
                                    accessibilityHint="Increases the priority of this goal"
                                >
                                    <View className={`rounded-md items-center justify-center ${
                                        !isFirst && 'bg-primary/10'
                                    }`} style={{ width: 36, height: 36 }}>
                                        <Ionicons 
                                            name="arrow-up" 
                                            size={20} 
                                            color={isFirst ? "#00000020" : "#25551b"} 
                                        />
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                            
                            <Animated.View style={{ transform: [{ scale: downButtonScale }] }}>
                                <TouchableOpacity
                                    onPress={() => moveGoalDown(index)}
                                    disabled={isLast || animatingIndex !== null}
                                    className={`rounded-lg items-center justify-center ${
                                        isLast ? 'bg-gray-100' : 'bg-primary/10'
                                    }`}
                                    style={{
                                        width: 40,
                                        height: 40,
                                    }}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Move ${goal.name} down`}
                                    accessibilityHint="Decreases the priority of this goal"
                                >
                                    <View className={`rounded-md items-center justify-center ${
                                        !isLast && 'bg-primary/10'
                                    }`} style={{ width: 36, height: 36 }}>
                                        <Ionicons 
                                            name="arrow-down" 
                                            size={20} 
                                            color={isLast ? "#00000020" : "#25551b"} 
                                        />
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </View>
                </View>
            </Animated.View>
        );
    };
    
    return (
        <SafeAreaView className="flex-1 bg-lightgreen" edges={["top"]}>
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
                        Order your goals by importance
                    </Text>
                    <Text className="text-primary/60 text-sm text-center px-4 mt-1">
                        Your top priority will guide your meal recommendations
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
                    <View className="gap-2">
                        {/* Instructions */}
                        <View className="flex-row items-center mb-4 px-1">
                            <Ionicons name="swap-vertical" size={20} color="#25551b60" />
                            <Text className="text-primary/60 text-sm ml-2 flex-1">
                                Tap the arrow buttons to reorder your priorities
                            </Text>
                        </View>
                        
                        {/* Goal List */}
                        <View>
                            {orderedGoals.map((goal, index) => renderGoalItem(goal, index))}
                        </View>

                        {/* Continue Button with animation and matching style */}
                        <Animated.View
                            style={{
                                opacity: buttonOpacity,
                                transform: [{ translateY: buttonTranslateY }]
                            }}
                            className="mt-6"
                        >
                            <Button
                                size="lg"
                                variant="default"
                                onPress={handleContinue}
                                disabled={orderedGoals.length === 0 || isLoading || animatingIndex !== null}
                                className="w-full"
                                accessibilityRole="button"
                                accessibilityLabel="Continue to next step"
                                accessibilityHint="Proceed to the meal types step of onboarding"
                                accessibilityState={{ 
                                    disabled: orderedGoals.length === 0 || isLoading,
                                    busy: isLoading 
                                }}
                                {...buttonPress}
                            >
                                <View className="flex-row items-center justify-center">
                                    <Text className="text-primary text-xl mr-2 font-semibold">
                                        {isLoading ? "Saving..." : hasUserInteracted ? "Continue" : "Continue with defaults"}
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