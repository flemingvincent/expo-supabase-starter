// components/onboarding/GoalsStep.tsx
import React, { useState, useEffect, useRef } from "react";
import { 
    View, 
    TouchableOpacity, 
    ScrollView, 
    Animated,
    PanResponder,
    Dimensions,
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
    order: number;
}

const { height: screenHeight } = Dimensions.get('window');

const GoalsStep = ({
    formData,
    handleFormChange,
    onNext,
    isLoading
}: GoalsStepProps) => {
    const [orderedGoals, setOrderedGoals] = useState<DraggableGoal[]>([]);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const { tags } = useAppData();
    
    // Track the original index when drag starts
    const dragStartIndex = useRef<number | null>(null);
    const currentOffset = useRef(0);

    // Animation setup similar to other screens
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const contentTranslateY = useRef(new Animated.Value(20)).current;
    const buttonOpacity = useRef(new Animated.Value(0)).current;
    const buttonTranslateY = useRef(new Animated.Value(20)).current;

    // Animation values for dragging
    const pan = useRef(new Animated.ValueXY()).current;
    const dragScale = useRef(new Animated.Value(1)).current;

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
        const goalTags = tags.filter((tag) => tag.type === "goal");
        const initialOrderedGoals = goalTags.map((tag, index) => ({
            id: tag.id,
            name: tag.name,
            order: index
        }));
        setOrderedGoals(initialOrderedGoals);
        
        // Initialize formData with ordered goal IDs
        handleFormChange("goalIds", initialOrderedGoals.map(g => g.id));
    }, [tags]);

    const moveGoal = (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) return;

        const newGoals = [...orderedGoals];
        const [movedGoal] = newGoals.splice(fromIndex, 1);
        newGoals.splice(toIndex, 0, movedGoal);
        
        // Update order values
        const updatedGoals = newGoals.map((goal, index) => ({
            ...goal,
            order: index
        }));

        // Use a smoother animation preset
        LayoutAnimation.configureNext({
            duration: 200,
            create: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity,
            },
            update: {
                type: LayoutAnimation.Types.easeInEaseOut,
            },
        });
        
        setOrderedGoals(updatedGoals);
        
        // Update formData with new order
        handleFormChange("goalIds", updatedGoals.map(g => g.id));
    };

    const createPanResponder = (goalIndex: number) => {
        return PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            
            onPanResponderGrant: () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setDraggingIndex(goalIndex);
                dragStartIndex.current = goalIndex;
                currentOffset.current = 0;
                
                Animated.spring(dragScale, {
                    toValue: 1.05,
                    useNativeDriver: true,
                }).start();
            },
            
            onPanResponderMove: (_, gestureState) => {
                // Update the pan position
                pan.setValue({ x: 0, y: gestureState.dy });
                
                // Calculate which position the item is being dragged to
                const itemHeight = 72; // Approximate height of each goal item
                const moveDistance = gestureState.dy + currentOffset.current;
                const itemsMoved = Math.round(moveDistance / itemHeight);
                const originalIndex = dragStartIndex.current!;
                const newIndex = Math.max(0, Math.min(orderedGoals.length - 1, originalIndex + itemsMoved));
                
                // Get current dragging index
                const currentDragIndex = draggingIndex;
                
                if (newIndex !== currentDragIndex && currentDragIndex !== null) {
                    // Calculate the offset adjustment when swapping
                    const indexDiff = newIndex - currentDragIndex;
                    currentOffset.current += indexDiff * itemHeight;
                    
                    // Adjust pan to compensate for the position change
                    pan.setValue({ x: 0, y: gestureState.dy - currentOffset.current });
                    
                    moveGoal(currentDragIndex, newIndex);
                    setDraggingIndex(newIndex);
                }
            },
            
            onPanResponderRelease: () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                
                Animated.parallel([
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: true,
                        tension: 40,
                        friction: 8,
                    }),
                    Animated.spring(dragScale, {
                        toValue: 1,
                        useNativeDriver: true,
                    })
                ]).start();
                
                setDraggingIndex(null);
                dragStartIndex.current = null;
                currentOffset.current = 0;
            },
        });
    };

    const renderGoalItem = (goal: DraggableGoal, index: number) => {
        const isDragging = draggingIndex === index;
        const panResponder = createPanResponder(index);
        
        const animatedStyle = isDragging ? {
            transform: [
                ...pan.getTranslateTransform(),
                { scale: dragScale }
            ],
            zIndex: 1000,
            elevation: 5,
        } : {};

        return (
            <Animated.View
                key={goal.id}
                style={[
                    animatedStyle,
                    {
                        opacity: isDragging ? 0.9 : 1,
                    }
                ]}
                className="mb-3"
            >
                <View
                    className="flex-row items-center bg-white/90 rounded-xl border-2 border-primary/20 overflow-hidden"
                    style={{
                        shadowColor: isDragging ? "#25551b" : "#000",
                        shadowOffset: { 
                            width: 0, 
                            height: isDragging ? 4 : 1 
                        },
                        shadowOpacity: isDragging ? 0.3 : 0.1,
                        shadowRadius: isDragging ? 8 : 2,
                        elevation: isDragging ? 8 : 2,
                    }}
                >
                    {/* Priority indicator bar - same color for all */}
                    <View className="w-1 h-full bg-primary" />
                    
                    {/* Goal content */}
                    <View className="flex-row items-center justify-between flex-1 p-4">
                        <View className="flex-row items-center flex-1">
                            <View className="w-8 h-8 rounded-full items-center justify-center mr-3 bg-primary">
                                <Text className="text-white font-bold text-sm">
                                    {index + 1}
                                </Text>
                            </View>
                            <Text className="text-lg font-medium flex-1 text-primary">
                                {goal.name}
                            </Text>
                        </View>
                        
                        {/* Drag handle */}
                        <View {...panResponder.panHandlers}>
                            <View className="p-2">
                                <Ionicons 
                                    name="reorder-three" 
                                    size={24} 
                                    color="#25551b80" 
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Animated.View>
        );
    };
    
    return (
        <SafeAreaView className="flex-1 bg-lightgreen" edges={["top", "bottom"]}>
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                scrollEnabled={draggingIndex === null}
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
                        Drag to order by importance
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
                            <Ionicons name="information-circle" size={20} color="#25551b60" />
                            <Text className="text-primary/60 text-sm ml-2 flex-1">
                                Hold and drag the ≡ icon to reorder your priorities
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
                                onPress={onNext}
                                disabled={orderedGoals.length === 0 || isLoading}
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